import dynamic from "next/dynamic";
import { Metadata } from "next";
import ReduceMotionToggle from "./components/ReduceMotionToggle";
import OutcomesBar from "./components/OutcomesBar";
import PlaybookForm from "./components/PlaybookForm";
import ConsultationForm from "./components/ConsultationForm";
import ConsentBanner from "./components/ConsentBanner";
import Reveal from "./components/Reveal";
import { GovernanceChecklist } from "./components/VisualProofs";

const CaseStudies = dynamic(() => import("./components/CaseStudies"), {
  ssr: false,
});

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return (
    <>
      <header className="header">
        <div className="container header-inner">
          <div>
            <strong>ETL GIS Consulting LLC</strong>
            <div className="helper-text">Spatial intelligence for leaders</div>
          </div>
          <nav className="nav" aria-label="Primary">
            <a href="#services">Services</a>
            <a href="#frameworks">Frameworks</a>
            <a href="#case-studies">Case studies</a>
            <a href="#trust">Trust center</a>
            <a href="#playbook">Playbook</a>
            <a href="#consult">Consult</a>
            <ReduceMotionToggle />
          </nav>
        </div>
      </header>
      <main id="main">
        <section className="section hero">
          <div className="container grid grid-2">
            <div>
              <span className="tag">Public sector + utility GIS</span>
              <h1>Spatial intelligence designed for decisive leaders.</h1>
              <p>
                We modernize GIS platforms for transportation authorities,
                utilities, and public agencies with compliance-first data
                engineering, analytics-ready insights, and executive storytelling.
              </p>
              <ul className="bullet-list">
                <li>Modernize legacy GIS with zero-trust controls.</li>
                <li>Convert fragmented data into mission-ready dashboards.</li>
                <li>Equip executives with clear, defensible decisions.</li>
              </ul>
              <div className="actions">
                <a className="button button-primary" href="#consult">
                  Book a confidential call
                </a>
                <a className="button button-secondary" href="#playbook">
                  Download the playbook
                </a>
              </div>
            </div>
            <div className="surface" style={{ padding: "2rem" }}>
              <div className="section-title">
                <h2>What decisive leaders expect</h2>
                <p>
                  Clear compliance posture. Operational lift you can brief.
                  Secure delivery with measurable outcomes.
                </p>
              </div>
              <div className="grid">
                <div className="card">
                  <strong>Modernized GIS platforms</strong>
                  <p>
                    Seamless migrations, field enablement, and zero downtime
                    transitions.
                  </p>
                </div>
                <div className="card">
                  <strong>CJIS &amp; FISMA readiness</strong>
                  <p>
                    Controls mapped to workflows, audit trails, and governance
                    playbooks.
                  </p>
                </div>
                <div className="card">
                  <strong>Executive storytelling</strong>
                  <p>
                    Leadership dashboards and decision narratives that withstand
                    oversight.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-tight">
          <div className="container">
            <Reveal>
              <OutcomesBar />
            </Reveal>
          </div>
        </section>

        <section id="services" className="section anchor-offset">
          <div className="container">
            <Reveal>
              <div className="section-title">
                <span className="tag">Core services</span>
                <h2>Compliance-first GIS modernization for critical missions</h2>
                <p>
                  We deliver end-to-end transformation with measurable value for
                  transportation authorities, utilities, and public agencies.
                </p>
              </div>
              <div className="grid grid-3">
                <div className="card">
                  <h3>Platform modernization</h3>
                  <p>
                    Legacy GIS upgrades, asset data migrations, and field
                    mobility enablement with continuity planning.
                  </p>
                </div>
                <div className="card">
                  <h3>Data engineering</h3>
                  <p>
                    Secure pipelines, analytics-ready insights, and operational
                    data products aligned to governance policy.
                  </p>
                </div>
                <div className="card">
                  <h3>Executive dashboards</h3>
                  <p>
                    Situation rooms, performance scorecards, and briefings built
                    for regulated oversight.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section id="frameworks" className="section anchor-offset">
          <div className="container">
            <Reveal>
              <div className="section-title">
                <span className="tag">Proven frameworks</span>
                <h2>Roadmaps that balance speed, compliance, and clarity</h2>
                <p>
                  Our delivery model keeps leadership aligned while reducing
                  operational and security risk.
                </p>
              </div>
              <div className="grid grid-2">
                <div className="card">
                  <h3>Strategic roadmaps</h3>
                  <p>
                    Multi-phase modernization plans with funding alignment and
                    clear milestones.
                  </p>
                </div>
                <div className="card">
                  <h3>Compliance by design</h3>
                  <p>
                    CJIS/FISMA controls embedded into data workflows and vendor
                    coordination.
                  </p>
                </div>
                <div className="card">
                  <h3>Operational resilience</h3>
                  <p>
                    Training, runbooks, and monitoring that keep teams ready for
                    audits or incidents.
                  </p>
                </div>
                <div className="card">
                  <h3>Executive clarity</h3>
                  <p>
                    Leadership-ready narratives and decision briefings linked to
                    measurable outcomes.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <Reveal>
              <div className="section-title">
                <span className="tag">Strategic partnerships</span>
                <h2>Aligned with public-sector technology partners</h2>
                <p>
                  We collaborate with GIS platform providers, cybersecurity
                  advisors, and cloud integrators to deliver secure deployments
                  without vendor lock-in.
                </p>
              </div>
              <div className="grid grid-3">
                <div className="card">
                  <h3>GIS platform alliances</h3>
                  <p>
                    Certified experts across leading GIS ecosystems for seamless
                    upgrades and migrations.
                  </p>
                </div>
                <div className="card">
                  <h3>Security advisory network</h3>
                  <p>
                    Partnered with compliance specialists to validate CJIS and
                    FISMA controls.
                  </p>
                </div>
                <div className="card">
                  <h3>Implementation delivery</h3>
                  <p>
                    Integrated with infrastructure providers to support secure
                    hosting and continuity planning.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section id="case-studies" className="section anchor-offset">
          <div className="container">
            <div className="section-title">
              <span className="tag">Featured outcomes</span>
              <h2>Evidence-backed project stories</h2>
              <p>
                Anonymized case studies show how we deliver measurable outcomes
                while safeguarding sensitive data.
              </p>
            </div>
            <CaseStudies />
          </div>
        </section>

        <section id="trust" className="section anchor-offset">
          <div className="container">
            <Reveal>
              <div className="section-title">
                <span className="tag">Compliance &amp; trust center</span>
                <h2>Zero-trust delivery with auditable governance</h2>
                <p>
                  We help agencies and utilities maintain clear security posture
                  across every GIS modernization milestone.
                </p>
              </div>
              <div className="trust-grid">
                <div className="card">
                  <h3>Controls narrative</h3>
                  <p>
                    Zero-trust access, data minimization, and continuous
                    monitoring mapped to CJIS and FISMA standards.
                  </p>
                  <ul className="bullet-list">
                    <li>Identity-first access with MFA and role segmentation.</li>
                    <li>Governance playbooks for data lineage and retention.</li>
                    <li>Training programs for operational readiness.</li>
                  </ul>
                </div>
                <div className="card">
                  <h3>Evidence hub</h3>
                  <p>
                    Artifact previews illustrate what leadership receives at every
                    delivery milestone.
                  </p>
                  <div className="evidence-card">
                    <span>Governance checklist preview</span>
                    <div className="visual-proof">
                      <GovernanceChecklist />
                    </div>
                    <div className="helper-text">
                      Policy mapping, audit trails, and incident workflows.
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section id="playbook" className="section anchor-offset">
          <div className="container">
            <Reveal>
              <div className="playbook surface" style={{ padding: "2.5rem" }}>
                <div>
                  <span className="tag">Executive playbook</span>
                  <h2>Get the GIS modernization playbook for 2025–2026</h2>
                  <p>
                    A concise field guide covering compliance-ready roadmaps,
                    data engineering patterns, and executive storytelling.
                  </p>
                  <div className="helper-text">
                    Not ready to book? Start with the playbook and align your
                    leadership team.
                  </div>
                </div>
                <PlaybookForm />
              </div>
            </Reveal>
          </div>
        </section>

        <section id="founder" className="section anchor-offset">
          <div className="container">
            <Reveal>
              <div className="grid grid-2">
                <div className="surface" style={{ padding: "2rem" }}>
                  <div
                    style={{
                      width: "140px",
                      height: "140px",
                      borderRadius: "50%",
                      background: "#dbeafe",
                      marginBottom: "1.5rem",
                    }}
                    aria-hidden="true"
                  />
                  <span className="badge">Marquis Who's Who 2025 Honoree</span>
                  <h2>Founder &amp; Principal: Ethan L. Thompson</h2>
                  <p>
                    Ethan leads ETL GIS Consulting LLC with 15+ years of
                    public-sector GIS modernization, specializing in compliant
                    data engineering and executive storytelling. His work helps
                    agencies translate complex spatial data into accountable
                    decisions.
                  </p>
                </div>
                <div className="card">
                  <h3>Leadership bio</h3>
                  <p>
                    Ethan has delivered statewide GIS programs, executive
                    dashboards, and operational training for transportation,
                    utility, and emergency management agencies. He partners with
                    CIOs, chiefs of staff, and compliance leaders to keep
                    modernization programs aligned and audit-ready.
                  </p>
                  <div className="helper-text">
                    Recognition: Marquis Who's Who in America, 2025 edition.
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section id="consult" className="section anchor-offset">
          <div className="container">
            <Reveal>
              <div className="section-title">
                <span className="tag">Consultation</span>
                <h2>Secure a modernization partner for the next 12 months</h2>
                <p>
                  Two-track funnel: book a confidential call or start with the
                  playbook if your team is still aligning.
                </p>
              </div>
              <div className="grid grid-2">
                <div className="card">
                  <h3>What happens next</h3>
                  <div className="next-steps">
                    <div>
                      <strong>1. Intake review</strong>
                      <p className="helper-text">
                        We confirm scope, compliance posture, and timeline.
                      </p>
                    </div>
                    <div>
                      <strong>2. Confidential briefing</strong>
                      <p className="helper-text">
                        A 45-minute call focused on risk controls and outcomes.
                      </p>
                    </div>
                    <div>
                      <strong>3. Executive roadmap</strong>
                      <p className="helper-text">
                        We deliver a phased plan with clear milestones.
                      </p>
                    </div>
                  </div>
                  <div style={{ marginTop: "1.5rem" }}>
                    <a
                      className="button button-primary"
                      href="https://cal.com/etl-gis-consulting"
                    >
                      Book on Cal.com
                    </a>
                    <p className="helper-text" style={{ marginTop: "0.75rem" }}>
                      Not ready to book? Download the playbook for leadership
                      alignment.
                    </p>
                  </div>
                </div>
                <ConsultationForm />
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <p>
            © 2025 ETL GIS Consulting LLC. Privacy-first analytics and
            compliance-focused delivery.
          </p>
        </div>
      </footer>

      <ConsentBanner />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                name: "ETL GIS Consulting LLC",
                url: "https://etl-gis-consulting-llc.vercel.app",
                description:
                  "Compliance-first GIS modernization for transportation authorities, utilities, and public agencies.",
              },
              {
                "@type": "ProfessionalService",
                name: "ETL GIS Consulting LLC",
                url: "https://etl-gis-consulting-llc.vercel.app",
                areaServed: "US",
                serviceType: [
                  "GIS modernization",
                  "Data engineering",
                  "Compliance consulting",
                  "Executive analytics",
                ],
              },
            ],
          }),
        }}
      />
    </>
  );
}
