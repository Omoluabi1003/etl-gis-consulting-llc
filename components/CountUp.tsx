"use client";

import { useEffect, useRef, useState } from "react";

interface CountUpProps {
  value: number;
  suffix?: string;
  duration?: number;
  reduceMotion: boolean;
}

export default function CountUp({
  value,
  suffix = "",
  duration = 1200,
  reduceMotion
}: CountUpProps) {
  const [displayValue, setDisplayValue] = useState(reduceMotion ? value : 0);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    if (reduceMotion) {
      setDisplayValue(value);
      return;
    }

    const step = (timestamp: number) => {
      if (!startRef.current) {
        startRef.current = timestamp;
      }
      const progress = Math.min((timestamp - startRef.current) / duration, 1);
      const nextValue = Math.floor(progress * value);
      setDisplayValue(nextValue);
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    const id = requestAnimationFrame(step);
    return () => cancelAnimationFrame(id);
  }, [value, duration, reduceMotion]);

  return (
    <span>
      {displayValue}
      {suffix}
    </span>
  );
}
