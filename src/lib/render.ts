import type { Business } from "@/lib/types/database";

export function renderBusinessHtml(params: {
  business: Business;
  aboutText: string;
  sourceUrl?: string;
}): string {
  const { business, aboutText, sourceUrl } = params;
  const about = escapeHtml(aboutText).replace(/\n/g, "<br />");
  const link = sourceUrl
    ? `<p>Source: <a href="${escapeHtml(sourceUrl)}" rel="noopener" target="_blank">${escapeHtml(sourceUrl)}</a></p>`
    : "";

  return `
  <header>
    <h1>${escapeHtml(business.name)}</h1>
  </header>
  <section>
    <h2>About</h2>
    <p>${about || "Text extraction unavailable."}</p>
    ${link}
  </section>
  `;
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

