"use client";

import { Suspense, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  AlertTriangle,
  ArrowLeft,
  CalendarDays,
  Camera,
  ClipboardList,
  Download,
  Loader2,
  MapPin,
  QrCode,
  Star,
  X,
} from "lucide-react";
import type { BookingResponse, BookingStatus, DisputeResponse } from "@/lib/types/vendor.types";
import type { Item } from "@/lib/types/item.types";
import { useGetItemQuery } from "@/redux/services/itemApi";
import { useGetMyProfileQuery, useGetMyReviewsQuery, useGetPublicUserProfileQuery } from "@/redux/services/userApi";
import { openBookingDocument } from "@/lib/booking-document";
import {
  useAddInspectionImagesMutation,
  useCreateBookingDisputeMutation,
  useCreateInspectionMutation,
  useDeleteInspectionImageMutation,
  useGetBookingDisputesQuery,
  useGetBookingQrCodeQuery,
  useGetBookingQuery,
  useGetBookingStatusHistoryQuery,
  useGetDisputeQuery,
  useGetInspectionImagesQuery,
  useGetInspectionQuery,
  useUpdateBookingStatusMutation,
  useUpdateDisputeMutation,
  useUpdateInspectionMutation,
  useUploadImageMutation,
} from "@/redux/services/renterApi";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

const FALLBACK_IMAGE = "/img/electronics.png";
const DISPUTE_TYPES = [
  { value: "ITEM_NOT_AS_DESCRIBED", label: "Item not as described" },
  { value: "DAMAGE", label: "Damage dispute" },
  { value: "LATE_RETURN", label: "Late return" },
  { value: "PAYMENT_ISSUE", label: "Payment issue" },
  { value: "OTHER", label: "Other" },
];

function statusStyle(status: BookingStatus) {
  if (status === "COMPLETED") return "bg-emerald-100 text-emerald-600";
  if (status === "PENDING" || status === "APPROVED") return "bg-blue-100 text-blue-600";
  if (status === "RENTED") return "bg-amber-100 text-amber-700";
  if (status === "EXPIRED" || status === "REJECTED" || status === "CANCELLED") return "bg-red-100 text-red-600";
  return "bg-slate-100 text-slate-600";
}

function formatLabel(value?: string) {
  if (!value) return "";
  return value.toLowerCase().replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDateTime(value?: string) {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" }).format(date);
}

function formatDate(value?: string) {
  if (!value) return "-";
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(date);
}

function formatMoney(amount = 0, currency = "USD") {
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
  } catch {
    return `$${amount.toFixed(2)}`;
  }
}


export default function BookingDetailPage() {
  return (
    <Suspense fallback={<main className="grid min-h-[60vh] place-items-center bg-[#f8fafc] text-slate-400">Loading booking...</main>}>
      <BookingDetailContent />
    </Suspense>
  );
}

function BookingDetailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookingId = searchParams.get("bookingId") || "";

  const { data: booking, isLoading, isError, refetch } = useGetBookingQuery(bookingId, { skip: !bookingId, pollingInterval: 10000, refetchOnFocus: true });
  const { data: item } = useGetItemQuery(booking?.itemId ?? "", { skip: !booking?.itemId });
  const { data: history = [] } = useGetBookingStatusHistoryQuery(bookingId, { skip: !bookingId, pollingInterval: 10000 });
  const { data: myReviews } = useGetMyReviewsQuery({ page: 0, size: 100 });
  const alreadyReviewed = (myReviews?.content ?? []).some((review: { bookingId?: string }) => review.bookingId === bookingId);

  const [updateStatus, { isLoading: isCancelling }] = useUpdateBookingStatusMutation();
  const [cancelOpen, setCancelOpen] = useState(false);

  if (isLoading) return <DetailSkeleton />;
  if (isError || !booking) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-[#f8fafc] px-6">
        <div className="max-w-md rounded-3xl border border-slate-200 bg-white p-9 text-center shadow-sm">
          <AlertTriangle className="mx-auto size-9 text-slate-300" />
          <h1 className="mt-4 text-xl font-bold text-slate-900">Unable to load this booking</h1>
          <button type="button" onClick={() => refetch()} className="mt-5 rounded-xl bg-[#F73030] px-5 py-2.5 text-sm font-bold text-white">Try again</button>
        </div>
      </main>
    );
  }

  const canCancel = booking.status === "PENDING" || booking.status === "APPROVED";
  const canReview = booking.status === "COMPLETED" && !alreadyReviewed;
  const image = item?.primaryImageUrl ?? item?.images?.find((entry) => entry.primary)?.imageUrl ?? item?.images?.[0]?.imageUrl ?? FALLBACK_IMAGE;

  async function handleCancel() {
    setCancelOpen(false);
    try {
      await updateStatus({ id: bookingId, body: { status: "CANCELLED", reason: "Cancelled by renter" } }).unwrap();
      toast.success("Booking cancelled");
    } catch {
      toast.error("Unable to cancel this booking");
    }
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] px-6 pb-20 pt-10">
      <div className="mx-auto max-w-5xl">
        <button type="button" onClick={() => router.back()} className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#253C95]">
          <ArrowLeft className="size-4" /> Back to bookings
        </button>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <section className="flex flex-col gap-5 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:flex-row">
              <div className="relative h-32 w-full shrink-0 overflow-hidden rounded-xl bg-slate-50 sm:w-40">
                <img src={image} alt={item?.title || "Rental item"} className="size-full object-contain p-2" />
              </div>
              <div className="flex-1">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${statusStyle(booking.status)}`}>{formatLabel(booking.status)}</span>
                <h1 className="mt-2 text-xl font-bold text-slate-900">{item?.title || `Booking ${booking.bookingRef || booking.id.slice(0, 8)}`}</h1>
                <p className="mt-1 flex items-center gap-1 text-xs text-slate-400"><MapPin className="size-3.5" />{item?.locationText || "Location unavailable"}</p>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <DateBox label="Start" value={formatDate(booking.rentalStart)} />
                  <DateBox label="End" value={formatDate(booking.rentalEnd)} />
                </div>
              </div>
            </section>

            <StatusHistorySection history={history} />
            <InspectionSection bookingId={bookingId} status={booking.status} />
            <DisputeSection bookingId={bookingId} />
          </div>

          <aside className="space-y-5">
            <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <h2 className="text-sm font-bold text-slate-800">Payment summary</h2>
              <div className="mt-4 space-y-2.5 text-sm">
                <Row label={`${formatMoney(booking.bookedPricePerDay, booking.currency)} × ${booking.rentalDays ?? 0} days`} value={formatMoney(booking.subtotal, booking.currency)} />
                <Row label="Security deposit" value={formatMoney(booking.securityDeposit, booking.currency)} />
                <div className="border-t border-slate-100 pt-2.5">
                  <Row label="Total" value={formatMoney(booking.totalAmount, booking.currency)} bold />
                </div>
                <p className="text-xs font-semibold text-slate-400">Payment: {formatLabel(booking.paymentStatus || "UNPAID")}</p>
              </div>

              <div className="mt-5 space-y-2 border-t border-slate-100 pt-5">
                <BookingDocumentButton booking={booking} item={item} kind="receipt" label="View receipt" />
                <BookingDocumentButton booking={booking} item={item} kind="invoice" label="View invoice" />
              </div>

              {canReview ? (
                <Link href={`/user/profile/review?bookingId=${encodeURIComponent(bookingId)}`} className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#253C95] text-sm font-bold text-white hover:bg-[#1e3179]">
                  <Star className="size-4" /> Leave a review
                </Link>
              ) : null}

              {canCancel ? (
                <AlertDialog open={cancelOpen} onOpenChange={setCancelOpen}>
                  <AlertDialogTrigger
                    render={
                      <button type="button" className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-red-200 text-sm font-bold text-new-red hover:bg-red-50">
                        Cancel booking
                      </button>
                    }
                  />
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Cancel this booking?</AlertDialogTitle>
                      <AlertDialogDescription>This will notify the owner and release the requested dates. This cannot be undone.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Keep booking</AlertDialogCancel>
                      <AlertDialogAction onClick={handleCancel} disabled={isCancelling}>{isCancelling ? "Cancelling..." : "Cancel booking"}</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ) : null}
            </section>

            {booking.status === "RENTED" || booking.status === "APPROVED" ? <QrCodeCard bookingId={bookingId} /> : null}
          </aside>
        </div>
      </div>
    </main>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className={bold ? "font-bold text-slate-800" : "text-slate-500"}>{label}</span>
      <span className={bold ? "font-bold text-[#F73030]" : "font-semibold text-slate-700"}>{value}</span>
    </div>
  );
}

function DateBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl bg-slate-50 px-3.5 py-2.5">
      <CalendarDays className="size-4 text-slate-400" />
      <div>
        <p className="text-[10px] font-medium text-slate-400">{label}</p>
        <p className="text-xs font-bold text-slate-800">{value}</p>
      </div>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <main className="min-h-screen bg-[#f8fafc] px-6 py-10">
      <div className="mx-auto max-w-5xl animate-pulse space-y-6">
        <div className="h-32 rounded-2xl bg-white" />
        <div className="h-48 rounded-2xl bg-white" />
      </div>
    </main>
  );
}

function BookingDocumentButton({ booking, item, kind, label }: { booking: BookingResponse; item?: Item; kind: "receipt" | "invoice"; label: string }) {
  const { data: myProfile } = useGetMyProfileQuery();
  const { data: ownerProfile } = useGetPublicUserProfileQuery(booking.ownerId ?? "", { skip: !booking.ownerId });
  const [isOpening, setIsOpening] = useState(false);

  function handleClick() {
    setIsOpening(true);
    try {
      const renterName = [myProfile?.firstName, myProfile?.lastName].filter(Boolean).join(" ") || myProfile?.username || "Renter";
      const ownerName = [ownerProfile?.firstName, ownerProfile?.lastName].filter(Boolean).join(" ") || ownerProfile?.username || "Rentiq vendor";
      const opened = openBookingDocument(
        kind,
        booking,
        { title: item?.title || "Rental item", locationText: item?.locationText },
        { name: renterName, email: myProfile?.email },
        { name: ownerName },
      );
      if (!opened) toast.error("Please allow pop-ups to view this document");
    } finally {
      setIsOpening(false);
    }
  }

  return (
    <button type="button" onClick={handleClick} disabled={isOpening} className="flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60">
      {isOpening ? <Loader2 className="size-3.5 animate-spin" /> : <Download className="size-3.5" />}
      {label}
    </button>
  );
}

function QrCodeCard({ bookingId }: { bookingId: string }) {
  const { data, isLoading } = useGetBookingQrCodeQuery(bookingId);
  if (isLoading || !data?.qrImageBase64) return null;
  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-6 text-center shadow-sm">
      <h2 className="flex items-center justify-center gap-2 text-sm font-bold text-slate-800"><QrCode className="size-4" /> Handover QR code</h2>
      <img src={`data:image/png;base64,${data.qrImageBase64}`} alt="Booking QR code" className="mx-auto mt-4 size-40" />
      <p className="mt-3 text-xs text-slate-400">Show this to the owner at pickup or return.</p>
    </section>
  );
}

function StatusHistorySection({ history }: { history: Array<{ id: string; newStatus: BookingStatus; reason?: string; createdAt?: string }> }) {
  if (!history.length) return null;
  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <h2 className="flex items-center gap-2 text-sm font-bold text-slate-800"><ClipboardList className="size-4 text-[#253C95]" /> Status timeline</h2>
      <ol className="mt-4 space-y-4 border-l border-slate-100 pl-4">
        {history.map((entry) => (
          <li key={entry.id} className="relative">
            <span className="absolute -left-[21px] top-1 size-2.5 rounded-full bg-[#253C95]" />
            <p className="text-sm font-bold text-slate-800">{formatLabel(entry.newStatus)}</p>
            {entry.reason ? <p className="text-xs text-slate-500">{entry.reason}</p> : null}
            <p className="text-[11px] text-slate-400">{formatDateTime(entry.createdAt)}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function InspectionSection({ bookingId, status }: { bookingId: string; status: BookingStatus }) {
  const { data: inspection, isError } = useGetInspectionQuery(bookingId);
  const { data: images = [] } = useGetInspectionImagesQuery(bookingId, { skip: !inspection });
  const [createInspection] = useCreateInspectionMutation();
  const [updateInspection] = useUpdateInspectionMutation();
  const [addImages, { isLoading: isUploadingRef }] = useAddInspectionImagesMutation();
  const [deleteImage] = useDeleteInspectionImageMutation();
  const [uploadImage] = useUploadImageMutation();
  const [notes, setNotes] = useState("");
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [uploadedImageIds, setUploadedImageIds] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canDocument = status === "RENTED" || status === "APPROVED";
  const noteField: "checkInNotes" | "checkOutNotes" = status === "RENTED" ? "checkOutNotes" : "checkInNotes";

  async function handleSaveNotes() {
    if (!notes.trim()) return;
    setIsSavingNotes(true);
    try {
      if (inspection) await updateInspection({ id: bookingId, body: { [noteField]: notes } }).unwrap();
      else await createInspection({ id: bookingId, body: { [noteField]: notes } }).unwrap();
      toast.success("Condition notes saved");
      setNotes("");
    } catch {
      toast.error("Unable to save notes");
    } finally {
      setIsSavingNotes(false);
    }
  }

  async function handleFiles(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files?.length) return;
    setIsUploading(true);
    try {
      const uploads = await Promise.all(Array.from(files).map((file) => {
        const body = new FormData();
        body.append("file", file);
        return uploadImage(body).unwrap();
      }));
      const imageEntries = uploads.map((upload) => ({ imageName: upload.imageUrl || upload.id, type: status === "RENTED" ? "CHECK_OUT" : "CHECK_IN" }));
      const added = await addImages({ id: bookingId, body: { images: imageEntries } }).unwrap();
      setUploadedImageIds((current) => [...current, ...added.map((entry) => entry.id)]);
      toast.success("Photos added");
    } catch {
      toast.error("Unable to upload photos");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleDeleteImage(imageId: string) {
    try {
      await deleteImage({ id: bookingId, imageId }).unwrap();
      setUploadedImageIds((current) => current.filter((id) => id !== imageId));
    } catch {
      toast.error("Unable to remove photo");
    }
  }

  if (isError && !canDocument) return null;

  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <h2 className="flex items-center gap-2 text-sm font-bold text-slate-800"><Camera className="size-4 text-[#253C95]" /> Condition report</h2>

      {inspection?.checkInNotes ? <NoteBlock label="Check-in notes" value={inspection.checkInNotes} /> : null}
      {inspection?.checkOutNotes ? <NoteBlock label="Check-out notes" value={inspection.checkOutNotes} /> : null}

      {images.length ? (
        <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
          {images.map((img) => (
            <div key={img.id} className="group relative aspect-square overflow-hidden rounded-lg bg-slate-100">
              <img src={img.imageName} alt="Condition photo" className="size-full object-cover" />
              {uploadedImageIds.includes(img.id) ? (
                <button type="button" onClick={() => handleDeleteImage(img.id)} className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition group-hover:opacity-100">
                  <X className="size-3" />
                </button>
              ) : null}
            </div>
          ))}
        </div>
      ) : !inspection ? (
        <p className="mt-3 text-xs text-slate-400">No condition report has been added yet.</p>
      ) : null}

      {canDocument ? (
        <div className="mt-4 space-y-3 border-t border-slate-100 pt-4">
          <Textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder={`Add your ${status === "RENTED" ? "return" : "pickup"} condition notes...`} rows={2} />
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={handleSaveNotes} disabled={isSavingNotes || !notes.trim()} className="rounded-lg bg-slate-800 px-3.5 py-2 text-xs font-semibold text-white disabled:opacity-50">
              {isSavingNotes ? "Saving..." : "Save notes"}
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFiles} className="hidden" id="inspection-photo-input" />
            <label htmlFor="inspection-photo-input" className="cursor-pointer rounded-lg border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
              {isUploading || isUploadingRef ? "Uploading..." : "Add photos"}
            </label>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function NoteBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="mt-3 rounded-xl bg-slate-50 p-3.5">
      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 text-sm text-slate-700">{value}</p>
    </div>
  );
}

function DisputeSection({ bookingId }: { bookingId: string }) {
  const { data: disputes = [] } = useGetBookingDisputesQuery(bookingId);
  const [createDispute, { isLoading }] = useCreateBookingDisputeMutation();
  const [open, setOpen] = useState(false);
  const [disputeType, setDisputeType] = useState(DISPUTE_TYPES[0].value);
  const [description, setDescription] = useState("");

  async function handleSubmit() {
    if (!description.trim()) return;
    try {
      await createDispute({ id: bookingId, body: { disputeType, description } }).unwrap();
      toast.success("Dispute submitted");
      setOpen(false);
      setDescription("");
    } catch {
      toast.error("Unable to submit dispute");
    }
  }

  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-sm font-bold text-slate-800"><AlertTriangle className="size-4 text-new-red" /> Disputes</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<button type="button" className="text-xs font-bold text-new-red hover:underline">Report a problem</button>} />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Report a problem with this booking</DialogTitle>
              <DialogDescription>Tell us what happened. Our team will review and help resolve it.</DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <select value={disputeType} onChange={(event) => setDisputeType(event.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm">
                {DISPUTE_TYPES.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}
              </select>
              <Textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Describe the issue in detail..." rows={4} maxLength={2000} />
            </div>
            <DialogFooter>
              <button type="button" onClick={handleSubmit} disabled={isLoading || !description.trim()} className="flex h-10 items-center justify-center gap-2 rounded-xl bg-new-red px-5 text-sm font-bold text-white disabled:opacity-60">
                {isLoading ? "Submitting..." : "Submit report"}
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {disputes.length ? (
        <div className="mt-4 space-y-3">
          {disputes.map((dispute) => <DisputeRow key={dispute.id} disputeId={dispute.id} summary={dispute} />)}
        </div>
      ) : (
        <p className="mt-3 text-xs text-slate-400">No disputes reported for this booking.</p>
      )}
    </section>
  );
}

function DisputeRow({ disputeId, summary }: { disputeId: string; summary: DisputeResponse }) {
  const isOpen = !summary.status || summary.status.toUpperCase() === "OPEN" || summary.status.toUpperCase() === "PENDING";
  const [isEditing, setIsEditing] = useState(false);
  const { data: detail } = useGetDisputeQuery(disputeId, { skip: !isEditing });
  const [updateDispute, { isLoading }] = useUpdateDisputeMutation();
  const [description, setDescription] = useState(summary.description ?? "");

  function startEditing() {
    setDescription(detail?.description ?? summary.description ?? "");
    setIsEditing(true);
  }

  async function handleSave() {
    if (!description.trim()) return;
    try {
      await updateDispute({ id: disputeId, body: { description } }).unwrap();
      toast.success("Dispute updated");
      setIsEditing(false);
    } catch {
      toast.error("Unable to update dispute");
    }
  }

  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-800">{formatLabel(summary.disputeType)}</span>
        <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-slate-600">{formatLabel(summary.status) || "Open"}</span>
      </div>

      {isEditing ? (
        <div className="mt-2 space-y-2">
          <Textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={3} maxLength={2000} />
          <div className="flex gap-2">
            <button type="button" onClick={handleSave} disabled={isLoading || !description.trim()} className="rounded-lg bg-slate-800 px-3 py-1.5 text-[11px] font-bold text-white disabled:opacity-50">{isLoading ? "Saving..." : "Save"}</button>
            <button type="button" onClick={() => setIsEditing(false)} className="rounded-lg border border-slate-200 px-3 py-1.5 text-[11px] font-bold text-slate-600">Cancel</button>
          </div>
        </div>
      ) : (
        <>
          <p className="mt-1.5 text-xs text-slate-600">{summary.description}</p>
          <div className="mt-1.5 flex items-center justify-between">
            <p className="text-[11px] text-slate-400">{formatDateTime(summary.createdAt)}</p>
            {isOpen ? <button type="button" onClick={startEditing} className="text-[11px] font-bold text-[#253C95] hover:underline">Edit</button> : null}
          </div>
        </>
      )}
    </div>
  );
}
