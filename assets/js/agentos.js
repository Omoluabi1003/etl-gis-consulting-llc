'use strict';

const state = { token: sessionStorage.getItem('agentos-token') || '', agents: [], summary: null };
const $ = (selector) => document.querySelector(selector);
const escapeHtml = (value) => String(value ?? '').replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]);
const formatTime = (value) => value ? new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)) : '—';

const request = async (options = {}) => {
    const response = await fetch('/api/agentos', { ...options, headers: { Accept: 'application/json', 'Content-Type': 'application/json', ...(state.token ? { Authorization: `Bearer ${state.token}` } : {}), ...(options.headers || {}) } });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || 'AgentOS request failed.');
    return data;
};

const setMessage = (element, message, error = false) => { element.textContent = message; element.classList.toggle('error', error); };
const statusClass = (status) => `status status-${String(status).toLowerCase().replaceAll('_', '-')}`;

const populateAgentForm = () => {
    $('#agent-id').insertAdjacentHTML('beforeend', state.agents.map((agent) => `<option value="${escapeHtml(agent.id)}">${escapeHtml(agent.name)} · ${escapeHtml(agent.department)}</option>`).join(''));
};

const updateActions = () => {
    const agent = state.agents.find((item) => item.id === $('#agent-id').value);
    $('#requested-action').innerHTML = '<option value="">Analysis or preparation only</option>' + (agent?.restrictedActions || []).map((action) => `<option value="${escapeHtml(action)}">Restricted · ${escapeHtml(action.replaceAll('-', ' '))}</option>`).join('');
    $('#boundary-note').textContent = agent ? `${agent.allowedTools.length} allowlisted tool${agent.allowedTools.length === 1 ? '' : 's'}. ${agent.restrictedActions.length} action${agent.restrictedActions.length === 1 ? '' : 's'} require human approval.` : 'Restricted actions are stopped at the approval boundary.';
};

const render = () => {
    const { metrics, agents, tasks, approvals, audit, departments, executiveSummary, generatedAt } = state.summary;
    $('#metric-total').textContent = metrics.totalTasks; $('#metric-active').textContent = metrics.activeTasks; $('#metric-approval').textContent = metrics.awaitingApproval; $('#metric-completed').textContent = metrics.completedTasks; $('#metric-failed').textContent = metrics.failedTasks;
    $('#freshness').textContent = `Operational state retrieved ${formatTime(generatedAt)}. Metrics reflect stored records, not sample data.`;
    $('#executive-summary').textContent = executiveSummary;
    $('#department-activity').innerHTML = departments.map((item) => `<span><strong>${escapeHtml(item.department)}</strong> ${item.active} active · ${item.completed} completed · ${item.failed} failed</span>`).join('');
    $('#agent-grid').innerHTML = agents.map((agent) => `<article class="agent-card"><div class="agent-card-top"><span class="department">${escapeHtml(agent.department)}</span><span class="${statusClass(agent.status)}">${escapeHtml(agent.status.replaceAll('-', ' '))}</span></div><h3>${escapeHtml(agent.name)}</h3><p>${escapeHtml(agent.description)}</p><dl><div><dt>Current assignment</dt><dd>${escapeHtml(agent.currentAssignment || 'None')}</dd></div><div><dt>Last completed</dt><dd>${escapeHtml(agent.lastCompletedTask || 'None')}</dd></div><div><dt>Human supervisor</dt><dd>${escapeHtml(agent.humanSupervisor || 'Unassigned')}</dd></div><div><dt>Completed / approvals</dt><dd>${agent.tasksCompleted} / ${agent.approvalRequests}</dd></div></dl><details><summary>Authority and capabilities</summary><p><strong>Allowed tools:</strong> ${agent.allowedTools.map(escapeHtml).join(', ')}</p><p><strong>Restricted:</strong> ${agent.restrictedActions.length ? agent.restrictedActions.map(escapeHtml).join(', ') : 'No configured consequential actions'}</p></details></article>`).join('');
    const pending = approvals.filter((item) => item.status === 'PENDING');
    $('#approval-count').textContent = pending.length;
    $('#approval-list').innerHTML = pending.length ? pending.map((approval) => `<article class="record approval-record"><div><span class="status status-waiting-for-approval">Pending</span><h3>${escapeHtml(approval.action)}</h3><p>${escapeHtml(approval.rationale)}</p><small>Task ${escapeHtml(approval.task_id || approval.taskId)} · requested by ${escapeHtml(approval.requested_by || approval.requestedBy)}</small></div><button type="button" data-review="${escapeHtml(approval.id)}" data-action="${escapeHtml(approval.action)}">Review</button></article>`).join('') : '<p class="empty-state">No actions are awaiting human approval.</p>';
    $('#task-list').innerHTML = tasks.length ? tasks.map((task) => `<article class="record"><div><span class="${statusClass(task.status)}">${escapeHtml(task.status.replaceAll('_', ' '))}</span><h3>${escapeHtml(task.title)}</h3><p>${escapeHtml(task.description)}</p><small>${escapeHtml(task.agent_id || task.agentId)} · initiated by ${escapeHtml(task.initiated_by || task.initiatedBy)} · ${formatTime(task.updated_at || task.updatedAt)}</small>${task.error ? `<p class="error-detail"><strong>Error:</strong> ${escapeHtml(task.error)}</p>` : ''}</div>${(task.agent_id || task.agentId) === 'gis-operations-agent' && task.status === 'ASSIGNED' ? `<details class="tool-runner"><summary>Run GeoJSON inspection</summary><form data-geojson-task="${escapeHtml(task.id)}"><label>GeoJSON FeatureCollection<textarea rows="5" required placeholder='{"type":"FeatureCollection","features":[]}'></textarea></label><button type="submit">Inspect read-only</button><p class="form-message" role="status"></p></form></details>` : ''}</article>`).join('') : '<p class="empty-state">No tasks have been submitted.</p>';
    $('#audit-list').innerHTML = audit.length ? audit.map((event) => `<tr><td>${formatTime(event.timestamp)}</td><td>${escapeHtml(event.user_name || event.user)}</td><td>${escapeHtml(event.agent_id || event.agent)}</td><td>${escapeHtml(event.tool)}</td><td>${escapeHtml(event.action)}</td><td>${escapeHtml(event.error || event.result)}</td></tr>`).join('') : '<tr><td colspan="6" class="empty-state">No audit events recorded.</td></tr>';
};

const loadSummary = async () => { state.summary = await request(); render(); $('#workspace').hidden = false; $('#access-panel').hidden = true; $('#lock-session').hidden = false; };

$('#access-form').addEventListener('submit', async (event) => { event.preventDefault(); state.token = $('#access-token').value; setMessage($('#access-message'), 'Connecting…'); try { await loadSummary(); sessionStorage.setItem('agentos-token', state.token); $('#access-token').value = ''; } catch (error) { state.token = ''; setMessage($('#access-message'), error.message, true); } });
$('#lock-session').addEventListener('click', () => { sessionStorage.removeItem('agentos-token'); state.token = ''; state.summary = null; $('#workspace').hidden = true; $('#access-panel').hidden = false; $('#lock-session').hidden = true; $('#freshness').textContent = 'Connect to view operational state.'; });
$('#agent-id').addEventListener('change', updateActions);
$('#refresh').addEventListener('click', () => loadSummary().catch((error) => alert(error.message)));

$('#task-form').addEventListener('submit', async (event) => { event.preventDefault(); const message = $('#task-message'); setMessage(message, 'Validating authority and creating task…'); const body = Object.fromEntries(new FormData(event.currentTarget)); try { const result = await request({ method: 'POST', body: JSON.stringify({ operation: 'submit-task', ...body }) }); setMessage(message, result.approval ? 'Task created and restricted action routed for approval.' : 'Task created and assigned.'); event.currentTarget.reset(); updateActions(); await loadSummary(); } catch (error) { setMessage(message, error.message, true); } });

document.addEventListener('click', (event) => { const button = event.target.closest('[data-review]'); if (!button) return; $('#approval-id').value = button.dataset.review; $('#decision-action').textContent = `Requested action: ${button.dataset.action}`; $('#decision-dialog').showModal(); });
$('#decision-cancel').addEventListener('click', () => $('#decision-dialog').close());
$('#decision-form').addEventListener('submit', async (event) => { event.preventDefault(); const message = $('#decision-message'); setMessage(message, 'Recording signed decision…'); try { await request({ method: 'POST', body: JSON.stringify({ operation: 'decide-approval', approvalId: $('#approval-id').value, decision: $('#decision').value, decidedBy: $('#decision-maker').value, note: $('#decision-note').value }) }); event.currentTarget.reset(); $('#decision-dialog').close(); await loadSummary(); } catch (error) { setMessage(message, error.message, true); } });

document.addEventListener('submit', async (event) => { const form = event.target.closest('[data-geojson-task]'); if (!form) return; event.preventDefault(); const message = form.querySelector('.form-message'); try { setMessage(message, 'Inspecting structure…'); const geojson = JSON.parse(form.querySelector('textarea').value); const task = state.summary.tasks.find((item) => item.id === form.dataset.geojsonTask); await request({ method: 'POST', body: JSON.stringify({ operation: 'inspect-geojson', taskId: task.id, user: task.initiated_by || task.initiatedBy, geojson }) }); await loadSummary(); } catch (error) { setMessage(message, error.message, true); } });

fetch('/api/agentos?action=definitions').then((response) => response.json()).then((data) => { state.agents = data.agents || []; populateAgentForm(); if (state.token) loadSummary().catch(() => { sessionStorage.removeItem('agentos-token'); state.token = ''; }); }).catch(() => setMessage($('#access-message'), 'Agent definitions could not be loaded.', true));
