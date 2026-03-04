"use client";

import { useEffect, useMemo, useState } from "react";

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export const useCountUp = (
  target: number,
  durationMs = 1200,
  enabled = true,
) => {
  const [value, setValue] = useState(0);
  const safeTarget = useMemo(() => Math.max(0, target), [target]);

  useEffect(() => {
    if (!enabled) {
      setValue(safeTarget);
      return;
    }

    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = clamp((now - start) / durationMs, 0, 1);
      const nextValue = Math.round(safeTarget * progress);
      setValue(nextValue);
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, [safeTarget, durationMs, enabled]);

  return value;
};
