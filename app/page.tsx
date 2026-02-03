"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";
import styles from "./page.module.css";
import CountUp from "./components/CountUp";
import ConsultationForm from "./components/ConsultationForm";
import ConsentBanner from "./components/ConsentBanner";
import PlaybookForm from "./components/PlaybookForm";
import ReduceMotionToggle from "./components/ReduceMotionToggle";
import RevealOnScroll from "./components/RevealOnScroll";

const VisualProofs = dynamic(() => import("./components/VisualProofs"));
const CaseStudies = dynamic(() => import("./components/CaseStudies"));
const TrustCenter = dynamic(() => import("./components/TrustCenter"));

export default function Home() {
  const [reduceMotion, setReduceMotion] = useState(false);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["Organization", "ProfessionalService"],
    name: "ETL GIS Consulting LLC",
    url: "https://etl-gis-consulting-llc.vercel.app",
    description:
      "Compliance-first GIS modernization and spatial intelligence for transportation authorities, utilities, and public agencies.",
    areaServed: "United States",
    serviceType: [
      "GIS modernization",
      "CJIS/FISMA compliance",
      "Data engineering",
      "Executive analytics",
      "Operational dashboards",
    ],
  };

  return (
    <div className={styles.page} data-reduce-motion={reduceMotion ? "true" : "false"}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <RevealOnScroll reduceMotion={reduceMotion} />
      <header className={styles.header}>
        <div className={styles.logoBlock}>
          <div className={styles.logoMark}>ETL</div>
          <div>
            <span>ETL GIS Consulting LLC</span>
            <small>Spatial intelligence for public-sector leaders</small>
          </div>
        </div>
        <nav className={styles.nav} aria-label="Primary">
          <Link href="#services">Services</Link>
          <Link href="#frameworks">Frameworks</Link>
          <Link href="#case-studies">Case studies</Link>
          <Link href="#trust">Trust center</Link>
          <Link href="#contact">Consultation</Link>
        </nav>
        <ReduceMotionToggle onChange={setReduceMotion} />
      </header>

      <main>
        <section id="hero" className={styles.hero} data-reveal>
          <div className={styles.heroContent}>
            <p className={styles.eyebrow}>Transportation authorities • Utilities • Public agencies</p>
            <h1>Spatial intelligence designed for decisive leaders.</h1>
            <p className={styles.heroLead}>
              ETL GIS Consulting LLC modernizes GIS platforms and delivers analytics-ready insights that
              meet CJIS/FISMA expectations. We translate complex data into executive clarity.
            </p>
            <ul className={styles.heroBullets}>
              <li>GIS platform modernization with zero-trust architecture.</li>
              <li>Data engineering for analytics-ready insights and dashboards.</li>
              <li>Executive storytelling that accelerates funding and policy decisions.</li>
            </ul>
            <div className={styles.heroActions}>
              <Link className={styles.primaryButton} href="#contact">
                Book a consultation
              </Link>
              <Link className={styles.secondaryButton} href="#playbook">
                Download playbook
              </Link>
            </div>
            <div className={styles.heroNote}>
              Not ready to book? Explore the modernization playbook and compliance checklist.
            </div>
          </div>
          <div className={styles.heroVisual}>
            <div className={styles.heroCard}>
              <span>Executive Brief</span>
              <h3>Operational clarity in 90 days</h3>
              <p>
                Structured roadmaps, governance, and leadership-ready dashboards for mission-critical
                environments.
              </p>
              <div className={styles.heroMeta}>
                <div>
                  <strong>Compliance</strong>
                  <span>CJIS + FISMA alignment</span>
                </div>
                <div>
                  <strong>Adoption</strong>
                  <span>Training + change management</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="outcomes" className={styles.outcomes} data-reveal>
          <div>
            <h2>Outcome-driven delivery for long-horizon missions</h2>
            <p>
              Our teams prioritize measurable outcomes and decision velocity while protecting
              operational risk.
            </p>
          </div>
          <div className={styles.outcomeBar}>
            <div>
              <h3>
                <CountUp value={27} suffix="%" reduceMotion={reduceMotion} />
              </h3>
              <p>Faster corridor prioritization decisions.</p>
            </div>
            <div>
              <h3>
                <CountUp value={99} suffix="%" reduceMotion={reduceMotion} />
              </h3>
              <p>Asset record accuracy after modernization.</p>
            </div>
            <div>
              <h3>
                <CountUp value={15} suffix=" min" reduceMotion={reduceMotion} />
              </h3>
              <p>Incident triage acceleration for EOCs.</p>
            </div>
          </div>
        </section>

        <section id="services" className={styles.section} data-reveal>
          <div className={styles.sectionHeader}>
            <h2>Service focus</h2>
            <p>Compliance-first services tailored to complex GIS and analytics programs.</p>
          </div>
          <div className={styles.serviceGrid}>
            <article>
              <h3>Modernizing GIS platforms</h3>
              <p>Upgrade legacy GIS environments to secure, interoperable architectures.</p>
            </article>
            <article>
              <h3>CJIS/FISMA compliance</h3>
              <p>Operational controls, governance, and audit-ready documentation.</p>
            </article>
            <article>
              <h3>Data engineering</h3>
              <p>Reliable pipelines that transform siloed data into analytics-ready assets.</p>
            </article>
            <article>
              <h3>Dashboards and insights</h3>
              <p>Executive dashboards, operational analytics, and KPI automation.</p>
            </article>
            <article>
              <h3>Executive storytelling</h3>
              <p>Leadership-ready narratives aligned to funding, policy, and public trust.</p>
            </article>
          </div>
        </section>

        <section id="visual-proof" className={styles.sectionAlt} data-reveal>
          <div className={styles.sectionHeader}>
            <h2>Visual proof of modernization</h2>
            <p>Neutral, secure representations of the artifacts we deliver.</p>
          </div>
          <VisualProofs />
        </section>

        <section id="frameworks" className={styles.section} data-reveal>
          <div className={styles.sectionHeader}>
            <h2>Proven frameworks</h2>
            <p>Repeatable delivery models built for compliance, operations, and executive clarity.</p>
          </div>
          <div className={styles.frameworkGrid}>
            <article>
              <h3>Strategic roadmaps</h3>
              <p>Sequenced modernization plans tied to funding cycles and mission milestones.</p>
            </article>
            <article>
              <h3>Compliance by design</h3>
              <p>Zero-trust policies, CJIS/FISMA alignment, and governance artifacts.</p>
            </article>
            <article>
              <h3>Operations enablement</h3>
              <p>Field-ready workflows, training, and change management for adoption.</p>
            </article>
            <article>
              <h3>Executive clarity</h3>
              <p>Decision-ready insights, KPI storytelling, and leadership briefings.</p>
            </article>
          </div>
        </section>

        <section id="partnerships" className={styles.sectionAlt} data-reveal>
          <div className={styles.sectionHeader}>
            <h2>Strategic partnerships</h2>
            <p>Collaborative delivery with public-sector integrators and trusted vendors.</p>
          </div>
          <div className={styles.partnerRow}>
            <div>Regional transportation planning partners</div>
            <div>Utilities and infrastructure providers</div>
            <div>Public safety technology vendors</div>
            <div>Data governance advisory networks</div>
          </div>
        </section>

        <section id="case-studies" className={styles.section} data-reveal>
          <div className={styles.sectionHeader}>
            <h2>Featured anonymized project stories</h2>
            <p>Outcome-first summaries with risk controls and time-to-value.</p>
          </div>
          <CaseStudies />
        </section>

        <section id="outcomes-proof" className={styles.sectionAlt} data-reveal>
          <div className={styles.sectionHeader}>
            <h2>Client outcomes</h2>
            <p>Measured results that help leaders secure funding, reduce risk, and act faster.</p>
          </div>
          <div className={styles.outcomesGrid}>
            <article>
              <h3>Governed analytics</h3>
              <p>Analytics-ready datasets that stand up to audit requirements.</p>
            </article>
            <article>
              <h3>Decision velocity</h3>
              <p>Faster prioritization, incident response, and resource allocation.</p>
            </article>
            <article>
              <h3>Operational trust</h3>
              <p>Clear adoption pathways with training and leadership alignment.</p>
            </article>
          </div>
        </section>

        <section id="trust" className={styles.section} data-reveal>
          <div className={styles.sectionHeader}>
            <h2>Compliance & trust center</h2>
            <p>Evidence-led assurance for CJIS, FISMA, and public-sector oversight.</p>
          </div>
          <TrustCenter />
        </section>

        <section id="playbook" className={styles.sectionAlt} data-reveal>
          <div className={styles.playbookGrid}>
            <div>
              <h2>Modernization playbook</h2>
              <p>
                Receive the GIS modernization playbook, compliance checklist, and executive briefing
                template. Built for agencies preparing 2025–2026 programs.
              </p>
              <ul>
                <li>Roadmap milestones aligned to procurement cycles.</li>
                <li>Governance and zero-trust checklist.</li>
                <li>Executive storytelling framework.</li>
              </ul>
            </div>
            <div className={styles.playbookCard}>
              <h3>Email-gated access</h3>
              <p>Delivered instantly. No spam. Opt-out anytime.</p>
              <PlaybookForm />
            </div>
          </div>
        </section>

        <section id="founder" className={styles.section} data-reveal>
          <div className={styles.founderGrid}>
            <div className={styles.portrait} aria-hidden="true">
              <div className={styles.portraitFrame}>
                <span>Portrait</span>
              </div>
            </div>
            <div>
              <p className={styles.eyebrow}>Founder & Principal Consultant</p>
              <h2>Leadership bio</h2>
              <p>
                Our founder blends GIS modernization, compliance, and executive communication for
                mission-driven agencies. Recognized in <em>Marquis Who&apos;s Who 2025</em> for leadership
                in spatial intelligence and public-sector transformation.
              </p>
              <div className={styles.founderHighlights}>
                <div>
                  <strong>20+ years</strong>
                  <span>GIS delivery and public-sector modernization</span>
                </div>
                <div>
                  <strong>Trusted advisor</strong>
                  <span>Transportation, utilities, and emergency response leaders</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className={styles.sectionAlt} data-reveal>
          <div className={styles.sectionHeader}>
            <h2>Schedule a consultation</h2>
            <p>
              Two-track funnel: book a strategic call or start with the modernization playbook.
            </p>
          </div>
          <div className={styles.contactGrid}>
            <div>
              <h3>Consultation request</h3>
              <ConsultationForm />
              <div className={styles.nextSteps}>
                <h4>What happens next</h4>
                <ol>
                  <li>We review your GIS and compliance priorities.</li>
                  <li>We align on scope, risk controls, and timeline.</li>
                  <li>You receive a tailored roadmap and proposal.</li>
                </ol>
              </div>
            </div>
            <div className={styles.contactSidebar}>
              <div className={styles.contactCard}>
                <h3>Prefer a calendar booking?</h3>
                <p>Reserve a 30-minute working session via Cal.com.</p>
                <a
                  className={styles.primaryButton}
                  href="https://cal.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Open calendar
                </a>
              </div>
              <div className={styles.contactCard}>
                <h3>Not ready to book?</h3>
                <p>
                  Download the playbook and evidence checklist for internal alignment before your
                  first call.
                </p>
                <Link href="#playbook" className={styles.secondaryButton}>
                  Get the playbook
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div>
          <strong>ETL GIS Consulting LLC</strong>
          <p>Spatial intelligence designed for decisive leaders.</p>
        </div>
        <div className={styles.footerLinks}>
          <Link href="#hero">Back to top</Link>
          <Link href="#trust">Compliance & trust</Link>
          <Link href="#contact">Consultation</Link>
        </div>
      </footer>

      <ConsentBanner />
    </div>
  );
}
