"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "reduce-motion";

export function useReduceMotionPreference() {
  const [reduceMotion, setReduceMotion] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const stored =
      typeof window !== "undefined"
        ? window.localStorage.getItem(STORAGE_KEY)
        : null;
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (stored !== null) {
      setReduceMotion(stored === "true");
    } else {
      setReduceMotion(prefersReduced);
    }
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady || typeof window === "undefined") {
      return;
    }
    document.documentElement.dataset.reduceMotion = reduceMotion
      ? "true"
      : "false";
    window.localStorage.setItem(STORAGE_KEY, String(reduceMotion));
  }, [reduceMotion, isReady]);

  return { reduceMotion, setReduceMotion, isReady };
}
