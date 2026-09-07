"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faSpinner, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useDeleteMyAvatarMutation, useUploadMyAvatarMutation } from "@/redux/services/userApi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AvatarUploadProps {
  avatarUrl: string | null;
  initials: string;
  fullName: string;
}

export default function AvatarUpload({ avatarUrl, initials, fullName }: AvatarUploadProps) {
  const [uploadAvatar, { isLoading: isUploading }] = useUploadMyAvatarMutation();
  const [deleteAvatar, { isLoading: isDeleting }] = useDeleteMyAvatarMutation();
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isBusy = isUploading || isDeleting;

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    try {
      await uploadAvatar(file).unwrap();
      toast.success("Profile photo updated");
    } catch {
      toast.error("Unable to upload photo");
    } finally {
      setPreview(null);
    }
  }

  async function handleRemove() {
    try {
      await deleteAvatar().unwrap();
      toast.success("Profile photo removed");
    } catch {
      toast.error("Unable to remove photo");
    }
  }

  const displayUrl = preview || avatarUrl;

  return (
    <div className="relative shrink-0">
      {displayUrl ? (
        <img src={displayUrl} alt={`${fullName} profile`} className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-md sm:h-32 sm:w-32" />
      ) : (
        <div role="img" aria-label={`${fullName} profile initials`} className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-white bg-rose-100 text-3xl font-bold uppercase text-[#F73030] shadow-md sm:h-32 sm:w-32">
          {initials}
        </div>
      )}

      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <button type="button" disabled={isBusy} aria-label="Change profile photo" className="absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded-full border border-slate-100 bg-white shadow-md hover:bg-slate-50 disabled:opacity-60">
              <FontAwesomeIcon icon={isBusy ? faSpinner : faCamera} spin={isBusy} className="h-3.5 w-3.5 text-slate-600" />
            </button>
          }
        />
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => fileInputRef.current?.click()} className="cursor-pointer gap-2">
            <FontAwesomeIcon icon={faCamera} className="h-3.5 w-3.5" /> Upload photo
          </DropdownMenuItem>
          {avatarUrl ? (
            <DropdownMenuItem onClick={handleRemove} variant="destructive" className="cursor-pointer gap-2">
              <FontAwesomeIcon icon={faTrash} className="h-3.5 w-3.5" /> Remove photo
            </DropdownMenuItem>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
