"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  useAddVendorInspectionImagesMutation,
  useCreateVendorBookingDisputeMutation,
  useCreateVendorInspectionMutation,
  useDeleteVendorInspectionImageMutation,
  useGetVendorBookingDisputesQuery,
  useGetVendorBookingQrCodeQuery,
  useGetVendorBookingQuery,
  useGetVendorBookingStatusHistoryQuery,
  useGetVendorInspectionImagesQuery,
  useGetVendorInspectionQuery,
  useLazyGetVendorBookingInvoiceQuery,
  useLazyGetVendorBookingReceiptQuery,
  useScanVendorBookingQrCodeMutation,
  useUpdateVendorBookingStatusMutation,
  useUpdateVendorDisputeMutation,
  useUpdateVendorInspectionMutation,
  useUploadVendorImageMutation,
} from "@/redux/services/vendorApi";
import type { BookingResponse, BookingStatus } from "@/lib/types/vendor.types";

function money(value?: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(value ?? 0);
}

function apiMessage(error: unknown, fallback: string) {
  if (typeof error === "object" && error && "data" in error) {
    const data = (error as { data?: { message?: string } }).data;
    if (data?.message) return data.message;
  }
  return fallback;
}

function nextActions(booking?: BookingResponse): BookingStatus[] {
  switch (booking?.status) {
    case "PENDING":
      return ["APPROVED", "REJECTED"];
    case "APPROVED":
      return ["RENTED", "CANCELLED"];
    case "RENTED":
      return ["COMPLETED"];
    default:
      return [];
  }
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export default function VendorBookingDetailPage() {
  const params = useParams<{ id: string }>();
  const bookingId = params.id;

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { data: booking, isLoading } = useGetVendorBookingQuery(bookingId, { skip: !bookingId });
  const { data: history = [] } = useGetVendorBookingStatusHistoryQuery(bookingId, { skip: !bookingId });
  const { data: qrCode, isError: qrError, isLoading: qrLoading } = useGetVendorBookingQrCodeQuery(bookingId, { skip: !bookingId });
  const { data: inspection, isError: inspectionMissing } = useGetVendorInspectionQuery(bookingId, { skip: !bookingId });
  const { data: inspectionImages = [] } = useGetVendorInspectionImagesQuery(bookingId, { skip: !bookingId });
  const { data: disputes = [] } = useGetVendorBookingDisputesQuery(bookingId, { skip: !bookingId });

  const [updateStatus, updateState] = useUpdateVendorBookingStatusMutation();
  const [scanQrCode, scanState] = useScanVendorBookingQrCodeMutation();
  const [fetchReceipt, receiptState] = useLazyGetVendorBookingReceiptQuery();
  const [fetchInvoice, invoiceState] = useLazyGetVendorBookingInvoiceQuery();
  const [createInspection, createInspectionState] = useCreateVendorInspectionMutation();
  const [updateInspection, updateInspectionState] = useUpdateVendorInspectionMutation();
  const [uploadImage, uploadImageState] = useUploadVendorImageMutation();
  const [addInspectionImages, addImagesState] = useAddVendorInspectionImagesMutation();
  const [deleteInspectionImage] = useDeleteVendorInspectionImageMutation();
  const [createDispute, createDisputeState] = useCreateVendorBookingDisputeMutation();
  const [updateDispute] = useUpdateVendorDisputeMutation();

  const [scanToken, setScanToken] = useState("");
  const [imageType, setImageType] = useState<"CHECK_IN" | "CHECK_OUT">("CHECK_IN");

  function resetMessages() {
    setError("");
    setSuccess("");
  }

  async function changeStatus(status: BookingStatus) {
    resetMessages();
    let reason: string | undefined;
    if (["REJECTED", "CANCELLED"].includes(status)) {
      const entered = window.prompt(`Reason for ${status.toLowerCase()}?`);
      if (entered === null) return;
      reason = entered.trim() || undefined;
    }
    try {
      await updateStatus({ bookingId, body: { status, reason } }).unwrap();
      setSuccess(`Booking updated to ${status}.`);
    } catch (requestError) {
      setError(apiMessage(requestError, "Unable to update booking status."));
    }
  }

  async function handleScan(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    resetMessages();
    if (!scanToken.trim()) return;
    try {
      await scanQrCode({ qrToken: scanToken.trim() }).unwrap();
      setSuccess("QR code scanned — booking updated.");
      setScanToken("");
    } catch (requestError) {
      setError(apiMessage(requestError, "Unable to scan this QR code."));
    }
  }

  async function handleDownload(kind: "receipt" | "invoice") {
    resetMessages();
    try {
      const blob = kind === "receipt" ? await fetchReceipt(bookingId).unwrap() : await fetchInvoice(bookingId).unwrap();
      downloadBlob(blob, `${kind}-${booking?.bookingRef || bookingId}.pdf`);
    } catch (requestError) {
      setError(apiMessage(requestError, `Unable to download the ${kind}.`));
    }
  }

  async function handleInspectionSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    resetMessages();
    const form = new FormData(event.currentTarget);
    const body = {
      checkInNotes: String(form.get("checkInNotes") || "").trim() || undefined,
      checkOutNotes: String(form.get("checkOutNotes") || "").trim() || undefined,
    };
    try {
      if (inspection) {
        await updateInspection({ bookingId, body }).unwrap();
      } else {
        await createInspection({ bookingId, body }).unwrap();
      }
      setSuccess("Inspection notes saved.");
    } catch (requestError) {
      setError(apiMessage(requestError, "Unable to save inspection notes."));
    }
  }

  async function handleInspectionImageUpload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    resetMessages();
    const form = new FormData(event.currentTarget);
    const file = form.get("file");
    if (!(file instanceof File) || file.size === 0) {
      setError("Choose a photo to upload.");
      return;
    }
    try {
      const uploaded = await uploadImage(file).unwrap();
      // The inspection endpoint links photos by name only; we pass back the uploaded
      // asset's publicId so the backend can resolve it to the stored image.
      const imageName = uploaded.publicId || uploaded.id;
      await addInspectionImages({ bookingId, body: { images: [{ imageName, type: imageType }] } }).unwrap();
      event.currentTarget.reset();
      setSuccess("Inspection photo uploaded.");
    } catch (requestError) {
      setError(apiMessage(requestError, "Unable to upload inspection photo."));
    }
  }

  async function removeInspectionImage(imageId: string) {
    resetMessages();
    try {
      await deleteInspectionImage({ bookingId, imageId }).unwrap();
      setSuccess("Photo removed.");
    } catch (requestError) {
      setError(apiMessage(requestError, "Unable to remove photo."));
    }
  }

  async function handleDisputeSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    resetMessages();
    const form = new FormData(event.currentTarget);
    const disputeType = String(form.get("disputeType") || "").trim();
    const description = String(form.get("description") || "").trim();
    if (!disputeType || !description) {
      setError("Dispute type and description are required.");
      return;
    }
    try {
      await createDispute({ bookingId, body: { disputeType, description } }).unwrap();
      event.currentTarget.reset();
      setSuccess("Dispute opened.");
    } catch (requestError) {
      setError(apiMessage(requestError, "Unable to open dispute."));
    }
  }

  if (isLoading) {
    return <div className="mx-auto max-w-[1100px] rounded-2xl border bg-white p-6 text-sm text-slate-500">Loading booking...</div>;
  }

  if (!booking) {
    return <div className="mx-auto max-w-[1100px] rounded-2xl border bg-white p-6 text-sm text-slate-500">Booking not found.</div>;
  }

  const currency = booking.currency || "USD";
  const openDispute = disputes.find((dispute) => dispute.status && !["RESOLVED", "DISMISSED"].includes(dispute.status));

  return (
    <div className="mx-auto max-w-[1100px] space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link href="/vendor/dashboard/booking" className="text-xs font-semibold text-slate-500 hover:text-slate-700">&larr; Back to bookings</Link>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">{booking.bookingRef || booking.id}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-700">{booking.status}</span>
            {booking.paymentStatus ? <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-700">{booking.paymentStatus}</span> : null}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {nextActions(booking).map((status) => (
            <button
              key={status}
              onClick={() => changeStatus(status)}
              disabled={updateState.isLoading}
              className={`rounded-lg px-3 py-2 text-xs font-bold text-white disabled:opacity-50 ${status === "REJECTED" || status === "CANCELLED" ? "bg-slate-600" : "bg-[#F73030]"}`}
            >
              {status === "APPROVED" ? "Approve" : status === "RENTED" ? "Mark rented" : status === "COMPLETED" ? "Complete" : status === "REJECTED" ? "Reject" : "Cancel"}
            </button>
          ))}
        </div>
      </div>

      {error ? <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}
      {success ? <div className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">{success}</div> : null}

      <section className="grid gap-5 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
          <h2 className="font-bold text-slate-950">Booking summary</h2>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2">
            <div><dt className="text-xs font-semibold text-slate-400">Item</dt><dd className="mt-1 text-sm font-semibold text-slate-900">{booking.itemId}</dd></div>
            <div><dt className="text-xs font-semibold text-slate-400">Customer</dt><dd className="mt-1 text-sm font-semibold text-slate-900">{booking.customerId || "—"}</dd></div>
            <div><dt className="text-xs font-semibold text-slate-400">Rental period</dt><dd className="mt-1 text-sm font-semibold text-slate-900">{booking.rentalStart} → {booking.rentalEnd} ({booking.rentalDays ?? "?"} days)</dd></div>
            <div><dt className="text-xs font-semibold text-slate-400">Price / day</dt><dd className="mt-1 text-sm font-semibold text-slate-900">{money(booking.bookedPricePerDay, currency)}</dd></div>
            <div><dt className="text-xs font-semibold text-slate-400">Subtotal</dt><dd className="mt-1 text-sm font-semibold text-slate-900">{money(booking.subtotal, currency)}</dd></div>
            <div><dt className="text-xs font-semibold text-slate-400">Security deposit</dt><dd className="mt-1 text-sm font-semibold text-slate-900">{money(booking.securityDeposit, currency)}</dd></div>
            <div><dt className="text-xs font-semibold text-slate-400">Commission</dt><dd className="mt-1 text-sm font-semibold text-slate-900">{money(booking.commissionAmount, currency)} ({((booking.commissionRate ?? 0) * 100).toFixed(1)}%)</dd></div>
            <div><dt className="text-xs font-semibold text-slate-400">Total</dt><dd className="mt-1 text-lg font-extrabold text-[#F73030]">{money(booking.totalAmount, currency)}</dd></div>
          </dl>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-bold text-slate-950">Documents</h2>
          <p className="mt-1 text-xs text-slate-500">Download the customer-facing paperwork for this booking.</p>
          <div className="mt-4 flex flex-col gap-2">
            <button onClick={() => handleDownload("receipt")} disabled={receiptState.isFetching} className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 disabled:opacity-50">{receiptState.isFetching ? "Preparing..." : "Download receipt"}</button>
            <button onClick={() => handleDownload("invoice")} disabled={invoiceState.isFetching} className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 disabled:opacity-50">{invoiceState.isFetching ? "Preparing..." : "Download invoice"}</button>
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-bold text-slate-950">Status history</h2>
          <div className="mt-4 space-y-4">
            {history.map((entry) => (
              <div key={entry.id} className="flex gap-3">
                <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#253C95]" />
                <div>
                  <p className="text-sm font-semibold text-slate-900">{entry.oldStatus ? `${entry.oldStatus} → ${entry.newStatus}` : entry.newStatus}</p>
                  <p className="text-xs text-slate-500">{entry.createdAt ? new Date(entry.createdAt).toLocaleString() : ""}{entry.reason ? ` · ${entry.reason}` : ""}</p>
                </div>
              </div>
            ))}
            {!history.length ? <p className="text-sm text-slate-500">No status changes recorded yet.</p> : null}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-bold text-slate-950">QR check-in</h2>
          {qrLoading ? <p className="mt-3 text-sm text-slate-500">Loading QR code...</p> : null}
          {qrError ? <p className="mt-3 text-sm text-slate-500">A QR code is not available for this booking yet.</p> : null}
          {qrCode ? (
            <div className="mt-4 flex flex-col items-center gap-3 sm:flex-row sm:items-start">
              {qrCode.qrImageBase64 ? (
                <img src={`data:image/png;base64,${qrCode.qrImageBase64}`} alt="Booking QR code" className="h-32 w-32 rounded-lg border border-slate-200" />
              ) : null}
              <div className="text-xs text-slate-500">
                <p className="font-semibold text-slate-700">Show this to the renter, or scan their code below to confirm pickup/return.</p>
                {qrCode.expiresAt ? <p className="mt-1">Expires {new Date(qrCode.expiresAt).toLocaleString()}</p> : null}
              </div>
            </div>
          ) : null}

          <form onSubmit={handleScan} className="mt-4 flex gap-2">
            <input value={scanToken} onChange={(event) => setScanToken(event.target.value)} placeholder="Paste renter's QR token" className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm" />
            <button disabled={scanState.isLoading} className="rounded-lg bg-[#253C95] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{scanState.isLoading ? "Scanning..." : "Confirm"}</button>
          </form>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-bold text-slate-950">Inspection</h2>
        <p className="mt-1 text-xs text-slate-500">Record condition notes and photos at pickup (check-in) and return (check-out).</p>

        <form key={inspection?.id || "new"} onSubmit={handleInspectionSubmit} className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold text-slate-700">Check-in notes<textarea name="checkInNotes" rows={3} defaultValue={inspection?.checkInNotes || ""} className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal" /></label>
          <label className="text-sm font-semibold text-slate-700">Check-out notes<textarea name="checkOutNotes" rows={3} defaultValue={inspection?.checkOutNotes || ""} className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal" /></label>
          <div className="sm:col-span-2">
            <button disabled={createInspectionState.isLoading || updateInspectionState.isLoading} className="rounded-lg bg-[#253C95] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
              {createInspectionState.isLoading || updateInspectionState.isLoading ? "Saving..." : inspection ? "Save notes" : "Create inspection"}
            </button>
            {inspectionMissing ? <span className="ml-3 text-xs text-slate-400">No inspection recorded yet — saving will create one.</span> : null}
          </div>
        </form>

        <div className="mt-6">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-sm font-bold text-slate-900">Photos</h3>
            <select value={imageType} onChange={(event) => setImageType(event.target.value as "CHECK_IN" | "CHECK_OUT")} className="rounded-lg border border-slate-300 px-2 py-1.5 text-xs font-semibold text-slate-700">
              <option value="CHECK_IN">Check-in</option>
              <option value="CHECK_OUT">Check-out</option>
            </select>
          </div>
          <form onSubmit={handleInspectionImageUpload} className="mt-3 flex flex-col gap-3 sm:flex-row">
            <input name="file" type="file" accept="image/*" className="min-w-0 flex-1 rounded-lg border border-slate-300 p-2 text-sm" />
            <button disabled={uploadImageState.isLoading || addImagesState.isLoading} className="rounded-lg bg-[#253C95] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
              {uploadImageState.isLoading || addImagesState.isLoading ? "Uploading..." : "Upload photo"}
            </button>
          </form>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {inspectionImages.map((image) => (
              <div key={image.id} className="overflow-hidden rounded-xl border border-slate-200 p-3">
                <p className="truncate text-xs font-semibold text-slate-700">{image.imageName}</p>
                <p className="mt-1 text-[10px] font-bold text-slate-400">{image.type}</p>
                <button onClick={() => removeInspectionImage(image.id)} className="mt-2 text-[10px] font-bold text-red-600">Delete</button>
              </div>
            ))}
            {!inspectionImages.length ? <p className="col-span-full py-4 text-center text-sm text-slate-500">No photos uploaded.</p> : null}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-bold text-slate-950">Disputes</h2>
        <div className="mt-4 divide-y divide-slate-100">
          {disputes.map((dispute) => (
            <div key={dispute.id} className="py-3">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-semibold text-slate-900">{dispute.disputeType}</p>
                <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-600">{dispute.status || "OPEN"}</span>
              </div>
              <p className="mt-1 text-sm text-slate-600">{dispute.description}</p>
              {dispute.resolvedAt ? <p className="mt-1 text-xs text-slate-400">Resolved {new Date(dispute.resolvedAt).toLocaleString()}</p> : null}
              {dispute.status && !["RESOLVED", "DISMISSED"].includes(dispute.status) ? (
                <button
                  onClick={async () => {
                    const description = window.prompt("Update dispute description", dispute.description || "");
                    if (description === null) return;
                    try {
                      await updateDispute({ disputeId: dispute.id, bookingId, body: { description } }).unwrap();
                    } catch (requestError) {
                      setError(apiMessage(requestError, "Unable to update dispute."));
                    }
                  }}
                  className="mt-2 text-xs font-semibold text-[#253C95]"
                >
                  Edit
                </button>
              ) : null}
            </div>
          ))}
          {!disputes.length ? <p className="py-4 text-sm text-slate-500">No disputes on this booking.</p> : null}
        </div>

        {!openDispute ? (
          <form onSubmit={handleDisputeSubmit} className="mt-4 grid gap-3 sm:grid-cols-[200px_1fr_auto]">
            <input name="disputeType" placeholder="Dispute type" required className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
            <input name="description" placeholder="Describe the issue" required className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
            <button disabled={createDisputeState.isLoading} className="rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 disabled:opacity-50">{createDisputeState.isLoading ? "Opening..." : "Open dispute"}</button>
          </form>
        ) : null}
      </section>
    </div>
  );
}
