'use strict';

const crypto = require('crypto');
const { jsonResponse, parseBody, getEnv } = require('./_utils');
const { AGENTS } = require('../agentos/definitions');
const { selectAgentOSStore } = require('../agentos/store');
const { AgentOrchestrator } = require('../agentos/orchestrator');

const authorized = (req) => {
  const expected = getEnv('AGENTOS_ACCESS_TOKEN');
  const header = req.headers?.authorization;
  const supplied = typeof header === 'string' ? /^Bearer[ \t]+(\S+)[ \t]*$/i.exec(header)?.[1] : '';
  if (!expected || !supplied) return false;
  const a = Buffer.from(expected), b = Buffer.from(supplied);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
};

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (!authorized(req)) return jsonResponse(res, 401, { message: 'An authenticated supervisor session is required.' });
  if (req.method === 'GET' && req.query?.action === 'definitions') return jsonResponse(res, 200, { agents: AGENTS });
  const { store, durable } = selectAgentOSStore();
  const orchestrator = new AgentOrchestrator(store);
  const body = parseBody(req);
  try {
    if (req.method === 'GET') return jsonResponse(res, 200, { ...await orchestrator.summary(), activityAvailable: true, activityScope: durable ? 'shared' : 'current-runtime' });
    if (req.method !== 'POST') return jsonResponse(res, 405, { message: 'Method not allowed.' });
    if (body.operation === 'submit-task') return jsonResponse(res, 201, await orchestrator.submit(body));
    if (body.operation === 'inspect-geojson') return jsonResponse(res, 200, { task: await orchestrator.inspectGeoJSON(body) });
    if (body.operation === 'decide-approval') return jsonResponse(res, 200, await orchestrator.decide(body));
    return jsonResponse(res, 400, { message: 'Unknown AgentOS operation.' });
  } catch (error) {
    console.error(JSON.stringify({ event: 'agentos_error', operation: body.operation || 'summary', message: error.message }));
    return jsonResponse(res, error.persistenceUnavailable ? 503 : 400, { message: error.persistenceUnavailable ? 'Operational records are temporarily unavailable. Please try again later.' : error.message });
  }
};
