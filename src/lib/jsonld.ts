import type { Business } from "@/lib/types/database";

type JsonLd = Record<string, unknown>;

export function jsonLdForBusiness(business: Business, baseUrl: string): JsonLd {
  const address =
    business.address_json && typeof business.address_json === "object"
      ? business.address_json
      : null;

  return {
    "@context": "https://schema.org",
    "@type": address ? "LocalBusiness" : "Organization",
    name: business.name,
    url: `${baseUrl}/b/${business.slug}`,
    description: business.description || "Business profile published via Microsite Generator",
    telephone: business.phone || undefined,
    sameAs: business.website ? [business.website] : [],
    address: address || undefined,
  };
}

