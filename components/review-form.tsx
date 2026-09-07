"use client";

import { useState, ChangeEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as faStarSolid, faCamera, faPaperPlane, faXmark } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";

const MAX_CHARS = 500;
const MAX_PHOTOS = 3;

export interface ReviewFormExistingImage {
  id: string;
  url: string;
}

export interface ReviewFormValues {
  rating: number;
  reviewText: string;
  photos: File[];
}

interface ReviewFormProps {
  initialRating?: number;
  initialText?: string;
  existingImages?: ReviewFormExistingImage[];
  onRemoveExistingImage?: (imageId: string) => void;
  submitLabel?: string;
  isSubmitting?: boolean;
  onSubmit: (values: ReviewFormValues) => void | Promise<void>;
}

export default function ReviewForm({
  initialRating = 0,
  initialText = "",
  existingImages = [],
  onRemoveExistingImage,
  submitLabel = "Submit Review",
  isSubmitting = false,
  onSubmit,
}: ReviewFormProps) {
  const [rating, setRating] = useState<number>(initialRating);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>(initialText);
  const [photos, setPhotos] = useState<File[]>([]);

  const remainingSlots = Math.max(0, MAX_PHOTOS - existingImages.length - photos.length);

  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files);
    setPhotos((current) => [...current, ...selectedFiles].slice(0, MAX_PHOTOS - existingImages.length));
    e.target.value = "";
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos((current) => current.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    onSubmit({ rating, reviewText, photos });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h2 className="text-sm font-bold text-slate-800">How was your experience?</h2>
        <div className="mt-3 flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="text-slate-300 transition-colors focus:outline-none"
            >
              <FontAwesomeIcon
                icon={star <= (hoverRating || rating) ? faStarSolid : faStarRegular}
                className={`h-7 w-7 ${star <= (hoverRating || rating) ? "text-amber-400" : "text-slate-300"}`}
              />
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-slate-400">Tap a star to rate</p>
      </div>

      <div>
        <label htmlFor="review" className="block text-sm font-bold text-slate-800">Your Review</label>
        <div className="relative mt-3">
          <textarea
            id="review"
            rows={5}
            maxLength={MAX_CHARS}
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Share details about the item condition, functionality, and your overall experience..."
            className="w-full resize-none rounded-2xl border border-slate-100 bg-slate-50/50 p-4 text-sm text-slate-800 placeholder-slate-400 focus:border-slate-200 focus:bg-white focus:outline-none"
          />
          <span className="absolute bottom-3 right-4 text-xs text-slate-400">{reviewText.length} / {MAX_CHARS}</span>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold text-slate-800">Add Photos <span className="font-normal text-slate-400">(Optional)</span></label>
          <span className="text-xs text-slate-400">Up to {MAX_PHOTOS} photos</span>
        </div>

        {existingImages.length > 0 && (
          <div className="mt-3 flex gap-3">
            {existingImages.map((image) => (
              <div key={image.id} className="relative h-20 w-20 overflow-hidden rounded-xl border border-slate-100 bg-slate-100">
                <img src={image.url} alt="Review attachment" className="h-full w-full object-cover" />
                {onRemoveExistingImage ? (
                  <button type="button" onClick={() => onRemoveExistingImage(image.id)} className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-slate-900/60 text-white transition hover:bg-slate-900">
                    <FontAwesomeIcon icon={faXmark} className="h-3 w-3" />
                  </button>
                ) : null}
              </div>
            ))}
          </div>
        )}

        {remainingSlots > 0 ? (
          <div className="relative mt-3 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/30 p-8 text-center transition hover:bg-slate-50">
            <input type="file" multiple accept="image/*" onChange={handlePhotoUpload} className="absolute inset-0 cursor-pointer opacity-0" />
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-new-red">
              <FontAwesomeIcon icon={faCamera} className="h-4 w-4" />
            </div>
            <p className="text-xs font-bold text-slate-700">Drag and drop or click to upload</p>
          </div>
        ) : null}

        {photos.length > 0 && (
          <div className="mt-4 flex gap-3">
            {photos.map((file, index) => (
              <div key={index} className="relative h-20 w-20 overflow-hidden rounded-xl border border-slate-100 bg-slate-100">
                <img src={URL.createObjectURL(file)} alt={`upload-${index}`} className="h-full w-full object-cover" />
                <button type="button" onClick={() => handleRemovePhoto(index)} className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-slate-900/60 text-white transition hover:bg-slate-900">
                  <FontAwesomeIcon icon={faXmark} className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting || rating === 0}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-new-red px-6 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Submitting..." : submitLabel}
          <FontAwesomeIcon icon={faPaperPlane} className="h-3.5 w-3.5" />
        </button>
      </div>
    </form>
  );
}
