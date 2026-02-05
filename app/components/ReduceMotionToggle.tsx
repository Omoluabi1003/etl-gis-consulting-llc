"use client";

import { useEffect, useState } from "react";

const storageKey = "etl-reduce-motion";

export default function ReduceMotionToggle() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey);
    if (stored === "true") {
      setEnabled(true);
      document.documentElement.classList.add("reduce-motion");
    }
  }, []);

  const toggle = () => {
    setEnabled((prev) => {
      const next = !prev;
      window.localStorage.setItem(storageKey, String(next));
      document.documentElement.classList.toggle("reduce-motion", next);
      window.dispatchEvent(new Event("reduce-motion-toggle"));
      return next;
    });
  };

  return (
    <button type="button" className="button button-ghost" onClick={toggle}>
      {enabled ? "Motion reduced" : "Reduce motion"}
    </button>
  );
}
