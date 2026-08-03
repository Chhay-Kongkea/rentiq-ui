"use client";

import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  EllipsisVertical,
  Eye,
  FileText,
  Percent,
} from "lucide-react";
import { useState } from "react";

type TransactionStatus = "Resolved" | "Pending" | "Rejected";

const transactions = [
  { id: "#TXN-90281", initials: "AM", client: "Alpha Manufacturing", type: "Enterprise Account", date: "Oct 24, 2023", category: "Logistics", amount: "$12,450.00", status: "Resolved" as TransactionStatus },
  { id: "#TXN-90280", initials: "JK", client: "Jensen & Kline Co.", type: "Corporate Account", date: "Oct 23, 2023", category: "Heavy Machinery", amount: "$4,820.00", status: "Pending" as TransactionStatus },
  { id: "#TXN-90279", initials: "BS", client: "BuildStar Inc.", type: "Individual Pro", date: "Oct 23, 2023", category: "Construction", amount: "$890.00", status: "Rejected" as TransactionStatus },
  { id: "#TXN-90278", initials: "TC", client: "TechCorp Logistics", type: "Enterprise Account", date: "Oct 22, 2023", category: "IT Systems", amount: "$22,400.00", status: "Resolved" as TransactionStatus },
];

const kpis = [
  { label: "Total Revenue", value: "$428,390.00", change: "+12.4% vs last month", changeStyle: "text-green-600", valueStyle: "text-[#fe1219]" },
  { label: "Average Order Value", value: "$1,245.50", change: "+3.2%", changeStyle: "text-green-600", valueStyle: "text-[#151c23]" },
  { label: "Total Commissions", value: "$64,258.40", change: "-1.5%", changeStyle: "text-red-500", valueStyle: "text-[#151c23]" },
  { label: "Active Payouts", value: "142", change: "Pending Approval", changeStyle: "text-[#fe1219]", valueStyle: "text-[#151c23]" },
];

const months = [
  { month: "Jan", height: 68 }, { month: "Feb", height: 94 }, { month: "Mar", height: 128, active: true },
  { month: "Apr", height: 110 }, { month: "May", height: 145 }, { month: "Jun", height: 145 }, { month: "Jul", height: 145, active: true },
];

function StatusBadge({ status }: { status: TransactionStatus }) {
  const style = status === "Resolved" ? "bg-green-100 text-green-700" : status === "Pending" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-600";
  return <span className={`rounded-full px-2 py-1 text-[9px] font-bold uppercase ${style}`}>{status}</span>;
}

export default function RevenueAnalyticsPage() {
  const [range, setRange] = useState("Last 30 Days");
  const [tab, setTab] = useState("Transaction History");

  return (
    <main className="min-h-screen bg-[#f8f9fa] px-4 pb-12 pt-20 text-[#191c1d] sm:px-6 lg:px-8 lg:pt-8">
      <div className="mx-auto max-w-[1380px]">
        <header className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between"><div><h1 className="text-[28px] font-bold tracking-[-0.03em] sm:text-[32px]">Revenue Analytics</h1><p className="mt-1 text-sm text-[#5c5f61]">Real-time financial performance and transaction insights.</p></div><div className="flex flex-wrap gap-3"><label className="relative"><CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2" /><select value={range} onChange={(event) => setRange(event.target.value)} className="h-10 appearance-none rounded-lg border border-red-200 bg-white pl-10 pr-9 text-xs font-semibold outline-none"><option>Last 30 Days</option><option>Last 90 Days</option><option>This Year</option></select><ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-3 -translate-y-1/2" /></label><button className="flex h-10 items-center gap-2 rounded-lg border border-red-200 bg-white px-4 text-xs font-bold"><Download className="size-4 text-red-500" />CSV</button><button className="flex h-10 items-center gap-2 rounded-lg bg-[#fe1219] px-4 text-xs font-bold text-white shadow-sm"><FileText className="size-4" />PDF Export</button></div></header>

        <section className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">{kpis.map(({ label, value, change, changeStyle, valueStyle }) => <article key={label} className="rounded-xl bg-white p-5 shadow-[0_4px_16px_rgba(0,0,0,0.05)]"><p className="text-[10px] font-bold uppercase tracking-wide text-[#5c403d]">{label}</p><p className={`mt-3 text-2xl font-semibold ${valueStyle}`}>{value}</p><p className={`mt-2 text-[10px] font-bold ${changeStyle}`}>{change}</p></article>)}</section>

        <section className="mt-12 grid gap-6 xl:grid-cols-[2fr_1fr]">
          <article className="rounded-xl bg-white p-6 shadow-[0_4px_16px_rgba(0,0,0,0.05)]"><div className="flex justify-between"><h2 className="text-xs font-bold uppercase text-[#fe1219]">Monthly Revenue Growth</h2><button aria-label="Chart menu"><EllipsisVertical className="size-4" /></button></div><div className="mt-8 flex h-[215px] items-end justify-around gap-4 border-b border-[#f0f0f0] px-3">{months.map(({ month, height, active }) => <div key={month} className="flex h-full flex-1 flex-col items-center justify-end gap-3"><div style={{ height }} className={`w-full max-w-9 rounded-t-sm ${active ? "bg-[#fe1219]" : "bg-[#e1e3e4]"}`} /><span className={`pb-1 text-[9px] font-medium uppercase ${active ? "text-red-500" : "text-[#6d7175]"}`}>{month}</span></div>)}</div></article>
          <article className="rounded-xl bg-white p-6 shadow-[0_4px_16px_rgba(0,0,0,0.05)]"><h2 className="text-xs font-bold uppercase text-[#fe1219]">Revenue by Category</h2><div className="mx-auto mt-7 grid size-[148px] place-items-center rounded-full bg-[conic-gradient(#fe1219_0_65%,#e1e3e4_65%_100%)]"><div className="grid size-[105px] place-items-center rounded-full bg-white text-center"><div><p className="text-2xl font-bold">65%</p><p className="mt-1 text-[8px] font-bold uppercase text-[#5c5f61]">Industrial</p></div></div></div><div className="mt-6 space-y-3">{[["Industrial Equipment","$278.4k","bg-[#fe1219]"],["Heavy Machinery","$92.1k","bg-[#555]"],["Logistics / Misc","$57.8k","bg-[#e1e3e4]"]].map(([label,value,color]) => <div key={label} className="flex items-center text-xs"><span className={`mr-2 size-2.5 rounded-full ${color}`} /><span className="flex-1">{label}</span><strong>{value}</strong></div>)}</div></article>
        </section>

        <section className="mt-12 overflow-hidden rounded-xl bg-white shadow-[0_4px_16px_rgba(0,0,0,0.05)]"><div className="flex gap-8 border-b border-red-200 px-6">{["Transaction History","Commission Reports","Payout Log"].map((item) => <button key={item} onClick={() => setTab(item)} className={`h-12 border-b-2 px-3 text-xs font-semibold ${tab === item ? "border-[#fe1219] text-[#fe1219]" : "border-transparent text-[#5c403d]"}`}>{item}</button>)}</div>{tab === "Transaction History" ? <div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left"><thead className="bg-[#f4f5f6] text-[10px] font-semibold text-[#5c403d]"><tr><th className="px-5 py-4">Transaction ID</th><th className="px-4">User / Client</th><th className="px-4">Date</th><th className="px-4">Category</th><th className="px-4">Amount</th><th className="px-4">Status</th><th className="px-4">Action</th></tr></thead><tbody className="divide-y divide-red-200">{transactions.map((transaction) => <tr key={transaction.id} className="h-[86px] text-xs"><td className="px-5 text-[10px] font-bold text-[#fe1219]">{transaction.id}</td><td className="px-4"><div className="flex items-center gap-3"><span className="grid size-8 place-items-center rounded-full bg-[#edf0f1] text-[10px] font-bold text-[#5c403d]">{transaction.initials}</span><div><p className="font-semibold">{transaction.client}</p><p className="mt-1 text-[9px] text-[#5c403d]">{transaction.type}</p></div></div></td><td className="px-4">{transaction.date}</td><td className="px-4"><span className="rounded bg-[#eceeef] px-2 py-1 text-[9px]">{transaction.category}</span></td><td className="px-4 font-bold">{transaction.amount}</td><td className="px-4"><StatusBadge status={transaction.status} /></td><td className="px-4"><button aria-label={`View ${transaction.id}`}><Eye className="size-4 text-[#5c5f61]" /></button></td></tr>)}</tbody></table></div> : <div className="grid min-h-[300px] place-items-center text-sm text-[#777]">{tab} data is ready for review.</div>}<footer className="flex flex-col gap-4 border-t border-red-100 px-5 py-5 text-[10px] text-[#5c403d] sm:flex-row sm:items-center sm:justify-between"><p>Showing 1-4 of 1,280 transactions</p><div className="flex gap-2"><button className="grid size-8 place-items-center rounded border border-red-200"><ChevronLeft className="size-3" /></button>{[1,2,3].map(page => <button key={page} className={`size-8 rounded border text-xs ${page === 1 ? "border-red-500 bg-[#fe1219] text-white" : "border-red-200"}`}>{page}</button>)}<button className="grid size-8 place-items-center rounded border border-red-200"><ChevronRight className="size-3" /></button></div></footer></section>

        <section className="mt-12 grid gap-6 xl:grid-cols-2"><article className="rounded-xl border-t-2 border-[#fe1219] bg-white p-6 shadow-[0_4px_16px_rgba(0,0,0,0.05)]"><h2 className="text-2xl font-semibold text-[#fe1219]">Recent Commissions</h2><div className="mt-6 space-y-4">{[["Standard Platform Fee","Applied to Alpha Manufacturing order","$1,245.00"],["Premium Listing Upgrade","BuildStar Inc. Promotion","$45.00"]].map(([title,note,value]) => <div key={title} className="flex items-center rounded-lg border border-red-200 bg-[#f3f4f5] p-4"><span className="mr-4 grid size-8 place-items-center rounded bg-white text-red-500 shadow-sm"><Percent className="size-4" /></span><div className="min-w-0 flex-1"><p className="text-sm font-bold">{title}</p><p className="mt-1 truncate text-[10px] text-[#5c403d]">{note}</p></div><span className="text-sm text-[#fe1219]">{value}</span></div>)}</div><button className="mt-6 h-10 w-full rounded-lg border-2 border-[#fe1219] text-sm font-semibold text-[#fe1219]">View All Commission Data</button></article>
          <article className="rounded-xl bg-white p-6 shadow-[0_4px_16px_rgba(0,0,0,0.05)]"><h2 className="text-2xl font-semibold">Upcoming Payouts</h2><div className="mt-6 space-y-4">{[["BK","Barkley Logistics Group","Scheduled for Oct 28","$42,800.20","Ready","text-green-600"],["VS","Vanguard Systems","Scheduled for Oct 30","$8,900.00","Review","text-amber-600"]].map(([initials,name,date,value,status,color]) => <div key={name} className="flex items-center rounded-xl border border-red-200 p-4"><span className="mr-4 grid size-12 place-items-center rounded-lg bg-[#edeeef] text-lg font-bold text-[#fe1219]">{initials}</span><div className="min-w-0 flex-1"><p className="truncate font-bold">{name}</p><p className="mt-1 text-xs text-[#5c403d]">{date}</p></div><div className="text-right"><p className="text-lg font-bold">{value}</p><p className={`mt-1 text-[10px] font-bold uppercase ${color}`}>{status}</p></div></div>)}</div></article></section>
      </div>
    </main>
  );
}
