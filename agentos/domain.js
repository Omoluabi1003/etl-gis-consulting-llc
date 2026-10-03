'use strict';

const crypto = require('crypto');

const TASK_STATES = Object.freeze(['REQUESTED', 'ANALYZING', 'ASSIGNED', 'RUNNING', 'REVIEW_REQUIRED', 'APPROVED', 'COMPLETED', 'FAILED']);
const DECISIONS = Object.freeze(['APPROVE', 'REJECT', 'REQUEST_REVISION']);
const ALLOWED_TRANSITIONS = Object.freeze({
  REQUESTED: ['ANALYZING', 'FAILED'], ANALYZING: ['ASSIGNED', 'REVIEW_REQUIRED', 'FAILED'],
  ASSIGNED: ['RUNNING', 'REVIEW_REQUIRED', 'FAILED'], RUNNING: ['REVIEW_REQUIRED', 'COMPLETED', 'FAILED'],
  REVIEW_REQUIRED: ['APPROVED', 'ANALYZING', 'FAILED'], APPROVED: ['RUNNING', 'COMPLETED', 'FAILED'],
  COMPLETED: [], FAILED: [],
});

const now = () => new Date().toISOString();
const id = (prefix) => `${prefix}_${crypto.randomUUID()}`;

const transitionTask = (task, nextState, detail = {}) => {
  if (!ALLOWED_TRANSITIONS[task.status]?.includes(nextState)) throw new Error(`Invalid task transition: ${task.status} -> ${nextState}`);
  const timestamp = now();
  return { ...task, ...detail, status: nextState, updatedAt: timestamp, actions: [...task.actions, { state: nextState, timestamp, detail: detail.actionDetail || '' }] };
};

const createTask = ({ title, description, initiatedBy, agentId, requestedAction = '', input = null }) => {
  const timestamp = now();
  return { id: id('task'), title, description, initiatedBy, agentId, requestedAction, input, status: 'REQUESTED', createdAt: timestamp, updatedAt: timestamp, actions: [{ state: 'REQUESTED', timestamp, detail: 'Task submitted by human operator.' }], outputs: [], approvalRequired: false, error: null };
};

const createApproval = ({ task, action, requestedBy }) => ({ id: id('approval'), taskId: task.id, agentId: task.agentId, action, rationale: `The requested action “${action}” is outside the agent's autonomous authority.`, requestedBy, status: 'PENDING', createdAt: now(), decidedAt: null, decidedBy: null, decisionNote: null });

const createAuditEvent = ({ user, agent, task, tool, action, result, approvalStatus = 'NOT_REQUIRED', error = null }) => ({ id: id('audit'), timestamp: now(), user, agent, task, tool, action, result, approvalStatus, error });

module.exports = { TASK_STATES, DECISIONS, transitionTask, createTask, createApproval, createAuditEvent };
