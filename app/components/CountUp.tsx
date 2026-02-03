"use client";

import { useEffect, useState } from "react";
import { useReduceMotionPreference } from "./useReduceMotion";

export default function CountUp({
  value,
  duration = 1200,
  decimals = 0
}: {
  value: number;
  duration?: number;
  decimals?: number;
}) {
  const { reduceMotion } = useReduceMotionPreference();
  const [displayValue, setDisplayValue] = useState(reduceMotion ? value : 0);

  useEffect(() => {
    if (reduceMotion) {
      setDisplayValue(value);
      return;
    }

    let start: number | null = null;
    const step = (timestamp: number) => {
      if (!start) {
        start = timestamp;
      }
      const progress = Math.min((timestamp - start) / duration, 1);
      const nextValue = progress * value;
      setDisplayValue(nextValue);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }, [duration, reduceMotion, value]);

  return <span>{displayValue.toFixed(decimals)}</span>;
}
