"use client";

import styles from "../page.module.css";

const controls = [
  {
    title: "Security controls",
    detail:
      "Mapped to NIST 800-53 and aligned with state procurement standards."
  },
  {
    title: "Privacy safeguards",
    detail: "Data minimization, retention schedules, and PII redaction."
  },
  {
    title: "Audit readiness",
    detail: "Evidence logs, change management, and quarterly control reviews."
  }
];

export default function TrustCenter() {
  return (
    <div className={styles.trustGrid}>
      {controls.map((control) => (
        <div key={control.title} className={styles.trustCard}>
          <h3>{control.title}</h3>
          <p>{control.detail}</p>
        </div>
      ))}
      <div className={styles.trustCard}>
        <h3>Artifacts available on request</h3>
        <ul>
          <li>System security plan outline</li>
          <li>Data processing agreement templates</li>
          <li>Incident response playbooks</li>
        </ul>
      </div>
    </div>
  );
}
