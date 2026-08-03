"use client";

import Image from "next/image";
import {
  ArrowDownToLine,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock3,
  DollarSign,
  Download,
  HandCoins,
  RotateCcw,
  ShieldCheck,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

type PaymentStatus = "Held in Escrow" | "Released" | "Unpaid";

const transactions = [
  { id: "BK-250501-001", renter: "John D", renterImage: "/img/admin/payment-john.png", owner: "Sam Vei", ownerImage: "/img/admin/payment-sam.png", gross: "$180.00", commission: "10%", net: "$162.00", status: "Held in Escrow" as PaymentStatus, method: "Credit Card" },
  { id: "BK-250501-002", renter: "Alice K", renterImage: "/img/admin/payment-alice.png", owner: "Tom Ret", ownerImage: "/img/admin/payment-tom.png", gross: "$250.00", commission: "10%", net: "$225.00", status: "Released" as PaymentStatus, method: "Bank Transfer" },
  { id: "BK-250501-003", renter: "Sokha", renterImage: "/img/admin/payment-sokha.png", owner: "Buildit C", ownerImage: "/img/admin/payment-buildit.png", gross: "$300.00", commission: "8%", net: "$276.00", status: "Unpaid" as PaymentStatus, method: "KHQR" },
];

const metrics = [
  { label: "Total Transactions", value: "1,256", detail: "+12%", note: "All time", icon: DollarSign, style: "bg-rose-50 text-red-500" },
  { label: "Held in Escrow", value: "128", detail: "$24.5k", note: "Active holdings", icon: ShieldCheck, style: "bg-orange-50 text-orange-500" },
  { label: "Released to Vendor", value: "982", detail: "$198.7k", note: "Confirmed payouts", icon: HandCoins, style: "bg-green-50 text-green-600" },
  { label: "Refunds (Total)", value: "74", detail: "$8.5k", note: "Processed", icon: RotateCcw, style: "bg-blue-50 text-blue-500" },
  { label: "Total Payouts", value: "972", detail: "$190.2k", note: "Successful", icon: ArrowDownToLine, style: "bg-violet-50 text-violet-500" },
];

function StatusBadge({ status }: { status: PaymentStatus }) {
  const styles = status === "Released" ? "bg-green-50 text-green-600" : status === "Unpaid" ? "bg-red-50 text-red-500" : "bg-orange-50 text-orange-600";
  return <span className={`inline-flex whitespace-nowrap rounded-full px-3 py-1.5 text-[9px] font-bold uppercase ${styles}`}>{status}</span>;
}

export default function PaymentsPage() {
  const [status, setStatus] = useState("All Status");
  const [payoutMode, setPayoutMode] = useState<"Automatic" | "Manual">("Automatic");
  const rows = useMemo(() => status === "All Status" ? transactions : transactions.filter((transaction) => transaction.status === status), [status]);

  return (
    <main className="min-h-screen bg-[#f4f4f4] px-4 pb-12 pt-20 text-[#151c23] sm:px-6 lg:px-8 lg:pt-8">
      <div className="mx-auto max-w-[1380px]">
        <header>
          <h1 className="text-[28px] font-bold sm:text-[32px]">Payment monitor</h1>
          <p className="mt-1 text-sm leading-6 text-[#676b70]">Track and manage all platform payment transactions, escrow, refunds, payouts, and wallet activities.</p>
        </header>

        <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {metrics.map(({ label, value, detail, note, icon: Icon, style }) => (
            <article key={label} className="min-h-[150px] rounded-2xl bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between"><span className={`grid size-10 place-items-center rounded-xl ${style}`}><Icon className="size-5" /></span><span className="text-xs font-bold text-[#555b61]">{detail}</span></div>
              <p className="mt-4 text-[10px] font-bold uppercase tracking-wide text-[#676b70]">{label}</p>
              <div className="mt-1 flex items-end justify-between"><p className="text-2xl font-bold">{value}</p><p className="pb-1 text-[9px] text-[#8b9197]">{note}</p></div>
            </article>
          ))}
        </section>

        <section className="mt-6 overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-[#edf0f2] px-6 py-5 xl:flex-row xl:items-center xl:justify-between">
            <div><h2 className="text-lg font-bold">Transactions &amp; Escrow</h2><p className="mt-1 text-[10px] text-[#7a8086]">Track all bookings and payment status</p></div>
            <div className="flex flex-wrap gap-3">
              <label className="relative"><select value={status} onChange={(event) => setStatus(event.target.value)} className="h-10 appearance-none rounded-xl border border-[#e8e9eb] bg-white pl-4 pr-10 text-xs font-semibold outline-none"><option>All Status</option><option>Held in Escrow</option><option>Released</option><option>Unpaid</option></select><ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#777]" /></label>
              <button className="h-10 rounded-xl border border-[#e8e9eb] bg-white px-4 text-xs font-semibold text-[#555b61]">2025-05-01 - 2025-05-31</button>
              <button className="flex h-10 items-center gap-2 rounded-xl bg-[#f73030] px-5 text-xs font-bold text-white"><Download className="size-4" /> Export</button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-left">
              <thead className="bg-[#fafbfc] text-[9px] font-bold uppercase tracking-wide text-[#686d72]"><tr><th className="px-6 py-4">Booking ID</th><th className="px-4">Renter</th><th className="px-4">Owner</th><th className="px-4">Gross</th><th className="px-4">Comm %</th><th className="px-4">Net</th><th className="px-4">Status</th><th className="px-4">Method</th><th className="px-4">Action</th></tr></thead>
              <tbody className="divide-y divide-[#edf0f2]">{rows.map((transaction) => <tr key={transaction.id} className="h-[82px] text-xs"><td className="px-6 font-bold">{transaction.id}</td><td className="px-4"><div className="flex items-center gap-2.5"><Image src={transaction.renterImage} alt="" width={32} height={32} className="size-8 rounded-full object-cover" />{transaction.renter}</div></td><td className="px-4"><div className="flex items-center gap-2.5"><Image src={transaction.ownerImage} alt="" width={32} height={32} className="size-8 rounded-full object-cover" />{transaction.owner}</div></td><td className="px-4 font-semibold">{transaction.gross}</td><td className="px-4 text-[#686d72]">{transaction.commission}</td><td className="px-4 font-bold">{transaction.net}</td><td className="px-4"><StatusBadge status={transaction.status} /></td><td className="px-4 text-[#555b61]">{transaction.method}</td><td className="px-4"><button aria-label={`View ${transaction.id}`} className="grid size-8 place-items-center rounded-lg border border-[#eaedef] text-[#70757a]"><ChevronRight className="size-4" /></button></td></tr>)}</tbody>
            </table>
          </div>
          {rows.length === 0 && <p className="py-10 text-center text-sm text-[#777]">No transactions match this status.</p>}
          <div className="flex flex-col gap-4 border-t border-[#edf0f2] px-6 py-5 text-[10px] text-[#777] sm:flex-row sm:items-center sm:justify-between"><p>Showing 1 to {rows.length} of 1,256 entries</p><div className="flex items-center gap-1"><button className="grid size-8 place-items-center rounded-lg border border-[#eceeef]">‹</button>{[1,2,3].map(page => <button key={page} className={`grid size-8 place-items-center rounded-lg ${page === 1 ? "bg-[#f73030] font-bold text-white" : "border border-[#eceeef]"}`}>{page}</button>)}<span className="px-1">…</span><button className="grid size-8 place-items-center rounded-lg border border-[#eceeef]">252</button><button className="grid size-8 place-items-center rounded-lg border border-[#eceeef]">›</button></div></div>
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-2">
          <article className="rounded-2xl bg-white p-6 shadow-sm"><h2 className="text-lg font-bold">Refunds Management</h2><p className="mt-1 text-[10px] text-[#7a8086]">Review and process customer refund requests</p><div className="mt-6 grid grid-cols-3 gap-3">{[["Pending","18",Clock3,"bg-orange-50 text-orange-500"],["Approved","25",CheckCircle2,"bg-green-50 text-green-600"],["Rejected","7",X,"bg-red-50 text-red-500"]].map(([label,value,Icon,style]) => { const IconComponent = Icon as typeof Clock3; return <div key={label as string} className="rounded-xl border border-[#eef0f2] p-4"><span className={`grid size-8 place-items-center rounded-lg ${style}`}><IconComponent className="size-4" /></span><p className="mt-3 text-[10px] text-[#777]">{label as string}</p><p className="mt-1 text-xl font-bold">{value as string}</p></div>})}</div><div className="mt-6 flex gap-3"><button className="h-10 flex-1 rounded-xl border border-[#f1c7c7] text-xs font-bold text-[#555b61]">View All</button><button className="h-10 flex-1 rounded-xl bg-[#f73030] text-xs font-bold text-white">Create Refund</button></div></article>

          <article className="rounded-2xl bg-white p-6 shadow-sm"><h2 className="text-lg font-bold">Owner Payout System</h2><p className="mt-1 text-[10px] text-[#7a8086]">Configure and track payouts to property owners</p><div className="mt-6 flex rounded-xl bg-[#f4f5f6] p-1">{(["Automatic","Manual"] as const).map(mode => <button key={mode} onClick={() => setPayoutMode(mode)} className={`h-10 flex-1 rounded-lg text-xs font-bold ${payoutMode === mode ? "bg-white text-[#f73030] shadow-sm" : "text-[#73787d]"}`}>{mode} Payout</button>)}</div><div className="mt-5 divide-y divide-[#edf0f2] rounded-xl border border-[#edf0f2]"><button className="flex h-14 w-full items-center justify-between px-4 text-xs font-bold"><span className="flex items-center gap-3"><span className="grid size-8 place-items-center rounded-lg bg-green-50 text-green-600"><Check className="size-4" /></span>Payout History</span><ChevronRight className="size-4 text-[#777]" /></button><button className="flex h-14 w-full items-center justify-between px-4 text-xs font-bold"><span className="flex items-center gap-3"><span className="grid size-8 place-items-center rounded-lg bg-blue-50 text-blue-500"><DollarSign className="size-4" /></span>Payout Tracking</span><ChevronRight className="size-4 text-[#777]" /></button></div></article>
        </section>
      </div>
    </main>
  );
}
