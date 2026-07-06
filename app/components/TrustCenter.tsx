import styles from "../page.module.css";

export default function TrustCenter() {
  return (
    <div className={styles.trustGrid}>
      <div className={styles.trustNarrative}>
        <h3>Controls narrative</h3>
        <p>
          We design with CJIS and FISMA expectations in mind, embedding zero-trust policies,
          governance checklists, and operator training into every program.
        </p>
        <ul className={styles.trustList}>
          <li>Zero-trust access segmentation with audit-ready logging.</li>
          <li>Data governance playbooks aligned to agency risk profiles.</li>
          <li>Training and change management for operational adoption.</li>
        </ul>
        <div className={styles.controlCallout}>
          <strong>Compliance posture:</strong> documented controls, repeatable evidence, and
          executive-readiness reporting.
        </div>
      </div>
      <div className={styles.trustEvidence}>
        <h3>Evidence hub</h3>
        <div className={styles.evidenceGrid}>
          <article>
            <h4>Control matrix preview</h4>
            <p>Mapped to CJIS/FISMA expectations with ownership and cadence.</p>
          </article>
          <article>
            <h4>Risk register snapshot</h4>
            <p>Prioritized mitigation steps and executive sign-off trails.</p>
          </article>
          <article>
            <h4>Training artifacts</h4>
            <p>Role-based guides for field teams, analysts, and leadership.</p>
          </article>
          <article>
            <h4>Change log bundle</h4>
            <p>Deployment evidence, validation reports, and audit packaging.</p>
          </article>
        </div>
        <p className={styles.trustNote}>
          Clients receive a curated evidence package ready for internal review and regulators.
        </p>
      </div>
    </div>
  );
}
