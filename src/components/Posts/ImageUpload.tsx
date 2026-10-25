"use client";

import { useRef, useState } from "react";
import { useUploadThing } from "@/utils/uploadthing";
import { ImageIcon, Loader2Icon, UploadCloudIcon, XIcon } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";

interface ImageUploadProps {
  onChange: (url: string) => void;
  value: string;
  endpoint: "postImage";
}

export default function ImageUpload({
  onChange,
  value,
  endpoint,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);

  const { startUpload, isUploading } = useUploadThing(endpoint, {
    onUploadProgress: (p) => setProgress(p),

    onClientUploadComplete: (res) => {
      const url = res?.[0]?.serverData?.fileUrl ?? res?.[0]?.ufsUrl;

      if (!url) {
        toast.error("Upload completed, but no URL was returned");
        return;
      }

      onChange(url);
      toast.success("Image uploaded successfully");
      setProgress(0);
    },

    onUploadError: (error) => {
      toast.error(error.message || "Image upload failed");
      setProgress(0);
    },
  });

  const handleFile = async (file?: File) => {
    if (!file || isUploading) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/avif",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Please select a JPG, PNG, WebP or AVIF image.");
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      toast.error("Image must be smaller than 4 MB.");
      return;
    }

    setProgress(0);

    // Automatically starts uploading after selection.
    await startUpload([file]);
  };

  if (value) {
    return (
      <div className="relative h-40 w-40 overflow-hidden rounded-lg">
        <Image
          src={value}
          alt="Uploaded image"
          fill
          sizes="160px"
          className="object-cover"
        />

        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white"
          aria-label="Remove image"
        >
          <XIcon className="size-4" />
        </button>
      </div>
    );
  }

  return (
    <div
      role="button"
      tabIndex={isUploading ? -1 : 0}
      aria-disabled={isUploading}
      onClick={() => {
        if (!isUploading) inputRef.current?.click();
      }}
      onKeyDown={(e) => {
        if (!isUploading && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          inputRef.current?.click();
        }
      }}
      onDragOver={(e) => {
        e.preventDefault();
        if (!isUploading) setIsDragging(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        setIsDragging(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);

        if (!isUploading) {
          void handleFile(e.dataTransfer.files[0]);
        }
      }}
      className={`flex min-h-48 cursor-pointer flex-col items-center
        justify-center rounded-lg border-2 border-dashed p-6
        text-center transition-colors ${
          isDragging
            ? "border-primary bg-primary/10"
            : "border-muted-foreground/30 hover:border-primary"
        } ${isUploading ? "cursor-wait opacity-75" : ""}`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="hidden"
        disabled={isUploading}
        onChange={(e) => {
          const file = e.target.files?.[0];
          void handleFile(file);
          e.target.value = "";
        }}
      />

      {isUploading ? (
        <>
          <Loader2Icon className="mb-3 size-10 animate-spin text-primary" />
          <p className="font-medium">Uploading image...</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {Math.round(progress)}% completed
          </p>
          <div className="mt-4 h-2 w-full max-w-64 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </>
      ) : (
        <>
          <UploadCloudIcon className="mb-3 size-10 text-muted-foreground" />
          <p className="font-medium">
            Click to select an image or drag it here
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Upload starts automatically after selection
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            JPG, PNG, WebP, AVIF · Maximum 4 MB
          </p>
        </>
      )}
    </div>
  );
}
