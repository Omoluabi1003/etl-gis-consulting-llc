"use client";

import { useEffect, useState } from "react";
import { useCountUp } from "../hooks/useCountUp";

const metrics = [
  { label: "Programs modernized", value: 14, suffix: "+" },
  { label: "Average time-to-value", value: 6, suffix: " weeks" },
  { label: "Operational risk reduced", value: 32, suffix: "%" },
  { label: "Executive briefings shipped", value: 120, suffix: "+" },
];

const MetricCard = ({
  label,
  value,
  suffix,
  reduceMotion,
}: {
  label: string;
  value: number;
  suffix: string;
  reduceMotion: boolean;
}) => {
  const count = useCountUp(value, 1200, !reduceMotion);
  return (
    <div className="metric" role="listitem">
      <span className="value">
        {reduceMotion ? value : count}
        {suffix}
      </span>
      <span className="label">{label}</span>
    </div>
  );
};

export default function OutcomesBar() {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      const stored = window.localStorage.getItem("etl-reduce-motion") === "true";
      setReduceMotion(media.matches || stored);
    };
    update();
    const listener = () => update();
    media.addEventListener("change", listener);
    window.addEventListener("reduce-motion-toggle", update);
    return () => {
      media.removeEventListener("change", listener);
      window.removeEventListener("reduce-motion-toggle", update);
    };
  }, []);

  return (
    <div className="outcomes-bar" role="list">
      {metrics.map((metric) => (
        <MetricCard
          key={metric.label}
          label={metric.label}
          value={metric.value}
          suffix={metric.suffix}
          reduceMotion={reduceMotion}
        />
      ))}
    </div>
  );
}
