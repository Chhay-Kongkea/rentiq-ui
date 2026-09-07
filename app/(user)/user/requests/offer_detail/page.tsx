"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft,
  CheckCircle2,
  Headset,
  Lock,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { useAcceptOfferMutation, useGetOfferQuery, useRejectOfferMutation } from "@/redux/services/renterApi";
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

function formatMoney(amount = 0, currency = "USD") {
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
  } catch {
    return `$${amount.toFixed(2)}`;
  }
}

export default function OfferDetailPage() {
  return (
    <Suspense fallback={<main className="grid min-h-[60vh] place-items-center bg-[#F2F4F7] text-slate-400">Loading offer...</main>}>
      <OfferDetailPageContent />
    </Suspense>
  );
}

function OfferDetailPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestId = searchParams.get("requestId") || "";
  const offerId = searchParams.get("offerId") || "";

  const { data: offer, isLoading, isError, refetch } = useGetOfferQuery(offerId, { skip: !offerId });
  const [acceptOffer, { isLoading: isAccepting }] = useAcceptOfferMutation();
  const [rejectOffer, { isLoading: isRejecting }] = useRejectOfferMutation();
  const [rejectOpen, setRejectOpen] = useState(false);

  async function handleAccept() {
    try {
      await acceptOffer({ requestId, offerId }).unwrap();
      toast.success("Offer accepted");
      router.push(`/user/requests/requests_detail?requestId=${requestId}`);
    } catch {
      toast.error("Unable to accept this offer");
    }
  }

  async function handleReject() {
    setRejectOpen(false);
    try {
      await rejectOffer({ requestId, offerId }).unwrap();
      toast.success("Offer declined");
      router.push(`/user/requests/requests_detail?requestId=${requestId}`);
    } catch {
      toast.error("Unable to decline this offer");
    }
  }

  if (isLoading) {
    return <main className="grid min-h-[60vh] place-items-center bg-[#F2F4F7] text-slate-400">Loading offer...</main>;
  }

  if (isError || !offer) {
    return (
      <main className="grid min-h-[60vh] place-items-center bg-[#F2F4F7] px-6">
        <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-lg font-bold text-[#1A2340]">Unable to load this offer</h1>
          <button type="button" onClick={() => refetch()} className="mt-4 rounded-xl bg-[#E8402C] px-5 py-2.5 text-sm font-semibold text-white">Try again</button>
        </div>
      </main>
    );
  }

  const isDecided = offer.status !== "PENDING";

  return (
    <div className="min-h-screen bg-[#F2F4F7] text-[#1A2340]">
      <main className="mx-auto max-w-6xl px-6 pb-20 pt-8">
        <Link href={`/user/requests/requests_detail?requestId=${requestId}`} className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#1A2340]">
          <ArrowLeft className="h-4 w-4" />
          Back to Request Details
        </Link>

        <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
          <span className="text-[#1A2E6B]">Offer for </span>
          <span className="text-[#E8402C]">{offer.itemTitle || "your request"}</span>
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Status: <span className="font-semibold text-[#1A2340]">{offer.status}</span>
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="rounded-2xl bg-white p-6 shadow-[0_4px_24px_rgba(20,30,60,0.06)] sm:p-8">
            <div className="rounded-r-lg border-l-4 border-[#E8402C] bg-[#F7F9FE] px-5 py-4">
              <p className="text-sm italic text-gray-600">
                &ldquo;{offer.message || "The owner didn't include a message with this offer."}&rdquo;
              </p>
            </div>

            <div className="mt-6 grid gap-6 border-t border-gray-100 pt-6 sm:grid-cols-2">
              <div>
                <p className="text-[11px] font-bold tracking-wide text-gray-400">OFFERED PRICE</p>
                <p className="mt-1 text-2xl font-bold text-[#E8402C]">{formatMoney(offer.offeredPrice, offer.currency)}</p>
              </div>
              <div>
                <p className="text-[11px] font-bold tracking-wide text-gray-400">SUBMITTED</p>
                <p className="mt-1 text-sm font-semibold text-[#1A2340]">{offer.createdAt ? new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(offer.createdAt)) : "-"}</p>
              </div>
            </div>
          </div>

          <aside className="h-fit rounded-2xl bg-white p-6 shadow-[0_4px_24px_rgba(20,30,60,0.06)]">
            <p className="text-sm font-bold text-[#1A2340]">Offer summary</p>
            <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
              <span className="text-sm font-bold text-[#1A2340]">Total Price</span>
              <span className="text-2xl font-extrabold text-[#E8402C]">{formatMoney(offer.offeredPrice, offer.currency)}</span>
            </div>

            {isDecided ? (
              <p className="mt-5 rounded-xl bg-slate-50 px-4 py-3 text-center text-sm font-semibold text-slate-600">
                This offer has already been {offer.status?.toLowerCase()}.
              </p>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleAccept}
                  disabled={isAccepting}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#E8402C] py-3 text-sm font-semibold text-white hover:bg-[#d6371f] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isAccepting ? "Accepting..." : "Accept Offer"}
                  <CheckCircle2 className="h-4 w-4" />
                </button>

                <AlertDialog open={rejectOpen} onOpenChange={setRejectOpen}>
                  <AlertDialogTrigger
                    render={
                      <button type="button" className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 py-3 text-sm font-semibold text-[#1A2340] hover:bg-gray-50">
                        <XCircle className="h-4 w-4" />
                        Decline Offer
                      </button>
                    }
                  />
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Decline this offer?</AlertDialogTitle>
                      <AlertDialogDescription>The owner will be notified their offer was declined.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Keep offer</AlertDialogCancel>
                      <AlertDialogAction onClick={handleReject} disabled={isRejecting}>{isRejecting ? "Declining..." : "Decline offer"}</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}

            <div className="mt-5 flex gap-3 rounded-xl border border-gray-100 bg-[#F7F9FE] p-4">
              <ShieldCheck className="h-5 w-5 shrink-0 text-[#1A2E6B]" />
              <div>
                <p className="text-xs font-bold text-[#1A2340]">RentDirect Guarantee</p>
                <p className="mt-1 text-xs text-gray-500">Your payment is held securely and only released after you receive the item.</p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
              <span className="flex items-center gap-1"><Lock className="h-3.5 w-3.5" />Secure Payment</span>
              <span className="flex items-center gap-1"><Headset className="h-3.5 w-3.5" />24/7 Support</span>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
