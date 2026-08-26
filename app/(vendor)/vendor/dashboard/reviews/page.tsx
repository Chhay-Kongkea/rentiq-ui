"use client";

import { FormEvent, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import {
  useAddVendorReviewReplyMutation,
  useEditVendorReviewReplyMutation,
  useGetMyVendorItemsQuery,
  useGetVendorItemReviewsQuery,
} from "@/redux/services/vendorApi";
import type { ReviewResponse } from "@/lib/types/vendor.types";

function apiMessage(error: unknown, fallback: string) {
  if (typeof error === "object" && error && "data" in error) {
    const data = (error as { data?: { message?: string } }).data;
    if (data?.message) return data.message;
  }
  return fallback;
}

function Stars({ rating = 0 }: { rating?: number }) {
  return (
    <div className="flex gap-0.5 text-amber-400">
      {Array.from({ length: 5 }).map((_, index) => (
        <FontAwesomeIcon key={index} icon={faStar} className={`h-3.5 w-3.5 ${index < rating ? "" : "text-slate-200"}`} />
      ))}
    </div>
  );
}

function ReviewCard({ review, itemId }: { review: ReviewResponse; itemId: string }) {
  const [replying, setReplying] = useState(false);
  const [error, setError] = useState("");
  const [addReply, addState] = useAddVendorReviewReplyMutation();
  const [editReply, editState] = useEditVendorReviewReplyMutation();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    const reply = String(form.get("reply") || "").trim();
    if (!reply) {
      setError("Write a reply before submitting.");
      return;
    }
    try {
      if (review.vendorReply) {
        await editReply({ reviewId: review.id, itemId, reply }).unwrap();
      } else {
        await addReply({ reviewId: review.id, itemId, reply }).unwrap();
      }
      setReplying(false);
    } catch (requestError) {
      setError(apiMessage(requestError, "Unable to save your reply."));
    }
  }

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <Stars rating={review.rating} />
        <span className="text-xs text-slate-400">{review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ""}</span>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-700">{review.reviewText || "No comment left."}</p>

      {review.images?.length ? (
        <div className="mt-3 flex gap-2">
          {review.images.map((image) => (
            <div key={image.id} className="h-16 w-16 overflow-hidden rounded-lg bg-slate-100">
              {image.imageUrl ? <img src={image.imageUrl} alt="" className="h-full w-full object-cover" /> : null}
            </div>
          ))}
        </div>
      ) : null}

      {review.vendorReply && !replying ? (
        <div className="mt-4 rounded-xl bg-slate-50 p-3">
          <p className="text-xs font-bold text-slate-500">Your reply</p>
          <p className="mt-1 text-sm text-slate-700">{review.vendorReply}</p>
          <button onClick={() => setReplying(true)} className="mt-2 text-xs font-semibold text-[#253C95]">Edit reply</button>
        </div>
      ) : null}

      {!review.vendorReply && !replying ? (
        <button onClick={() => setReplying(true)} className="mt-4 text-xs font-semibold text-[#253C95]">Reply to this review</button>
      ) : null}

      {replying ? (
        <form onSubmit={handleSubmit} className="mt-4 space-y-2">
          {error ? <p className="text-xs text-red-600">{error}</p> : null}
          <textarea name="reply" rows={3} defaultValue={review.vendorReply || ""} placeholder="Thank the reviewer or address their feedback..." className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm" />
          <div className="flex gap-2">
            <button disabled={addState.isLoading || editState.isLoading} className="rounded-lg bg-[#253C95] px-4 py-2 text-xs font-semibold text-white disabled:opacity-60">
              {addState.isLoading || editState.isLoading ? "Saving..." : "Save reply"}
            </button>
            <button type="button" onClick={() => setReplying(false)} className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700">Cancel</button>
          </div>
        </form>
      ) : null}
    </article>
  );
}

export default function VendorReviewsPage() {
  const { data: itemPage, isLoading: itemsLoading } = useGetMyVendorItemsQuery({ pageSize: 100 });
  const items = itemPage?.content ?? [];
  const [selectedItemId, setSelectedItemId] = useState<string>("");
  const activeItemId = selectedItemId || items[0]?.id || "";

  const { data: reviewPage, isLoading: reviewsLoading } = useGetVendorItemReviewsQuery(
    { itemId: activeItemId, size: 50, sort: "createdAt,desc" },
    { skip: !activeItemId },
  );
  const reviews = reviewPage?.content ?? [];

  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      <div>
        <p className="text-sm font-semibold text-[#F73030]">Customer feedback</p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-950">Reviews & replies</h1>
        <p className="mt-1 text-sm text-slate-500">Choose a listing to read its reviews and reply directly to renters.</p>
      </div>

      <div className="grid gap-5 xl:grid-cols-[280px_1fr]">
        <section className="h-fit rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
          {itemsLoading ? <p className="p-3 text-sm text-slate-500">Loading listings...</p> : null}
          <div className="space-y-1">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedItemId(item.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${activeItemId === item.id ? "bg-red-50 font-semibold text-[#F73030]" : "text-slate-600 hover:bg-slate-50"}`}
              >
                <div className="h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                  {item.primaryImageUrl ? <img src={item.primaryImageUrl} alt="" className="h-full w-full object-cover" /> : null}
                </div>
                <span className="min-w-0 flex-1 truncate">{item.title || "Untitled item"}</span>
                {item.averageRating ? <span className="shrink-0 text-xs font-bold text-amber-500">★ {item.averageRating.toFixed(1)}</span> : null}
              </button>
            ))}
            {!itemsLoading && !items.length ? <p className="p-3 text-sm text-slate-500">You need a listing before you can receive reviews.</p> : null}
          </div>
        </section>

        <section className="space-y-4">
          {reviewsLoading ? <p className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">Loading reviews...</p> : null}
          {reviews.map((review) => <ReviewCard key={review.id} review={review} itemId={activeItemId} />)}
          {!reviewsLoading && activeItemId && !reviews.length ? (
            <p className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">No reviews yet for this listing.</p>
          ) : null}
        </section>
      </div>
    </div>
  );
}
