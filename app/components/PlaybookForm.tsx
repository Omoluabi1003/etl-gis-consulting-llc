"use client";

import { FormEvent, useState } from "react";
import styles from "../page.module.css";

export default function PlaybookForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success">("idle");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.includes("@")) return;
    setStatus("success");
    setEmail("");
  };

  if (status === "success") {
    return (
      <div className={styles.playbookSuccess} role="status">
        <strong>Playbook unlocked.</strong> Check your inbox for the download link.
      </div>
    );
  }

  return (
    <form className={styles.playbookForm} onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Work email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
      />
      <button type="submit" className={styles.primaryButton}>
        Get the playbook
      </button>
    </form>
  );
}
