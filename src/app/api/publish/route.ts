import { NextResponse } from "next/server";
import { z } from "zod";
import { publishBusiness } from "@/lib/publish";

const bodySchema = z.object({
  businessId: z.string().uuid(),
});

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: "businessId is required" }, { status: 400 });
  }

  const result = await publishBusiness(parsed.data.businessId);
  return NextResponse.json(result, { status: 200 });
}

