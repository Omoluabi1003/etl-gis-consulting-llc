'use strict';

const $ = (selector) => document.querySelector(selector);
const escapeHtml = (value) => String(value ?? '').replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]);
const formatTime = (value) => value ? new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)) : '—';
const statusClass = (status) => `status status-${String(status).toLowerCase().replaceAll('_', '-')}`;

const setConnectionState = (state, title, message) => {
    $('#connection-title').textContent = title;
    $('#connection-message').textContent = message;
    $('#connection-status').textContent = state.replaceAll('-', ' ');
    $('#connection-status').className = `connection-status status-${state}`;
};

const render = ({ metrics, agents, departments, executiveSummary, generatedAt }) => {
    $('#metric-total').textContent = metrics.totalTasks;
    $('#metric-active').textContent = metrics.activeTasks;
    $('#metric-approval').textContent = metrics.awaitingApproval;
    $('#metric-completed').textContent = metrics.completedTasks;
    $('#metric-failed').textContent = metrics.failedTasks;
    $('#freshness').textContent = `Public operational state retrieved ${formatTime(generatedAt)}. Sensitive task and personnel details remain protected.`;
    $('#executive-summary').textContent = executiveSummary;
    $('#department-activity').innerHTML = departments.map((item) => `<span><strong>${escapeHtml(item.department)}</strong> ${item.active} active · ${item.completed} completed · ${item.failed} failed</span>`).join('');
    $('#agent-grid').innerHTML = agents.map((agent) => `<article class="agent-card"><div class="agent-card-top"><span class="department">${escapeHtml(agent.department)}</span><span class="${statusClass(agent.status)}">${escapeHtml(agent.status.replaceAll('-', ' '))}</span></div><h3>${escapeHtml(agent.name)}</h3><p>${escapeHtml(agent.description)}</p><dl><div><dt>Completed work</dt><dd>${agent.tasksCompleted}</dd></div><div><dt>Pending approvals</dt><dd>${agent.approvalRequests}</dd></div></dl><details><summary>Capabilities and safeguards</summary><p><strong>Allowed tools:</strong> ${agent.allowedTools.map(escapeHtml).join(', ')}</p><p><strong>Human approval required:</strong> ${agent.restrictedActions.length ? agent.restrictedActions.map((action) => escapeHtml(action.replaceAll('-', ' '))).join(', ') : 'No configured consequential actions'}</p></details></article>`).join('');
    $('#workspace').hidden = false;
    setConnectionState('connected', 'Public dashboard connected', 'Read-only access is free and loaded automatically. Supervisor operations remain protected.');
};

const loadDashboard = async () => {
    setConnectionState('loading', 'Loading AgentOS', 'Retrieving public, non-sensitive operational information.');
    try {
        const response = await fetch('/api/agentos', { headers: { Accept: 'application/json' } });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.message || 'AgentOS is temporarily unavailable.');
        render(data);
    } catch (error) {
        const offline = !navigator.onLine;
        setConnectionState(offline ? 'offline' : 'error', offline ? 'AgentOS is offline' : 'AgentOS could not connect', offline ? 'Reconnect to the internet and reload the page.' : error.message);
        $('#freshness').textContent = offline ? 'Offline. Public operational state could not be refreshed.' : 'The public dashboard could not be loaded.';
    }
};

window.addEventListener('offline', () => setConnectionState('offline', 'AgentOS is offline', 'Reconnect to the internet and reload the page.'));
loadDashboard();
