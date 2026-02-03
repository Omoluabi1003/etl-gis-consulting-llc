"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Script from "next/script";
import CountUp from "../components/CountUp";
import ReduceMotionToggle from "../components/ReduceMotionToggle";
import ConsultationForm from "../components/ConsultationForm";
import PlaybookForm from "../components/PlaybookForm";
import {
  DashboardFrame,
  GovernanceChecklist,
  MapTileCard,
  PipelineSchematic
} from "../components/VisualProof";

const ConsentBanner = dynamic(() => import("../components/ConsentBanner"), {
  ssr: false
});

const CaseStudyModal = dynamic(() => import("../components/CaseStudyModal"), {
  ssr: false
});

const CASE_STUDIES = [
  {
    id: "metro",
    title: "Metro Mobility Analytics",
    badge: "-28% incident response time",
    summary:
      "Unified rail and bus telemetry into a single operational intelligence layer.",
    outcome:
      "Reduced incident response time by 28% and delivered executive-ready daily briefs.",
    scope:
      "Multi-modal transit authority with 4,000+ assets and 19 operational districts.",
    approach:
      "Modernized the GIS stack, standardized data pipelines, and built an executive briefing dashboard.",
    riskControls:
      "CJIS-aligned access controls, audit logging, and segmentation of sensitive feeds.",
    timeToValue: "First insights delivered in 6 weeks."
  },
  {
    id: "utility",
    title: "Utility Network Modernization",
    badge: "92% data integrity uplift",
    summary:
      "Re-architected a legacy GIS network model into an analytics-ready platform.",
    outcome:
      "Achieved 92% data integrity coverage across critical assets and reduced field rework.",
    scope:
      "Investor-owned utility managing transmission, distribution, and inspection programs.",
    approach:
      "Governed data engineering, schema normalization, and a modernization roadmap.",
    riskControls:
      "FISMA controls mapping, data retention policies, and training playbooks.",
    timeToValue: "Operational dashboards delivered in 8 weeks."
  },
  {
    id: "response",
    title: "Emergency Response Dashboards",
    badge: "45% faster situational updates",
    summary:
      "Delivered live operational dashboards for emergency management leadership.",
    outcome:
      "Accelerated situational awareness reporting by 45% across command centers.",
    scope:
      "State public agency coordinating multi-jurisdictional response teams.",
    approach:
      "Executive storytelling workshops, dashboard design, and data governance sprints.",
    riskControls:
      "Zero-trust architecture reviews and incident response tabletop exercises.",
    timeToValue: "Critical dashboards stood up within 30 days."
  }
];

const METRICS = [
  { value: 28, suffix: "%", label: "Faster incident response" },
  { value: 92, suffix: "%", label: "Data integrity coverage" },
  { value: 6, suffix: " wks", label: "Median time-to-value" }
];

export default function HomePage() {
  const [reduceMotion, setReduceMotion] = useState(false);
  const [activeStudy, setActiveStudy] = useState<(typeof CASE_STUDIES)[0] | null>(
    null
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mediaQuery.matches);
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      document
        .querySelectorAll(".reveal")
        .forEach((element) => element.classList.add("visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.2 }
    );

    document.querySelectorAll(".reveal").forEach((element) => {
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, [reduceMotion]);

  const orgJsonLd = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": ["Organization", "ProfessionalService"],
      name: "ETL GIS Consulting LLC",
      url: "https://etl-gis-consulting-llc.vercel.app",
      description:
        "Spatial intelligence, GIS modernization, and compliance-ready analytics for public-sector leaders.",
      areaServed: ["Transportation authorities", "Utilities", "Public agencies"],
      slogan: "Spatial intelligence designed for decisive leaders"
    }),
    []
  );

  return (
    <>
      <Script type="application/ld+json" id="org-jsonld">
        {JSON.stringify(orgJsonLd)}
      </Script>
      <header className="nav">
        <div className="nav-inner container">
          <div>
            <strong>ETL GIS Consulting LLC</strong>
            <div className="helper">Compliance-first spatial intelligence</div>
          </div>
          <nav className="nav-links" aria-label="Primary">
            <a href="#services">Services</a>
            <a href="#frameworks">Frameworks</a>
            <a href="#case-studies">Case studies</a>
            <a href="#trust-center">Trust center</a>
            <a href="#consult">Consult</a>
          </nav>
          <div className="nav-cta">
            <ReduceMotionToggle
              enabled={reduceMotion}
              onToggle={() => setReduceMotion((prev) => !prev)}
            />
            <a className="button primary" href="#consult">
              Book consultation
            </a>
          </div>
        </div>
      </header>

      <main>
        <section className="hero" id="top">
          <div className="container hero-grid">
            <div className="reveal">
              <span className="hero-badge">Public sector • Utilities • Transit</span>
              <h1>Spatial intelligence designed for decisive leaders.</h1>
              <p>
                ETL GIS Consulting LLC modernizes GIS platforms, aligns CJIS/FISMA
                compliance, and delivers analytics-ready insights that leadership
                can act on quickly.
              </p>
              <div className="hero-bullets">
                <div>• Modernized GIS architectures with measurable operational lift.</div>
                <div>• Executive storytelling dashboards built for daily decisions.</div>
                <div>• Compliance, governance, and training embedded from day one.</div>
              </div>
              <div className="hero-actions">
                <a className="button primary" href="#consult">
                  Schedule a discovery call
                </a>
                <a className="button secondary" href="#playbooks">
                  Download compliance playbooks
                </a>
              </div>
            </div>
            <div className="proof-bar reveal" aria-label="Visual proof">
              <div className="visual-proof">
                <div className="visual-panel">
                  <DashboardFrame />
                </div>
                <div className="visual-panel">
                  <MapTileCard />
                </div>
              </div>
              <p className="helper">
                Anonymized visuals represent the executive dashboards, spatial
                intelligence layers, and decision-ready briefings delivered to
                public-sector leadership teams.
              </p>
            </div>
          </div>
        </section>

        <section id="outcomes">
          <div className="container">
            <div className="proof-bar reveal">
              <h2>Outcome-driven engagement built for long sales cycles</h2>
              <div className="proof-bar-grid">
                {METRICS.map((metric) => (
                  <div className="metric" key={metric.label}>
                    <div className="metric-value">
                      <CountUp
                        value={metric.value}
                        suffix={metric.suffix}
                        reduceMotion={reduceMotion}
                      />
                    </div>
                    <div className="metric-label">{metric.label}</div>
                  </div>
                ))}
              </div>
              <p className="helper">
                Metrics represent anonymized outcomes from transit, utilities,
                and emergency response engagements.
              </p>
            </div>
          </div>
        </section>

        <section id="services">
          <div className="container split">
            <div className="reveal">
              <h2>What we deliver</h2>
              <p className="helper">
                A full-lifecycle modernization program covering platform,
                compliance, and executive decision support.
              </p>
              <ul className="list">
                <li>GIS platform modernization and roadmap delivery.</li>
                <li>CJIS/FISMA readiness, zero-trust architecture alignment.</li>
                <li>Data engineering for analytics-ready insight pipelines.</li>
                <li>Operational dashboards, executive briefings, storytelling.</li>
                <li>Training and governance enablement for internal teams.</li>
              </ul>
            </div>
            <div className="card reveal">
              <h3>Strategic partnerships</h3>
              <p className="helper">
                We align with enterprise GIS vendors, cybersecurity advisors, and
                public-sector procurement teams to de-risk delivery and accelerate
                adoption.
              </p>
              <div className="visual-panel" style={{ marginTop: "16px" }}>
                <PipelineSchematic />
              </div>
            </div>
          </div>
        </section>

        <section id="frameworks">
          <div className="container">
            <div className="reveal">
              <h2>Proven frameworks for predictable outcomes</h2>
              <p className="helper">
                Every engagement follows a structured, compliance-ready framework
                that leadership can track at each stage.
              </p>
            </div>
            <div className="card-grid" style={{ marginTop: "24px" }}>
              <div className="card reveal">
                <h3>Roadmap modernization</h3>
                <p className="helper">
                  Sequenced platform upgrades, procurement support, and a 12–18
                  month delivery plan aligned to budget cycles.
                </p>
              </div>
              <div className="card reveal">
                <h3>Compliance & governance</h3>
                <p className="helper">
                  CJIS/FISMA mapping, policy updates, and auditable controls for
                  sensitive data flows.
                </p>
              </div>
              <div className="card reveal">
                <h3>Operations enablement</h3>
                <p className="helper">
                  Workflow redesign, SOP updates, and training for cross-agency
                  teams managing daily GIS operations.
                </p>
              </div>
              <div className="card reveal">
                <h3>Executive clarity</h3>
                <p className="helper">
                  Decision-ready dashboards, briefing templates, and executive
                  storytelling that drives action.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="case-studies">
          <div className="container">
            <div className="reveal">
              <h2>Featured project stories</h2>
              <p className="helper">
                Anonymized engagements illustrating measurable outcomes.
              </p>
            </div>
            <div className="card-grid" style={{ marginTop: "24px" }}>
              {CASE_STUDIES.map((study) => (
                <div className="card reveal" key={study.id}>
                  <span className="badge">{study.badge}</span>
                  <h3>{study.title}</h3>
                  <p className="helper">{study.summary}</p>
                  <div className="case-actions">
                    <button
                      className="button secondary"
                      onClick={() => setActiveStudy(study)}
                    >
                      Quick view
                    </button>
                    <span className="helper">Outcome-first delivery</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="outcomes-proof">
          <div className="container split">
            <div className="card reveal">
              <h2>Client outcomes</h2>
              <ul className="list">
                <li>Operational time savings documented for leadership reporting.</li>
                <li>Improved data lineage and audit readiness for compliance teams.</li>
                <li>Improved executive confidence through consistent briefings.</li>
                <li>Faster onboarding for internal GIS and analytics staff.</li>
              </ul>
            </div>
            <div className="card reveal">
              <h3>Governance evidence preview</h3>
              <p className="helper">
                Clients receive a packaged trust center with artifacts that support
                procurement reviews and board updates.
              </p>
              <div className="visual-panel" style={{ marginTop: "16px" }}>
                <GovernanceChecklist />
              </div>
            </div>
          </div>
        </section>

        <section id="trust-center">
          <div className="container split">
            <div className="reveal">
              <h2>Compliance & trust center</h2>
              <p className="helper">
                Zero-trust, governance, and training aligned to CJIS/FISMA
                obligations for sensitive geospatial data.
              </p>
              <div className="trust-grid" style={{ marginTop: "16px" }}>
                <div className="notice">
                  Controls narrative: access segmentation, audit logging, and data
                  retention policies mapped to agency requirements.
                </div>
                <div className="notice">
                  Training: tailored role-based enablement and tabletop exercises
                  for operational teams.
                </div>
              </div>
            </div>
            <div className="card reveal">
              <h3>Evidence hub</h3>
              <div className="trust-grid" style={{ marginTop: "12px" }}>
                <div className="notice">Security architecture diagrams</div>
                <div className="notice">Control matrices & audit logs</div>
                <div className="notice">Governance playbooks</div>
                <div className="notice">Executive briefing templates</div>
              </div>
              <ul className="list" style={{ marginTop: "16px" }}>
                <li>Compliance readiness reporting for procurement.</li>
                <li>Data governance playbooks with roles, workflows, approvals.</li>
                <li>Operational KPI baselines for leadership updates.</li>
              </ul>
              <div className="visual-panel" style={{ marginTop: "16px" }}>
                <DashboardFrame />
              </div>
            </div>
          </div>
        </section>

        <section id="playbooks">
          <div className="container split">
            <div className="reveal">
              <h2>Compliance playbooks for leadership teams</h2>
              <p className="helper">
                Download the 2025–2026 GIS modernization playbooks for public
                agencies and utilities.
              </p>
              <p className="helper" style={{ marginTop: "12px" }}>
                Not ready to book? Start with a playbook and we will follow up
                with a tailored roadmap outline.
              </p>
            </div>
            <div className="card reveal">
              <PlaybookForm />
            </div>
          </div>
        </section>

        <section id="leadership">
          <div className="container split">
            <div className="card reveal">
              <h2>Founder & leadership</h2>
              <p className="helper">
                Marquis Who’s Who 2025 honoree with two decades leading GIS
                modernization across public-sector and utility environments.
              </p>
              <ul className="list">
                <li>Former public agency GIS program director.</li>
                <li>Led compliance-ready platform transitions for critical assets.</li>
                <li>Advisor to transportation authorities and utility executives.</li>
              </ul>
            </div>
            <div className="card reveal">
              <h3>Founder portrait</h3>
              <div className="visual-panel" style={{ marginTop: "16px" }}>
                <svg viewBox="0 0 220 220" role="img" aria-label="Founder portrait">
                  <rect width="220" height="220" rx="110" fill="#dbe7f0" />
                  <circle cx="110" cy="88" r="40" fill="#c8d6e5" />
                  <rect x="55" y="130" width="110" height="60" rx="30" fill="#c8d6e5" />
                </svg>
              </div>
              <p className="helper" style={{ marginTop: "12px" }}>
                Recognized in Marquis Who’s Who 2025 for contributions to public
                sector geospatial modernization.
              </p>
            </div>
          </div>
        </section>

        <section id="consult">
          <div className="container split">
            <div className="reveal">
              <h2>Book a consultation</h2>
              <p className="helper">
                Two-track engagement: book a call or download the playbooks while
                you align internal stakeholders.
              </p>
              <p className="helper" style={{ marginTop: "10px" }}>
                Not ready to book? Start with the compliance playbooks above and
                return when your team is aligned.
              </p>
              <div className="notice" style={{ marginTop: "16px" }}>
                What happens next:
                <ol className="list" style={{ marginTop: "10px" }}>
                  <li>We confirm fit and compliance requirements.</li>
                  <li>We deliver a 30-minute discovery briefing.</li>
                  <li>We outline a modernization roadmap and staffing plan.</li>
                </ol>
              </div>
              <div style={{ marginTop: "18px" }}>
                <a
                  className="button secondary"
                  href="https://cal.com"
                  target="_blank"
                  rel="noreferrer"
                >
                  Book via Cal.com
                </a>
              </div>
            </div>
            <ConsultationForm />
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <p>
            © 2025 ETL GIS Consulting LLC. Privacy-first analytics available upon
            consent.
          </p>
        </div>
      </footer>

      <CaseStudyModal study={activeStudy} onClose={() => setActiveStudy(null)} />
      <ConsentBanner />
    </>
  );
}
