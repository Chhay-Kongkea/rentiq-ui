"use client";

import { useMemo, useState } from "react";
import {
  useGetVendorBookingsQuery,
  useGetVendorScheduleQuery,
  useUpdateVendorBookingStatusMutation,
} from "@/redux/services/vendorApi";
import type { BookingResponse, BookingStatus } from "@/lib/types/vendor.types";

const TABS: Array<"ALL" | BookingStatus> = ["ALL", "PENDING", "APPROVED", "RENTED", "COMPLETED", "REJECTED", "CANCELLED"];

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

function nextActions(booking: BookingResponse): BookingStatus[] {
  switch (booking.status) {
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

export default function VendorBookingPage() {
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("ALL");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { data: bookings = [], isLoading } = useGetVendorBookingsQuery();

  const today = new Date();
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().slice(0, 10);
  const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().slice(0, 10);
  const { data: schedule = [] } = useGetVendorScheduleQuery({ from: monthStart, to: monthEnd });
  const [updateStatus, updateState] = useUpdateVendorBookingStatusMutation();

  const filtered = useMemo(
    () => activeTab === "ALL" ? bookings : bookings.filter((booking) => booking.status === activeTab),
    [bookings, activeTab],
  );

  async function changeStatus(booking: BookingResponse, status: BookingStatus) {
    setError("");
    setSuccess("");
    let reason: string | undefined;
    if (["REJECTED", "CANCELLED"].includes(status)) {
      const entered = window.prompt(`Reason for ${status.toLowerCase()}?`);
      if (entered === null) return;
      reason = entered.trim() || undefined;
    }

    try {
      await updateStatus({ bookingId: booking.id, body: { status, reason } }).unwrap();
      setSuccess(`Booking ${booking.bookingRef || booking.id} updated to ${status}.`);
    } catch (requestError) {
      setError(apiMessage(requestError, "Unable to update booking status."));
    }
  }

  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-[#F73030]">Rental operations</p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">Bookings</h1>
          <p className="mt-1 text-sm text-slate-500">Approve, reject, start, and complete vendor bookings.</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm">
          <span className="text-slate-500">This month:</span>{" "}
          <strong className="text-slate-900">{schedule.length} scheduled</strong>
        </div>
      </div>

      {error ? <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}
      {success ? <div className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">{success}</div> : null}

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
        <div className="flex min-w-max gap-1">
          {TABS.map((tab) => {
            const count = tab === "ALL" ? bookings.length : bookings.filter((booking) => booking.status === tab).length;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${activeTab === tab ? "bg-[#253C95] text-white" : "text-slate-500 hover:bg-slate-50"}`}
              >
                {tab === "ALL" ? "All" : tab} <span className="ml-1 opacity-70">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {isLoading ? <p className="p-6 text-sm text-slate-500">Loading bookings...</p> : null}
        <div className="divide-y divide-slate-100">
          {filtered.map((booking) => (
            <article key={booking.id} className="p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-bold text-slate-950">{booking.bookingRef || booking.id}</h2>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-700">{booking.status}</span>
                    {booking.paymentStatus ? <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-700">{booking.paymentStatus}</span> : null}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-500">
                    <span>Item: {booking.itemId}</span>
                    <span>Customer: {booking.customerId || "—"}</span>
                    <span>{booking.rentalStart} → {booking.rentalEnd}</span>
                    <span>{booking.rentalDays ?? "?"} days</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="text-left sm:text-right">
                    <p className="text-lg font-extrabold text-slate-950">{money(booking.totalAmount, booking.currency || "USD")}</p>
                    <p className="text-xs text-slate-500">Deposit {money(booking.securityDeposit, booking.currency || "USD")}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {nextActions(booking).map((status) => (
                      <button
                        key={status}
                        onClick={() => changeStatus(booking, status)}
                        disabled={updateState.isLoading}
                        className={`rounded-lg px-3 py-2 text-xs font-bold text-white disabled:opacity-50 ${status === "REJECTED" || status === "CANCELLED" ? "bg-slate-600" : "bg-[#F73030]"}`}
                      >
                        {status === "APPROVED" ? "Approve" : status === "RENTED" ? "Mark rented" : status === "COMPLETED" ? "Complete" : status === "REJECTED" ? "Reject" : "Cancel"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
          {!isLoading && !filtered.length ? <p className="p-10 text-center text-sm text-slate-500">No bookings in this status.</p> : null}
        </div>
      </section>
    </div>
  );
}
