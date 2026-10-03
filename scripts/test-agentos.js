'use strict';

const assert = require('assert');
const { AgentOrchestrator } = require('../agentos/orchestrator');
const { inspectGeoJSON } = require('../agentos/tools/geojson-inspector');
const agentosHandler = require('../api/agentos');

class MemoryStore {
  constructor() { this.tasks = []; this.approvals = []; this.audit = []; }
  listTasks() { return Promise.resolve([...this.tasks].reverse()); }
  listApprovals() { return Promise.resolve([...this.approvals].reverse()); }
  listAudit() { return Promise.resolve([...this.audit].reverse()); }
  getTask(id) { return Promise.resolve(this.tasks.find((item) => item.id === id) || null); }
  getApproval(id) { return Promise.resolve(this.approvals.find((item) => item.id === id) || null); }
  saveTask(task) { this.tasks = [...this.tasks.filter((item) => item.id !== task.id), structuredClone(task)]; return Promise.resolve(task); }
  saveApproval(approval) { this.approvals = [...this.approvals.filter((item) => item.id !== approval.id), structuredClone(approval)]; return Promise.resolve(approval); }
  appendAudit(event) { this.audit.push(structuredClone(event)); return Promise.resolve(); }
}

const run = async () => {
  const report = inspectGeoJSON({ type: 'FeatureCollection', features: [{ type: 'Feature', id: 7, properties: { asset: 'hydrant' }, geometry: { type: 'Point', coordinates: [-80.3, 27.2] } }, { type: 'Feature', id: 7, properties: { asset: 'hydrant' }, geometry: null }] });
  assert.equal(report.featureCount, 2); assert.deepEqual(report.duplicateFeatureIds, ['7']); assert.equal(report.validForPreparation, false);

  const store = new MemoryStore(); const orchestrator = new AgentOrchestrator(store);
  const ordinary = await orchestrator.submit({ title: 'Inspect hydrants', description: 'Validate the supplied FeatureCollection.', initiatedBy: 'GIS Manager', agentId: 'gis-operations-agent' });
  assert.equal(ordinary.task.status, 'ASSIGNED'); assert.equal(ordinary.approval, null);
  const completed = await orchestrator.inspectGeoJSON({ taskId: ordinary.task.id, user: 'GIS Manager', geojson: { type: 'FeatureCollection', features: [] } });
  assert.equal(completed.status, 'COMPLETED'); assert.equal(completed.outputs[0].data.featureCount, 0);

  const restricted = await orchestrator.submit({ title: 'Publish roads', description: 'Publish reviewed road centerlines.', initiatedBy: 'Program Director', agentId: 'gis-operations-agent', requestedAction: 'publish-authoritative-data' });
  assert.equal(restricted.task.status, 'REVIEW_REQUIRED'); assert.equal(restricted.approval.status, 'PENDING');
  const decided = await orchestrator.decide({ approvalId: restricted.approval.id, decision: 'APPROVE', decidedBy: 'Data Steward', note: 'QA evidence reviewed; authorization recorded.' });
  assert.equal(decided.task.status, 'APPROVED'); assert.equal(decided.approval.status, 'APPROVED');
  assert(store.audit.some((event) => event.approvalStatus === 'APPROVED'));

  const summary = await orchestrator.summary();
  assert.equal(summary.metrics.totalTasks, 2); assert.equal(summary.metrics.completedTasks, 1); assert.equal(summary.metrics.activeTasks, 1);
  const publicSummary = await orchestrator.publicSummary();
  assert.equal(publicSummary.access, 'public-read-only');
  assert.equal(publicSummary.metrics.totalTasks, 2);
  assert(!('tasks' in publicSummary)); assert(!('approvals' in publicSummary)); assert(!('audit' in publicSummary));
  assert(!('currentAssignment' in publicSummary.agents[0])); assert(!('humanSupervisor' in publicSummary.agents[0]));

  const invoke = async (req) => {
    const response = { headers: {}, setHeader(name, value) { this.headers[name] = value; }, end(payload) { this.payload = JSON.parse(payload); } };
    await agentosHandler(req, response);
    return response;
  };
  const unauthorizedWrite = await invoke({ method: 'POST', query: {}, headers: {}, body: { operation: 'submit-task' } });
  assert.equal(unauthorizedWrite.statusCode, 401);
  assert.match(unauthorizedWrite.payload.message, /authenticated supervisor session/);

  const savedEnv = Object.fromEntries(['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'AGENTOS_ACCESS_TOKEN'].map((key) => [key, process.env[key]]));
  const originalFetch = global.fetch;
  try {
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    global.fetch = async () => { throw new Error('Unconfigured mode must never fetch'); };
    const localRead = await invoke({ method: 'GET', query: {}, headers: {} });
    assert.equal(localRead.statusCode, 200);
    assert.equal(localRead.payload.agents.length, 7);
    assert.equal(localRead.payload.activityScope, 'current-runtime');
    assert.equal(localRead.payload.metrics.totalTasks, 0);
    assert(!JSON.stringify(localRead.payload).includes('SUPABASE'));
    process.env.SUPABASE_URL = 'https://example.supabase.co';
    const partialRead = await invoke({ method: 'GET', query: {}, headers: {} });
    assert.equal(partialRead.statusCode, 200);
    assert.equal(partialRead.payload.activityScope, 'current-runtime');
    delete process.env.SUPABASE_URL;
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'server-only-test-key';
    assert.equal((await invoke({ method: 'GET', query: {}, headers: {} })).payload.activityScope, 'current-runtime');
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;

    process.env.AGENTOS_ACCESS_TOKEN = 'test-supervisor';
    const headers = { authorization: 'Bearer test-supervisor' };
    const submit = await invoke({ method: 'POST', query: {}, headers, body: { operation: 'submit-task', title: 'Local GIS check', description: 'Validate an empty dataset', initiatedBy: 'GIS Manager', agentId: 'gis-operations-agent' } });
    assert.equal(submit.statusCode, 201);
    const inspection = await invoke({ method: 'POST', query: {}, headers, body: { operation: 'inspect-geojson', taskId: submit.payload.task.id, user: 'GIS Manager', geojson: { type: 'FeatureCollection', features: [] } } });
    assert.equal(inspection.payload.task.status, 'COMPLETED');
    const restricted = await invoke({ method: 'POST', query: {}, headers, body: { operation: 'submit-task', title: 'Publish', description: 'Publish reviewed data', initiatedBy: 'GIS Manager', agentId: 'gis-operations-agent', requestedAction: 'publish-authoritative-data' } });
    assert.equal(restricted.payload.task.status, 'REVIEW_REQUIRED');
    assert.equal((await invoke({ method: 'POST', query: {}, headers: {}, body: { operation: 'decide-approval', approvalId: restricted.payload.approval.id } })).statusCode, 401);
    const decision = await invoke({ method: 'POST', query: {}, headers, body: { operation: 'decide-approval', approvalId: restricted.payload.approval.id, decision: 'APPROVE', decidedBy: 'Data Steward', note: 'Reviewed' } });
    assert.equal(decision.payload.task.status, 'APPROVED');
    const localSummary = await invoke({ method: 'GET', query: {}, headers: {} });
    assert.equal(localSummary.payload.metrics.totalTasks, 2);
    assert.equal(localSummary.payload.metrics.completedTasks, 1);
    assert(!('tasks' in localSummary.payload));
    const supervisor = await invoke({ method: 'GET', query: { scope: 'supervisor' }, headers });
    assert(supervisor.payload.audit.some((event) => event.approvalStatus === 'APPROVED'));
    assert.equal((await invoke({ method: 'GET', query: { scope: 'supervisor' }, headers: {} })).statusCode, 401);

    process.env.SUPABASE_URL = 'https://example.supabase.co';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'server-only-test-key';
    global.fetch = async () => ({ ok: true, json: async () => [] });
    const publicRead = await invoke({ method: 'GET', query: {}, headers: {} });
    assert.equal(publicRead.statusCode, 200);
    assert.equal(publicRead.payload.activityScope, 'shared');
    assert.equal(publicRead.payload.metrics.totalTasks, 0);
    assert(!('tasks' in publicRead.payload));
    const failures = [
      async () => { throw new Error('private network details'); },
      async () => ({ ok: false, text: async () => 'server-only-test-key' }),
      async () => ({ ok: true, json: async () => { throw new Error('bad JSON'); } }),
      async () => ({ ok: true, json: async () => ({ invalid: true }) }),
      async (url, { signal }) => new Promise((resolve, reject) => signal.addEventListener('abort', () => reject(new Error('timeout')), { once: true })),
    ];
    for (const failure of failures) {
      global.fetch = failure;
      const outage = await invoke({ method: 'GET', query: {}, headers: {} });
      assert.equal(outage.statusCode, 200);
      assert.equal(outage.payload.activityAvailable, false);
      assert.equal(outage.payload.agents.length, 7);
      assert.equal(outage.payload.metrics.totalTasks, null);
      assert.equal(outage.payload.agents[0].tasksCompleted, null);
      assert(!JSON.stringify(outage.payload).includes('server-only-test-key'));
    }
    global.fetch = failures[0];
    const failedWrite = await invoke({ method: 'POST', query: {}, headers, body: { operation: 'submit-task', title: 'Outage write', description: 'Must not enter memory', initiatedBy: 'GIS Manager', agentId: 'gis-operations-agent' } });
    assert.equal(failedWrite.statusCode, 503);
    global.fetch = async () => ({ ok: true, json: async () => [] });
    assert.equal((await invoke({ method: 'GET', query: {}, headers: {} })).payload.activityAvailable, true);
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    assert.equal((await invoke({ method: 'GET', query: {}, headers: {} })).payload.metrics.totalTasks, 2);
  } finally {
    global.fetch = originalFetch;
    for (const [key, value] of Object.entries(savedEnv)) {
      if (value === undefined) delete process.env[key]; else process.env[key] = value;
    }
  }
  console.log('[test] AgentOS lifecycle, optional persistence, outage recovery, approval boundary, audit, and GeoJSON inspection ok');
};

run().catch((error) => { console.error(`[test] ${error.stack || error.message}`); process.exit(1); });
