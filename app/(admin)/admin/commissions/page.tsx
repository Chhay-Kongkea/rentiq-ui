"use client";

import {
  AlertTriangle,
  CalendarDays,
  CalendarPlus,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Edit3,
  Percent,
  Search,
  TrendingUp,
} from "lucide-react";
import { useMemo, useState } from "react";

type RuleStatus = "Active" | "Expired";

const rules = [
  { initials: "EL", category: "Electronics", commission: "10%", effective: "01/01/2025", status: "Active" as RuleStatus, updated: "Nov 12, 2025" },
  { initials: "VE", category: "Vehicles", commission: "15%", effective: "08/15/2024", status: "Active" as RuleStatus, updated: "Oct 04, 2025" },
  { initials: "AP", category: "Apparel", commission: "12%", effective: "06/01/2023", status: "Expired" as RuleStatus, updated: "Jan 02, 2025" },
  { initials: "HO", category: "Home & Garden", commission: "13%", effective: "03/10/2025", status: "Active" as RuleStatus, updated: "Sep 18, 2025" },
  { initials: "SP", category: "Sports & Outdoor", commission: "10%", effective: "07/01/2025", status: "Active" as RuleStatus, updated: "Aug 30, 2025" },
];

const statistics = [
  { label: "Active Rules", value: "4", note: "+2 this month", badge: "Healthy", icon: Percent, iconStyle: "bg-green-100 text-green-700", badgeStyle: "bg-green-50 text-green-700" },
  { label: "Scheduled", value: "1", note: "Effective soon", badge: "Healthy", icon: CalendarPlus, iconStyle: "bg-blue-100 text-blue-600", badgeStyle: "bg-green-50 text-green-700" },
  { label: "Avg Commission", value: "11.4%", note: "Across categories", badge: "Healthy", icon: TrendingUp, iconStyle: "bg-red-100 text-red-500", badgeStyle: "bg-green-50 text-green-700" },
  { label: "Conflicts", value: "1", note: "Review needed", badge: "Attention", icon: AlertTriangle, iconStyle: "bg-amber-100 text-amber-600", badgeStyle: "bg-orange-50 text-orange-700" },
];

function StatusBadge({ status }: { status: RuleStatus }) {
  return <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase ${status === "Active" ? "border-green-200 bg-green-50 text-green-600" : "border-neutral-300 bg-neutral-200 text-neutral-600"}`}><span className="size-1 rounded-full bg-current" />{status}</span>;
}

export default function CommissionSettingsPage() {
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const visibleRules = useMemo(() => rules.filter((rule) => rule.category.toLowerCase().includes(query.toLowerCase())), [query]);

  return (
    <main className="min-h-screen bg-[#f3f3f3] px-4 pb-12 pt-20 text-[#151c23] sm:px-6 lg:px-8 lg:pt-8">
      <div className="mx-auto max-w-[1380px]">
        <header><h1 className="text-[28px] font-bold tracking-[-0.02em] sm:text-[32px]">Commission Settings</h1><p className="mt-1 text-sm text-[#5c5f61] sm:text-base">Configure category-based commission rules applied to completed bookings.</p></header>

        <section className="mt-7 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {statistics.map(({ label, value, note, badge, icon: Icon, iconStyle, badgeStyle }) => <article key={label} className="h-[164px] rounded-2xl border border-rose-100/30 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><span className={`grid size-10 place-items-center rounded-lg ${iconStyle}`}><Icon className="size-5" /></span><span className={`rounded-full px-2 py-1 text-[9px] font-bold uppercase ${badgeStyle}`}>{badge}</span></div><p className="mt-4 text-sm text-[#5c5f61]">{label}</p><p className="text-2xl font-bold">{value}</p><p className="mt-1 text-xs text-[#5c5f61]">{note}</p></article>)}
        </section>

        <section className="mt-6 overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="flex flex-col gap-5 border-b border-[#eef0f3] px-6 py-6 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-xl font-bold">Category Commission Rules</h2><p className="mt-1 max-w-sm text-sm leading-5 text-[#85898d]">Inline edit rates and schedule new rules per category.</p></div><label className="relative block w-full sm:w-[300px]"><Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#8b9197]" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search categories..." className="h-11 w-full rounded-xl border border-[#e8e9ec] bg-[#fafafa] pl-11 pr-4 text-sm outline-none focus:border-red-300" /></label></div>

          <div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left"><thead className="bg-[#f8f9fb] text-[10px] font-bold uppercase tracking-wide text-[#60656a]"><tr><th className="px-8 py-5">Category</th><th className="px-4">Commission %</th><th className="px-4">Effective From</th><th className="px-4">Status</th><th className="px-4">Last Updated</th><th className="px-4">Actions</th></tr></thead><tbody className="divide-y divide-[#eef0f3]">{visibleRules.map((rule, index) => <tr key={rule.category} className={`h-[82px] text-sm ${rule.status === "Expired" ? "text-[#9ca0a4]" : ""}`}><td className="px-8"><div className="flex items-center gap-3"><span className={`grid size-8 place-items-center rounded-full text-[10px] font-bold ${rule.status === "Expired" ? "bg-neutral-100 text-neutral-400" : "bg-red-50 text-red-600"}`}>{rule.initials}</span><span className="flex items-center gap-1 font-medium text-[#20262c]">{rule.category}<ChevronDown className="size-3" /></span></div></td><td className="px-4">{editing === rule.category ? <input autoFocus defaultValue={rule.commission.replace("%", "")} onBlur={() => setEditing(null)} className="h-10 w-[68px] rounded-xl border border-red-300 px-3 outline-none" /> : <button onClick={() => setEditing(rule.category)} className="h-10 w-[68px] rounded-xl border border-rose-100 bg-white text-[#656a70]">{rule.commission}</button>}</td><td className="px-4"><span className="flex items-center gap-2 whitespace-nowrap"><CalendarDays className="size-4" />{rule.effective}{index > 0 && <CalendarDays className="size-3 text-neutral-400" />}</span></td><td className="px-4"><StatusBadge status={rule.status} /></td><td className="px-4 whitespace-nowrap text-[#73787d]">{rule.updated}</td><td className="px-4"><button onClick={() => setEditing(rule.category)} className="flex items-center gap-1 text-xs font-medium text-red-500"><Edit3 className="size-3.5" /> Edit</button></td></tr>)}</tbody></table></div>
          {visibleRules.length === 0 && <p className="py-12 text-center text-sm text-[#777]">No categories match your search.</p>}
          <footer className="flex flex-col gap-4 border-t border-[#eef0f3] px-7 py-5 text-[10px] text-[#686d72] sm:flex-row sm:items-center sm:justify-between"><p>Showing 1 to {visibleRules.length} of 24,512 entries</p><div className="flex items-center gap-2"><button aria-label="Previous page" className="grid size-9 place-items-center rounded-lg border border-[#eceeef] text-neutral-400"><ChevronLeft className="size-4" /></button>{[1, 2, 3].map((page) => <button key={page} className={`grid size-9 place-items-center rounded-lg border text-xs font-semibold ${page === 1 ? "border-red-500 bg-[#fe121a] text-white" : "border-red-200 text-[#5c403d]"}`}>{page}</button>)}<span>...</span><button className="grid size-9 place-items-center rounded-lg border border-red-200 text-xs font-semibold">12</button><button aria-label="Next page" className="grid size-9 place-items-center rounded-lg border border-red-200"><ChevronRight className="size-4" /></button></div></footer>
        </section>
      </div>
    </main>
  );
}
