"use client";

import { useState } from "react";
import Link from "next/link";
import { CalendarDays, HeartHandshake, MapPin } from "lucide-react";
import type { BookingResponse, BookingStatus } from "@/lib/types/vendor.types";
import { useGetItemQuery } from "@/redux/services/itemApi";
import { useGetMyBookingsQuery } from "@/redux/services/renterApi";

const FALLBACK_IMAGE = "/img/electronics.png";
const TABS = [
  { id: "all", label: "All" },
  { id: "upcoming", label: "Upcoming" },
  { id: "active", label: "Active" },
  { id: "overdue", label: "Overdue" },
  { id: "pasts", label: "Pasts" },
] as const;
type TabId = (typeof TABS)[number]["id"];

function bookingGroup(status: BookingStatus): Exclude<TabId, "all"> {
  if (status === "PENDING" || status === "APPROVED") return "upcoming";
  if (status === "RENTED") return "active";
  if (status === "EXPIRED") return "overdue";
  return "pasts";
}

function statusStyle(status: BookingStatus) {
  if (status === "COMPLETED") return "bg-emerald-100 text-emerald-600";
  if (status === "PENDING" || status === "APPROVED") return "bg-blue-100 text-blue-600";
  if (status === "RENTED") return "bg-amber-100 text-amber-700";
  if (status === "EXPIRED" || status === "REJECTED") return "bg-red-100 text-red-600";
  return "bg-slate-100 text-slate-600";
}

function formatLabel(value: string) {
  return value.toLowerCase().replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDate(value: string) {
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

export default function MyBookingPage() {
  const [activeTab, setActiveTab] = useState<TabId>("all");
  const { data: bookings = [], isLoading, isError, refetch } = useGetMyBookingsQuery(undefined, {
    pollingInterval: 15000,
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });
  const filteredBookings = bookings.filter((booking) => activeTab === "all" || bookingGroup(booking.status) === activeTab);

  return (
    <main className="min-h-screen bg-[#f8fafc] px-6 pb-20 pt-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6"><h1 className="text-3xl font-extrabold tracking-tight"><span className="text-[#253C95]">My </span><span className="text-[#F73030]">Booking</span></h1><p className="mt-1 text-sm text-slate-400">Manage and track all your past and upcoming rental experiences.</p></div>
        <div className="mb-6 border-b border-slate-200"><nav className="-mb-px flex gap-8 overflow-x-auto">{TABS.map((tab) => <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`pb-3 text-sm font-semibold transition-colors ${activeTab === tab.id ? "border-b-2 border-new-red text-slate-800" : "text-slate-400 hover:text-slate-600"}`}>{tab.label}</button>)}</nav></div>

        {isLoading ? (
          <div className="space-y-4">{Array.from({ length: 3 }, (_, index) => <div key={index} className="h-48 animate-pulse rounded-2xl bg-white" />)}</div>
        ) : isError ? (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-10 text-center"><p className="text-sm font-semibold text-red-700">Unable to load your bookings.</p><button type="button" onClick={() => refetch()} className="mt-4 rounded-xl bg-[#F73030] px-5 py-2.5 text-sm font-semibold text-white">Try again</button></div>
        ) : filteredBookings.length === 0 ? (
          <div className="rounded-2xl border border-slate-100 bg-white p-12 text-center text-slate-400"><HeartHandshake className="mx-auto mb-3 size-9 text-slate-300" /><p className="text-sm font-medium">No bookings found in this section.</p></div>
        ) : (
          <div className="space-y-4">{filteredBookings.map((booking) => <BookingCard key={booking.id} booking={booking} />)}</div>
        )}
      </div>
    </main>
  );
}

function BookingCard({ booking }: { booking: BookingResponse }) {
  const { data: item, isLoading } = useGetItemQuery(booking.itemId);
  const image = item?.primaryImageUrl ?? item?.images?.find((entry) => entry.primary)?.imageUrl ?? item?.images?.[0]?.imageUrl ?? FALLBACK_IMAGE;

  return (
    <article className="relative flex flex-col gap-6 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:shadow-md sm:flex-row sm:items-center">
      <div className="relative flex h-36 w-full shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-50 p-2 sm:w-44">
        {isLoading ? <div className="size-full animate-pulse rounded-lg bg-slate-100" /> : <img src={image} alt={item?.title || "Rental item"} className="size-full object-contain" />}
        <span className={`absolute left-2 top-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${statusStyle(booking.status)}`}><span className="size-1.5 rounded-full bg-current" />{formatLabel(booking.status)}</span>
      </div>
      <div className="flex flex-1 flex-col justify-between">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
          <div><h2 className="text-lg font-bold text-slate-800">{item?.title || `Booking ${booking.bookingRef || booking.id.slice(0, 8)}`}</h2><p className="mt-0.5 flex items-center gap-1 text-xs text-slate-400"><MapPin className="size-3 text-slate-300" />{item?.locationText || "Location unavailable"}</p></div>
          <div className="text-left sm:text-right"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total · {formatLabel(booking.paymentStatus || "UNPAID")}</p><p className="text-xl font-extrabold text-slate-800">{formatMoney(booking.totalAmount, booking.currency)}</p></div>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2"><DateBox label="Start Date" value={formatDate(booking.rentalStart)} /><DateBox label="End Date" value={formatDate(booking.rentalEnd)} /></div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-1"><div className="flex flex-wrap gap-2"><Link href={`/user/profile/my-booking/detail?bookingId=${booking.id}`} className="rounded-xl bg-[#253C95] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#1e3179]">View Booking</Link><Link href={`/items/${booking.itemId}`} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50">View Item Details</Link></div><span className="text-xs font-medium text-slate-400">{booking.rentalDays ?? "–"} rental days</span></div>
      </div>
    </article>
  );
}

function DateBox({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-2.5"><CalendarDays className="size-4 text-slate-400" /><div><p className="text-[10px] font-medium text-slate-400">{label}</p><p className="text-xs font-bold text-slate-800">{value}</p></div></div>;
}
