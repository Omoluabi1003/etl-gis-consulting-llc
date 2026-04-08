"use client";

import { useState } from "react";
import styles from "../page.module.css";
import Modal from "./Modal";

const CASES = [
  {
    id: "metro",
    title: "Metro Mobility Analytics",
    badge: "27% faster corridor decisions",
    summary: "Unified multi-agency transit data and executive-ready KPIs.",
    outcome: "Reduced corridor prioritization cycle time by 27%.",
    scope: "3 transit authorities, 18 data sources, regional planning partners.",
    approach: "Built a governed data lake, standardized schemas, and automated KPI pipelines.",
    risks: "CJIS alignment for incident datasets, role-based access, and audit-ready logging.",
    time: "First dashboards live in 8 weeks.",
  },
  {
    id: "utility",
    title: "Utility Network Modernization",
    badge: "99.2% asset record accuracy",
    summary: "Modernized GIS platform and improved field data quality.",
    outcome: "Achieved 99.2% asset record accuracy with zero-trust access controls.",
    scope: "Electric + water network data, field operations, and asset lifecycle tracking.",
    approach: "Migrated to a modern GIS stack with automated QA/QC and mobile sync.",
    risks: "FISMA-aligned controls, data governance, and operator training pathways.",
    time: "Network cutover completed in 12 weeks.",
  },
  {
    id: "emergency",
    title: "Emergency Response Dashboards",
    badge: "15 min faster incident triage",
    summary: "Real-time situational awareness for emergency operations centers.",
    outcome: "Cut incident triage time by 15 minutes during peak events.",
    scope: "Public safety, fire, and utility responders with shared SOPs.",
    approach: "Designed secure dashboards, event pipelines, and executive briefings.",
    risks: "Zero-trust segmentation, mission-critical redundancy, compliance training.",
    time: "Operational in 6 weeks with phased expansion.",
  },
];

export default function CaseStudies() {
  const [active, setActive] = useState<(typeof CASES)[number] | null>(null);

  return (
    <div>
      <div className={styles.caseGrid}>
        {CASES.map((item) => (
          <article key={item.id} className={styles.caseCard}>
            <span className={styles.caseBadge}>{item.badge}</span>
            <h3>{item.title}</h3>
            <p>{item.summary}</p>
            <button
              className={styles.secondaryButton}
              type="button"
              onClick={() => setActive(item)}
            >
              Quick View
            </button>
          </article>
        ))}
      </div>
      <p className={styles.anonymizedNote}>
        All case studies are anonymized summaries. Client names are withheld to protect sensitive
        environments.
      </p>
      <Modal
        open={Boolean(active)}
        title={active?.title ?? ""}
        onClose={() => setActive(null)}
      >
        {active && (
          <div className={styles.modalGrid}>
            <div>
              <h4>Outcome</h4>
              <p>{active.outcome}</p>
            </div>
            <div>
              <h4>Scope</h4>
              <p>{active.scope}</p>
            </div>
            <div>
              <h4>Approach</h4>
              <p>{active.approach}</p>
            </div>
            <div>
              <h4>Risk Controls</h4>
              <p>{active.risks}</p>
            </div>
            <div>
              <h4>Time-to-Value</h4>
              <p>{active.time}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
