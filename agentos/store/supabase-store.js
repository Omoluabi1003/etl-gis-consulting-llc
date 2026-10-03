'use strict';

const { getEnv } = require('../../api/_utils');

const encode = (value) => encodeURIComponent(value);

class SupabaseAgentOSStore {
  constructor(fetchImpl = global.fetch) { this.fetch = fetchImpl; }

  async request(tableAndQuery, options = {}) {
    const baseUrl = getEnv('SUPABASE_URL').replace(/\/$/, '');
    const key = getEnv('SUPABASE_SERVICE_ROLE_KEY');
    if (!baseUrl || !key) throw new Error('AgentOS persistence is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    try {
      const response = await this.fetch(`${baseUrl}/rest/v1/${tableAndQuery}`, { ...options, signal: controller.signal, headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', ...(options.method === 'POST' ? { Prefer: 'return=representation' } : {}), ...(options.headers || {}) } });
      if (!response.ok) throw new Error('Persistence request failed.');
      if (response.status === 204) return null;
      const rows = await response.json();
      if (!Array.isArray(rows)) throw new Error('Invalid persistence response.');
      return rows;
    } catch (cause) {
      const error = new Error('AgentOS persistence is temporarily unavailable.');
      error.persistenceUnavailable = true;
      throw error;
    } finally {
      clearTimeout(timeout);
    }
  }

  async listTasks(limit = 100) { return this.request(`agentos_tasks?select=*&order=created_at.desc&limit=${limit}`); }
  async getTask(taskId) { return (await this.request(`agentos_tasks?select=*&id=eq.${encode(taskId)}&limit=1`))[0] || null; }
  async saveTask(task) { const rows = await this.request('agentos_tasks?on_conflict=id', { method: 'POST', headers: { Prefer: 'resolution=merge-duplicates,return=representation' }, body: JSON.stringify(toTaskRow(task)) }); return fromTaskRow(rows[0]); }
  async listApprovals(limit = 100) { return this.request(`agentos_approvals?select=*&order=created_at.desc&limit=${limit}`); }
  async getApproval(approvalId) { return (await this.request(`agentos_approvals?select=*&id=eq.${encode(approvalId)}&limit=1`))[0] || null; }
  async saveApproval(approval) { const rows = await this.request('agentos_approvals?on_conflict=id', { method: 'POST', headers: { Prefer: 'resolution=merge-duplicates,return=representation' }, body: JSON.stringify(toApprovalRow(approval)) }); return fromApprovalRow(rows[0]); }
  async appendAudit(event) { await this.request('agentos_audit_events', { method: 'POST', body: JSON.stringify(toAuditRow(event)) }); }
  async listAudit(limit = 100) { return this.request(`agentos_audit_events?select=*&order=timestamp.desc&limit=${limit}`); }
}

const toTaskRow = (task) => ({ id: task.id, title: task.title, description: task.description, initiated_by: task.initiatedBy, agent_id: task.agentId, requested_action: task.requestedAction, input: task.input, status: task.status, created_at: task.createdAt, updated_at: task.updatedAt, actions: task.actions, outputs: task.outputs, approval_required: task.approvalRequired, error: task.error });
const fromTaskRow = (row) => ({ id: row.id, title: row.title, description: row.description, initiatedBy: row.initiated_by, agentId: row.agent_id, requestedAction: row.requested_action, input: row.input, status: row.status, createdAt: row.created_at, updatedAt: row.updated_at, actions: row.actions || [], outputs: row.outputs || [], approvalRequired: row.approval_required, error: row.error });
const toApprovalRow = (approval) => ({ id: approval.id, task_id: approval.taskId, agent_id: approval.agentId, action: approval.action, rationale: approval.rationale, requested_by: approval.requestedBy, status: approval.status, created_at: approval.createdAt, decided_at: approval.decidedAt, decided_by: approval.decidedBy, decision_note: approval.decisionNote });
const fromApprovalRow = (row) => ({ id: row.id, taskId: row.task_id, agentId: row.agent_id, action: row.action, rationale: row.rationale, requestedBy: row.requested_by, status: row.status, createdAt: row.created_at, decidedAt: row.decided_at, decidedBy: row.decided_by, decisionNote: row.decision_note });
const toAuditRow = (event) => ({ id: event.id, timestamp: event.timestamp, user_name: event.user, agent_id: event.agent, task_id: event.task, tool: event.tool, action: event.action, result: event.result, approval_status: event.approvalStatus, error: event.error });

module.exports = { SupabaseAgentOSStore, fromTaskRow, fromApprovalRow };
