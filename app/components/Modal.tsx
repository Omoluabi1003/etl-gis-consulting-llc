"use client";

import { useEffect } from "react";
import styles from "../page.module.css";

interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ open, title, onClose, children }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className={styles.modalOverlay} role="dialog" aria-modal="true" aria-label={title}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <div>
            <p className={styles.modalEyebrow}>Quick View</p>
            <h3>{title}</h3>
          </div>
          <button type="button" className={styles.modalClose} onClick={onClose} aria-label="Close modal">
            Close
          </button>
        </div>
        <div className={styles.modalBody}>{children}</div>
      </div>
    </div>
  );
}
