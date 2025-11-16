import slugify from "slugify";

export function generateSlug(name: string, randomFn: () => number = Math.random): string {
  const base = slugify(name, { lower: true, strict: true }).replace(/[^a-z0-9-]/g, "");
  const safeBase = base.length > 0 ? base : "business";
  const suffix = randomFn().toString(36).replace(/[^a-z0-9]/g, "").slice(2, 6) || "0000";
  return `${safeBase}-${suffix}`;
}

