"use client";

import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  CirclePlus,
  EllipsisVertical,
  Eye,
  Filter,
  MousePointerClick,
  Pencil,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";

type CampaignStatus = "Active" | "Rejected" | "Pending";

const campaigns = [
  { title: "Summer Fleet Showcase", subtitle: "Homepage Hero Banner", image: "/img/admin/promo-car.png", status: "Active" as CampaignStatus, dates: "Jun 01 - Aug 31, 2024", location: "Main Landing Page, Desktop & Mobile", impressions: "1.2k", clicks: "84", enabled: true },
  { title: "Holiday Early Bird", subtitle: "Featured Sidebar Slot", image: "/img/admin/promo-concept-car.png", status: "Rejected" as CampaignStatus, error: "Issue: Image quality too low for high-resolution displays. Please upload 1200px+.", enabled: false },
  { title: "Earthmover Promo", subtitle: "Search Results Banner", image: "/img/admin/promo-excavator.png", status: "Pending" as CampaignStatus, dates: "Jul 15 - Aug 15, 2024", error: "Awaiting creative approval", enabled: false },
];

const boostedItems = [
  { name: "Excavator X-200", image: "/img/admin/boost-excavator.png", stars: 5, budget: "$45.00 / $100.00", progress: 45, impressions: "842", clicks: "56", status: "Boosted" },
  { name: "GT Convertible", image: "/img/admin/boost-gt.png", stars: 5, budget: "$210.00 / $250.00", progress: 84, impressions: "2.1k", clicks: "189", status: "Boosted" },
  { name: "Cinema Drone Pack", image: "/img/admin/boost-drone.png", stars: 2, budget: "$12.50 / $50.00", progress: 25, impressions: "321", clicks: "14", status: "Paused" },
];

const stats = [
  { label: "Active Now", value: "12", note: "+2 from last week", icon: TrendingUp, noteStyle: "text-green-600" },
  { label: "Total Impressions", value: "4.2k", note: "+12% conversion", icon: Eye, noteStyle: "text-green-600" },
  { label: "Avg. CTR", value: "3.8%", note: "Industry standard: 2.1%", icon: MousePointerClick, noteStyle: "text-red-500" },
  { label: "Budget Used", value: "$1,240", note: "$3,000", progress: 40, icon: TrendingUp, noteStyle: "text-[#777]" },
];

function CampaignBadge({ status }: { status: CampaignStatus }) {
  const style = status === "Active" ? "bg-green-100 text-green-700" : status === "Rejected" ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-700";
  return <span className={`rounded-full px-2 py-1 text-[9px] font-bold uppercase ${style}`}>{status}</span>;
}

export default function PromotionsPage() {
  const [enabled, setEnabled] = useState(campaigns.map(campaign => campaign.enabled));
  const [sort, setSort] = useState("Performance (High-Low)");
  const toggle = (index: number) => setEnabled(current => current.map((value, itemIndex) => itemIndex === index ? !value : value));

  return (
    <main className="min-h-screen bg-[#f3f3f3] px-4 pb-12 pt-20 text-[#191c1d] sm:px-6 lg:px-8 lg:pt-8"><div className="mx-auto max-w-[1380px]">
      <header><div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-xs text-[#5c403d]">Admin <span className="mx-1">›</span> <strong className="text-red-500">Promotions</strong></p><h1 className="mt-4 text-[28px] font-bold sm:text-[32px]">Promotions &amp; Ads</h1></div><div className="flex gap-3"><button className="flex h-10 items-center gap-2 rounded-lg border border-[#906f6c] bg-white px-6 text-xs"><Filter className="size-4" />Filters</button><button className="flex h-10 items-center gap-2 rounded-lg bg-[#fe1219] px-6 text-xs text-white"><CirclePlus className="size-4" />Create New Promotion</button></div></div></header>

      <section className="mt-20 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">{stats.map(({ label,value,note,progress,icon: Icon,noteStyle }) => <article key={label} className="h-[164px] rounded-xl border border-red-200 bg-white p-6 shadow-sm"><p className="text-[10px] font-medium uppercase text-[#5c403d]">{label}</p><p className="mt-3 text-2xl font-semibold">{value}</p><div className={`mt-3 flex items-center gap-2 text-xs ${noteStyle}`}><Icon className="size-4" />{note}</div>{progress && <div className="mt-4 h-2 rounded-full bg-neutral-200"><div className="h-full rounded-full bg-[#fe1219]" style={{width:`${progress}%`}} /></div>}</article>)}</section>

          <section className="mt-12"><div className="mb-5 flex items-center justify-between"><h2 className="text-xl font-semibold">Active Advertisements</h2><button className="text-sm text-red-500">View All Campaigns</button></div><div className="grid gap-6 xl:grid-cols-3">{campaigns.map((campaign,index) => <article key={campaign.title} className="overflow-hidden rounded-xl border border-red-200 bg-white shadow-sm"><div className="relative h-[180px]"><Image src={campaign.image} alt={campaign.title} fill className="object-cover" /><div className="absolute right-4 top-4"><CampaignBadge status={campaign.status} /></div></div><div className="min-h-[170px] p-4"><div className="flex items-start justify-between"><div><h3 className="text-sm font-medium">{campaign.title}</h3><p className="mt-1 text-[10px] text-[#5c403d]">{campaign.subtitle}</p></div><button onClick={() => toggle(index)} className={`relative h-6 w-11 rounded-full transition-colors ${enabled[index] ? "bg-[#fe1219]" : "bg-neutral-200"}`} aria-label={`Toggle ${campaign.title}`}><span className={`absolute top-1 size-4 rounded-full bg-white transition-all ${enabled[index] ? "left-6" : "left-1"}`} /></button></div>{campaign.dates && <p className="mt-4 flex items-center gap-2 text-xs text-[#5c403d]"><CalendarDays className="size-4" />{campaign.dates}</p>}{campaign.location && <p className="mt-2 text-xs text-[#5c403d]">⌖ &nbsp;{campaign.location}</p>}{campaign.error && <p className={`mt-4 flex gap-2 rounded-lg p-3 text-xs ${campaign.status === "Rejected" ? "bg-red-50 text-red-500" : "text-red-500"}`}><CircleAlert className="size-4 shrink-0" />{campaign.error}</p>}</div><footer className="flex min-h-14 items-center border-t border-red-200 px-4">{campaign.status === "Rejected" ? <Link href="/admin/advertisements/promotions/resolve-error" className="grid h-9 w-full place-items-center rounded-lg bg-neutral-200 text-xs text-neutral-500">Resolve Errors</Link> : <><div className="mr-8"><p className="text-[8px] uppercase text-[#5c403d]">Impressions</p><p className="text-xs">{campaign.impressions || "--"}</p></div><div><p className="text-[8px] uppercase text-[#5c403d]">Clicks</p><p className="text-xs">{campaign.clicks || "--"}</p></div><button className="ml-auto text-red-500">{campaign.status === "Active" ? <Pencil className="size-4" /> : <EllipsisVertical className="size-4" />}</button></>}</footer></article>)}</div></section>

      <section className="mt-12"><div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><h2 className="text-xl font-semibold">Promoted Assets (Item Boosts)</h2><label className="flex items-center gap-3 text-xs text-[#5c403d]">Sort by:<span className="relative"><select value={sort} onChange={event => setSort(event.target.value)} className="appearance-none bg-transparent pr-6 text-red-500 outline-none"><option>Performance (High-Low)</option><option>Budget Used</option><option>Clicks</option></select><ChevronDown className="pointer-events-none absolute right-0 top-1/2 size-3 -translate-y-1/2" /></span></label></div><div className="overflow-hidden rounded-xl border border-red-200 bg-white shadow-sm"><div className="overflow-x-auto"><table className="w-full min-w-[850px] text-left"><thead className="bg-[#f3f4f5] text-xs font-semibold text-[#5c5f61]"><tr><th className="px-6 py-4">Item Name</th><th className="px-4">Boost Level</th><th className="px-4">Budget Status</th><th className="px-4">Impressions</th><th className="px-4">Clicks</th><th className="px-4">Status</th></tr></thead><tbody className="divide-y divide-red-200">{boostedItems.map(item => <tr key={item.name} className="h-[92px] text-sm"><td className="px-6"><div className="flex items-center gap-3"><Image src={item.image} alt="" width={40} height={40} className="size-10 rounded-lg object-cover" /><span className="max-w-24">{item.name}</span></div></td><td className="px-4 text-lg tracking-[-2px] text-amber-500">{"★".repeat(item.stars)}{"☆".repeat(5-item.stars)}</td><td className="px-4"><p className="text-xs">{item.budget}</p><div className="mt-2 h-1.5 w-28 rounded-full bg-neutral-200"><div className="h-full rounded-full bg-[#fe1219]" style={{width:`${item.progress}%`}} /></div></td><td className="px-4">{item.impressions}</td><td className="px-4">{item.clicks}</td><td className="px-4"><span className={`rounded-full px-3 py-1 text-[9px] font-bold uppercase ${item.status === "Boosted" ? "bg-green-100 text-green-700" : "bg-neutral-200 text-neutral-600"}`}>{item.status}</span></td></tr>)}</tbody></table></div><footer className="flex items-center justify-between border-t border-red-200 bg-[#f3f4f5] px-6 py-4 text-xs text-[#5d5e61]"><p>Showing 1-3 of 42 boosted items</p><div className="flex gap-2"><button className="grid size-8 place-items-center rounded-lg border border-red-200 bg-white"><ChevronLeft className="size-4" /></button><button className="grid size-8 place-items-center rounded-lg border border-red-200 bg-white"><ChevronRight className="size-4" /></button></div></footer></div></section>
    </div></main>
  );
}
