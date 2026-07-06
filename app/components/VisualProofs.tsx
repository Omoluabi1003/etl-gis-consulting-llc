import styles from "../page.module.css";

export default function VisualProofs() {
  return (
    <div className={styles.visualProofGrid}>
      <div className={styles.visualCard}>
        <h4>Anonymized dashboard frame</h4>
        <svg viewBox="0 0 320 180" role="img" aria-label="Dashboard preview" className={styles.visualSvg}>
          <rect x="10" y="10" width="300" height="160" rx="14" fill="#f3f6f9" stroke="#d7dee6" />
          <rect x="24" y="30" width="120" height="24" rx="6" fill="#dce6ef" />
          <rect x="24" y="68" width="80" height="60" rx="8" fill="#c7d8e6" />
          <rect x="118" y="68" width="80" height="60" rx="8" fill="#e7eef5" />
          <rect x="212" y="30" width="74" height="98" rx="10" fill="#d7e4ef" />
          <rect x="24" y="138" width="260" height="10" rx="5" fill="#c0d2e0" />
        </svg>
        <p>Executive-ready KPIs with secure access tiers and audit logs.</p>
      </div>
      <div className={styles.visualCard}>
        <h4>Map tile card</h4>
        <svg viewBox="0 0 320 180" role="img" aria-label="Map tile preview" className={styles.visualSvg}>
          <rect x="10" y="10" width="300" height="160" rx="14" fill="#f3f7f8" stroke="#d7dee6" />
          <path d="M30 40 L110 30 L190 60 L270 45" stroke="#8fb1c9" strokeWidth="4" fill="none" />
          <path d="M30 120 L120 90 L200 110 L270 100" stroke="#4b7693" strokeWidth="4" fill="none" />
          <circle cx="120" cy="90" r="8" fill="#2f6a8f" />
          <circle cx="200" cy="110" r="8" fill="#1f4b6d" />
          <rect x="40" y="130" width="90" height="20" rx="6" fill="#d7e4ef" />
        </svg>
        <p>Operational layers prepared for planning, field, and executive use.</p>
      </div>
      <div className={styles.visualCard}>
        <h4>Pipeline schematic</h4>
        <svg viewBox="0 0 320 180" role="img" aria-label="Pipeline preview" className={styles.visualSvg}>
          <rect x="10" y="10" width="300" height="160" rx="14" fill="#f3f6f9" stroke="#d7dee6" />
          <rect x="24" y="40" width="70" height="36" rx="8" fill="#d7e4ef" />
          <rect x="124" y="40" width="70" height="36" rx="8" fill="#c7d8e6" />
          <rect x="224" y="40" width="70" height="36" rx="8" fill="#bcd0e2" />
          <rect x="24" y="104" width="270" height="14" rx="7" fill="#9fbcd1" />
          <circle cx="90" cy="110" r="8" fill="#2f6a8f" />
          <circle cx="160" cy="110" r="8" fill="#1f4b6d" />
          <circle cx="230" cy="110" r="8" fill="#0a2a43" />
        </svg>
        <p>Data engineering flow from source systems to analytics-ready insights.</p>
      </div>
      <div className={styles.visualCard}>
        <h4>Governance checklist preview</h4>
        <svg viewBox="0 0 320 180" role="img" aria-label="Governance checklist preview" className={styles.visualSvg}>
          <rect x="10" y="10" width="300" height="160" rx="14" fill="#f3f6f9" stroke="#d7dee6" />
          <rect x="30" y="34" width="160" height="20" rx="6" fill="#d7e4ef" />
          <rect x="30" y="70" width="24" height="24" rx="6" fill="#c0d2e0" />
          <rect x="30" y="108" width="24" height="24" rx="6" fill="#c0d2e0" />
          <rect x="70" y="74" width="200" height="16" rx="8" fill="#e4ecf3" />
          <rect x="70" y="112" width="200" height="16" rx="8" fill="#e4ecf3" />
          <path d="M36 82 L42 88 L52 76" stroke="#1f6f4a" strokeWidth="4" fill="none" />
          <path d="M36 120 L42 126 L52 114" stroke="#1f6f4a" strokeWidth="4" fill="none" />
        </svg>
        <p>Compliance evidence that stakeholders can review and retain.</p>
      </div>
    </div>
  );
}
