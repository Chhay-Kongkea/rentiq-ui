"use client";

import Image from "next/image";
import {
  AlertTriangle,
  Ban,
  CheckCircle2,
  Ellipsis,
  Filter,
  Gavel,
  MessageSquareWarning,
  SearchCheck,
  ShieldAlert,
} from "lucide-react";
import { useState } from "react";

type ReportStatus = "In Review" | "High Priority" | "Queued";

const reports = [
  { id: "#8821", item: "GenPower X500", image: "/img/admin/investigation-generator.png", reporter: "Sarah Jenkins", type: "Fraudulent", date: "Oct 24, 14:22", status: "In Review" as ReportStatus },
  { id: "#8818", item: "8K Cine Rig", image: "/img/admin/investigation-pc.png", reporter: "Michael R.", type: "Harassment", date: "Oct 24, 12:05", status: "High Priority" as ReportStatus },
  { id: "#8812", item: "BMW", image: "/img/admin/investigation-bmw.png", reporter: "System Audit", type: "Suspicious Login", date: "Oct 23, 18:45", status: "Queued" as ReportStatus },
];

const stats = [
  { label: "Pending Reports", value: "142", badge: "+12%", icon: AlertTriangle, iconStyle: "bg-red-100 text-red-500", badgeStyle: "bg-red-500 text-white" },
  { label: "Active Investigations", value: "28", badge: "Stable", icon: SearchCheck, iconStyle: "bg-neutral-200 text-neutral-600", badgeStyle: "bg-neutral-200 text-neutral-600" },
  { label: "Review Queue", value: "56", badge: "Low Vol", icon: MessageSquareWarning, iconStyle: "bg-slate-200 text-slate-600", badgeStyle: "bg-neutral-100 text-neutral-600" },
  { label: "Actions Taken", value: "1,092", badge: "Last 24h", icon: Gavel, iconStyle: "bg-red-100 text-red-500", badgeStyle: "bg-red-100 text-red-500" },
];

function StatusBadge({ status }: { status: ReportStatus }) {
  const style = status === "High Priority" ? "bg-green-100 text-green-700" : status === "In Review" ? "bg-amber-100 text-amber-700" : "bg-neutral-200 text-neutral-600";
  return <span className={`whitespace-nowrap rounded-full px-3 py-1 text-[10px] font-medium ${style}`}>{status}</span>;
}

export default function InvestigationsPage() {
  const [tab, setTab] = useState("Report Queue");
  const [selected, setSelected] = useState(reports[0]);
  const [notes, setNotes] = useState("");
  const [result, setResult] = useState("");

  const takeAction = (action: string) => setResult(`${action} recorded for ${selected.id}.`);

  return (
    <main className="min-h-screen bg-[#f8f9fa] px-4 pb-12 pt-20 text-[#191c1d] sm:px-6 lg:px-8 lg:pt-8">
      <div className="mx-auto max-w-[1380px]">
        <header className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between"><div><h1 className="text-[28px] font-bold tracking-[-0.03em] sm:text-[32px]">Reports &amp; Investigations</h1><p className="mt-1 text-sm text-[#5c403d]">Manage security, fraud, and user conduct across the platform.</p></div><div className="flex gap-3"><button className="flex h-10 items-center gap-2 rounded-lg border border-[#906f6c] bg-white px-5 text-xs font-bold"><Filter className="size-4" />Filters</button><button className="flex h-10 items-center gap-2 rounded-lg bg-[#fe1219] px-5 text-xs font-bold text-white shadow-sm"><ShieldAlert className="size-4" />Fraud Audit</button></div></header>

        <section className="mt-7 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">{stats.map(({ label, value, badge, icon: Icon, iconStyle, badgeStyle }) => <article key={label} className="rounded-xl border border-red-200 bg-white p-5 shadow-[0_4px_10px_rgba(0,0,0,0.04)]"><div className="flex items-center justify-between"><span className={`grid size-10 place-items-center rounded-lg ${iconStyle}`}><Icon className="size-5" /></span><span className={`rounded px-2 py-1 text-[9px] font-bold ${badgeStyle}`}>{badge}</span></div><p className="mt-3 text-xs font-bold uppercase tracking-wide text-[#5c403d]">{label}</p><p className="mt-1 text-2xl font-semibold">{value}</p></article>)}</section>

        <nav className="mt-6 flex gap-3 overflow-x-auto border-b border-red-200" aria-label="Investigation sections">{["Report Queue","Abuse Monitoring","Review Moderation","Action History"].map(item => <button key={item} onClick={() => setTab(item)} className={`h-12 shrink-0 border-b-2 px-6 text-sm font-semibold ${tab === item ? "border-[#fe1219] text-[#fe1219]" : "border-transparent text-[#5c403d]"}`}>{item}</button>)}</nav>

        <section className="mt-6 overflow-hidden rounded-xl border border-red-200 bg-white shadow-sm"><div className="overflow-x-auto"><table className="w-full min-w-[850px] text-left"><thead className="bg-[#f2f2f2] text-xs font-bold uppercase text-[#5c403d]"><tr><th className="px-4 py-4">Reported Item</th><th className="px-4">Reporter</th><th className="px-4">Type</th><th className="px-4">Date</th><th className="px-4">Status</th><th className="px-4">Actions</th></tr></thead><tbody className="divide-y divide-red-200">{reports.map(report => <tr key={report.id} onClick={() => setSelected(report)} className={`h-[88px] cursor-pointer text-sm transition-colors ${selected.id === report.id ? "bg-red-50/40" : "hover:bg-neutral-50"}`}><td className="px-4"><div className="flex items-center gap-3"><Image src={report.image} alt="" width={40} height={40} className="size-10 rounded-lg object-cover" /><span className="font-semibold">{report.item}</span></div></td><td className="px-4"><div className="flex items-center gap-2"><span className="size-7 rounded-full bg-neutral-200" />{report.reporter}</div></td><td className="px-4"><span className="rounded bg-neutral-200 px-2 py-1 text-xs">{report.type}</span></td><td className="px-4">{report.date}</td><td className="px-4"><StatusBadge status={report.status} /></td><td className="px-4"><button aria-label={`Actions for ${report.item}`} className="text-red-500"><Ellipsis className="size-5" /></button></td></tr>)}</tbody></table></div></section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[340px_1fr]">
          <article className="rounded-xl border border-red-200 bg-white p-6 shadow-sm"><h2 className="text-2xl font-semibold">Handle Report</h2><label className="mt-6 block text-[10px] font-medium uppercase text-[#5c403d]">Selected Case<input readOnly value={`${selected.id} - ${selected.item}`} className="mt-2 h-11 w-full rounded-lg border border-red-200 bg-[#f3f4f5] px-3 text-sm font-semibold outline-none" /></label><label className="mt-5 block text-[10px] font-medium uppercase text-[#5c403d]">Resolution Notes<textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Explain the investigation outcome..." className="mt-2 h-[98px] w-full resize-none rounded-lg border border-red-200 bg-[#f8f9fa] p-3 text-sm outline-none focus:border-red-400" /></label><div className="mt-5 grid grid-cols-2 gap-2"><button onClick={() => takeAction("Warning")} className="h-10 rounded-lg border border-[#906f6c] text-sm font-semibold">Warning</button><button onClick={() => takeAction("Suspension")} className="h-10 rounded-lg border border-[#906f6c] text-sm font-semibold">Suspension</button><button onClick={() => takeAction("Permanent ban")} className="col-span-2 h-11 rounded-lg bg-[#ff1119] text-sm font-semibold text-white shadow-sm">Issue Permanent Ban</button><button onClick={() => takeAction("Dismissal")} className="col-span-2 h-10 rounded-lg border border-red-200 text-sm font-semibold text-[#5c403d]">Dismiss Report</button></div>{result && <p role="status" className="mt-4 rounded-lg bg-green-50 p-3 text-xs font-medium text-green-700">{result}</p>}</article>

          <article className="rounded-xl border border-red-200 bg-white p-6 shadow-sm"><div className="flex items-center justify-between"><h2 className="text-2xl font-semibold">Action History Log</h2><button className="text-sm font-semibold text-[#fd121a]">Export Log</button></div><div className="mt-7 space-y-6">{[
            { title: <>User <strong className="text-red-500">@scam_buster</strong> was banned</>, detail: "Reason: Verification Fraud. Actioned by Admin_04.", time: "Today at 10:45 AM", icon: Ban, style: "bg-red-100 text-red-500" },
            { title: <>Warning issued to <strong className="text-red-500">@fast_rent_uk</strong></>, detail: "Reason: Late delivery complaints. Actioned by System_Bot.", time: "Yesterday at 6:30 PM", icon: AlertTriangle, style: "bg-neutral-200 text-neutral-600" },
            { title: <>Report ID #7762 Resolved</>, detail: "Status: Dismissed. Reason: Insufficient evidence. Actioned by Admin_04.", time: "Yesterday at 4:15 PM", icon: CheckCircle2, style: "bg-neutral-200 text-neutral-600" },
          ].map(({ title, detail, time, icon: Icon, style }, index) => <div key={time} className="flex gap-4"><div className="flex flex-col items-center"><span className={`grid size-8 place-items-center rounded-full ${style}`}><Icon className="size-4" /></span>{index < 2 && <span className="mt-1 h-11 w-px bg-red-200" />}</div><div><p className="text-sm font-semibold">{title}</p><p className="mt-1 text-sm text-[#5c403d]">{detail}</p><p className="mt-1 text-xs text-[#906f6c]">{time}</p></div></div>)}</div></article>
        </section>
      </div>
    </main>
  );
}
