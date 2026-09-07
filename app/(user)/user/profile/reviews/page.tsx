"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Pencil, Star, Trash2 } from "lucide-react";
import type { UserReview } from "@/lib/types/user.types";
import { useGetMyReviewsQuery } from "@/redux/services/userApi";
import { useDeleteReviewMutation } from "@/redux/services/renterApi";
import { useGetItemQuery } from "@/redux/services/itemApi";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

function formatDate(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(date);
}

export default function MyReviewsPage() {
  const { data, isLoading, isError, refetch } = useGetMyReviewsQuery({ page: 0, size: 50, sort: "createdAt,desc" });
  const reviews = data?.content ?? [];

  return (
    <main className="min-h-screen bg-[#f8fafc] px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-800"><span className="text-new-blue">My </span><span className="text-new-red">Reviews</span></h1>
          <p className="mt-1.5 text-sm text-slate-400">Reviews you&apos;ve left after completed rentals.</p>
        </div>

        {isLoading ? (
          <div className="space-y-4">{Array.from({ length: 3 }, (_, index) => <div key={index} className="h-28 animate-pulse rounded-2xl bg-white" />)}</div>
        ) : isError ? (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-10 text-center">
            <p className="text-sm font-semibold text-red-700">Unable to load your reviews.</p>
            <button type="button" onClick={() => refetch()} className="mt-4 rounded-xl bg-new-red px-5 py-2.5 text-sm font-semibold text-white">Try again</button>
          </div>
        ) : reviews.length === 0 ? (
          <div className="rounded-2xl border border-slate-100 bg-white p-12 text-center text-slate-400">
            <Star className="mx-auto mb-3 size-9 text-slate-300" />
            <p className="text-sm font-medium">You haven&apos;t written any reviews yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => <ReviewCard key={review.id} review={review} />)}
          </div>
        )}
      </div>
    </main>
  );
}

function ReviewCard({ review }: { review: UserReview }) {
  const { data: item } = useGetItemQuery(review.itemId ?? "", { skip: !review.itemId });
  const [deleteReview, { isLoading: isDeleting }] = useDeleteReviewMutation();
  const [open, setOpen] = useState(false);

  async function handleDelete() {
    setOpen(false);
    try {
      await deleteReview(review.id).unwrap();
      toast.success("Review deleted");
    } catch {
      toast.error("Unable to delete review");
    }
  }

  return (
    <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-slate-800">{item?.title || "Rental item"}</p>
          <div className="mt-1 flex items-center gap-1">
            {Array.from({ length: 5 }, (_, index) => (
              <Star key={index} className={`size-3.5 ${index < (review.rating ?? 0) ? "fill-amber-400 text-amber-400" : "fill-slate-100 text-slate-200"}`} />
            ))}
            <span className="ml-1 text-[11px] text-slate-400">{formatDate(review.createdAt)}</span>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <Link href={`/user/profile/review?reviewId=${review.id}`} aria-label="Edit review" className="rounded-full p-2 text-slate-400 hover:bg-slate-50 hover:text-[#253C95]">
            <Pencil className="size-3.5" />
          </Link>
          <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger render={<button type="button" aria-label="Delete review" className="rounded-full p-2 text-slate-400 hover:bg-red-50 hover:text-new-red"><Trash2 className="size-3.5" /></button>} />
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this review?</AlertDialogTitle>
                <AlertDialogDescription>This will permanently remove your review and its photos.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>{isDeleting ? "Deleting..." : "Delete review"}</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      {review.reviewText ? <p className="mt-3 text-sm leading-6 text-slate-600">{review.reviewText}</p> : null}
      {review.vendorReply ? (
        <div className="mt-3 rounded-xl bg-slate-50 p-3">
          <p className="text-[10px] font-bold uppercase tracking-wide text-[#253C95]">Owner response</p>
          <p className="mt-1 text-xs leading-5 text-slate-600">{review.vendorReply}</p>
        </div>
      ) : null}
    </article>
  );
}
