"use client";

import { useMemo, useState } from "react";

interface FormState {
  name: string;
  organization: string;
  email: string;
  role: string;
  challenge: string;
  details: string;
  timeline: string;
}

const initialState: FormState = {
  name: "",
  organization: "",
  email: "",
  role: "",
  challenge: "",
  details: "",
  timeline: ""
};

export default function ConsultationForm() {
  const [formState, setFormState] = useState<FormState>(initialState);
  const [submitted, setSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState("");

  const errors = useMemo(() => {
    const nextErrors: Partial<Record<keyof FormState, string>> = {};
    if (!formState.name.trim()) {
      nextErrors.name = "Please add your name.";
    }
    if (!formState.organization.trim()) {
      nextErrors.organization = "Please add your organization.";
    }
    if (!formState.email.includes("@")) {
      nextErrors.email = "Please use a work email.";
    }
    if (!formState.challenge.trim()) {
      nextErrors.challenge = "Please summarize the primary challenge.";
    }
    return nextErrors;
  }, [formState]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (Object.keys(errors).length > 0) {
      return;
    }
    const ref = `ETL-${Date.now().toString().slice(-6)}`;
    setReferenceId(ref);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="cta-block" aria-live="polite">
        <h3>Consultation request received</h3>
        <p className="helper">
          We will follow up within 2 business days with a scoped discovery plan.
        </p>
        <div className="notice" style={{ marginTop: "16px" }}>
          Reference ID: <strong>{referenceId}</strong>
        </div>
      </div>
    );
  }

  return (
    <form className="cta-block" onSubmit={handleSubmit} noValidate>
      <h3>Request a compliance-ready consultation</h3>
      <p className="helper">
        Short form first. Expand details only if helpful.
      </p>
      <div className="form-grid" style={{ marginTop: "18px" }}>
        <div className="field">
          <label htmlFor="name">Full name</label>
          <input id="name" name="name" value={formState.name} onChange={handleChange} />
          {errors.name && <span className="helper">{errors.name}</span>}
        </div>
        <div className="field">
          <label htmlFor="organization">Organization</label>
          <input
            id="organization"
            name="organization"
            value={formState.organization}
            onChange={handleChange}
          />
          {errors.organization && <span className="helper">{errors.organization}</span>}
        </div>
        <div className="field">
          <label htmlFor="email">Work email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formState.email}
            onChange={handleChange}
          />
          {errors.email && <span className="helper">{errors.email}</span>}
        </div>
        <div className="field">
          <label htmlFor="role">Role</label>
          <input id="role" name="role" value={formState.role} onChange={handleChange} />
        </div>
        <div className="field">
          <label htmlFor="challenge">Primary challenge</label>
          <textarea
            id="challenge"
            name="challenge"
            rows={3}
            value={formState.challenge}
            onChange={handleChange}
          />
          {errors.challenge && <span className="helper">{errors.challenge}</span>}
        </div>
        <details>
          <summary className="toggle">Add more details (optional)</summary>
          <div className="form-grid" style={{ marginTop: "12px" }}>
            <div className="field">
              <label htmlFor="details">Current GIS environment</label>
              <textarea
                id="details"
                name="details"
                rows={3}
                value={formState.details}
                onChange={handleChange}
              />
            </div>
            <div className="field">
              <label htmlFor="timeline">Decision timeline</label>
              <select
                id="timeline"
                name="timeline"
                value={formState.timeline}
                onChange={handleChange}
              >
                <option value="">Select one</option>
                <option value="0-30">0-30 days</option>
                <option value="30-90">30-90 days</option>
                <option value="90-180">90-180 days</option>
                <option value="180+">180+ days</option>
              </select>
            </div>
          </div>
        </details>
        <button className="button primary" type="submit">
          Submit request
        </button>
      </div>
    </form>
  );
}
