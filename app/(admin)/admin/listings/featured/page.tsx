"use client";

import Image from "next/image";
import { BarChart3, CalendarDays, Eye, GripVertical, Megaphone, Pin, Plus, Search, Timer, X } from "lucide-react";
import { useMemo, useState } from "react";

type FeaturedListing = {
  id: number;
  slot: number;
  title: string;
  code: string;
  tier: string;
  expiry: string;
  image: string;
  autoUnpin: boolean;
};

const initialListings: FeaturedListing[] = [
  { id: 1, slot: 1, title: "Lakeside Manor Villa", code: "#RE-4012", tier: "Premium Tier", expiry: "Oct 24, 2023", image: "/img/admin/featured-lakeside.png", autoUnpin: true },
  { id: 2, slot: 2, title: "Industrial Loft Office", code: "#CM-1190", tier: "Commercial", expiry: "In 4 hours", image: "/img/admin/featured-industrial.png", autoUnpin: true },
  { id: 4, slot: 4, title: "Sky Garden Penthouse", code: "#RE-9923", tier: "Residential", expiry: "Nov 02, 2023", image: "/img/admin/featured-sky.png", autoUnpin: false },
  { id: 5, slot: 5, title: "Executive Plaza Suite", code: "#CM-2024", tier: "Commercial", expiry: "Oct 28, 2023", image: "/img/admin/featured-plaza.png", autoUnpin: true },
  { id: 6, slot: 6, title: "The Concrete Haven", code: "#RE-5510", tier: "Designer", expiry: "Permanent", image: "/img/admin/featured-concrete.png", autoUnpin: false },
];

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return <button type="button" role="switch" aria-checked={checked} aria-label={label} onClick={onChange} className={`relative h-6 w-11 rounded-full transition-colors ${checked ? "bg-[#f73030]" : "bg-neutral-300"}`}><span className={`absolute top-1 size-4 rounded-full bg-white shadow transition-transform ${checked ? "left-6" : "left-1"}`} /></button>;
}

export default function FeaturedListingsPage() {
  const [listings, setListings] = useState(initialListings);
  const [query, setQuery] = useState("");

  const filteredListings = useMemo(() => listings.filter((listing) => `${listing.title} ${listing.code} ${listing.tier}`.toLowerCase().includes(query.toLowerCase())), [listings, query]);
  const toggleAutoUnpin = (id: number) => setListings((current) => current.map((item) => item.id === id ? { ...item, autoUnpin: !item.autoUnpin } : item));
  const removeListing = (id: number) => setListings((current) => current.filter((item) => item.id !== id));

  return (
    <main className="min-h-screen bg-[#f3f3f3] px-4 pb-12 pt-20 sm:px-6 lg:px-8 lg:pt-8">
      <div className="mx-auto max-w-[1380px]">
        <header className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div><h1 className="text-[28px] font-bold tracking-[-.03em] text-[#151c23] sm:text-[32px]">Featured Listings Control</h1><p className="mt-1 max-w-2xl text-sm leading-6 text-[#5c5f61] sm:text-base">Pin listings to the featured row on home. Set expiry dates for automated rotation.</p></div>
          <div className="flex gap-3"><button className="flex h-11 items-center gap-2 rounded-2xl border bg-white px-5 text-xs font-bold text-[#5c5f61]"><Eye className="size-4" /> View Live</button><button className="h-11 rounded-2xl bg-[#f73030] px-6 text-xs font-bold text-white shadow-[0_8px_16px_rgba(188,0,11,.2)]">Save Changes</button></div>
        </header>

        <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4 xl:gap-6">
          <div className="h-[164px] rounded-[20px] bg-white p-6 shadow-sm"><span className="grid size-12 place-items-center rounded-[20px] bg-red-100 text-red-700"><Pin className="size-5" /></span><p className="mt-3 text-sm font-bold text-[#5c5f61]">Active Slots</p><p className="mt-1 text-2xl font-bold">{listings.length} <span className="text-base font-normal text-[#5c5f61]">/ 6</span></p></div>
          <div className="h-[164px] rounded-[20px] bg-white p-6 shadow-sm"><span className="grid size-12 place-items-center rounded-[20px] bg-orange-100 text-orange-600"><Timer className="size-5" /></span><p className="mt-3 text-sm font-bold text-[#5c5f61]">Upcoming Expiries</p><p className="mt-1 text-2xl font-bold">2 <span className="rounded bg-orange-100 px-2 py-1 text-xs">24h</span></p></div>
          <div className="h-[164px] rounded-[20px] bg-white p-6 shadow-sm"><span className="grid size-12 place-items-center rounded-[20px] bg-green-50 text-green-600"><BarChart3 className="size-5" /></span><p className="mt-3 text-sm font-bold text-[#5c5f61]">Total Impressions</p><p className="mt-1 text-2xl font-bold">124.5k</p></div>
          <div className="relative h-[164px] overflow-hidden rounded-[20px] bg-[#f73030] p-6 text-white shadow-lg"><span className="grid size-10 place-items-center rounded-2xl bg-white/20"><Megaphone className="size-5" /></span><p className="mt-3 text-sm font-bold">Campaign Alert</p><p className="mt-1 text-sm leading-5">Weekend peak hours detected. Suggest.</p><Megaphone className="absolute -bottom-5 -right-5 size-28 rotate-[-15deg] text-white/10" /></div>
        </section>

        <label className="relative mt-7 block w-full max-w-[300px]"><Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#6b7280]" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search listings to pin..." className="h-12 w-full rounded-[20px] border-0 bg-white pl-12 pr-4 text-sm outline-none focus:ring-2 focus:ring-red-200" /></label>

        <section className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredListings.map((listing) => <article key={listing.id} className={`group overflow-hidden rounded-[20px] border-2 bg-white p-1.5 shadow-sm ${listing.slot === 1 ? "border-red-200" : "border-transparent"}`}>
            <div className="relative h-48 overflow-hidden rounded-2xl"><Image src={listing.image} alt={listing.title} fill sizes="(min-width:1280px) 30vw, (min-width:768px) 50vw, 100vw" className="object-cover" /><span className={`absolute left-3 top-3 rounded px-2 py-1 text-[9px] font-bold text-white ${listing.slot === 1 ? "bg-[#f73030]" : "bg-[#151c23]/80"}`}>SLOT {String(listing.slot).padStart(2, "0")}</span><button type="button" onClick={() => removeListing(listing.id)} aria-label={`Remove ${listing.title} from featured listings`} className="absolute right-3 top-3 grid size-8 place-items-center rounded-full bg-black/40 text-white opacity-0 transition-opacity hover:bg-red-500 group-hover:opacity-100 focus:opacity-100"><X className="size-4" /></button></div>
            <div className="p-4"><div className="flex items-start justify-between"><div><h2 className="text-lg font-bold text-[#151c23]">{listing.title}</h2><p className="mt-1 text-[10px] text-[#5c5f61]">ID: {listing.code} • {listing.tier}</p></div><GripVertical className="size-5 cursor-grab text-[#d9e0e8]" /></div><div className="mt-4 flex items-center justify-between border-t pt-4"><span className="flex items-center gap-2 text-xs font-bold text-[#5c5f61]"><CalendarDays className="size-4" /> Featured Until</span><span className={`text-xs font-bold ${listing.expiry === "In 4 hours" ? "text-orange-600" : listing.expiry === "Permanent" ? "text-green-600" : ""}`}>{listing.expiry}</span></div><div className="mt-4 flex items-center justify-between rounded-xl bg-[#eaf0f9] px-3 py-2"><div><p className="text-xs font-bold">Auto-unpin</p><p className="text-[10px] text-[#5c5f61]">Rotate when expired</p></div><Toggle checked={listing.autoUnpin} onChange={() => toggleAutoUnpin(listing.id)} label={`Toggle auto-unpin for ${listing.title}`} /></div></div>
          </article>)}

          {!query && !listings.some((listing) => listing.slot === 3) && <button type="button" className="flex min-h-[410px] flex-col items-center justify-center rounded-[20px] border-2 border-dashed border-red-200 text-center"><span className="grid size-14 place-items-center rounded-full bg-white text-[#5c5f61] shadow-sm"><Plus className="size-7" /></span><h2 className="mt-4 text-lg font-bold">Empty Slot 03</h2><p className="mt-2 max-w-48 text-sm leading-5 text-[#5c5f61]">Search and pin a new listing here or drag an existing one to reorder.</p></button>}

          {filteredListings.length === 0 && query && <div className="col-span-full rounded-2xl bg-white py-16 text-center text-sm text-[#5c5f61]">No featured listings match your search.</div>}
        </section>
      </div>
    </main>
  );
}
