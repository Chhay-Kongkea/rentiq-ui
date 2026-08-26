"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { ArrowRight, CalendarDays, CheckCircle2, ClipboardCheck, Clock3, MapPin, ShieldCheck } from "lucide-react";
import { useGetItemQuery } from "@/redux/services/itemApi";
import Footer from "@/components/footer";

export default function BookingConfirmationPage() {
  return (
    <Suspense fallback={null}>
      <BookingConfirmationPageContent />
    </Suspense>
  );
}

function BookingConfirmationPageContent() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId") || "Pending";
  const start = searchParams.get("start") || "-";
  const end = searchParams.get("end") || "-";
  const { data: item, isLoading } = useGetItemQuery(id);
  const days = start !== "-" && end !== "-" ? Math.max(1, Math.ceil((new Date(end).getTime() - new Date(start).getTime()) / 86400000)) : 0;
  const total = days * (item?.pricePerDay ?? 0);

  return <><main className="min-h-[65vh] bg-[#f7f8fb] px-4 py-12 sm:px-8"><div className="mx-auto max-w-3xl"><div className="text-center"><span className="mx-auto flex size-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600"><CheckCircle2 className="size-11" strokeWidth={1.8} /></span><p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-emerald-600">Booking request sent</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-[#253C95] sm:text-4xl">Your booking is confirmed</h1><p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500">The owner has received your request. We&apos;ll notify you when they review and respond to your booking.</p></div><section className="mt-10 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"><div className="flex flex-col gap-5 border-b border-slate-100 p-6 sm:flex-row sm:items-center sm:p-8"><div className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-slate-50"><img src={item?.primaryImageUrl || item?.images?.[0]?.imageUrl || "/img/electronics.png"} alt={item?.title || "Rental item"} className="size-full object-contain" /></div><div className="flex-1"><p className="text-xs font-bold uppercase tracking-wide text-slate-400">Rental item</p><h2 className="mt-1 text-xl font-bold text-slate-900">{isLoading ? "Loading item..." : item?.title || "Rental item"}</h2><p className="mt-2 flex items-center gap-1.5 text-sm text-slate-500"><MapPin className="size-4 text-[#F73030]" />{item?.locationText || "Location unavailable"}</p></div><div className="rounded-xl bg-blue-50 px-4 py-3 text-left sm:text-right"><p className="text-[10px] font-bold uppercase tracking-wide text-[#253C95]">Booking reference</p><p className="mt-1 font-mono text-sm font-bold text-[#253C95]">{bookingId}</p></div></div><div className="grid gap-4 p-6 sm:grid-cols-3 sm:p-8"><div className="rounded-2xl bg-slate-50 p-4"><CalendarDays className="size-5 text-[#253C95]" /><p className="mt-3 text-xs text-slate-400">Rental period</p><p className="mt-1 text-sm font-bold text-slate-800">{start} - {end}</p></div><div className="rounded-2xl bg-slate-50 p-4"><Clock3 className="size-5 text-[#253C95]" /><p className="mt-3 text-xs text-slate-400">Duration</p><p className="mt-1 text-sm font-bold text-slate-800">{days} day{days === 1 ? "" : "s"}</p></div><div className="rounded-2xl bg-slate-50 p-4"><ClipboardCheck className="size-5 text-[#F73030]" /><p className="mt-3 text-xs text-slate-400">Estimated total</p><p className="mt-1 text-sm font-bold text-[#F73030]">${total.toFixed(2)}</p></div></div></section><div className="mt-6 grid gap-4 sm:grid-cols-2"><div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5"><ShieldCheck className="size-5 text-emerald-600" /><h3 className="mt-3 font-bold text-emerald-900">Protected by Rentiq</h3><p className="mt-1 text-sm leading-6 text-emerald-800/80">Your booking and payment remain protected while the owner reviews your request.</p></div><div className="rounded-2xl border border-slate-200 bg-white p-5"><h3 className="font-bold text-slate-900">What&apos;s next?</h3><p className="mt-1 text-sm leading-6 text-slate-500">Check your bookings for updates and messages from the owner.</p></div></div><div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><Link href="/user/requests/myrequests" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#F73030] px-6 py-3 text-sm font-bold text-white hover:bg-[#dd2b2b]">View my bookings <ArrowRight className="size-4" /></Link><Link href="/items" className="inline-flex items-center justify-center rounded-xl border border-[#253C95] px-6 py-3 text-sm font-bold text-[#253C95] hover:bg-blue-50">Continue browsing</Link></div></div></main><Footer /></>;
}