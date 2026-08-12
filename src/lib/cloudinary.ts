/**
 * Cloudinary server-side utilities.
 *
 * - uploadImage()     → Server Action / Route Handler signed upload
 * - deleteImage()     → Server-side asset deletion by public_id
 * - generateSignature()  → Signs upload params for direct client-side uploads
 *
 * Never import this file in Client Components — it exposes the API secret.
 */
import { v2 as cloudinary } from "cloudinary";

// Configure once at module load — runs server-side only
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export { cloudinary };

// ── Upload ─────────────────────────────────────────────────────────────────

export interface UploadResult {
  publicId: string;
  secureUrl: string;
  width: number;
  height: number;
  format: string;
}

/**
 * Upload a file (data URI, URL, or local path) to a specific Cloudinary folder.
 * Used in Server Actions for admin book/author/banner image management.
 */
export async function uploadImage(
  source: string,
  folder: "books" | "authors" | "publishers" | "banners" | "avatars",
): Promise<UploadResult> {
  const result = await cloudinary.uploader.upload(source, {
    folder: `booklife/${folder}`,
    allowed_formats: ["jpg", "jpeg", "png", "webp", "avif"],
    transformation: [{ quality: "auto", fetch_format: "auto" }],
  });

  return {
    publicId: result.public_id,
    secureUrl: result.secure_url,
    width: result.width,
    height: result.height,
    format: result.format,
  };
}

/**
 * Delete a Cloudinary asset by its public_id.
 * Called when a book/banner image is replaced or the record is deleted.
 */
export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}

// ── Signature for direct client uploads ───────────────────────────────────

export interface SignaturePayload {
  signature: string;
  timestamp: number;
  apiKey: string;
  cloudName: string;
  uploadPreset: string;
  folder: string;
}

/**
 * Generate a signed upload signature for direct browser → Cloudinary uploads.
 * The signature is returned to the client; the secret never leaves the server.
 *
 * The client then POSTs directly to Cloudinary's upload API with the signature.
 */
export function generateUploadSignature(
  folder: "books" | "authors" | "publishers" | "banners" | "avatars",
): SignaturePayload {
  const timestamp = Math.round(Date.now() / 1000);
  const uploadPreset =
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? "booklife_uploads";
  const folderPath = `booklife/${folder}`;

  const paramsToSign = {
    folder: folderPath,
    timestamp,
    upload_preset: uploadPreset,
  };

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET!,
  );

  return {
    signature,
    timestamp,
    apiKey: process.env.CLOUDINARY_API_KEY!,
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
    uploadPreset,
    folder: folderPath,
  };
}
