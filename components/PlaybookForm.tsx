"use client";

import { useState } from "react";

export default function PlaybookForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!email.includes("@")) {
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="notice" aria-live="polite">
        Thanks. Your compliance playbook is on the way.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="form-grid" noValidate>
      <div className="field">
        <label htmlFor="playbook-email">Work email</label>
        <input
          id="playbook-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>
      <button className="button primary" type="submit">
        Send me the playbook
      </button>
      <p className="helper">No spam. One follow-up with scheduling options.</p>
    </form>
  );
}
