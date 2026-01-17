# Authenticity Verification Checklist

Use this checklist in staging/production to confirm trust promises and operational readiness.

## 1) Contact Identity & Trust Center
- [ ] Confirm primary inbox `contact@etl-gis.com` appears across homepage, contact page, and footer links.
- [ ] Confirm Trust Center links resolve to `/privacy` and `/terms`.
- [ ] Confirm CJIS alignment brief downloads from `/assets/downloads/cjis-alignment-brief.pdf`.

## 2) Consultation Request Form (`/api/consultation`)
**Client-side UX**
- [ ] Required field validation triggers for name, email, organization, interest, goals, and consent.
- [ ] Honeypot field remains hidden and empty in normal submissions.
- [ ] Success state displays a lead/reference ID.
- [ ] Error state does not expose server internals.

**Server-side behavior**
- [ ] Submissions are stored in Supabase table `lead_submissions`.
- [ ] Rate limit blocks repeated submissions from same IP/email within 10 minutes.
- [ ] Internal notification email is sent to `PRIMARY_INBOX`.
- [ ] Requester confirmation email is sent with the lead ID and SLA.

**Sample request (production)**
```bash
curl -X POST https://etl-gis-consulting-llc.vercel.app/api/consultation \
  -H "Content-Type: application/json" \
  -d '{
    "full-name": "Test User",
    "email": "test@example.com",
    "organization": "Example Org",
    "interest": "strategy",
    "goals": "Testing form endpoint",
    "consent": "yes"
  }'
```

## 3) Playbook Unlock Form (`/api/playbook`)
**Client-side UX**
- [ ] Consent checkbox is required before submission.
- [ ] Success state unlocks downloads and displays a lead/reference ID.

**Server-side behavior**
- [ ] Submissions are stored in Supabase table `playbook_requests`.
- [ ] Internal notification email is sent to `PRIMARY_INBOX`.
- [ ] Requester email includes direct PDF links.

**Sample request (production)**
```bash
curl -X POST https://etl-gis-consulting-llc.vercel.app/api/playbook \
  -H "Content-Type: application/json" \
  -d '{
    "full-name": "Test User",
    "email": "test@example.com",
    "organization": "Example Org",
    "consent": "yes",
    "resource": "Enterprise GIS playbooks"
  }'
```

## 4) Consent-Based Analytics (Plausible)
- [ ] Prior to consent, verify the Plausible script is **not** requested in the Network tab.
- [ ] After accepting analytics, verify `https://plausible.io/js/script.js` loads and analytics events fire.
- [ ] Use the “Manage analytics preferences” footer link to reopen the consent banner.
- [ ] Declining analytics should prevent script loading on subsequent page loads.

## 5) Logs & Observability
- [ ] Confirm JSON logs for form submissions appear in the hosting platform logs.
- [ ] Validate both success and failure logs contain the lead ID and status.

## 6) CI Checks
- [ ] GitHub Actions CI passes: HTML lint, config typecheck, build check, form endpoint integration test, and link checker.
- [ ] Link checker reports no internal broken links.

## 7) Environment Variables (required in production)
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` (or `SUPABASE_ANON_KEY` with row-level security configured)
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `PRIMARY_INBOX`
- `SITE_URL`
