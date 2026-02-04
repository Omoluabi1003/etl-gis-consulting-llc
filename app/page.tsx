import dynamic from "next/dynamic";
import styles from "./page.module.css";
import ConsultationForm from "./components/ConsultationForm";
import PlaybookForm from "./components/PlaybookForm";
import ConsentBanner from "./components/ConsentBanner";
import ReduceMotionToggle from "./components/ReduceMotionToggle";
import RevealOnScroll from "./components/RevealOnScroll";
import CountUp from "./components/CountUp";

const VisualProofs = dynamic(() => import("./components/VisualProofs"), {
  loading: () => <p>Loading visuals...</p>
});
const CaseStudies = dynamic(() => import("./components/CaseStudies"), {
  loading: () => <p>Loading case studies...</p>
});
const TrustCenter = dynamic(() => import("./components/TrustCenter"), {
  loading: () => <p>Loading trust center...</p>
});

const outcomes = [
  {
    value: 12,
    suffix: "+",
    label: "weeks to audit-ready modernization plans"
  },
  {
    value: 99.9,
    suffix: "%",
    decimals: 1,
    label: "availability targets for mission dashboards"
  },
  {
    value: 0,
    suffix: "",
    label: "unowned controls in compliance crosswalks"
  }
];

const services = [
  {
    title: "Compliance-first GIS modernization",
    detail:
      "Architect secure, resilient platforms with documented control inheritance."
  },
  {
    title: "Data governance + lineage",
    detail:
      "Implement defensible data practices for public reporting and audit trails."
  },
  {
    title: "Operational readiness",
    detail:
      "Train teams, document runbooks, and validate continuity before go-live."
  }
];

const frameworks = [
  "NIST 800-53 Moderate",
  "CJIS Security Policy",
  "State IT security baselines",
  "FedRAMP-informed controls"
];

const partnerships = [
  "Esri ecosystem delivery",
  "Microsoft Azure Government",
  "AWS GovCloud alignment",
  "ServiceNow GRC integrations"
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": ["Organization", "ProfessionalService"],
  name: "ETL GIS Consulting",
  url: "https://etl-gis-consulting.example.com",
  description:
    "Compliance-first GIS consulting for public-sector agencies, focused on audit-ready modernization and data governance.",
  areaServed: "US",
  knowsAbout: ["GIS modernization", "Compliance", "Public sector"],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "sales",
    email: "intake@etl-gis-consulting.example.com"
  }
};

export default function Page() {
  return (
    <div className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header className={styles.header}>
        <div className={styles.brand}>
          <span className={styles.logoMark}>ETL</span>
          <span>GIS Consulting</span>
        </div>
        <nav aria-label="Primary" className={styles.nav}>
          <a href="#outcomes">Outcomes</a>
          <a href="#services">Services</a>
          <a href="#proof">Proof</a>
          <a href="#trust">Trust center</a>
          <a href="#contact">Contact</a>
        </nav>
        <a className={styles.primaryButton} href="#contact">
          Book consultation
        </a>
      </header>

      <main>
        <section id="hero" className={styles.hero}>
          <div>
            <p className={styles.eyebrow}>Compliance-first GIS modernization</p>
            <h1>
              Modernize public-sector GIS without compromising audit readiness.
            </h1>
            <p className={styles.lede}>
              ETL GIS Consulting helps agencies deliver secure, resilient
              geospatial programs with documented controls, privacy safeguards,
              and operational continuity.
            </p>
            <div className={styles.heroActions}>
              <a className={styles.primaryButton} href="#contact">
                Book a consultation
              </a>
              <a className={styles.secondaryButton} href="#playbook">
                Get the compliance playbook
              </a>
            </div>
            <div className={styles.heroMeta}>
              <span>Public-sector focus</span>
              <span>Audit-ready delivery</span>
              <span>Evidence-driven reporting</span>
            </div>
          </div>
          <div className={styles.heroCard}>
            <h2>Engagement signal</h2>
            <p>
              We start with a 90-minute compliance intake to map controls,
              identify dependencies, and establish a secure delivery roadmap.
            </p>
            <ul>
              <li>Control inventory and ownership</li>
              <li>Data residency + privacy posture</li>
              <li>Priority modernization milestones</li>
            </ul>
          </div>
        </section>

        <section id="outcomes" className={styles.section}>
          <RevealOnScroll>
            <div className={styles.sectionHeader}>
              <h2>Outcomes leaders can scan quickly</h2>
              <p>
                Quantifiable progress for security teams, program managers, and
                executive sponsors.
              </p>
            </div>
            <div className={styles.outcomeGrid}>
              {outcomes.map((outcome) => (
                <div key={outcome.label} className={styles.outcomeCard}>
                  <p className={styles.outcomeMetric}>
                    <CountUp
                      value={outcome.value}
                      decimals={outcome.decimals ?? 0}
                    />
                    {outcome.suffix}
                  </p>
                  <p>{outcome.label}</p>
                </div>
              ))}
            </div>
          </RevealOnScroll>
        </section>

        <section id="services" className={styles.sectionAlt}>
          <RevealOnScroll>
            <div className={styles.sectionHeader}>
              <h2>Services designed for compliance assurance</h2>
              <p>
                Each engagement delivers artifacts security teams can approve
                and procurement teams can defend.
              </p>
            </div>
            <div className={styles.cardGrid}>
              {services.map((service) => (
                <div key={service.title} className={styles.infoCard}>
                  <h3>{service.title}</h3>
                  <p>{service.detail}</p>
                </div>
              ))}
            </div>
          </RevealOnScroll>
        </section>

        <section id="proof" className={styles.section}>
          <RevealOnScroll>
            <div className={styles.sectionHeader}>
              <h2>Visual proof of compliant delivery</h2>
              <p>
                Replace static reports with real-time control dashboards and
                defensible evidence trails.
              </p>
            </div>
            <VisualProofs />
          </RevealOnScroll>
        </section>

        <section id="frameworks" className={styles.sectionAlt}>
          <RevealOnScroll>
            <div className={styles.split}>
              <div>
                <h2>Framework alignment built in</h2>
                <p>
                  We map every deliverable to your agency’s control baseline and
                  provide evidence-ready documentation.
                </p>
              </div>
              <ul className={styles.list}>
                {frameworks.map((framework) => (
                  <li key={framework}>{framework}</li>
                ))}
              </ul>
            </div>
          </RevealOnScroll>
        </section>

        <section id="partnerships" className={styles.section}>
          <RevealOnScroll>
            <div className={styles.split}>
              <div>
                <h2>Technology partnerships</h2>
                <p>
                  We integrate with agency-standard platforms while maintaining
                  procurement and security requirements.
                </p>
              </div>
              <ul className={styles.list}>
                {partnerships.map((partner) => (
                  <li key={partner}>{partner}</li>
                ))}
              </ul>
            </div>
          </RevealOnScroll>
        </section>

        <section id="case-studies" className={styles.sectionAlt}>
          <RevealOnScroll>
            <div className={styles.sectionHeader}>
              <h2>Case studies</h2>
              <p>
                Proven delivery in high-stakes environments with confidentiality
                preserved.
              </p>
            </div>
            <CaseStudies />
          </RevealOnScroll>
        </section>

        <section id="trust" className={styles.section}>
          <RevealOnScroll>
            <div className={styles.sectionHeader}>
              <h2>Trust center</h2>
              <p>
                Evidence and documentation that support procurement, security,
                and compliance reviews.
              </p>
            </div>
            <TrustCenter />
          </RevealOnScroll>
        </section>

        <section id="playbook" className={styles.sectionAlt}>
          <RevealOnScroll>
            <div className={styles.sectionHeader}>
              <h2>Compliance playbook</h2>
              <p>
                A short guide for reducing audit friction while accelerating GIS
                modernization.
              </p>
            </div>
            <div className={styles.playbookCard}>
              <div>
                <h3>What you will get</h3>
                <ul>
                  <li>Security control checklist for GIS programs</li>
                  <li>Data governance templates for public records</li>
                  <li>Procurement-ready modernization roadmap</li>
                </ul>
              </div>
              <PlaybookForm />
            </div>
          </RevealOnScroll>
        </section>

        <section id="founder" className={styles.section}>
          <RevealOnScroll>
            <div className={styles.split}>
              <div>
                <h2>Founder-led delivery</h2>
                <p>
                  Our founder leads every engagement, ensuring compliance
                  alignment from discovery through deployment.
                </p>
                <p>
                  You receive direct access to senior GIS strategists who speak
                  the language of audit committees and CIO offices.
                </p>
              </div>
              <div className={styles.founderCard}>
                <h3>Principal consultant</h3>
                <p>
                  15+ years supporting public-sector GIS programs, specializing
                  in compliance-driven modernization.
                </p>
                <p className={styles.founderMeta}>
                  Certified GIS Professional • Security-aware delivery
                </p>
              </div>
            </div>
          </RevealOnScroll>
        </section>

        <section id="contact" className={styles.sectionAlt}>
          <RevealOnScroll>
            <div className={styles.sectionHeader}>
              <h2>Book a compliance consultation</h2>
              <p>
                Tell us where you are in your modernization program and we will
                respond with a secure engagement plan.
              </p>
            </div>
            <div className={styles.contactGrid}>
              <ConsultationForm />
              <div className={styles.contactPanel}>
                <h3>What happens next</h3>
                <ol>
                  <li>We confirm your governance and compliance constraints.</li>
                  <li>We provide a scoping brief within 48 hours.</li>
                  <li>We schedule a security-aligned roadmap session.</li>
                </ol>
                <div className={styles.contactDetails}>
                  <p>
                    <strong>Email:</strong> intake@etl-gis-consulting.example.com
                  </p>
                  <p>
                    <strong>Response time:</strong> One business day
                  </p>
                </div>
              </div>
            </div>
          </RevealOnScroll>
        </section>
      </main>

      <footer className={styles.footer}>
        <div>
          <strong>ETL GIS Consulting</strong>
          <p>Compliance-first GIS delivery for public-sector agencies.</p>
        </div>
        <ReduceMotionToggle />
        <div className={styles.footerLinks}>
          <a href="#hero">Back to top</a>
          <a href="#trust">Trust center</a>
          <a href="#contact">Contact</a>
        </div>
      </footer>

      <ConsentBanner />
    </div>
  );
}
