"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "etl-gis-consent";

export default function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      setVisible(true);
    }
  }, []);

  const handleChoice = (value: string) => {
    window.localStorage.setItem(STORAGE_KEY, value);
    setVisible(false);
  };

  if (!visible) {
    return null;
  }

  return (
    <div className="consent" role="region" aria-label="Privacy consent">
      <strong>Privacy-first analytics</strong>
      <p className="helper" style={{ marginTop: "6px" }}>
        We only collect anonymized usage data after consent. You can opt out at
        any time.
      </p>
      <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
        <button className="button primary" onClick={() => handleChoice("yes")}>
          Accept
        </button>
        <button
          className="button secondary"
          onClick={() => handleChoice("no")}
        >
          Decline
        </button>
      </div>
    </div>
  );
}
