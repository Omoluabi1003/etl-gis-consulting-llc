"use client";

import { useEffect } from "react";
import styles from "../page.module.css";

export default function RevealOnScroll({ reduceMotion }: { reduceMotion: boolean }) {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (reduceMotion) {
      elements.forEach((element) => element.classList.add(styles.revealVisible));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.revealVisible);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [reduceMotion]);

  return null;
}
