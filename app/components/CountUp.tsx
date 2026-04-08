"use client";

import { useEffect, useState } from "react";

interface CountUpProps {
  value: number;
  suffix?: string;
  duration?: number;
  reduceMotion?: boolean;
}

export default function CountUp({
  value,
  suffix = "",
  duration = 1200,
  reduceMotion = false,
}: CountUpProps) {
  const [display, setDisplay] = useState(reduceMotion ? value : 0);

  useEffect(() => {
    if (reduceMotion) {
      setDisplay(value);
      return;
    }

    let start = 0;
    const startTime = performance.now();
    const animate = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const nextValue = Math.round(start + (value - start) * progress);
      setDisplay(nextValue);
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [reduceMotion, value, duration]);

  return (
    <span>
      {display}
      {suffix}
    </span>
  );
}
