"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import ReviewForm, { type ReviewFormValues } from "@/components/review-form";
import {
  useAttachReviewImagesMutation,
  useCreateBookingReviewMutation,
  useGetReviewQuery,
  useRemoveReviewImageMutation,
  useUpdateReviewMutation,
  useUploadImageMutation,
} from "@/redux/services/renterApi";

export default function WriteReviewPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#f8fafc]" />}>
      <WriteReviewPageContent />
    </Suspense>
  );
}

function WriteReviewPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const reviewId = searchParams.get("reviewId");
  const isEditMode = Boolean(reviewId);

  const { data: existingReview, isLoading: isLoadingReview } = useGetReviewQuery(reviewId ?? "", { skip: !reviewId });
  const [createReview, { isLoading: isCreating }] = useCreateBookingReviewMutation();
  const [updateReview, { isLoading: isUpdating }] = useUpdateReviewMutation();
  const [uploadImage] = useUploadImageMutation();
  const [attachImages] = useAttachReviewImagesMutation();
  const [removeImage] = useRemoveReviewImageMutation();

  async function handleSubmit(values: ReviewFormValues) {
    try {
      let targetReviewId = reviewId;
      if (isEditMode && reviewId) {
        await updateReview({ id: reviewId, body: { rating: values.rating, reviewText: values.reviewText } }).unwrap();
      } else {
        if (!bookingId) {
          toast.error("Missing booking reference for this review.");
          return;
        }
        const created = await createReview({ id: bookingId, body: { rating: values.rating, reviewText: values.reviewText } }).unwrap();
        targetReviewId = created.id;
      }

      if (targetReviewId && values.photos.length) {
        const uploads = await Promise.all(values.photos.map((file) => {
          const body = new FormData();
          body.append("file", file);
          return uploadImage(body).unwrap();
        }));
        await attachImages({
          reviewId: targetReviewId,
          images: uploads.filter((upload) => upload.imageUrl).map((upload) => ({ imageUrl: upload.imageUrl as string, thumbnailUrl: upload.thumbnailUrl })),
        }).unwrap();
      }

      toast.success(isEditMode ? "Review updated" : "Review submitted — thank you!");
      router.push("/user/profile/my-booking");
    } catch {
      toast.error("Unable to submit your review. Please try again.");
    }
  }

  async function handleRemoveExistingImage(imageId: string) {
    if (!reviewId) return;
    try {
      await removeImage({ reviewId, imageId }).unwrap();
    } catch {
      toast.error("Unable to remove photo");
    }
  }

  if (isEditMode && isLoadingReview) {
    return <main className="min-h-screen bg-[#f8fafc] px-4 py-10 text-center text-sm text-slate-400">Loading review...</main>;
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">
            <span className="text-new-blue">{isEditMode ? "Edit your " : "Write a "}</span>
            <span className="text-new-red">Review</span>
          </h1>
          <p className="mt-1.5 text-sm text-slate-400">Share your experience to help other renters make confident decisions.</p>
        </div>

        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
          <ReviewForm
            initialRating={existingReview?.rating ?? 0}
            initialText={existingReview?.reviewText ?? ""}
            existingImages={(existingReview?.images ?? []).map((image) => ({ id: image.id ?? "", url: image.imageUrl ?? "" })).filter((image) => image.id)}
            onRemoveExistingImage={handleRemoveExistingImage}
            submitLabel={isEditMode ? "Save changes" : "Submit Review"}
            isSubmitting={isCreating || isUpdating}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </main>
  );
}
