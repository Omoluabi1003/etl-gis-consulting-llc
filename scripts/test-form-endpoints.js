const path = require('path');

process.env.SUPABASE_URL = 'https://example.supabase.co';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-key';
process.env.RESEND_API_KEY = 'test-resend';
process.env.RESEND_FROM_EMAIL = 'contact@etl-gis.com';
process.env.PRIMARY_INBOX = 'contact@etl-gis.com';
process.env.SITE_URL = 'https://etl-gis-consulting-llc.vercel.app';

const consultation = require(path.join(__dirname, '..', 'api', 'consultation.js'));
const playbook = require(path.join(__dirname, '..', 'api', 'playbook.js'));

global.fetch = async (url, options = {}) => {
  const method = options.method || 'GET';
  if (url.includes('rest/v1/lead_submissions') && method === 'GET') {
    return { ok: true, json: async () => [] };
  }
  if (url.includes('rest/v1/lead_submissions') && method === 'POST') {
    return { ok: true, json: async () => [{ lead_id: 'lead-1' }] };
  }
  if (url.includes('rest/v1/playbook_requests') && method === 'GET') {
    return { ok: true, json: async () => [] };
  }
  if (url.includes('rest/v1/playbook_requests') && method === 'POST') {
    return { ok: true, json: async () => [{ lead_id: 'lead-2' }] };
  }
  if (url.includes('api.resend.com')) {
    return { ok: true, json: async () => ({ id: 'email-1' }) };
  }
  return { ok: false, text: async () => 'Unhandled fetch in test.' };
};

const buildRes = () => {
  const res = {
    statusCode: 200,
    headers: {},
    body: '',
    setHeader(name, value) {
      this.headers[name] = value;
    },
    end(payload) {
      this.body = payload;
    },
  };
  return res;
};

const buildReq = (body) => ({
  method: 'POST',
  headers: {
    'x-forwarded-for': '203.0.113.10',
    'user-agent': 'form-endpoint-test',
  },
  socket: { remoteAddress: '203.0.113.10' },
  body: JSON.stringify(body),
});

const runTest = async (name, handler, reqBody) => {
  const req = buildReq(reqBody);
  const res = buildRes();
  await handler(req, res);
  const parsed = JSON.parse(res.body || '{}');
  if (res.statusCode !== 200) {
    throw new Error(`${name} failed with status ${res.statusCode}: ${parsed.message || res.body}`);
  }
  if (!parsed.leadId) {
    throw new Error(`${name} did not return a leadId.`);
  }
  console.log(`[test] ${name} ok`);
};

const run = async () => {
  await runTest('consultation', consultation, {
    'full-name': 'Test User',
    email: 'test@example.com',
    organization: 'Example Org',
    interest: 'strategy',
    goals: 'Test goals',
    consent: 'yes',
  });

  await runTest('playbook', playbook, {
    'full-name': 'Test User',
    email: 'test@example.com',
    organization: 'Example Org',
    consent: 'yes',
    resource: 'Enterprise GIS playbooks',
  });
};

run().catch((error) => {
  console.error(`[test] ${error.message}`);
  process.exit(1);
});
