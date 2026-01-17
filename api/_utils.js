const crypto = require('crypto');

const jsonResponse = (res, status, payload) => {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
};

const parseBody = (req) => {
  if (!req?.body) {
    return {};
  }
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch (error) {
      return {};
    }
  }
  return req.body;
};

const sanitizeString = (value, maxLength = 5000) => {
  if (typeof value !== 'string') {
    return '';
  }
  return value.trim().slice(0, maxLength);
};

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const getClientIp = (req) => {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim();
  }
  return req.socket?.remoteAddress || '';
};

const getUserAgent = (req) => req.headers['user-agent'] || '';

const getEnv = (name) => process.env[name] || '';

const getSupabaseHeaders = () => {
  const apiKey = getEnv('SUPABASE_SERVICE_ROLE_KEY') || getEnv('SUPABASE_ANON_KEY');
  return {
    apikey: apiKey,
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  };
};

const fetchSupabase = async (path, options = {}) => {
  const supabaseUrl = getEnv('SUPABASE_URL');
  if (!supabaseUrl) {
    throw new Error('Supabase URL is not configured.');
  }
  const url = `${supabaseUrl.replace(/\/$/, '')}/rest/v1/${path}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getSupabaseHeaders(),
      ...(options.headers || {}),
    },
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Supabase request failed.');
  }
  return response.json();
};

const checkRateLimit = async ({ table, email, ipAddress, windowMinutes = 10 }) => {
  const since = new Date(Date.now() - windowMinutes * 60 * 1000).toISOString();
  const filters = [];
  if (email) {
    filters.push(`email.eq.${encodeURIComponent(email)}`);
  }
  if (ipAddress) {
    filters.push(`ip_address.eq.${encodeURIComponent(ipAddress)}`);
  }
  if (!filters.length) {
    return false;
  }
  const query = `select=created_at&or=(${filters.join(',')})&created_at=gte.${since}&limit=1`;
  const data = await fetchSupabase(`${table}?${query}`, { method: 'GET' });
  return Array.isArray(data) && data.length > 0;
};

const insertRecord = async ({ table, payload }) => {
  const data = await fetchSupabase(`${table}`, {
    method: 'POST',
    headers: {
      Prefer: 'return=representation',
    },
    body: JSON.stringify(payload),
  });
  return data?.[0] || null;
};

const sendEmail = async ({ to, subject, text, replyTo }) => {
  const apiKey = getEnv('RESEND_API_KEY');
  const from = getEnv('RESEND_FROM_EMAIL');
  if (!apiKey || !from) {
    throw new Error('Email service is not configured.');
  }
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: Array.isArray(to) ? to : [to],
      subject,
      text,
      ...(replyTo ? { reply_to: replyTo } : {}),
    }),
  });
  if (!response.ok) {
    const textResponse = await response.text();
    throw new Error(textResponse || 'Email send failed.');
  }
  return response.json();
};

const generateLeadId = () => crypto.randomUUID();

module.exports = {
  jsonResponse,
  parseBody,
  sanitizeString,
  validateEmail,
  getClientIp,
  getUserAgent,
  getEnv,
  checkRateLimit,
  insertRecord,
  sendEmail,
  generateLeadId,
};
