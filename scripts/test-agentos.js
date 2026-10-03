'use strict';

const assert = require('assert');
const { AgentOrchestrator } = require('../agentos/orchestrator');
const { inspectGeoJSON } = require('../agentos/tools/geojson-inspector');

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
  console.log('[test] AgentOS lifecycle, approval boundary, audit, and GeoJSON inspection ok');
};

run().catch((error) => { console.error(`[test] ${error.stack || error.message}`); process.exit(1); });
