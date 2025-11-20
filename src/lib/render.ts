import type { Business } from "@/lib/types/database";

export function renderBusinessHtml(params: {
  business: Business;
  aboutText: string;
  sourceUrl?: string;
}): string {
  const { business, aboutText, sourceUrl } = params;
  const about = escapeHtml(aboutText).replace(/\n/g, "<br />");
  const link = sourceUrl
    ? `<p style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid #e5e7eb; font-size: 0.875rem; color: #6b7280;">Source: <a href="${escapeHtml(sourceUrl)}" rel="noopener" target="_blank">${escapeHtml(sourceUrl)}</a></p>`
    : "";

  return `<article>
  <header>
    <h1 style="font-size: 2rem; font-weight: 700; margin-bottom: 1.5rem; color: #111827;">${escapeHtml(business.name)}</h1>
  </header>
  <section>
    <h2 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 1rem; color: #374151;">About</h2>
    <div style="line-height: 1.75; color: #4b5563;">${about || "Text extraction unavailable."}</div>
    ${link}
  </section>
</article>`;
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

