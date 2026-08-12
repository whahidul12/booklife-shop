/**
 * POST /api/cloudinary-sign
 *
 * Server-side signature endpoint for direct browser → Cloudinary uploads.
 * Only authenticated users (any role) can request a signature.
 *
 * Body: { folder: "books" | "authors" | "publishers" | "banners" | "avatars" }
 * Response: SignaturePayload (signature, timestamp, apiKey, cloudName, uploadPreset, folder)
 */
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { generateUploadSignature } from "@/lib/cloudinary";
import { z } from "zod";

const bodySchema = z.object({
  folder: z.enum(["books", "authors", "publishers", "banners", "avatars"]),
});

export async function POST(request: NextRequest) {
  // Require an active session
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid folder", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const payload = generateUploadSignature(parsed.data.folder);
  return NextResponse.json(payload);
}
