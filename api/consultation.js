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

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return jsonResponse(res, 405, { message: 'Method not allowed.' });
  }

  const payload = parseBody(req);
  const fullName = sanitizeString(payload['full-name'] || payload.fullName, 200);
  const email = sanitizeString(payload.email, 200).toLowerCase();
  const organization = sanitizeString(payload.organization, 200);
  const interest = sanitizeString(payload.interest, 120);
  const goals = sanitizeString(payload.goals || payload.message, 4000);
  const timezone = sanitizeString(payload.timezone, 120);
  const kickoffDate = sanitizeString(payload['kickoff-date'] || payload.kickoffDate, 40);
  const consent = sanitizeString(payload.consent, 20);
  const honeypot = sanitizeString(payload.website, 200);

  if (honeypot) {
    return jsonResponse(res, 400, { message: 'Submission rejected.' });
  }

  if (!fullName || !email || !organization || !interest || !goals) {
    return jsonResponse(res, 400, { message: 'Please complete all required fields.' });
  }

  if (!validateEmail(email)) {
    return jsonResponse(res, 400, { message: 'Please provide a valid email address.' });
  }

  if (consent !== 'yes') {
    return jsonResponse(res, 400, { message: 'Please confirm consent to be contacted.' });
  }

  const supabaseUrl = getEnv('SUPABASE_URL');
  const supabaseKey = getEnv('SUPABASE_SERVICE_ROLE_KEY') || getEnv('SUPABASE_ANON_KEY');
  const inbox = getEnv('PRIMARY_INBOX');

  if (!supabaseUrl || !supabaseKey || !inbox) {
    console.error(JSON.stringify({ event: 'consultation_config_missing' }));
    return jsonResponse(res, 500, { message: 'Form service is not configured yet.' });
  }

  const ipAddress = getClientIp(req);
  const userAgent = getUserAgent(req);

  try {
    const isRateLimited = await checkRateLimit({
      table: 'lead_submissions',
      email,
      ipAddress,
      windowMinutes: 10,
    });

    if (isRateLimited) {
      return jsonResponse(res, 429, { message: 'Please wait a few minutes before submitting again.' });
    }

    const leadId = generateLeadId();
    const record = {
      lead_id: leadId,
      full_name: fullName,
      email,
      organization,
      interest,
      goals,
      timezone,
      kickoff_date: kickoffDate || null,
      consent,
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

    await insertRecord({ table: 'lead_submissions', payload: record });

    console.log(JSON.stringify({ event: 'consultation_submitted', leadId, email }));

    const internalBody = [
      'New consultation request received.',
      `Lead ID: ${leadId}`,
      `Name: ${fullName}`,
      `Email: ${email}`,
      `Organization: ${organization}`,
      `Interest: ${interest}`,
      `Goals: ${goals}`,
      `Timezone: ${timezone || 'Not provided'}`,
      `Kickoff date: ${kickoffDate || 'Not provided'}`,
      `Page: ${record.page_path || 'Not provided'}`,
      `Referrer: ${record.referrer || 'Not provided'}`,
      `UTM: ${record.utm_source || '-'} / ${record.utm_medium || '-'} / ${record.utm_campaign || '-'}`,
      `IP: ${ipAddress}`,
    ].join('\n');

    await sendEmail({
      to: inbox,
      subject: `New consultation request (${leadId})`,
      text: internalBody,
      replyTo: email,
    });

    const requesterBody = [
      `Hi ${fullName},`,
      '',
      'Thanks for reaching out to ETL GIS Consulting LLC.',
      `Your consultation request has been received and logged under reference ID ${leadId}.`,
      'A senior consultant will respond within one business day with next steps and scheduling options.',
      '',
      'If you need to add details, reply directly to this email.',
      '',
      '— ETL GIS Consulting LLC',
    ].join('\n');

    await sendEmail({
      to: email,
      subject: `We received your request (${leadId})`,
      text: requesterBody,
    });

    return jsonResponse(res, 200, { leadId, message: 'Request received.' });
  } catch (error) {
    console.error(JSON.stringify({ event: 'consultation_error', message: error?.message || error }));
    return jsonResponse(res, 500, { message: 'We could not process your request. Please try again shortly.' });
  }
};
