"use client";

import { useMemo, useState } from "react";
import { useGetVendorEarningsQuery, useGetVendorPerformanceQuery } from "@/redux/services/vendorApi";

function isoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function money(value?: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(value ?? 0);
}

export default function VendorEarningsPage() {
  const today = useMemo(() => new Date(), []);
  const initialFrom = useMemo(() => {
    const date = new Date(today);
    date.setDate(date.getDate() - 30);
    return isoDate(date);
  }, [today]);

  const [from, setFrom] = useState(initialFrom);
  const [to, setTo] = useState(isoDate(today));
  const [groupBy, setGroupBy] = useState<"DAY" | "MONTH">("DAY");

  const { data: report, isLoading, isError } = useGetVendorEarningsQuery({ from, to, groupBy });
  const { data: performance } = useGetVendorPerformanceQuery();
  const currencySummary = report?.currencies?.[0];
  const currency = currencySummary?.currency || "USD";
  const rows = report?.trend?.find((trend) => trend.currency === currency)?.points ?? report?.trend?.[0]?.points ?? [];

  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      <div>
        <p className="text-sm font-semibold text-[#F73030]">Financial reporting</p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-950">Earnings</h1>
        <p className="mt-1 text-sm text-slate-500">View vendor earnings by day or month.</p>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Selected period</p><p className="mt-2 text-2xl font-extrabold text-slate-950">{money(currencySummary?.completedBookingValue, currency)}</p><p className="mt-1 text-xs text-slate-500">{currencySummary?.completedBookingCount ?? 0} completed bookings · {currency}</p></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">All-time booking value</p><p className="mt-2 text-2xl font-extrabold text-slate-950">{money(performance?.completedBookingValue, currency)}</p><p className="mt-1 text-xs text-slate-500">From vendor performance</p></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Completed bookings</p><p className="mt-2 text-2xl font-extrabold text-slate-950">{performance?.completedBookings ?? 0}</p><p className="mt-1 text-xs text-slate-500">Acceptance rate {((performance?.acceptanceRate ?? 0) * (performance?.acceptanceRate && performance.acceptanceRate <= 1 ? 100 : 1)).toFixed(1)}%</p></div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-4">
          <label className="text-sm font-semibold text-slate-700">From<input type="date" value={from} onChange={(event) => setFrom(event.target.value)} className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal" /></label>
          <label className="text-sm font-semibold text-slate-700">To<input type="date" value={to} onChange={(event) => setTo(event.target.value)} className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal" /></label>
          <label className="text-sm font-semibold text-slate-700">Group by<select value={groupBy} onChange={(event) => setGroupBy(event.target.value as "DAY" | "MONTH")} className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal"><option value="DAY">Day</option><option value="MONTH">Month</option></select></label>
          <div className="flex items-end"><div className="w-full rounded-lg bg-slate-50 px-3 py-2.5 text-sm text-slate-600">{report?.from || from} → {report?.to || to}</div></div>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4"><h2 className="font-bold text-slate-950">Earnings breakdown</h2></div>
        {isLoading ? <p className="p-6 text-sm text-slate-500">Loading earnings report...</p> : null}
        {isError ? <p className="p-6 text-sm text-red-600">Unable to load the earnings report for this date range.</p> : null}
        <div className="divide-y divide-slate-100">
          {rows.map((row, index) => (
            <div key={`${row.period}-${index}`} className="grid grid-cols-[1fr_auto_auto] items-center gap-6 px-5 py-4">
              <div><p className="text-sm font-semibold text-slate-900">{row.period || "Period"}</p><p className="text-xs text-slate-500">{row.completedBookingCount ?? 0} completed bookings</p></div>
              <div className="hidden h-2 w-40 overflow-hidden rounded-full bg-slate-100 sm:block"><div className="h-full rounded-full bg-[#253C95]" style={{ width: `${currencySummary?.completedBookingValue ? Math.min(100, ((row.completedBookingValue ?? 0) / currencySummary.completedBookingValue) * 100) : 0}%` }} /></div>
              <p className="text-sm font-extrabold text-slate-950">{money(row.completedBookingValue, currency)}</p>
            </div>
          ))}
          {!isLoading && !isError && !rows.length ? <p className="p-10 text-center text-sm text-slate-500">No earnings found for this period.</p> : null}
        </div>
      </section>
    </div>
  );
}
