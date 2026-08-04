"use client";

import { CalendarCheck2, CalendarDays, CheckCircle2, ChevronDown, Download, Gavel, QrCode, Search, TimerReset } from "lucide-react";
import { useMemo, useState } from "react";

type BookingStatus = "Rented" | "Approved" | "Completed";

const bookings = [
  { reference: "BK-24801", date: "Jul 04, 2026", renter: "Sokha Chan", renterInitials: "SC", item: "Sony A7 IV Mirrorless Kit", category: "Electronics", owner: "Urban Rides Co.", ownerInitials: "UR", period: "Jul 06 → Jul 09", duration: "3 days", total: "$285", deposit: "$400", status: "Rented" as BookingStatus },
  { reference: "BK-24802", date: "Jul 05, 2026", renter: "Rathana Ken", renterInitials: "RK", item: "Honda PCX 160 Scooter", category: "Vehicles", owner: "MotoHub PP", ownerInitials: "MH", period: "Jul 08 → Jul 15", duration: "7 days", total: "$189", deposit: "$250", status: "Approved" as BookingStatus },
  { reference: "BK-24803", date: "Jul 01, 2026", renter: "Malis Vong", renterInitials: "MV", item: "Bosch GBH Rotary Hammer", category: "Tools", owner: "ToolShed Cambodia", ownerInitials: "TS", period: "Jul 02 → Jul 04", duration: "2 days", total: "$42", deposit: "$80", status: "Completed" as BookingStatus },
];

const stats = [
  { label: "Total Bookings", value: "1,284", icon: CalendarDays, color: "bg-red-50 text-red-600" },
  { label: "Pending Approval", value: "12", icon: CalendarCheck2, color: "bg-orange-50 text-orange-600" },
  { label: "Active Rentals", value: "87", icon: TimerReset, color: "bg-blue-50 text-blue-600" },
  { label: "Completed", value: "1,142", icon: CheckCircle2, color: "bg-green-50 text-green-600" },
  { label: "Open Disputes", value: "6", note: "Needs review", icon: Gavel, color: "bg-amber-50 text-amber-700" },
  { label: "QR Pending", value: "9", note: "Awaiting pickup", icon: QrCode, color: "bg-cyan-50 text-cyan-600" },
];

function StatusBadge({ status }: { status: BookingStatus }) {
  const color = status === "Completed" ? "bg-green-50 text-green-600" : status === "Approved" ? "bg-blue-50 text-blue-600" : "bg-blue-50 text-blue-700";
  return <span className={`inline-flex rounded-full px-2 py-1 text-[8px] font-bold uppercase ${color}`}>{status}</span>;
}

function BookingTable({ rows, dispute = false }: { rows: typeof bookings; dispute?: boolean }) {
  return <div className="overflow-x-auto"><table className="w-full min-w-[940px] text-left"><thead className="bg-[#fafbfc] text-[9px] font-bold uppercase tracking-wide text-[#5c5f61]"><tr><th className="px-7 py-5">Reference</th><th className="px-4">Renter</th><th className="px-4">Item</th><th className="px-4">Owner</th><th className="px-4">Rental Period</th><th className="px-4">Total</th><th className="px-4">Deposit</th><th className="px-4">Status</th></tr></thead><tbody className="divide-y divide-[#eef0f3]">{rows.map((booking, index) => <tr key={booking.reference} className={`h-[104px] text-xs ${!dispute && index === 0 ? "border-l-2 border-red-500" : ""}`}><td className="px-7"><p className="font-bold">{booking.reference}</p><p className="mt-1 text-[9px] text-[#87909a]">{booking.date}</p></td><td className="px-4"><div className="flex items-center gap-2"><span className="grid size-8 place-items-center rounded-full bg-pink-100 text-[9px] font-bold text-pink-500">{booking.renterInitials}</span>{booking.renter}</div></td><td className="px-4"><p className="font-bold">{booking.item}</p><p className="mt-1 text-[9px] text-[#87909a]">{booking.category}</p></td><td className="px-4"><div className="flex items-center gap-2"><span className="grid size-8 place-items-center rounded-full bg-blue-100 text-[9px] font-bold text-blue-500">{booking.ownerInitials}</span>{booking.owner}</div></td><td className="px-4"><p className="font-medium">{booking.period}</p><p className="mt-1 text-[9px] text-[#87909a]">{booking.duration}</p></td><td className="px-4 font-bold">{booking.total}</td><td className="px-4 text-[#5c5f61]">{booking.deposit}</td><td className="px-4"><StatusBadge status={booking.status} /></td></tr>)}</tbody></table></div>;
}

export default function BookingMonitorPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");

  const visibleBookings = useMemo(() => bookings.filter((booking) => {
    const searchMatches = `${booking.reference} ${booking.renter} ${booking.owner} ${booking.item}`.toLowerCase().includes(query.toLowerCase());
    const categoryMatches = category === "All" || booking.category === category;
    const statusMatches = status === "All" || booking.status === status;
    return searchMatches && categoryMatches && statusMatches;
  }), [category, query, status]);

  return (
    <main className="min-h-screen bg-[#f3f3f3] px-4 pb-12 pt-20 sm:px-6 lg:px-8 lg:pt-8">
      <div className="mx-auto max-w-[1380px]">
        <header className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between"><div><h1 className="text-[28px] font-bold text-[#151c23] sm:text-[32px]">Booking Monitor</h1><p className="mt-1 max-w-4xl text-sm leading-6 text-[#5c5f61]">Track booking lifecycle, verify QR pickup and return, manage inspections, security deposits, and disputes.</p></div><div className="flex gap-3"><button className="flex h-10 items-center gap-2 rounded-2xl border border-rose-100 bg-white px-5 text-xs font-bold text-[#5c5f61]"><Download className="size-4" /> Export</button><button className="flex h-10 items-center gap-2 rounded-2xl bg-[#f73030] px-5 text-xs font-bold text-white"><QrCode className="size-4" /> Verify QR</button></div></header>

        <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4 xl:gap-6">{stats.map(({ label, value, note, icon: Icon, color }) => <div key={label} className="h-[164px] rounded-2xl bg-white p-6 shadow-sm"><span className={`grid size-10 place-items-center rounded-2xl ${color}`}><Icon className="size-5" /></span><p className="mt-3 text-xs font-bold uppercase text-[#5c5f61]">{label}</p><p className="mt-1 text-2xl font-bold">{value}</p>{note && <p className="mt-1 text-[9px] text-[#5c5f61]">{note}</p>}</div>)}</section>

        <section className="mt-6 flex flex-col gap-3 rounded-2xl bg-white p-3 shadow-sm lg:flex-row lg:items-center"><label className="relative block min-w-0 flex-1"><Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-neutral-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by reference, customer, owner, or item..." className="h-10 w-full rounded-xl bg-[#f3f6fa] pl-11 pr-4 text-xs outline-none" /></label><div className="flex flex-wrap gap-3">{[["Category",category,setCategory,["All","Electronics","Vehicles","Tools"]],["Status",status,setStatus,["All","Rented","Approved","Completed"]]].map(([label,value,setValue,options]) => <label key={label as string} className="relative"><select value={value as string} onChange={(event) => (setValue as (value:string)=>void)(event.target.value)} className="h-10 appearance-none rounded-xl border border-rose-100 bg-white pl-4 pr-9 text-xs font-bold outline-none">{(options as string[]).map(option => <option key={option} value={option}>{label as string}: {option}</option>)}</select><ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-3 -translate-y-1/2" /></label>)}<button className="flex h-10 items-center gap-2 rounded-xl border border-rose-100 bg-white px-4 text-xs font-bold"><CalendarDays className="size-4" /> Date Range</button></div></section>

        <section className="mt-4 overflow-hidden rounded-2xl bg-white shadow-sm"><div className="flex items-center justify-between px-6 py-5"><div><h2 className="text-lg font-bold">All Bookings</h2><p className="text-[10px] text-[#5c5f61]">Click a row to view full booking details.</p></div><p className="text-[10px] text-[#5c5f61]">Showing 1–{visibleBookings.length} of 1,284</p></div><BookingTable rows={visibleBookings} />{visibleBookings.length === 0 && <p className="py-12 text-center text-sm text-[#5c5f61]">No bookings match these filters.</p>}</section>

        <section className="mt-6 overflow-hidden rounded-2xl bg-white shadow-sm"><div className="flex items-center justify-between px-6 py-5"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-full bg-amber-50 text-amber-700"><Gavel className="size-5" /></span><div><h2 className="text-lg font-bold">Dispute Management</h2><p className="text-[10px] text-[#5c5f61]">6 open • 3 in review • 218 resolved</p></div></div><button className="flex items-center gap-1 text-xs font-bold text-red-600">View all disputes <span>→</span></button></div><BookingTable rows={bookings} dispute /></section>
      </div>
    </main>
  );
}
