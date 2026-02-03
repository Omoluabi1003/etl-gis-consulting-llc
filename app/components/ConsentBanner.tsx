"use client";

import { useEffect, useState } from "react";

const storageKey = "etl-consent";

export default function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey);
    if (!stored) {
      setVisible(true);
    }
  }, []);

  const handleChoice = (choice: "accepted" | "declined") => {
    window.localStorage.setItem(storageKey, choice);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="consent-banner" role="dialog" aria-live="polite">
      <strong>Privacy-first analytics consent</strong>
      <p className="helper-text">
        We only activate privacy-safe analytics after explicit consent. Declining
        keeps this site fully functional.
      </p>
      <div className="consent-actions">
        <button
          type="button"
          className="button button-primary"
          onClick={() => handleChoice("accepted")}
        >
          Allow analytics
        </button>
        <button
          type="button"
          className="button button-secondary"
          onClick={() => handleChoice("declined")}
        >
          Decline
        </button>
      </div>
    </div>
  );
}
