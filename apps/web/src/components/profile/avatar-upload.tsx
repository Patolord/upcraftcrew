"use client";

import { useState, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

interface AvatarUploadProps {
  currentAvatar?: string | null;
  userId: string;
  userName?: string | null;
  onUploadSuccess?: (url: string) => void;
}

export const AvatarUpload = ({
  currentAvatar,
  userId,
  userName,
  onUploadSuccess,
}: AvatarUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const saveUserAvatar = useMutation(api.files.saveUserAvatar);

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validar tamanho (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setIsUploading(true);

    try {
      // 1. Gerar URL de upload
      const uploadUrl = await generateUploadUrl();

      // 2. Upload do arquivo para Convex Storage
      const uploadResult = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!uploadResult.ok) {
        throw new Error("Failed to upload file");
      }

      const { storageId } = await uploadResult.json();

      // 3. Salvar referência do avatar
      const result = await saveUserAvatar({ userId, storageId });

      // 4. Preview local
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);

      toast.success("Avatar uploaded successfully!");
      onUploadSuccess?.(result.url);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload avatar");
    } finally {
      setIsUploading(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const displayAvatar = previewUrl || currentAvatar;

  return (
    <div className="relative">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      <div className="avatar cursor-pointer" onClick={handleClick}>
        <div className="size-24 rounded-full bg-base-200 ring ring-primary ring-offset-2 ring-offset-base-100 hover:ring-offset-4 transition-all">
          {isUploading ? (
            <div className="flex size-full items-center justify-center">
              <span className="loading loading-spinner loading-md" />
            </div>
          ) : displayAvatar ? (
            <img src={displayAvatar} alt={userName || "User"} />
          ) : (
            <div className="bg-primary text-primary-content flex size-full items-center justify-center text-3xl font-bold">
              {getInitials(userName)}
            </div>
          )}
        </div>
      </div>

      {/* Upload button overlay */}
      <button
        type="button"
        onClick={handleClick}
        disabled={isUploading}
        className="btn btn-circle btn-primary btn-sm absolute bottom-0 right-0 shadow-lg"
        title="Change avatar"
      >
        {isUploading ? (
          <span className="loading loading-spinner loading-xs" />
        ) : (
          <span className="iconify lucide--camera size-4" />
        )}
      </button>
    </div>
  );
};
