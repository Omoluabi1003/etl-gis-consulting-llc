"use client";

import { useId, useState } from "react";

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  organization: string;
  role: string;
  agencyType: string;
  goal: string;
  timeline: string;
  systems: string;
};

const initialState: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  organization: "",
  role: "",
  agencyType: "",
  goal: "",
  timeline: "",
  systems: "",
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ConsultationForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [successId, setSuccessId] = useState<string | null>(null);
  const formId = useId();

  const updateField = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    const nextErrors: Partial<FormState> = {};
    if (!form.firstName) nextErrors.firstName = "First name is required.";
    if (!form.lastName) nextErrors.lastName = "Last name is required.";
    if (!form.email || !emailRegex.test(form.email)) {
      nextErrors.email = "Enter a valid work email.";
    }
    if (!form.organization) {
      nextErrors.organization = "Organization name is required.";
    }
    if (!form.role) nextErrors.role = "Role is required.";
    if (!form.agencyType) {
      nextErrors.agencyType = "Select an agency type.";
    }
    if (!form.goal) nextErrors.goal = "Share your primary goal.";
    return nextErrors;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      const id = `ETL-${Math.floor(Math.random() * 90000 + 10000)}`;
      setSuccessId(id);
      setForm(initialState);
    }
  };

  if (successId) {
    return (
      <div className="form-card" role="status">
        <h3>Consultation request received</h3>
        <p className="helper-text">
          We will confirm next steps within one business day. Reference ID:
          <strong> {successId}</strong>
        </p>
        <button
          type="button"
          className="button button-secondary"
          onClick={() => setSuccessId(null)}
        >
          Submit another request
        </button>
      </div>
    );
  }

  return (
    <form className="form-card" onSubmit={handleSubmit} noValidate>
      <div className="section-title">
        <h3>Request a confidential consultation</h3>
        <p>
          Short-first intake so we can respond quickly. Expand for additional
          context if helpful.
        </p>
      </div>
      <div className="form-grid">
        <div>
          <label htmlFor={`${formId}-first`}>First name</label>
          <input
            id={`${formId}-first`}
            value={form.firstName}
            onChange={(event) => updateField("firstName", event.target.value)}
            aria-invalid={Boolean(errors.firstName)}
            aria-describedby={errors.firstName ? `${formId}-first-error` : undefined}
            required
          />
          {errors.firstName ? (
            <span className="helper-text" id={`${formId}-first-error`}>
              {errors.firstName}
            </span>
          ) : null}
        </div>
        <div>
          <label htmlFor={`${formId}-last`}>Last name</label>
          <input
            id={`${formId}-last`}
            value={form.lastName}
            onChange={(event) => updateField("lastName", event.target.value)}
            aria-invalid={Boolean(errors.lastName)}
            aria-describedby={errors.lastName ? `${formId}-last-error` : undefined}
            required
          />
          {errors.lastName ? (
            <span className="helper-text" id={`${formId}-last-error`}>
              {errors.lastName}
            </span>
          ) : null}
        </div>
        <div>
          <label htmlFor={`${formId}-email`}>Work email</label>
          <input
            id={`${formId}-email`}
            type="email"
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? `${formId}-email-error` : undefined}
            required
          />
          {errors.email ? (
            <span className="helper-text" id={`${formId}-email-error`}>
              {errors.email}
            </span>
          ) : null}
        </div>
        <div>
          <label htmlFor={`${formId}-org`}>Organization</label>
          <input
            id={`${formId}-org`}
            value={form.organization}
            onChange={(event) => updateField("organization", event.target.value)}
            aria-invalid={Boolean(errors.organization)}
            aria-describedby={
              errors.organization ? `${formId}-org-error` : undefined
            }
            required
          />
          {errors.organization ? (
            <span className="helper-text" id={`${formId}-org-error`}>
              {errors.organization}
            </span>
          ) : null}
        </div>
        <div>
          <label htmlFor={`${formId}-role`}>Role</label>
          <input
            id={`${formId}-role`}
            value={form.role}
            onChange={(event) => updateField("role", event.target.value)}
            aria-invalid={Boolean(errors.role)}
            aria-describedby={errors.role ? `${formId}-role-error` : undefined}
            required
          />
          {errors.role ? (
            <span className="helper-text" id={`${formId}-role-error`}>
              {errors.role}
            </span>
          ) : null}
        </div>
        <div>
          <label htmlFor={`${formId}-agency`}>Agency type</label>
          <select
            id={`${formId}-agency`}
            value={form.agencyType}
            onChange={(event) => updateField("agencyType", event.target.value)}
            aria-invalid={Boolean(errors.agencyType)}
            aria-describedby={
              errors.agencyType ? `${formId}-agency-error` : undefined
            }
            required
          >
            <option value="">Select</option>
            <option>Transportation authority</option>
            <option>Utility or energy provider</option>
            <option>Public safety or emergency management</option>
            <option>Public agency or municipality</option>
          </select>
          {errors.agencyType ? (
            <span className="helper-text" id={`${formId}-agency-error`}>
              {errors.agencyType}
            </span>
          ) : null}
        </div>
        <div>
          <label htmlFor={`${formId}-goal`}>Primary goal</label>
          <input
            id={`${formId}-goal`}
            value={form.goal}
            onChange={(event) => updateField("goal", event.target.value)}
            aria-invalid={Boolean(errors.goal)}
            aria-describedby={errors.goal ? `${formId}-goal-error` : undefined}
            required
          />
          {errors.goal ? (
            <span className="helper-text" id={`${formId}-goal-error`}>
              {errors.goal}
            </span>
          ) : null}
        </div>
      </div>
      <details>
        <summary className="helper-text">More details (optional)</summary>
        <div className="form-grid" style={{ marginTop: "1rem" }}>
          <div>
            <label htmlFor={`${formId}-timeline`}>Timeline or deadline</label>
            <input
              id={`${formId}-timeline`}
              value={form.timeline}
              onChange={(event) => updateField("timeline", event.target.value)}
            />
          </div>
          <div>
            <label htmlFor={`${formId}-systems`}>Current GIS systems</label>
            <input
              id={`${formId}-systems`}
              value={form.systems}
              onChange={(event) => updateField("systems", event.target.value)}
            />
          </div>
        </div>
      </details>
      <div className="form-actions">
        <button type="submit" className="button button-primary">
          Submit request
        </button>
        <span className="helper-text">
          We respond within one business day.
        </span>
      </div>
    </form>
  );
}
