"use client";

import {
  Building2,
  CarFront,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  GripVertical,
  LayoutGrid,
  Pencil,
  PlusCircle,
  Search,
  Trash2,
  Warehouse,
} from "lucide-react";
import { useMemo, useState } from "react";

type CategoryStatus = "Active" | "Hidden";

type Category = {
  id: number;
  name: string;
  description: string;
  items: string;
  commission: string;
  status: CategoryStatus;
  icon: typeof Building2;
};

const categories: Category[] = [
  { id: 1, name: "Residential Rentals", description: "Apartments, Homes, Villas", items: "1,248 units", commission: "3.5%", status: "Active", icon: Building2 },
  { id: 2, name: "Commercial Leasing", description: "Offices, Warehouses, Retails", items: "1,211 units", commission: "5.0%", status: "Active", icon: Warehouse },
  { id: 3, name: "Luxury Motors", description: "Sports Cars, Exotic Rentals", items: "2,148 units", commission: "8.5%", status: "Hidden", icon: CarFront },
  { id: 4, name: "Luxury Motors", description: "Sports Cars, Exotic Rentals", items: "2,148 units", commission: "8.5%", status: "Hidden", icon: CarFront },
  { id: 5, name: "Luxury Motors", description: "Sports Cars, Exotic Rentals", items: "2,148 units", commission: "8.5%", status: "Hidden", icon: CarFront },
  { id: 6, name: "Camera Gear", description: "Cinematography, Audio, Lighting", items: "1,244 units", commission: "12.0%", status: "Active", icon: LayoutGrid },
];

const stats = [
  { label: "Total Categories", value: "24", note: "+2 this month", icon: LayoutGrid, colors: "bg-red-50 text-red-600" },
  { label: "Active Units", value: "21", icon: Eye, colors: "bg-green-50 text-green-600" },
  { label: "Hidden Archival", value: "03", icon: EyeOff, colors: "bg-yellow-100 text-yellow-700" },
  { label: "Total Listings", value: "1,248", icon: PlusCircle, colors: "bg-orange-100 text-orange-600" },
];

const tabs = ["All", "Active", "Hidden"] as const;

export default function CategoryManagementPage() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("All");
  const [query, setQuery] = useState("");

  const visibleCategories = useMemo(() => categories.filter((category) => {
    const statusMatches = activeTab === "All" || category.status === activeTab;
    const queryMatches = `${category.name} ${category.description}`.toLowerCase().includes(query.toLowerCase());
    return statusMatches && queryMatches;
  }), [activeTab, query]);

  return (
    <main className="min-h-screen bg-[#f3f3f3] px-4 pb-10 pt-20 sm:px-6 lg:px-8 lg:pt-8">
      <div className="mx-auto max-w-[1380px]">
        <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-[28px] font-bold tracking-[-0.03em] text-[#151c23] sm:text-[32px]">Category Management</h1>
            <p className="mt-1 text-sm text-[#5c5f61] sm:text-base">Add, edit, reorder, or hide rental categories platform-wide.</p>
          </div>
          <button type="button" className="inline-flex h-12 items-center justify-center gap-3 self-start rounded-2xl bg-[#f73030] px-6 text-sm font-bold text-white shadow-[0_8px_16px_rgba(143,0,6,0.2)] sm:self-auto">
            <PlusCircle className="size-4" /> Add New Category
          </button>
        </header>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4 xl:gap-6">
          {stats.map(({ label, value, note, icon: Icon, colors }) => (
            <div key={label} className="h-[164px] rounded-2xl border border-[#e6e8ec]/30 bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
              <div className="flex items-start justify-between">
                <div className={`grid size-12 place-items-center rounded-xl ${colors}`}><Icon className="size-5" /></div>
                {note && <span className="rounded bg-green-50 px-2 py-1 text-[10px] text-green-600">↗ &nbsp;{note}</span>}
              </div>
              <p className="mt-3 text-xs font-bold uppercase tracking-[0.1em] text-[#5c5f61]">{label}</p>
              <p className="mt-1 text-2xl font-bold text-[#151c23]">{value}</p>
            </div>
          ))}
        </section>

        <section className="mt-6 overflow-hidden rounded-2xl border border-rose-200/30 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
          <div className="flex flex-col gap-4 bg-white px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex w-full max-w-[438px] gap-1 rounded-2xl bg-[#f3f3f3] p-1.5">
              {tabs.map((tab) => {
                const count = tab === "All" ? 24 : tab === "Active" ? 21 : 3;
                return <button key={tab} type="button" onClick={() => setActiveTab(tab)} className={`h-10 flex-1 rounded-xl px-4 text-sm transition-all ${activeTab === tab ? "bg-[#f73030] font-bold text-white shadow-sm" : "font-medium text-[#5c5f61] hover:bg-white/70"}`}>{tab} ({count})</button>;
              })}
            </div>
            <label className="relative block w-full lg:w-[305px]">
              <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-neutral-300" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search categories, listings, or rates..." className="h-10 w-full rounded-full border border-[#e1e5eb] bg-white pl-11 pr-4 text-xs outline-none focus:border-red-300" />
            </label>
          </div>

          <div className="border-b border-rose-100/50 bg-[#f7f9fc] px-8 py-8">
            <p className="flex items-center gap-2 text-sm font-medium uppercase text-[#5c5f61]"><span className="text-lg leading-none">≡</span> Catalog Structure</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[840px] text-left">
              <thead className="bg-[#fafbfc] text-[10px] font-bold uppercase tracking-wide text-[#5c5f61]">
                <tr><th className="w-24 px-8 py-5">Rank</th><th className="px-4 py-5">Category Entity</th><th className="px-4 py-5">Item Count</th><th className="px-4 py-5">Commission</th><th className="px-4 py-5">Status</th><th className="px-4 py-5">Actions</th></tr>
              </thead>
              <tbody className="divide-y divide-[#eceff3]">
                {visibleCategories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <tr key={category.id} className="h-[86px] text-sm text-[#151c23]">
                      <td className="px-8"><button type="button" aria-label={`Reorder ${category.name}`} className="cursor-grab text-neutral-300"><GripVertical className="size-5" /></button></td>
                      <td className="px-4"><div className="flex items-center gap-3"><div className="grid size-12 shrink-0 place-items-center rounded-xl bg-red-50 text-[#f73030]"><Icon className="size-5" /></div><div><p className="font-medium">{category.name}</p><p className="text-[10px] text-[#77797b]">{category.description}</p></div></div></td>
                      <td className="px-4"><span className="rounded-full bg-[#eaf0f9] px-3 py-1.5 text-[9px] text-[#5c5f61]">{category.items}</span></td>
                      <td className="px-4"><p className="font-bold">{category.commission}</p><p className="text-[8px] font-bold uppercase text-red-500">Editing</p></td>
                      <td className="px-4"><span className={`text-[9px] font-bold uppercase ${category.status === "Active" ? "text-green-600" : "text-[#5c5f61]"}`}>{category.status}</span></td>
                      <td className="px-4"><div className="flex gap-2"><button type="button" aria-label={`Edit ${category.name}`} className="grid size-10 place-items-center rounded-full border border-rose-100 text-[#151c23] hover:bg-neutral-50"><Pencil className="size-4" /></button><button type="button" aria-label={`Delete ${category.name}`} className="grid size-10 place-items-center rounded-full border border-rose-100 text-[#151c23] hover:bg-red-50 hover:text-red-600"><Trash2 className="size-4" /></button></div></td>
                    </tr>
                  );
                })}
                {visibleCategories.length === 0 && <tr><td colSpan={6} className="px-8 py-16 text-center text-sm text-[#77797b]">No categories match your search.</td></tr>}
              </tbody>
            </table>
          </div>

          <footer className="flex flex-col gap-4 border-t border-[#eceff3] px-6 py-4 text-[10px] text-[#5c5f61] sm:flex-row sm:items-center sm:justify-between">
            <p>Showing 1 - {visibleCategories.length} of 24 pending listings</p>
            <nav aria-label="Category pages" className="flex gap-2"><button aria-label="Previous page" className="grid size-9 place-items-center rounded-md border border-neutral-200 text-neutral-300"><ChevronLeft className="size-4" /></button>{[1, 2, 3].map((page) => <button key={page} className={`size-9 rounded-md border text-xs font-semibold ${page === 1 ? "border-[#fe121a] bg-[#fe121a] text-white" : "border-red-200 text-[#5c5f61]"}`}>{page}</button>)}<span className="grid size-9 place-items-center">…</span><button className="size-9 rounded-md border border-red-200">12</button><button aria-label="Next page" className="grid size-9 place-items-center rounded-md border border-red-200"><ChevronRight className="size-4" /></button></nav>
          </footer>
        </section>
      </div>
    </main>
  );
}
