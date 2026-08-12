"use client";

/**
 * CloudinaryImageUpload
 *
 * Reusable file-picker + progress bar that uploads to Cloudinary and
 * calls onUpload(secureUrl) when complete.
 *
 * Usage:
 *   <CloudinaryImageUpload
 *     folder="books"
 *     label="বইয়ের কভার"
 *     currentUrl={book.imageUrl}
 *     onUpload={(url) => setImageUrl(url)}
 *   />
 *
 * The component also renders a hidden <input name={hiddenFieldName}> that
 * holds the uploaded URL so it is included in a parent <form> submission.
 */
import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, ImageIcon } from "lucide-react";
import { useCloudinaryUpload } from "../hooks/useCloudinaryUpload";

type UploadFolder = "books" | "authors" | "publishers" | "banners" | "avatars";

interface CloudinaryImageUploadProps {
  folder:          UploadFolder;
  label?:          string;
  /** URL currently saved in the DB — shown as preview before a new upload */
  currentUrl?:     string | null;
  /** Called with the Cloudinary secure_url after a successful upload */
  onUpload:        (secureUrl: string) => void;
  /** Name of the hidden input that carries the URL in a form submission */
  hiddenFieldName?: string;
  /** Max file size in MB (default 5) */
  maxSizeMb?:      number;
  className?:      string;
}

export function CloudinaryImageUpload({
  folder,
  label       = "ছবি আপলোড",
  currentUrl,
  onUpload,
  hiddenFieldName = "imageUrl",
  maxSizeMb   = 5,
  className   = "",
}: CloudinaryImageUploadProps) {
  const inputRef                    = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentUrl ?? null);
  const [localError, setLocalError] = useState<string | null>(null);

  const { upload, uploading, progress, error: uploadError, reset } = useCloudinaryUpload(folder);

  const displayError = localError ?? uploadError;

  // ── Handle file selection ───────────────────────────────────────────────
  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setLocalError(null);
    reset();

    // Client-side validation
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/avif"];
    if (!allowedTypes.includes(file.type)) {
      setLocalError("শুধুমাত্র JPG, PNG, WebP বা AVIF ফরম্যাট গ্রহণযোগ্য");
      return;
    }
    if (file.size > maxSizeMb * 1024 * 1024) {
      setLocalError(`ফাইলের আকার ${maxSizeMb}MB এর বেশি হওয়া যাবে না`);
      return;
    }

    // Show local preview immediately
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    try {
      const secureUrl = await upload(file);
      // Replace object URL with the real Cloudinary URL
      URL.revokeObjectURL(objectUrl);
      setPreviewUrl(secureUrl);
      onUpload(secureUrl);
    } catch {
      // Error message already set by the hook
      setPreviewUrl(currentUrl ?? null);
    }

    // Reset input so the same file can be re-selected if needed
    if (inputRef.current) inputRef.current.value = "";
  }

  function handleRemove() {
    setPreviewUrl(null);
    setLocalError(null);
    reset();
    onUpload("");
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <p className="text-xs font-medium text-gray-600">{label}</p>
      )}

      {/* Hidden form field — carries the URL on form submit */}
      <input type="hidden" name={hiddenFieldName} value={previewUrl ?? ""} />

      {previewUrl ? (
        // ── Preview ──────────────────────────────────────────────────────
        <div className="group relative h-36 w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
          <Image
            src={previewUrl}
            alt="preview"
            fill
            className="object-cover"
            sizes="320px"
            unoptimized={previewUrl.startsWith("blob:")}
          />

          {/* Uploading overlay */}
          {uploading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/40">
              <div className="h-1.5 w-2/3 overflow-hidden rounded-full bg-white/30">
                <div
                  className="h-full rounded-full bg-white transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-white">
                {progress}%
              </span>
            </div>
          )}

          {/* Remove button */}
          {!uploading && (
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 flex size-6 items-center justify-center rounded-full bg-red-600 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-700"
              aria-label="ছবি সরান"
            >
              <X className="size-3.5" />
            </button>
          )}

          {/* Re-upload button */}
          {!uploading && (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="absolute bottom-2 right-2 flex items-center gap-1.5 rounded-lg bg-black/60 px-2.5 py-1.5 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/80"
            >
              <Upload className="size-3" />
              পরিবর্তন করুন
            </button>
          )}
        </div>
      ) : (
        // ── Drop zone ─────────────────────────────────────────────────────
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex h-36 w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 text-gray-400 transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <ImageIcon className="size-7" />
          <span className="text-xs font-medium">
            ক্লিক করে ছবি বেছে নিন
          </span>
          <span className="text-[10px] text-gray-400">
            JPG · PNG · WebP · AVIF · max {maxSizeMb}MB
          </span>
        </button>
      )}

      {/* Error */}
      {displayError && (
        <p className="flex items-center gap-1.5 rounded-md bg-red-50 px-3 py-1.5 text-xs text-red-600">
          {displayError}
        </p>
      )}

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp,image/avif"
        onChange={handleFileChange}
        className="hidden"
        aria-hidden="true"
      />
    </div>
  );
}
