"use client";

import { useEffect, useState } from "react";
import styles from "../page.module.css";

const caseStudies = [
  {
    id: "metro-transit",
    title: "Metropolitan Transit Authority",
    summary:
      "Data residency compliance and modernization of field workflows across 240 facilities.",
    highlights: [
      "Aligned GIS operations to NIST 800-53 moderate controls",
      "Reduced inspection cycle time by 32%",
      "Established continuous evidence capture for audits"
    ]
  },
  {
    id: "state-water",
    title: "State Water Resources Board",
    summary:
      "Secure modernization program to unify permitting data for 18 regional offices.",
    highlights: [
      "Consolidated 12 legacy datasets into a governed lake",
      "Introduced data lineage reporting for leadership",
      "Achieved 99.95% availability for public dashboards"
    ]
  },
  {
    id: "county-emergency",
    title: "County Office of Emergency Services",
    summary:
      "Rapid deployment of compliant geospatial dashboards during hurricane season.",
    highlights: [
      "Delivered in 6 weeks with documented risk register",
      "Established least-privilege access model for 180 responders",
      "Created continuity runbooks for surge events"
    ]
  }
];

export default function CaseStudies() {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (!activeId) {
      return;
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveId(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeId]);

  const activeStudy = caseStudies.find((study) => study.id === activeId);

  return (
    <div>
      <p className={styles.disclaimer}>
        Case studies are anonymized to respect client confidentiality and
        security requirements.
      </p>
      <div className={styles.caseGrid}>
        {caseStudies.map((study) => (
          <article key={study.id} className={styles.caseCard}>
            <h3>{study.title}</h3>
            <p>{study.summary}</p>
            <button
              type="button"
              className={styles.textButton}
              onClick={() => setActiveId(study.id)}
              aria-haspopup="dialog"
              aria-controls="case-study-modal"
            >
              Quick view
            </button>
          </article>
        ))}
      </div>

      {activeStudy && (
        <div className={styles.modalBackdrop} role="presentation">
          <div
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="case-study-title"
            id="case-study-modal"
          >
            <div className={styles.modalHeader}>
              <h3 id="case-study-title">{activeStudy.title}</h3>
              <button
                type="button"
                className={styles.iconButton}
                onClick={() => setActiveId(null)}
                aria-label="Close quick view"
              >
                ×
              </button>
            </div>
            <p>{activeStudy.summary}</p>
            <ul>
              {activeStudy.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={() => setActiveId(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
