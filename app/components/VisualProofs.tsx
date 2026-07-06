import React from "react";

export const DashboardFrame = () => (
  <svg viewBox="0 0 320 180" role="img" aria-label="Anonymized dashboard frame">
    <rect x="10" y="14" width="300" height="150" rx="12" fill="#e9edf5" />
    <rect x="24" y="30" width="120" height="18" rx="6" fill="#c7d2fe" />
    <rect x="24" y="60" width="120" height="12" rx="6" fill="#d9e2f3" />
    <rect x="24" y="80" width="120" height="12" rx="6" fill="#d9e2f3" />
    <rect x="160" y="30" width="130" height="80" rx="10" fill="#dbeafe" />
    <rect x="160" y="120" width="130" height="24" rx="8" fill="#cbd5f5" />
  </svg>
);

export const MapTileCard = () => (
  <svg viewBox="0 0 320 180" role="img" aria-label="Neutral map tile preview">
    <rect x="16" y="16" width="288" height="148" rx="12" fill="#e9edf5" />
    <path
      d="M36 50 L110 40 L160 70 L220 54 L280 78"
      stroke="#94a3b8"
      strokeWidth="4"
      fill="none"
    />
    <circle cx="98" cy="90" r="10" fill="#60a5fa" />
    <circle cx="188" cy="104" r="10" fill="#38bdf8" />
    <circle cx="248" cy="96" r="10" fill="#0ea5e9" />
  </svg>
);

export const PipelineSchematic = () => (
  <svg viewBox="0 0 320 180" role="img" aria-label="Data pipeline schematic">
    <rect x="20" y="70" width="60" height="40" rx="8" fill="#dbeafe" />
    <rect x="130" y="50" width="60" height="80" rx="8" fill="#c7d2fe" />
    <rect x="240" y="70" width="60" height="40" rx="8" fill="#bfdbfe" />
    <path d="M80 90 H130" stroke="#64748b" strokeWidth="4" />
    <path d="M190 90 H240" stroke="#64748b" strokeWidth="4" />
    <circle cx="110" cy="90" r="6" fill="#1d4ed8" />
    <circle cx="220" cy="90" r="6" fill="#1d4ed8" />
  </svg>
);

export const GovernanceChecklist = () => (
  <svg viewBox="0 0 320 180" role="img" aria-label="Governance checklist preview">
    <rect x="24" y="22" width="272" height="136" rx="12" fill="#eef2ff" />
    <rect x="48" y="50" width="20" height="20" rx="4" fill="#bfdbfe" />
    <rect x="80" y="52" width="180" height="16" rx="6" fill="#cbd5f5" />
    <rect x="48" y="86" width="20" height="20" rx="4" fill="#bfdbfe" />
    <rect x="80" y="88" width="150" height="16" rx="6" fill="#cbd5f5" />
    <rect x="48" y="122" width="20" height="20" rx="4" fill="#bfdbfe" />
    <rect x="80" y="124" width="170" height="16" rx="6" fill="#cbd5f5" />
  </svg>
);
