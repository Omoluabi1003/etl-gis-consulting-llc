export function DashboardFrame() {
  return (
    <svg viewBox="0 0 320 180" role="img" aria-label="Anonymized dashboard">
      <rect width="320" height="180" rx="18" fill="#ffffff" />
      <rect x="20" y="20" width="120" height="12" rx="6" fill="#c8d6e5" />
      <rect x="20" y="48" width="280" height="8" rx="4" fill="#e5edf5" />
      <rect x="20" y="70" width="90" height="60" rx="10" fill="#e5edf5" />
      <rect x="130" y="70" width="170" height="60" rx="10" fill="#d7e3f0" />
      <rect x="20" y="140" width="280" height="16" rx="8" fill="#c8d6e5" />
    </svg>
  );
}

export function MapTileCard() {
  return (
    <svg viewBox="0 0 320 180" role="img" aria-label="Map tile preview">
      <rect width="320" height="180" rx="18" fill="#ffffff" />
      <rect x="18" y="18" width="284" height="144" rx="12" fill="#e5edf5" />
      <path
        d="M32 130 L120 70 L210 110 L288 50"
        stroke="#8aa6bf"
        strokeWidth="4"
        fill="none"
      />
      <circle cx="120" cy="70" r="6" fill="#0c4a6e" />
      <circle cx="210" cy="110" r="6" fill="#0c4a6e" />
      <circle cx="288" cy="50" r="6" fill="#0c4a6e" />
    </svg>
  );
}

export function PipelineSchematic() {
  return (
    <svg viewBox="0 0 320 180" role="img" aria-label="Data pipeline schematic">
      <rect width="320" height="180" rx="18" fill="#ffffff" />
      <rect x="24" y="40" width="70" height="40" rx="10" fill="#dbe7f0" />
      <rect x="125" y="40" width="70" height="40" rx="10" fill="#c8d6e5" />
      <rect x="226" y="40" width="70" height="40" rx="10" fill="#dbe7f0" />
      <line x1="94" y1="60" x2="125" y2="60" stroke="#8aa6bf" strokeWidth="4" />
      <line x1="195" y1="60" x2="226" y2="60" stroke="#8aa6bf" strokeWidth="4" />
      <rect x="64" y="110" width="190" height="40" rx="12" fill="#e5edf5" />
      <line x1="160" y1="80" x2="160" y2="110" stroke="#8aa6bf" strokeWidth="4" />
    </svg>
  );
}

export function GovernanceChecklist() {
  return (
    <svg viewBox="0 0 320 180" role="img" aria-label="Governance checklist">
      <rect width="320" height="180" rx="18" fill="#ffffff" />
      <rect x="24" y="24" width="272" height="20" rx="10" fill="#dbe7f0" />
      <rect x="24" y="62" width="180" height="12" rx="6" fill="#e5edf5" />
      <rect x="24" y="86" width="200" height="12" rx="6" fill="#e5edf5" />
      <rect x="24" y="110" width="160" height="12" rx="6" fill="#e5edf5" />
      <circle cx="254" cy="68" r="8" fill="#0f766e" />
      <circle cx="254" cy="92" r="8" fill="#0f766e" />
      <circle cx="254" cy="116" r="8" fill="#f59e0b" />
    </svg>
  );
}
