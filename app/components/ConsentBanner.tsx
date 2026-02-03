"use client";

import { useEffect, useState } from "react";
import styles from "../page.module.css";

const STORAGE_KEY = "consent-banner";

export default function ConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const stored =
      typeof window !== "undefined"
        ? window.localStorage.getItem(STORAGE_KEY)
        : null;
    if (stored !== "dismissed") {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    window.localStorage.setItem(STORAGE_KEY, "dismissed");
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className={styles.consentBanner} role="region" aria-label="Privacy">
      <p>
        This site does not use advertising cookies. We only store your form data
        when you choose to submit it.
      </p>
      <button type="button" onClick={handleDismiss}>
        Acknowledge
      </button>
    </div>
  );
}
