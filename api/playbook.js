const {
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
} = require('./_utils');

const getPlaybookLinks = () => {
  const siteUrl = getEnv('SITE_URL') || 'https://etl-gis-consulting-llc.vercel.app';
  return [
    `${siteUrl}/assets/downloads/utility-network-modernization-playbook.pdf`,
    `${siteUrl}/assets/downloads/public-agency-analytics-playbook.pdf`,
    `${siteUrl}/assets/downloads/cjis-alignment-brief.pdf`,
  ];
};

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return jsonResponse(res, 405, { message: 'Method not allowed.' });
  }

  const payload = parseBody(req);
  const fullName = sanitizeString(payload['full-name'] || payload.fullName, 200);
  const email = sanitizeString(payload.email, 200).toLowerCase();
  const organization = sanitizeString(payload.organization, 200);
  const consent = sanitizeString(payload.consent, 20);
  const honeypot = sanitizeString(payload.website, 200);

  if (honeypot) {
    return jsonResponse(res, 400, { message: 'Submission rejected.' });
  }

  if (!fullName || !email || !organization) {
    return jsonResponse(res, 400, { message: 'Please complete all required fields.' });
  }

  if (!validateEmail(email)) {
    return jsonResponse(res, 400, { message: 'Please provide a valid email address.' });
  }

  if (consent !== 'yes') {
    return jsonResponse(res, 400, { message: 'Consent is required to receive the playbooks.' });
  }

  const supabaseUrl = getEnv('SUPABASE_URL');
  const supabaseKey = getEnv('SUPABASE_SERVICE_ROLE_KEY') || getEnv('SUPABASE_ANON_KEY');
  const inbox = getEnv('PRIMARY_INBOX');

  if (!supabaseUrl || !supabaseKey || !inbox) {
    console.error(JSON.stringify({ event: 'playbook_config_missing' }));
    return jsonResponse(res, 500, { message: 'Form service is not configured yet.' });
  }

  const ipAddress = getClientIp(req);
  const userAgent = getUserAgent(req);

  try {
    const isRateLimited = await checkRateLimit({
      table: 'playbook_requests',
      email,
      ipAddress,
      windowMinutes: 10,
    });

    if (isRateLimited) {
      return jsonResponse(res, 429, { message: 'Please wait a few minutes before requesting again.' });
    }

    const leadId = generateLeadId();
    const record = {
      lead_id: leadId,
      full_name: fullName,
      email,
      organization,
      consent,
      resource: sanitizeString(payload.resource, 200),
      page_path: sanitizeString(payload.pagePath, 200),
      referrer: sanitizeString(payload.referrer, 500),
      utm_source: sanitizeString(payload.utmSource, 120),
      utm_medium: sanitizeString(payload.utmMedium, 120),
      utm_campaign: sanitizeString(payload.utmCampaign, 120),
      utm_term: sanitizeString(payload.utmTerm, 120),
      utm_content: sanitizeString(payload.utmContent, 120),
      ip_address: ipAddress,
      user_agent: userAgent,
      created_at: new Date().toISOString(),
    };

    await insertRecord({ table: 'playbook_requests', payload: record });

    console.log(JSON.stringify({ event: 'playbook_requested', leadId, email }));

    const playbookLinks = getPlaybookLinks();

    const internalBody = [
      'Playbook request received.',
      `Lead ID: ${leadId}`,
      `Name: ${fullName}`,
      `Email: ${email}`,
      `Organization: ${organization}`,
      `Resource: ${record.resource || 'Enterprise GIS playbooks'}`,
      `Page: ${record.page_path || 'Not provided'}`,
      `Referrer: ${record.referrer || 'Not provided'}`,
      `UTM: ${record.utm_source || '-'} / ${record.utm_medium || '-'} / ${record.utm_campaign || '-'}`,
      `IP: ${ipAddress}`,
    ].join('\n');

    await sendEmail({
      to: inbox,
      subject: `Playbook request (${leadId})`,
      text: internalBody,
      replyTo: email,
    });

    const requesterBody = [
      `Hi ${fullName},`,
      '',
      'Thanks for requesting the ETL GIS playbook series.',
      `Your reference ID is ${leadId}.`,
      '',
      'Download links:',
      ...playbookLinks.map((link) => `- ${link}`),
      '',
      'If you have any questions or would like a walkthrough, reply to this email and we will follow up.',
      '',
      '— ETL GIS Consulting LLC',
    ].join('\n');

    await sendEmail({
      to: email,
      subject: `Your GIS playbooks (${leadId})`,
      text: requesterBody,
    });

    return jsonResponse(res, 200, { leadId, message: 'Playbooks sent.' });
  } catch (error) {
    console.error(JSON.stringify({ event: 'playbook_error', message: error?.message || error }));
    return jsonResponse(res, 500, { message: 'We could not process your request. Please try again shortly.' });
  }
};
