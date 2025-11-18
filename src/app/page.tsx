"use client";

import { useState } from "react";

export default function Home() {
  const [status, setStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Upload failed");
      }

      if (payload.slug) {
        window.location.href = `/b/${payload.slug}`;
      } else {
        setStatus("Upload succeeded but no slug returned.");
      }
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="page">
      <section className="card">
        <form className="form" onSubmit={handleSubmit}>
          <label>
            Business name
            <input name="name" placeholder="Acme Repairs" required />
          </label>

          <label>
            Document
            <input
              name="file"
              type="file"
              accept=".pdf,.txt,.png,.jpg,.jpeg,.doc,.docx"
              required
            />
          </label>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Uploading…" : "Upload & Publish"}
          </button>
        </form>

        {status && <p className="status">{status}</p>}
      </section>
    </main>
  );
}
