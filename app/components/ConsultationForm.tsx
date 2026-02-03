"use client";

import { useState } from "react";
import styles from "../page.module.css";

type FormState = "idle" | "success";

const generateReference = () =>
  `ETL-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

export default function ConsultationForm() {
  const [state, setState] = useState<FormState>("idle");
  const [referenceId, setReferenceId] = useState<string>("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const reference = generateReference();
    setReferenceId(reference);
    setState("success");
    form.reset();
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.fieldRow}>
        <label htmlFor="name">Full name</label>
        <input id="name" name="name" type="text" required />
      </div>
      <div className={styles.fieldRow}>
        <label htmlFor="agency">Agency or department</label>
        <input id="agency" name="agency" type="text" required />
      </div>
      <div className={styles.fieldRow}>
        <label htmlFor="email">Work email</label>
        <input id="email" name="email" type="email" required />
      </div>
      <div className={styles.fieldRow}>
        <label htmlFor="goal">Primary objective</label>
        <select id="goal" name="goal" required>
          <option value="">Select one</option>
          <option value="audit">Audit readiness</option>
          <option value="modernize">Modernize GIS stack</option>
          <option value="data">Secure data governance</option>
          <option value="delivery">Delivery acceleration</option>
        </select>
      </div>
      <div className={styles.fieldRow}>
        <label htmlFor="notes">Constraints or deadlines</label>
        <textarea id="notes" name="notes" rows={3} />
      </div>
      <button type="submit" className={styles.primaryButton}>
        Book a compliance consultation
      </button>
      {state === "success" && (
        <p className={styles.formSuccess} role="status">
          Thanks. A coordinator will respond within one business day. Reference
          ID: <strong>{referenceId}</strong>
        </p>
      )}
    </form>
  );
}
