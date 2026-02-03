"use client";

import { useState } from "react";
import styles from "../page.module.css";

type FormState = "idle" | "success";

export default function PlaybookForm() {
  const [state, setState] = useState<FormState>("idle");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    setState("success");
    form.reset();
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.fieldRow}>
        <label htmlFor="playbook-email">Work email</label>
        <input id="playbook-email" name="email" type="email" required />
      </div>
      <div className={styles.fieldRow}>
        <label htmlFor="playbook-role">Role</label>
        <select id="playbook-role" name="role" required>
          <option value="">Select one</option>
          <option value="executive">Executive sponsor</option>
          <option value="security">Security or compliance</option>
          <option value="gis">GIS lead</option>
          <option value="procurement">Procurement or PMO</option>
        </select>
      </div>
      <button type="submit" className={styles.secondaryButton}>
        Email me the playbook
      </button>
      {state === "success" && (
        <p className={styles.formSuccess} role="status">
          Check your inbox for the secure download link.
        </p>
      )}
    </form>
  );
}
