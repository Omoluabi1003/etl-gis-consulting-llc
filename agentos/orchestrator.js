'use strict';

const { AGENTS, getAgent } = require('./definitions');
const { DECISIONS, createTask, transitionTask, createApproval, createAuditEvent } = require('./domain');
const { inspectGeoJSON } = require('./tools/geojson-inspector');

const clean = (value, max = 1000) => typeof value === 'string' ? value.trim().slice(0, max) : '';

class AgentOrchestrator {
  constructor(store) { this.store = store; }

  async summary() {
    const [tasks, approvals, audit] = await Promise.all([this.store.listTasks(), this.store.listApprovals(), this.store.listAudit(40)]);
    const agentViews = AGENTS.map((agent) => {
      const owned = tasks.filter((task) => (task.agent_id || task.agentId) === agent.id);
      const normalizeStatus = (task) => task.status;
      const active = owned.find((task) => ['ANALYZING', 'ASSIGNED', 'RUNNING', 'REVIEW_REQUIRED', 'APPROVED'].includes(normalizeStatus(task)));
      const completed = owned.filter((task) => normalizeStatus(task) === 'COMPLETED');
      const pending = approvals.filter((approval) => (approval.agent_id || approval.agentId) === agent.id && approval.status === 'PENDING');
      return { ...agent, status: active ? (active.status === 'REVIEW_REQUIRED' ? 'waiting-for-approval' : 'working') : 'available', currentAssignment: active?.title || null, lastCompletedTask: completed[0]?.title || null, humanSupervisor: active?.initiated_by || active?.initiatedBy || null, tasksCompleted: completed.length, approvalRequests: pending.length };
    });
    const count = (state) => tasks.filter((task) => task.status === state).length;
    const metrics = { totalTasks: tasks.length, activeTasks: tasks.filter((task) => ['ANALYZING', 'ASSIGNED', 'RUNNING', 'APPROVED'].includes(task.status)).length, awaitingApproval: count('REVIEW_REQUIRED'), completedTasks: count('COMPLETED'), failedTasks: count('FAILED') };
    const departments = AGENTS.map((agent) => agent.department).filter((department, index, values) => values.indexOf(department) === index).map((department) => { const ids = AGENTS.filter((agent) => agent.department === department).map((agent) => agent.id); const owned = tasks.filter((task) => ids.includes(task.agent_id || task.agentId)); return { department, total: owned.length, active: owned.filter((task) => ['ANALYZING', 'ASSIGNED', 'RUNNING', 'REVIEW_REQUIRED', 'APPROVED'].includes(task.status)).length, completed: owned.filter((task) => task.status === 'COMPLETED').length, failed: owned.filter((task) => task.status === 'FAILED').length }; });
    const executiveSummary = metrics.totalTasks === 0 ? 'No operational tasks have been recorded. Submit an assignment to establish the first traceable work item.' : `${metrics.activeTasks} active task${metrics.activeTasks === 1 ? '' : 's'}, ${metrics.awaitingApproval} awaiting human approval, ${metrics.completedTasks} completed, and ${metrics.failedTasks} failed across ${departments.filter((item) => item.total > 0).length} active department${departments.filter((item) => item.total > 0).length === 1 ? '' : 's'}.`;
    return { agents: agentViews, tasks, approvals, audit, metrics, departments, executiveSummary, generatedAt: new Date().toISOString() };
  }

  async submit(raw) {
    const title = clean(raw.title, 160), description = clean(raw.description, 4000), initiatedBy = clean(raw.initiatedBy, 160), agentId = clean(raw.agentId, 100), requestedAction = clean(raw.requestedAction, 120);
    if (!title || !description || !initiatedBy || !agentId) throw new Error('Title, description, initiating human, and agent are required.');
    const agent = getAgent(agentId);
    if (!agent) throw new Error('Unknown agent.');
    let task = createTask({ title, description, initiatedBy, agentId, requestedAction, input: null });
    task = transitionTask(task, 'ANALYZING', { actionDetail: 'Request validated against the selected agent definition.' });
    await this.store.appendAudit(createAuditEvent({ user: initiatedBy, agent: agentId, task: task.id, tool: 'orchestrator', action: 'analyze-request', result: 'Request validated.' }));
    if (agent.restrictedActions.includes(requestedAction)) {
      task = transitionTask(task, 'REVIEW_REQUIRED', { approvalRequired: true, actionDetail: `Blocked restricted action: ${requestedAction}.` });
      const approval = createApproval({ task, action: requestedAction, requestedBy: initiatedBy });
      await this.store.saveTask(task);
      await this.store.saveApproval(approval);
      await this.store.appendAudit(createAuditEvent({ user: initiatedBy, agent: agentId, task: task.id, tool: 'permission-boundary', action: requestedAction, result: 'Execution blocked pending human decision.', approvalStatus: 'PENDING' }));
      return { task, approval };
    }
    task = transitionTask(task, 'ASSIGNED', { actionDetail: 'Request assigned within the agent allowlist.' });
    return { task: await this.store.saveTask(task), approval: null };
  }

  async inspectGeoJSON({ taskId, user, geojson }) {
    let task = await this.store.getTask(clean(taskId, 100));
    user = clean(user, 160);
    if (!task || task.agentId !== 'gis-operations-agent') throw new Error('A GIS Operations Agent task is required.');
    if (!user || user !== task.initiatedBy) throw new Error('Only the initiating human may run this preparation tool.');
    if (!['ASSIGNED', 'APPROVED'].includes(task.status)) throw new Error(`Task cannot run from ${task.status}.`);
    task = transitionTask(task, 'RUNNING', { actionDetail: 'Started read-only GeoJSON inspection.' });
    await this.store.saveTask(task);
    try {
      const report = inspectGeoJSON(geojson);
      task = transitionTask(task, 'COMPLETED', { outputs: [...task.outputs, { type: 'geojson-inspection', createdAt: new Date().toISOString(), data: report }], actionDetail: 'Read-only inspection completed.' });
      await Promise.all([this.store.saveTask(task), this.store.appendAudit(createAuditEvent({ user, agent: task.agentId, task: task.id, tool: 'geojson-inspector', action: 'inspect', result: `Inspected ${report.featureCount} features.` }))]);
      return task;
    } catch (error) {
      task = transitionTask(task, 'FAILED', { error: error.message, actionDetail: 'Inspection failed visibly.' });
      await Promise.all([this.store.saveTask(task), this.store.appendAudit(createAuditEvent({ user, agent: task.agentId, task: task.id, tool: 'geojson-inspector', action: 'inspect', result: 'Failed.', error: error.message }))]);
      throw error;
    }
  }

  async decide({ approvalId, decision, decidedBy, note }) {
    decision = clean(decision, 30); decidedBy = clean(decidedBy, 160); note = clean(note, 2000);
    if (!DECISIONS.includes(decision) || !decidedBy || !note) throw new Error('A valid decision, human decision-maker, and decision note are required.');
    const approval = await this.store.getApproval(clean(approvalId, 120));
    if (!approval || approval.status !== 'PENDING') throw new Error('Pending approval request not found.');
    let task = await this.store.getTask(approval.taskId);
    if (!task || task.status !== 'REVIEW_REQUIRED') throw new Error('Task is not awaiting review.');
    approval.status = decision === 'APPROVE' ? 'APPROVED' : decision === 'REJECT' ? 'REJECTED' : 'REVISION_REQUESTED'; approval.decidedAt = new Date().toISOString(); approval.decidedBy = decidedBy; approval.decisionNote = note;
    if (decision === 'APPROVE') task = transitionTask(task, 'APPROVED', { actionDetail: `Restricted action authorized by ${decidedBy}; execution remains separate.` });
    if (decision === 'REJECT') task = transitionTask(task, 'FAILED', { error: `Approval rejected: ${note}`, actionDetail: `Rejected by ${decidedBy}.` });
    if (decision === 'REQUEST_REVISION') task = transitionTask(task, 'ANALYZING', { approvalRequired: false, actionDetail: `Revision requested by ${decidedBy}.` });
    await Promise.all([this.store.saveApproval(approval), this.store.saveTask(task), this.store.appendAudit(createAuditEvent({ user: decidedBy, agent: task.agentId, task: task.id, tool: 'human-approval', action: decision, result: note, approvalStatus: approval.status }))]);
    return { task, approval };
  }
}

module.exports = { AgentOrchestrator };
