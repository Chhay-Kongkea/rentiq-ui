"use client";

import {
  AlertTriangle,
  BarChart3,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  Download,
  Filter,
  ReceiptText,
  WalletCards,
} from "lucide-react";
import { useState } from "react";

const channelRows = [
  { name: "Booking Events", description: "New, modified, or cancelled bookings", email: true, push: true },
  { name: "Payment Events", description: "Success, failures, and payout status", email: true, push: false },
  { name: "Marketing & Growth", description: "Promo opportunities and platform tips", email: false, push: true },
  { name: "System Reports", description: "Weekly performance and tax summaries", email: true, push: false },
];

const notifications = [
  { title: "New Booking Request", time: "Just now", body: <>Sarah Jenkins has requested to book <strong>Lakeside Manor Villa</strong> for June 12–15.</>, icon: CalendarDays, style: "bg-red-50 text-red-500", actions: "booking" },
  { title: "Payout Processed", time: "2 hours ago", body: <>A payout of <strong>$1,240.50</strong> for the period May 20–27 has been initiated to your ABA Bank account.</>, icon: WalletCards, style: "bg-green-50 text-green-600", actions: "receipt" },
  { title: "Action Required: Listing Missing Info", time: "5 hours ago", body: <>The listing <strong>Industrial Loft Office</strong> is missing fire safety certification documents.</>, icon: AlertTriangle, style: "bg-orange-50 text-orange-500", actions: "update" },
  { title: "Monthly Performance Report", time: "Yesterday", body: <>Your monthly performance summary for May is ready. Total revenue up by 18% compared to last month.</>, icon: BarChart3, style: "bg-blue-50 text-blue-600", actions: "download" },
  { title: "Refund Request Completed", time: "May 28", body: <>Refund of $45.00 for Booking #9283 (Security Deposit) has been issued to the tenant.</>, icon: ReceiptText, style: "bg-red-50 text-red-500", actions: "none" },
];

function Checkbox({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return <button type="button" aria-label={label} aria-pressed={checked} onClick={onChange} className={`grid size-5 place-items-center rounded border ${checked ? "border-[#f73030] bg-[#f73030] text-white" : "border-red-200 bg-white"}`}>{checked && <Check className="size-3.5" />}</button>;
}

export default function SettingsPage() {
  const [language, setLanguage] = useState<"English" | "Khmer">("English");
  const [currency, setCurrency] = useState("USD ($) - US Dollar");
  const [channels, setChannels] = useState(channelRows);
  const [saved, setSaved] = useState(false);
  const [read, setRead] = useState(false);

  const toggleChannel = (index: number, key: "email" | "push") => setChannels(current => current.map((row, rowIndex) => rowIndex === index ? { ...row, [key]: !row[key] } : row));
  const reset = () => { setLanguage("English"); setCurrency("USD ($) - US Dollar"); setChannels(channelRows); setSaved(false); };

  return (
    <main className="min-h-screen bg-[#f3f3f3] px-4 pb-12 pt-20 text-[#191c1d] sm:px-6 lg:px-8 lg:pt-4"><div className="mx-auto max-w-[1380px]">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><h1 className="text-[28px] font-bold sm:text-[32px]">Platform Settings</h1><p className="mt-1 text-sm text-[#5f5e5e]">Configure your global localization and notification preferences.</p></div><div className="flex gap-3"><button onClick={reset} className="h-10 rounded-lg border border-[#906f6d] bg-white px-5 text-sm text-[#5c403d]">Reset Default</button><button onClick={() => setSaved(true)} className="h-10 rounded-lg bg-[#f73030] px-5 text-sm font-bold text-white">Save Changes</button></div></header>
      {saved && <p role="status" className="mt-3 rounded-lg bg-green-50 px-4 py-3 text-sm font-medium text-green-700">Settings saved successfully.</p>}

      <div className="mt-5 grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
        <div className="space-y-6">
          <section className="overflow-hidden rounded-xl border border-red-200 bg-white shadow-sm"><h2 className="flex h-14 items-center gap-2 border-b border-red-200 px-5 text-lg font-semibold before:h-6 before:w-1 before:rounded-full before:bg-[#f73030]">Regional Formats</h2><div className="space-y-6 p-8"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-semibold">Primary Language</p><p className="mt-1 max-w-40 text-[10px] leading-4 text-[#5f5e5e]">Used for your admin interface and emails</p></div><div className="flex rounded-lg bg-neutral-100 p-1">{(["English","Khmer"] as const).map(item => <button key={item} onClick={() => setLanguage(item)} className={`h-9 rounded-md px-5 text-xs ${language === item ? "bg-[#f73030] font-semibold text-white" : "text-[#5c403d]"}`}>{item}</button>)}</div></div><label className="block text-sm font-semibold">Base Currency<span className="relative mt-2 block"><select value={currency} onChange={event => setCurrency(event.target.value)} className="h-12 w-full appearance-none rounded-lg border border-red-200 bg-white px-4 text-sm font-normal text-[#5f5e5e] outline-none"><option>USD ($) - US Dollar</option><option>KHR (៛) - Cambodian Riel</option></select><ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-red-500" /></span></label><div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-semibold">Date Format<span className="mt-2 flex h-12 items-center justify-between rounded-lg border border-red-200 px-4 font-normal text-[#777]"><span>DD/MM/YYYY</span><CalendarDays className="size-5 text-red-500" /></span></label><label className="text-sm font-semibold">Time Format<span className="mt-2 flex h-12 items-center justify-between rounded-lg border border-red-200 px-4 font-normal text-[#777]"><span>12-hour (AM/PM)</span><Clock3 className="size-5 text-red-500" /></span></label></div></div></section>

          <section className="overflow-hidden rounded-xl border border-red-200 bg-white shadow-sm"><h2 className="flex h-14 items-center gap-2 border-b border-red-200 px-5 text-lg font-semibold before:h-6 before:w-1 before:rounded-full before:bg-[#f73030]">Notification Channels</h2><div className="grid grid-cols-[1fr_70px_70px] bg-red-50/50 px-7 py-3 text-[10px] font-bold uppercase"><span>Event Category</span><span className="text-center">Email</span><span className="text-center">Push</span></div>{channels.map((row,index) => <div key={row.name} className="grid min-h-[88px] grid-cols-[1fr_70px_70px] items-center border-t border-red-200 px-7"><div><p className="text-sm font-medium">{row.name}</p><p className="mt-1 max-w-48 text-[10px] leading-4 text-[#5f5e5e]">{row.description}</p></div><div className="flex justify-center"><Checkbox checked={row.email} onChange={() => toggleChannel(index,"email")} label={`Toggle email for ${row.name}`} /></div><div className="flex justify-center"><Checkbox checked={row.push} onChange={() => toggleChannel(index,"push")} label={`Toggle push for ${row.name}`} /></div></div>)}</section>
        </div>

        <section className="overflow-hidden rounded-xl border border-red-200 bg-white shadow-sm"><div className="flex h-14 items-center justify-between border-b border-red-200 px-5"><h2 className="flex items-center gap-2 text-lg font-semibold before:h-6 before:w-1 before:rounded-full before:bg-[#f73030]">Notification Center</h2><button onClick={() => setRead(true)} className="flex items-center gap-3 text-xs font-semibold"><Filter className="size-4" />{read ? "All marked as read" : "Mark all as read"}</button></div><div className="space-y-4 p-8">{notifications.map(({title,time,body,icon: Icon,style,actions},index) => <article key={title} className={`rounded-xl border border-red-200 p-5 ${!read && index === 0 ? "bg-red-50" : "bg-white"}`}><div className="flex gap-4"><span className={`grid size-10 shrink-0 place-items-center rounded-full ${style}`}><Icon className="size-5" /></span><div className="min-w-0 flex-1"><div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between"><h3 className="font-semibold">{title}</h3><time className="text-xs text-red-500">{time}</time></div><p className="mt-1 text-sm leading-5 text-[#5f5e5e]">{body}</p>{actions === "booking" && <div className="mt-4 flex gap-2"><button className="rounded bg-[#f73030] px-5 py-2 text-sm font-bold text-white">Accept</button><button className="rounded border border-[#906f6d] px-5 py-2 text-sm font-bold">Decline</button></div>}{actions === "receipt" && <button className="mt-3 flex items-center gap-1 text-sm font-bold"><ReceiptText className="size-3" />View Receipt</button>}{actions === "update" && <button className="mt-4 rounded bg-[#f73030] px-5 py-2 text-sm font-bold text-white">Update Documents</button>}{actions === "download" && <button className="mt-3 flex items-center gap-1 text-sm font-bold"><Download className="size-3" />Download PDF</button>}</div></div></article>)}<p className="py-4 text-center text-xs text-red-500">Older notifications archived</p></div></section>
      </div>
    </div></main>
  );
}
