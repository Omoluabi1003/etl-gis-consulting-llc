'use strict';

// Process-local only: records do not survive a cold start or span server instances.
class MemoryAgentOSStore {
  constructor() { this.tasks = new Map(); this.approvals = new Map(); this.audit = []; }
  async listTasks(limit = 100) { return structuredClone([...this.tasks.values()].reverse().slice(0, limit)); }
  async listApprovals(limit = 100) { return structuredClone([...this.approvals.values()].reverse().slice(0, limit)); }
  async listAudit(limit = 100) { return structuredClone(this.audit.slice(-limit).reverse()); }
  async getTask(id) { return structuredClone(this.tasks.get(id) || null); }
  async getApproval(id) { return structuredClone(this.approvals.get(id) || null); }
  async saveTask(task) { this.tasks.set(task.id, structuredClone(task)); return structuredClone(task); }
  async saveApproval(approval) { this.approvals.set(approval.id, structuredClone(approval)); return structuredClone(approval); }
  async appendAudit(event) { this.audit.push(structuredClone(event)); }
}

module.exports = { MemoryAgentOSStore };
