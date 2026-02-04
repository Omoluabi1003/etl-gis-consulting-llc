"use client";

import { useReduceMotionPreference } from "./useReduceMotion";
import styles from "../page.module.css";

export default function ReduceMotionToggle() {
  const { reduceMotion, setReduceMotion, isReady } =
    useReduceMotionPreference();

  const handleToggle = () => {
    setReduceMotion(!reduceMotion);
  };

  return (
    <div className={styles.reduceMotionToggle}>
      <div>
        <p className={styles.toggleLabel}>Reduce motion</p>
        <p className={styles.toggleHint}>
          Controls scroll reveals and count animations across the page.
        </p>
      </div>
      <button
        type="button"
        className={styles.toggleButton}
        onClick={handleToggle}
        aria-pressed={reduceMotion}
        aria-live="polite"
      >
        {isReady ? (reduceMotion ? "Enabled" : "Disabled") : "Loading"}
      </button>
    </div>
  );
}
