"use client";

import { useEffect, useState } from "react";
import styles from "../page.module.css";

const STORAGE_KEY = "etl-reduce-motion";

export default function ReduceMotionToggle({
  onChange,
}: {
  onChange: (value: boolean) => void;
}) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const value = stored === "true";
      setEnabled(value);
      onChange(value);
      return;
    }
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setEnabled(prefersReduced);
    onChange(prefersReduced);
  }, [onChange]);

  const handleToggle = () => {
    const next = !enabled;
    setEnabled(next);
    window.localStorage.setItem(STORAGE_KEY, String(next));
    onChange(next);
  };

  return (
    <button type="button" className={styles.motionToggle} onClick={handleToggle}>
      Reduce motion: <span>{enabled ? "On" : "Off"}</span>
    </button>
  );
}
