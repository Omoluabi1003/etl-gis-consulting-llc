"use client";

import { ReactNode } from "react";
import { useReveal } from "../hooks/useReveal";

export default function Reveal({ children }: { children: ReactNode }) {
  const { ref, visible } = useReveal();

  return (
    <div ref={ref} className={`reveal ${visible ? "is-visible" : ""}`}>
      {children}
    </div>
  );
}
