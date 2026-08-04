"use client";

import Image from "next/image";
import { CalendarDays, Check, ChevronDown, ChevronLeft, ChevronRight, Clock3, Eye, FileCheck2, Flag, Search, ShieldAlert, X } from "lucide-react";
import { useMemo, useState } from "react";

type ModerationState = "Pending" | "Approved" | "Removed" | "Flagged";

const listings = [
  { id: 1, property: "Manor Villa", location: "Lake District, Sector 4", owner: "Jenkins", ownerId: "ID: USR-8821", category: "Residential", date: "Today, 10:45 AM", status: "Pending" as ModerationState, image: "/img/admin/listing-manor.png", avatar: "/img/admin/owner-jenkins.png", warning: "Suspicious Pricing" },
  { id: 2, property: "Loft Office", location: "Tech Corridor, District 7", owner: "Chen", ownerId: "ID: USR-9042", category: "Commercial", date: "Yesterday, 4:20 PM", status: "Pending" as ModerationState, image: "/img/admin/listing-office.png", avatar: "/img/admin/owner-chen.png" },
  { id: 3, property: "Valley", location: "Suburban Heights", owner: "Holdings", ownerId: "ID: CORP-112", category: "Residential", date: "Yesterday, 1:15 PM", status: "Flagged" as ModerationState, image: "/img/admin/listing-valley.png", avatar: "/img/admin/owner-chen.png" },
  { id: 4, property: "Retail", location: "City Center, Central District", owner: "Aris", ownerId: "ID: USR-4509", category: "Commercial", date: "Oct 12, 9:30 AM", status: "Pending" as ModerationState, image: "/img/admin/listing-retail.png", avatar: "/img/admin/owner-aris.png" },
];

const tabs: { label: ModerationState; count: string }[] = [
  { label: "Pending", count: "24" }, { label: "Approved", count: "1,402" }, { label: "Removed", count: "42" }, { label: "Flagged", count: "8" },
];

const stats = [
  { label: "Avg. Approval Time", value: "4.2h", note: "+12%", icon: Clock3, color: "bg-red-100 text-red-700" },
  { label: "Pending Tasks", value: "24", icon: CalendarDays, color: "bg-orange-100 text-orange-600" },
  { label: "Approved Today", value: "86", icon: FileCheck2, color: "bg-blue-100 text-blue-600" },
  { label: "Fraud Detected", value: "3", icon: ShieldAlert, color: "bg-green-100 text-green-600" },
];

export default function ListingModerationPage() {
  const [activeTab, setActiveTab] = useState<ModerationState>("Pending");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [decisions, setDecisions] = useState<Record<number, ModerationState>>({});

  const visibleListings = useMemo(() => listings.filter((listing) => {
    const currentStatus = decisions[listing.id] ?? listing.status;
    const statusMatches = currentStatus === activeTab;
    const categoryMatches = category === "All" || listing.category === category;
    const searchMatches = `${listing.property} ${listing.owner} ${listing.location}`.toLowerCase().includes(query.toLowerCase());
    return statusMatches && categoryMatches && searchMatches;
  }), [activeTab, category, decisions, query]);

  const decide = (id: number, state: ModerationState) => setDecisions((current) => ({ ...current, [id]: state }));

  return (
    <main className="min-h-screen bg-[#f3f3f3] px-4 pb-10 pt-20 sm:px-6 lg:px-8 lg:pt-8">
      <div className="mx-auto max-w-[1380px]">
        <header><h1 className="text-[28px] font-bold tracking-[-0.03em] text-[#151c23] sm:text-[32px]">Listing Moderation</h1><p className="mt-1 max-w-2xl text-sm leading-6 text-[#5c5f61] sm:text-base">Review and approve or remove property listings before they become publicly visible.</p></header>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4 xl:gap-6">
          {stats.map(({ label, value, note, icon: Icon, color }) => <div key={label} className="h-[164px] rounded-2xl border border-[#e6e8ec]/30 bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,.05)]"><div className="flex justify-between"><span className={`grid size-12 place-items-center rounded-xl ${color}`}><Icon className="size-5" /></span>{note && <span className="h-fit rounded bg-green-50 px-2 py-1 text-[10px] font-bold text-green-600">{note}</span>}</div><p className="mt-3 text-xs font-semibold uppercase tracking-[.05em] text-[#5c5f61]">{label}</p><p className="mt-1 text-2xl font-bold">{value}</p></div>)}
        </section>

        <section className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <label className="relative block w-full sm:w-64"><Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-neutral-300" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Quick search users..." className="h-11 w-full rounded-full border border-[#e6ecf4] bg-white pl-11 pr-4 text-sm outline-none focus:border-red-300" /></label>
          <div className="flex gap-3"><label className="relative"><select value={category} onChange={(event) => setCategory(event.target.value)} className="h-11 appearance-none rounded-xl border border-rose-100 bg-white pl-4 pr-9 text-xs font-bold outline-none"><option>All</option><option>Residential</option><option>Commercial</option></select><span className="pointer-events-none absolute inset-y-0 right-3 flex items-center"><ChevronDown className="size-3" /></span></label><button className="flex h-11 items-center gap-2 rounded-xl border border-rose-100 bg-white px-4 text-xs font-bold"><CalendarDays className="size-4" /> Date Range</button></div>
        </section>

        <section className="mt-5 overflow-hidden rounded-2xl border border-rose-100 bg-white shadow-[0_1px_2px_rgba(0,0,0,.04)]">
          <div className="p-5"><div className="grid max-w-[620px] grid-cols-2 gap-1 rounded-2xl bg-[#f0f0f0] p-1 sm:grid-cols-4">{tabs.map(({ label, count }) => <button key={label} onClick={() => setActiveTab(label)} className={`h-10 rounded-xl px-4 text-sm transition-all ${activeTab === label ? "bg-[#f73030] font-bold text-white shadow-sm" : "font-medium text-[#5c5f61]"}`}>{label} ({count})</button>)}</div></div>
          <div className="overflow-x-auto"><table className="w-full min-w-[960px] text-left"><thead className="bg-[#f7f9fc] text-[10px] font-bold uppercase tracking-wide text-[#5c5f61]"><tr><th className="px-8 py-6">Property</th><th className="px-4">Owner</th><th className="px-4">Category</th><th className="px-4">Submitted Date</th><th className="px-4">Status</th><th className="px-4">Actions</th></tr></thead><tbody className="divide-y divide-[#eef0f3]">{visibleListings.map((listing) => <tr key={listing.id} className="h-[128px] text-sm"><td className="px-8"><div className="flex items-center gap-3"><Image src={listing.image} alt="" width={64} height={64} className="size-16 rounded-lg object-cover" /><div><p className="font-bold">{listing.property}</p><p className="mt-1 max-w-28 text-[10px] leading-4 text-[#77797b]">{listing.location}</p>{listing.warning && <span className="mt-1 inline-block rounded bg-red-50 px-2 py-0.5 text-[7px] font-bold uppercase text-red-500">{listing.warning}</span>}</div></div></td><td className="px-4"><div className="flex items-center gap-3"><Image src={listing.avatar} alt="" width={40} height={40} className="size-10 rounded-full object-cover" /><div><p className="font-bold">{listing.owner}</p><p className="text-[10px] text-[#77797b]">{listing.ownerId}</p></div></div></td><td className="px-4"><span className="rounded-lg bg-[#e9eff8] px-3 py-1.5 text-xs text-[#5c5f61]">{listing.category}</span></td><td className="px-4 whitespace-pre-line text-[#77797b]">{listing.date.replace(", ", ",\n")}</td><td className="px-4"><span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase ${listing.status === "Flagged" ? "bg-yellow-100 text-yellow-700" : "bg-orange-50 text-orange-600"}`}>{listing.status}</span></td><td className="px-4"><div className="flex gap-2"><button aria-label={`View ${listing.property}`} className="grid size-9 place-items-center rounded-lg border border-rose-100"><Eye className="size-4" /></button><button onClick={() => decide(listing.id, "Approved")} aria-label={`Approve ${listing.property}`} className="grid size-9 place-items-center rounded-lg border border-green-200 bg-green-50 text-green-600"><Check className="size-4" /></button><button onClick={() => decide(listing.id, "Removed")} aria-label={`Remove ${listing.property}`} className="grid size-9 place-items-center rounded-lg border border-red-200 bg-red-50 text-red-500"><X className="size-4" /></button><button onClick={() => decide(listing.id, "Flagged")} aria-label={`Flag ${listing.property}`} className={`grid size-9 place-items-center rounded-lg border ${listing.status === "Flagged" ? "border-amber-500 bg-amber-500 text-white" : "border-amber-200 text-amber-600"}`}><Flag className="size-4" /></button></div></td></tr>)}{visibleListings.length === 0 && <tr><td colSpan={6} className="py-16 text-center text-sm text-[#77797b]">No listings match this moderation state.</td></tr>}</tbody></table></div>
          <footer className="flex flex-col gap-4 border-t px-6 py-4 text-[10px] text-[#5c5f61] sm:flex-row sm:items-center sm:justify-between"><p>Showing 1–{visibleListings.length} of 24 pending listings</p><nav aria-label="Listing pages" className="flex gap-2"><button className="grid size-10 place-items-center rounded-lg border text-neutral-300"><ChevronLeft className="size-4" /></button>{[1,2,3].map(page => <button key={page} className={`size-10 rounded-lg border ${page === 1 ? "border-red-500 bg-red-500 text-white" : "border-rose-200"}`}>{page}</button>)}<span className="grid size-10 place-items-center">…</span><button className="size-10 rounded-lg border border-rose-200">12</button><button className="grid size-10 place-items-center rounded-lg border border-rose-200"><ChevronRight className="size-4" /></button></nav></footer>
        </section>
      </div>
    </main>
  );
}
