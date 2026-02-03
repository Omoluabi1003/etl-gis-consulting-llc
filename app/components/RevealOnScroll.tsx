"use client";

import { useEffect, useRef, useState } from "react";
import { useReduceMotionPreference } from "./useReduceMotion";
import styles from "../page.module.css";

export default function RevealOnScroll({
  children
}: {
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { reduceMotion } = useReduceMotionPreference();

  useEffect(() => {
    if (reduceMotion) {
      setIsVisible(true);
      return;
    }

    const element = ref.current;
    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [reduceMotion]);

  return (
    <div
      ref={ref}
      className={`${styles.reveal} ${isVisible ? styles.revealVisible : ""}`}
    >
      {children}
    </div>
  );
}
