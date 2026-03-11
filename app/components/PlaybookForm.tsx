"use client";

import { useId, useState } from "react";

export default function PlaybookForm() {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const formId = useId();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Enter a valid email to receive the playbook.");
      return;
    }
    setError("");
    setSuccess(true);
  };

  if (success) {
    return (
      <div>
        <strong>Playbook request received.</strong>
        <p className="helper-text">
          Check your inbox for a secure download link and compliance checklist.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div>
        <label htmlFor={`${formId}-email`}>Work email</label>
        <input
          id={`${formId}-email`}
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${formId}-email-error` : undefined}
          required
        />
        {error ? (
          <span className="helper-text" id={`${formId}-email-error`}>
            {error}
          </span>
        ) : null}
      </div>
      <button type="submit" className="button button-primary">
        Send the playbook
      </button>
      <span className="helper-text">
        We respect agency security policies. No spam or tracking pixels.
      </span>
    </form>
  );
}
