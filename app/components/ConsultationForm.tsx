"use client";

import { FormEvent, useState } from "react";
import styles from "../page.module.css";

interface FormState {
  firstName: string;
  lastName: string;
  organization: string;
  email: string;
  role: string;
  timeline: string;
  details: string;
}

const initialState: FormState = {
  firstName: "",
  lastName: "",
  organization: "",
  email: "",
  role: "",
  timeline: "",
  details: "",
};

export default function ConsultationForm() {
  const [formState, setFormState] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (field: keyof FormState, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!formState.firstName.trim()) nextErrors.firstName = "First name is required.";
    if (!formState.lastName.trim()) nextErrors.lastName = "Last name is required.";
    if (!formState.organization.trim()) nextErrors.organization = "Organization is required.";
    if (!formState.email.includes("@")) nextErrors.email = "Enter a valid work email.";
    if (!formState.timeline.trim()) nextErrors.timeline = "Select an expected timeline.";
    return nextErrors;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    const reference = `ETL-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    setSuccess(reference);
    setFormState(initialState);
  };

  if (success) {
    return (
      <div className={styles.successBox} role="status">
        <h3>Request received</h3>
        <p>
          Thank you. We will respond within two business days. Reference ID: <strong>{success}</strong>
        </p>
        <button type="button" className={styles.secondaryButton} onClick={() => setSuccess(null)}>
          Submit another request
        </button>
      </div>
    );
  }

  return (
    <form className={styles.formCard} onSubmit={handleSubmit} noValidate>
      <div className={styles.formGrid}>
        <label>
          First name
          <input
            type="text"
            value={formState.firstName}
            onChange={(event) => handleChange("firstName", event.target.value)}
            aria-invalid={Boolean(errors.firstName)}
            aria-describedby={errors.firstName ? "firstName-error" : undefined}
          />
          {errors.firstName && (
            <span id="firstName-error" className={styles.errorText}>
              {errors.firstName}
            </span>
          )}
        </label>
        <label>
          Last name
          <input
            type="text"
            value={formState.lastName}
            onChange={(event) => handleChange("lastName", event.target.value)}
            aria-invalid={Boolean(errors.lastName)}
            aria-describedby={errors.lastName ? "lastName-error" : undefined}
          />
          {errors.lastName && (
            <span id="lastName-error" className={styles.errorText}>
              {errors.lastName}
            </span>
          )}
        </label>
        <label>
          Organization
          <input
            type="text"
            value={formState.organization}
            onChange={(event) => handleChange("organization", event.target.value)}
            aria-invalid={Boolean(errors.organization)}
            aria-describedby={errors.organization ? "organization-error" : undefined}
          />
          {errors.organization && (
            <span id="organization-error" className={styles.errorText}>
              {errors.organization}
            </span>
          )}
        </label>
        <label>
          Work email
          <input
            type="email"
            value={formState.email}
            onChange={(event) => handleChange("email", event.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && (
            <span id="email-error" className={styles.errorText}>
              {errors.email}
            </span>
          )}
        </label>
        <label>
          Role
          <input
            type="text"
            value={formState.role}
            onChange={(event) => handleChange("role", event.target.value)}
          />
        </label>
        <label>
          Timeline
          <select
            value={formState.timeline}
            onChange={(event) => handleChange("timeline", event.target.value)}
            aria-invalid={Boolean(errors.timeline)}
            aria-describedby={errors.timeline ? "timeline-error" : undefined}
          >
            <option value="">Select one</option>
            <option value="0-3">0-3 months</option>
            <option value="3-6">3-6 months</option>
            <option value="6-12">6-12 months</option>
            <option value="12+">12+ months</option>
          </select>
          {errors.timeline && (
            <span id="timeline-error" className={styles.errorText}>
              {errors.timeline}
            </span>
          )}
        </label>
      </div>
      <details className={styles.moreDetails}>
        <summary>More details (optional)</summary>
        <label>
          Current challenges or priorities
          <textarea
            rows={4}
            value={formState.details}
            onChange={(event) => handleChange("details", event.target.value)}
          />
        </label>
      </details>
      <div className={styles.formActions}>
        <button type="submit" className={styles.primaryButton}>
          Request consultation
        </button>
        <span className={styles.formHelper}>We respond within two business days.</span>
      </div>
    </form>
  );
}
