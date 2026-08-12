"use client";

/**
 * useCloudinaryUpload
 *
 * Client-side hook that:
 *   1. Fetches a signed upload signature from /api/cloudinary-sign
 *   2. POSTs the file directly to Cloudinary's upload API
 *   3. Returns the secure URL on success
 *
 * Only works in Client Components — never call from a Server Component.
 *
 * Usage:
 *   const { upload, uploading, progress, error } = useCloudinaryUpload("books");
 *   const url = await upload(file);
 */
import { useState, useCallback } from "react";

type UploadFolder = "books" | "authors" | "publishers" | "banners" | "avatars";

interface SignaturePayload {
  signature:    string;
  timestamp:    number;
  apiKey:       string;
  cloudName:    string;
  uploadPreset: string;
  folder:       string;
}

interface UseCloudinaryUploadReturn {
  /** Upload a File object; resolves with the Cloudinary secure_url */
  upload:    (file: File) => Promise<string>;
  uploading: boolean;
  /** 0–100 */
  progress:  number;
  error:     string | null;
  reset:     () => void;
}

export function useCloudinaryUpload(
  folder: UploadFolder,
): UseCloudinaryUploadReturn {
  const [uploading, setUploading] = useState(false);
  const [progress,  setProgress]  = useState(0);
  const [error,     setError]     = useState<string | null>(null);

  const reset = useCallback(() => {
    setUploading(false);
    setProgress(0);
    setError(null);
  }, []);

  const upload = useCallback(
    async (file: File): Promise<string> => {
      setUploading(true);
      setProgress(0);
      setError(null);

      try {
        // ── 1. Get server-side signature ──────────────────────────────────
        const sigRes = await fetch("/api/cloudinary-sign", {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({ folder }),
        });

        if (!sigRes.ok) {
          const json = await sigRes.json().catch(() => ({}));
          throw new Error(
            (json as { error?: string }).error ?? "Signature fetch failed",
          );
        }

        const sig: SignaturePayload = await sigRes.json();

        // ── 2. Build multipart form ───────────────────────────────────────
        const fd = new FormData();
        fd.append("file",          file);
        fd.append("api_key",       sig.apiKey);
        fd.append("timestamp",     String(sig.timestamp));
        fd.append("signature",     sig.signature);
        fd.append("upload_preset", sig.uploadPreset);
        fd.append("folder",        sig.folder);

        // ── 3. Upload via XHR for progress tracking ───────────────────────
        const secureUrl = await new Promise<string>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          const url = `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`;

          xhr.open("POST", url);

          xhr.upload.addEventListener("progress", (evt) => {
            if (evt.lengthComputable) {
              setProgress(Math.round((evt.loaded / evt.total) * 100));
            }
          });

          xhr.addEventListener("load", () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              try {
                const data = JSON.parse(xhr.responseText) as {
                  secure_url: string;
                };
                resolve(data.secure_url);
              } catch {
                reject(new Error("Invalid Cloudinary response"));
              }
            } else {
              try {
                const errData = JSON.parse(xhr.responseText) as {
                  error?: { message?: string };
                };
                reject(
                  new Error(
                    errData?.error?.message ?? `Upload failed (${xhr.status})`,
                  ),
                );
              } catch {
                reject(new Error(`Upload failed (${xhr.status})`));
              }
            }
          });

          xhr.addEventListener("error", () =>
            reject(new Error("Network error during upload")),
          );
          xhr.addEventListener("abort", () =>
            reject(new Error("Upload aborted")),
          );

          xhr.send(fd);
        });

        setProgress(100);
        return secureUrl;
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "আপলোড ব্যর্থ হয়েছে";
        setError(msg);
        throw err;
      } finally {
        setUploading(false);
      }
    },
    [folder],
  );

  return { upload, uploading, progress, error, reset };
}
