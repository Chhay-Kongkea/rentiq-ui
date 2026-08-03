import {
  BadgeCheck,
  Banknote,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  FileCheck2,
  Lightbulb,
  Megaphone,
  ReceiptText,
  Settings2,
  Store,
  Users,
  X,
} from "lucide-react";
import Image from "next/image";

const kpis = [
  { label: "Total Users", value: "12,482", trend: "+12%", icon: Users },
  { label: "Active Listings", value: "843", trend: "+5.4%", icon: Store },
  { label: "Bookings Today", value: "42", badge: "Busy", icon: CalendarDays },
  { label: "Total Revenue", value: "$1.24M", trend: "+18%", icon: Banknote },
];

const activities = [
  { title: "New Host Verified", description: "John Doe approved as property owner.", time: "2 mins ago", icon: BadgeCheck, color: "text-emerald-500 border-emerald-400" },
  { title: "Booking Confirmed", description: 'Unit 402 - "Sky Garden Loft" booked.', time: "1 hour ago", icon: FileCheck2, color: "text-blue-500 border-blue-400" },
  { title: "Payment Failed", description: "User #9283 encountered bank error.", time: "3 hours ago", icon: CircleAlert, color: "text-red-500 border-red-400", danger: true },
  { title: "New Listing Posted", description: "Modern Studio in District 7 added.", time: "5 hours ago", icon: Store, color: "text-rose-400 border-rose-300" },
];

const approvals = [
  { name: "Lakeside Manor Villa", owner: "By Sarah Jenkins", type: "Listing", submitted: "Today, 10:45 AM", image: "/img/home.png" },
  { name: "Michael Chen", owner: "Identity Verification", type: "Host Profile", submitted: "Yesterday, 4:20 PM", image: "/img/man.png" },
  { name: "Industrial Loft Office", owner: "By Metro Spaces Ltd.", type: "Commercial", submitted: "Yesterday, 1:15 PM", image: "/img/room.png" },
];

function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`rounded-xl border border-[#e6e8ec] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] ${className}`}>{children}</section>;
}

export default function AdminDashboardPage() {
  return (
    <main className="min-h-screen bg-[#f3f3f3] px-4 pb-10 pt-20 sm:px-6 lg:px-8 lg:pt-7">
      <div className="mx-auto max-w-[1380px]">
        <header className="mb-6">
          <h1 className="text-[28px] font-bold tracking-[-0.03em] text-[#151c23] sm:text-[32px]">Admin Overview</h1>
          <p className="mt-1 text-sm text-[#5c5f61] sm:text-base">Platform command center — KPIs, pending actions, revenue snapshot, activity log.</p>
        </header>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 xl:gap-6">
          {kpis.map(({ label, value, trend, badge, icon: Icon }) => (
            <Panel key={label} className="p-5 sm:p-6">
              <div className="flex items-start justify-between">
                <div className="grid size-8 place-items-center rounded-lg bg-red-50 text-[#fe121a]">
                  <Icon className="size-[18px]" strokeWidth={2} />
                </div>
                {trend && <span className="text-xs font-bold text-green-600">{trend}↑</span>}
                {badge && <span className="rounded bg-red-100 px-2 py-0.5 text-[10px] font-bold uppercase text-[#fc1319]">{badge}</span>}
              </div>
              <p className="mt-4 text-sm font-bold uppercase tracking-[0.04em] text-[#5c5f61]">{label}</p>
              <p className="mt-1 text-2xl font-bold tracking-tight text-[#151c23]">{value}</p>
            </Panel>
          ))}
        </div>

        <div className="mt-6 grid items-start gap-6 xl:grid-cols-[minmax(0,2.3fr)_minmax(260px,1fr)]">
          <div className="space-y-6">
            <Panel className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-[#151c23]">Revenue Performance</h2>
                  <p className="text-sm text-[#77797b]">Monthly performance compared to last year</p>
                </div>
                <button type="button" className="flex shrink-0 items-center gap-2 rounded-md border border-red-200 px-3 py-2 text-xs font-semibold text-[#151c23]">
                  Last 30 Days <ChevronDown className="size-3" />
                </button>
              </div>
              <div className="mt-8 grid h-[220px] grid-cols-4 items-end gap-7 px-2 sm:gap-12">
                {[54, 80, 94, 67].map((height, index) => (
                  <div key={height} className="flex h-full flex-col justify-end gap-3">
                    <div className={`w-full rounded-t-lg ${index === 2 ? "bg-[#df929e]" : index === 0 ? "bg-[#f6e4e7]" : "bg-[#edc7cd]"}`} style={{ height: `${height}%` }} />
                    <span className="text-center text-[10px] font-medium text-[#434648]">WK {index + 1}</span>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel className="overflow-hidden">
              <h2 className="px-6 py-5 text-lg font-semibold text-[#151c23]">Pending Approvals</h2>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[680px] text-left">
                  <thead className="bg-[#eaf0f9] text-xs font-bold uppercase tracking-[0.06em] text-[#5c5f61]">
                    <tr><th className="px-7 py-3">Property / User</th><th className="px-4 py-3">Type</th><th className="px-4 py-3">Submitted</th><th className="px-4 py-3">Action</th></tr>
                  </thead>
                  <tbody className="divide-y divide-[#e6e8ec]">
                    {approvals.map((item) => (
                      <tr key={item.name} className="text-sm text-[#30353a]">
                        <td className="px-7 py-3">
                          <div className="flex items-center gap-3">
                            <Image src={item.image} alt="" width={40} height={40} className="size-10 rounded-md object-cover" />
                            <div><p className="font-bold leading-tight text-[#151c23]">{item.name}</p><p className="text-[10px] text-[#77797b]">{item.owner}</p></div>
                          </div>
                        </td>
                        <td className="px-4 py-3">{item.type}</td><td className="px-4 py-3 text-[#77797b]">{item.submitted}</td>
                        <td className="px-4 py-3"><div className="flex gap-2"><button aria-label={`Approve ${item.name}`} className="grid size-7 place-items-center rounded-full border border-emerald-200 text-emerald-500"><Check className="size-3.5" /></button><button aria-label={`Reject ${item.name}`} className="grid size-7 place-items-center rounded-full border border-red-200 text-red-500"><X className="size-3.5" /></button></div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>
          </div>

          <div className="space-y-6">
            <Panel className="p-6">
              <h2 className="mb-6 text-lg font-semibold text-[#151c23]">Recent Activity</h2>
              <div className="relative space-y-6 before:absolute before:bottom-3 before:left-[11px] before:top-3 before:w-px before:bg-[#e8eef8]">
                {activities.map(({ title, description, time, icon: Icon, color, danger }) => (
                  <div key={title} className="relative flex gap-4">
                    <div className={`z-10 grid size-6 shrink-0 place-items-center rounded-full border bg-white ${color}`}><Icon className="size-3.5" /></div>
                    <div><p className={`text-sm font-bold ${danger ? "text-red-600" : "text-[#151c23]"}`}>{title}</p><p className="mt-0.5 text-xs leading-4 text-[#77797b]">{description}</p><p className="mt-1 text-[9px] font-medium uppercase text-[#e9a0a3]">{time}</p></div>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel className="p-6">
              <h2 className="mb-5 text-lg font-semibold text-[#151c23]">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-3">
                {[{ label: "Broadcast", icon: Megaphone }, { label: "Verification", icon: BadgeCheck }, { label: "Refunds", icon: ReceiptText }, { label: "Parameters", icon: Settings2 }].map(({ label, icon: Icon }) => (
                  <button key={label} type="button" className="flex h-[74px] flex-col items-center justify-center gap-2 rounded-lg bg-[#e9eff9] text-[#202a35] transition-colors hover:bg-[#dfe8f5]"><Icon className="size-5" /><span className="text-[10px] font-medium uppercase tracking-wide">{label}</span></button>
                ))}
              </div>
              <div className="mt-3 flex gap-3 rounded-lg border border-red-200 bg-red-50 p-3 text-[#fe121a]">
                <Lightbulb className="mt-0.5 size-5 shrink-0" />
                <div><p className="text-[10px] font-bold uppercase">Pro Tip</p><p className="mt-0.5 text-[10px] leading-4 text-[#77797b]">Optimization suggested for 12 low-performing listings in the Central District area.</p></div>
              </div>
            </Panel>
          </div>
        </div>

        <nav aria-label="Dashboard pages" className="mt-6 flex justify-center gap-2">
          <button aria-label="Previous page" className="grid size-9 place-items-center rounded-md border border-neutral-200 bg-white text-neutral-300"><ChevronLeft className="size-4" /></button>
          {[1, 2, 3].map((page) => <button key={page} className={`size-9 rounded-md border text-sm font-semibold ${page === 1 ? "border-[#fe121a] bg-[#fe121a] text-white" : "border-red-200 bg-white text-[#5c5f61]"}`}>{page}</button>)}
          <span className="grid size-9 place-items-center text-sm text-[#77797b]">…</span><button className="size-9 rounded-md border border-red-200 bg-white text-sm text-[#5c5f61]">12</button>
          <button aria-label="Next page" className="grid size-9 place-items-center rounded-md border border-red-200 bg-white text-[#151c23]"><ChevronRight className="size-4" /></button>
        </nav>
      </div>
    </main>
  );
}
