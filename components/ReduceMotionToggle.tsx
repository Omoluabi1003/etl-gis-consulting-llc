"use client";

interface ReduceMotionToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

export default function ReduceMotionToggle({
  enabled,
  onToggle
}: ReduceMotionToggleProps) {
  return (
    <button className="toggle" onClick={onToggle} aria-pressed={enabled}>
      {enabled ? "Reduce motion: On" : "Reduce motion: Off"}
    </button>
  );
}
