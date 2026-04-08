"use client";

import { useEffect, useState } from "react";
import styles from "../page.module.css";

const STORAGE_KEY = "etl-analytics-consent";

export default function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      setVisible(true);
    }
  }, []);

  const handleChoice = (choice: "accepted" | "declined") => {
    window.localStorage.setItem(STORAGE_KEY, choice);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className={styles.consentBanner} role="region" aria-label="Privacy-first analytics consent">
      <div>
        <strong>Privacy-first analytics.</strong> We only use anonymous, aggregate metrics to
        improve the experience. No third-party advertising pixels.
      </div>
      <div className={styles.consentActions}>
        <button type="button" className={styles.secondaryButton} onClick={() => handleChoice("declined")}
          aria-label="Decline analytics">
          Decline
        </button>
        <button type="button" className={styles.primaryButton} onClick={() => handleChoice("accepted")}
          aria-label="Accept analytics">
          Accept
        </button>
      </div>
    </div>
  );
}
