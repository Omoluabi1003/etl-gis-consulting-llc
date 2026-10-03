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

const displayCount = (value) => value == null ? 'N/A' : value;

const render = ({ metrics, agents, departments, executiveSummary, generatedAt, activityAvailable = true, activityScope }) => {
    $('#metric-total').textContent = displayCount(metrics.totalTasks);
    $('#metric-active').textContent = displayCount(metrics.activeTasks);
    $('#metric-approval').textContent = displayCount(metrics.awaitingApproval);
    $('#metric-completed').textContent = displayCount(metrics.completedTasks);
    $('#metric-failed').textContent = displayCount(metrics.failedTasks);
    $('#freshness').textContent = activityScope === 'current-runtime' ? `Temporary activity retrieved ${formatTime(generatedAt)}. Records may reset and do not include shared history.` : activityAvailable ? `Public operational state retrieved ${formatTime(generatedAt)}. Sensitive task and personnel details remain protected.` : 'Agent capabilities are available. Operational counts cannot currently be retrieved.';
    $('#executive-summary').textContent = executiveSummary;
    $('#department-activity').innerHTML = departments.map((item) => `<span><strong>${escapeHtml(item.department)}</strong> ${displayCount(item.active)} active · ${displayCount(item.completed)} completed · ${displayCount(item.failed)} failed</span>`).join('');
    $('#agent-grid').innerHTML = agents.map((agent) => `<article class="agent-card"><div class="agent-card-top"><span class="department">${escapeHtml(agent.department)}</span><span class="${statusClass(agent.status)}">${escapeHtml(agent.status.replaceAll('-', ' '))}</span></div><h3>${escapeHtml(agent.name)}</h3><p>${escapeHtml(agent.description)}</p><dl><div><dt>Completed work</dt><dd>${displayCount(agent.tasksCompleted)}</dd></div><div><dt>Pending approvals</dt><dd>${displayCount(agent.approvalRequests)}</dd></div></dl><details><summary>Capabilities and safeguards</summary><p><strong>Allowed tools:</strong> ${agent.allowedTools.map(escapeHtml).join(', ')}</p><p><strong>Human approval required:</strong> ${agent.restrictedActions.length ? agent.restrictedActions.map((action) => escapeHtml(action.replaceAll('-', ' '))).join(', ') : 'No configured consequential actions'}</p></details></article>`).join('');
    $('#workspace').hidden = false;
    setConnectionState('connected', 'AgentOS operational', activityAvailable ? 'Read-only access is free and loaded automatically. Supervisor operations remain protected.' : 'Agent capabilities are ready. Operational activity will return when the connection is restored.');
};

const loadDashboard = async () => {
    setConnectionState('loading', 'Loading AgentOS', 'Retrieving public, non-sensitive operational information.');
    try {
        const response = await fetch('/api/agentos', { headers: { Accept: 'application/json' } });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error('AgentOS is temporarily unavailable. Please try again shortly.');
        render(data);
    } catch (error) {
        const offline = !navigator.onLine;
        setConnectionState(offline ? 'offline' : 'error', offline ? 'AgentOS is offline' : 'AgentOS could not connect', offline ? 'Reconnect to the internet and reload the page.' : error.message);
        $('#freshness').textContent = offline ? 'Offline. Public operational state could not be refreshed.' : 'The public dashboard could not be loaded.';
    }
};

window.addEventListener('online', loadDashboard);
window.addEventListener('offline', () => setConnectionState('offline', 'AgentOS is offline', 'Reconnect to the internet and reload the page.'));
loadDashboard();
