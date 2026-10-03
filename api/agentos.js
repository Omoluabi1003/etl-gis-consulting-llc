'use strict';

const crypto = require('crypto');
const { jsonResponse, parseBody, getEnv } = require('./_utils');
const { AGENTS } = require('../agentos/definitions');
const { SupabaseAgentOSStore } = require('../agentos/store/supabase-store');
const { AgentOrchestrator } = require('../agentos/orchestrator');

const authorized = (req) => {
  const expected = getEnv('AGENTOS_ACCESS_TOKEN');
  const supplied = (req.headers?.authorization || '').replace(/^Bearer\s+/i, '');
  if (!expected || !supplied) return false;
  const a = Buffer.from(expected), b = Buffer.from(supplied);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
};

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'GET' && req.query?.action === 'definitions') return jsonResponse(res, 200, { agents: AGENTS });
  if (!authorized(req)) return jsonResponse(res, 401, { message: 'A valid AgentOS access token is required.' });
  const orchestrator = new AgentOrchestrator(new SupabaseAgentOSStore());
  const body = parseBody(req);
  try {
    if (req.method === 'GET') return jsonResponse(res, 200, await orchestrator.summary());
    if (req.method !== 'POST') return jsonResponse(res, 405, { message: 'Method not allowed.' });
    if (body.operation === 'submit-task') return jsonResponse(res, 201, await orchestrator.submit(body));
    if (body.operation === 'inspect-geojson') return jsonResponse(res, 200, { task: await orchestrator.inspectGeoJSON(body) });
    if (body.operation === 'decide-approval') return jsonResponse(res, 200, await orchestrator.decide(body));
    return jsonResponse(res, 400, { message: 'Unknown AgentOS operation.' });
  } catch (error) {
    console.error(JSON.stringify({ event: 'agentos_error', operation: body.operation || 'summary', message: error.message }));
    const configurationError = /not configured/.test(error.message);
    return jsonResponse(res, configurationError ? 503 : 400, { message: error.message });
  }
};
