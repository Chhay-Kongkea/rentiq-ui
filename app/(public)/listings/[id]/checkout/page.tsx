"use client";

import { FormEvent, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CalendarDays, CheckCircle2, MapPin, ShieldCheck } from "lucide-react";
import { useGetItemQuery } from "@/redux/services/itemApi";
import { useCreateBookingMutation } from "@/redux/services/userApi";
import Footer from "@/components/footer";

export default function ItemCheckoutPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: item, isLoading, isError } = useGetItemQuery(id);
  const [createBooking, { isLoading: isBooking }] = useCreateBookingMutation();
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [error, setError] = useState("");

  const days = start && end && end >= start
    ? Math.max(1, Math.ceil((new Date(end).getTime() - new Date(start).getTime()) / 86400000))
    : 0;
  const subtotal = days * (item?.pricePerDay ?? 0);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!start || !end || end < start) { setError("Choose a valid rental period."); return; }
    setError("");
    try {
      await createBooking({ itemId: id, rentalStart: start, rentalEnd: end }).unwrap();
      router.push("/user/profile/my-booking");
    } catch { setError("Unable to create the rental request. Please try again."); }
  }

  if (isLoading) return <main className="grid min-h-[60vh] place-items-center bg-slate-50 text-slate-500">Loading rental details...</main>;
  if (isError || !item) return <main className="grid min-h-[60vh] place-items-center bg-slate-50 text-red-600">Unable to load this item.</main>;

  return <>
    <main className="bg-[#f7f8fb] px-4 py-8 pb-14 sm:px-8 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <button type="button" onClick={() => router.back()} className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-[#253C95]"><ArrowLeft className="size-4" /> Back to item</button>
        <div className="mb-8 flex items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#F73030]">Rental checkout</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-[#253C95] sm:text-4xl">Request to rent</h1><p className="mt-2 text-sm text-slate-500">Choose your dates and send a protected rental request.</p></div><div className="hidden items-center gap-2 text-xs font-semibold text-slate-400 sm:flex"><span className="flex size-7 items-center justify-center rounded-full bg-[#253C95] text-white">1</span><span className="h-px w-8 bg-slate-300" /><span>Review &amp; submit</span></div></div>
        <div className="grid gap-6 lg:grid-cols-[1fr_390px]">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-5 border-b border-slate-100 pb-7 sm:flex-row"><img src={item.primaryImageUrl || item.images?.[0]?.imageUrl || "/img/electronics.png"} alt={item.title || "Rental item"} className="h-40 w-full rounded-2xl bg-slate-50 object-contain sm:w-52" /><div className="flex-1"><span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-[#F73030]">Rental item</span><h2 className="mt-3 text-2xl font-bold leading-tight text-slate-900">{item.title}</h2><p className="mt-2 flex items-center gap-1.5 text-sm text-slate-500"><MapPin className="size-4 text-[#F73030]" />{item.locationText || "Location unavailable"}</p><p className="mt-4 text-xl font-bold text-[#F73030]">${item.pricePerDay ?? 0}<span className="text-sm font-medium text-slate-400"> / day</span></p></div></div>
            <div className="pt-7"><h2 className="text-xl font-bold text-slate-900">Select rental period</h2><p className="mt-1 text-sm text-slate-500">Tell the owner when you need this item.</p><form onSubmit={handleSubmit} className="mt-6 grid gap-5 sm:grid-cols-2"><label className="text-sm font-semibold text-slate-700">From<input type="date" required value={start} onChange={(event) => setStart(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-3 outline-none focus:border-[#253C95] focus:ring-2 focus:ring-[#253C95]/10" /></label><label className="text-sm font-semibold text-slate-700">To<input type="date" required value={end} onChange={(event) => setEnd(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-3 outline-none focus:border-[#253C95] focus:ring-2 focus:ring-[#253C95]/10" /></label><div className="sm:col-span-2">{error ? <p className="text-sm text-red-600">{error}</p> : <p className="flex items-center gap-2 text-sm text-slate-500"><CalendarDays className="size-4 text-[#253C95]" />{days ? `${days} rental day${days === 1 ? "" : "s"} selected` : "Select dates to calculate your total"}</p>}</div><button disabled={isBooking} className="sm:col-span-2 flex h-12 items-center justify-center gap-2 rounded-xl bg-[#F73030] font-bold text-white transition hover:bg-[#dd2b2b] disabled:cursor-not-allowed disabled:opacity-60"><CheckCircle2 className="size-4" />{isBooking ? "Submitting..." : "Confirm Booking"}</button></form></div>
          </section>
          <aside className="space-y-5"><section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="text-lg font-bold text-slate-900">Price summary</h2><div className="mt-5 space-y-3 text-sm"><div className="flex justify-between text-slate-500"><span>${item.pricePerDay ?? 0} × {days || 0} days</span><span className="font-semibold text-slate-800">${subtotal.toFixed(2)}</span></div><div className="border-t border-slate-100 pt-3"><div className="flex justify-between font-bold text-slate-900"><span>Estimated total</span><span className="text-[#F73030]">${subtotal.toFixed(2)}</span></div></div></div><p className="mt-5 text-xs leading-5 text-slate-400">Final payment details are confirmed after the owner accepts your request.</p></section><section className="rounded-3xl border border-emerald-100 bg-emerald-50/60 p-6"><ShieldCheck className="size-6 text-emerald-600" /><h3 className="mt-3 font-bold text-emerald-900">Protected rental</h3><p className="mt-1 text-sm leading-6 text-emerald-800/80">Your request and payment are protected through Rentiq escrow.</p></section></aside>
        </div>
      </div>
    </main>
    <Footer />
  </>;
}
