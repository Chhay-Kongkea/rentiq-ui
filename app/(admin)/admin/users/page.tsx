"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Ban,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  EllipsisVertical,
  Filter,
  Search,
  Settings2,
  ShieldCheck,
  TrendingUp,
  UserPlus,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";

type UserStatus = "Verified" | "Pending" | "Banned";
type UserRole = "Renter" | "Vendor";

type AdminUser = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  joined: string;
  status: UserStatus;
  image: string;
};

const users: AdminUser[] = [
  { id: 1, name: "Hean Sitha", email: "sarah.j@enterprise.com", role: "Renter", joined: "Oct 24, 2023", status: "Verified", image: "/img/admin/user-sitha.png" },
  { id: 2, name: "Alex Rivera", email: "alex.r@vistas.io", role: "Vendor", joined: "Nov 12, 2023", status: "Pending", image: "/img/admin/user-alex.png" },
  { id: 3, name: "Thomas Wright", email: "twright@mail.co", role: "Renter", joined: "Sep 05, 2023", status: "Banned", image: "/img/admin/user-thomas.png" },
  { id: 4, name: "Elena Rodriguez", email: "elena.rod@vanguard.io", role: "Vendor", joined: "Dec 02, 2023", status: "Verified", image: "/img/admin/user-elena.png" },
  { id: 5, name: "Alex Rivera", email: "alex.r@vistas.io", role: "Vendor", joined: "Nov 12, 2023", status: "Pending", image: "/img/admin/user-alex.png" },
  { id: 6, name: "Alex Rivera", email: "alex.r@vistas.io", role: "Vendor", joined: "Nov 12, 2023", status: "Pending", image: "/img/admin/user-alex.png" },
];

const vendorUsers: AdminUser[] = [
  { id: 1, name: "Sarah Jenkins", email: "sarah.j@enterprise.com", role: "Vendor", joined: "Oct 24, 2023", status: "Verified", image: "/img/admin/user-sitha.png" },
  { id: 2, name: "Alex Rivera", email: "alex.r@vistas.io", role: "Vendor", joined: "Nov 12, 2023", status: "Pending", image: "/img/admin/user-alex.png" },
  { id: 3, name: "Thomas Wright", email: "twright@mail.co", role: "Vendor", joined: "Sep 05, 2023", status: "Banned", image: "/img/admin/user-thomas.png" },
  { id: 4, name: "Elena Rodriguez", email: "elena.rod@vanguard.io", role: "Vendor", joined: "Dec 02, 2023", status: "Verified", image: "/img/admin/user-elena.png" },
  { id: 5, name: "Alex Rivera", email: "alex.r@vistas.io", role: "Vendor", joined: "Nov 12, 2023", status: "Pending", image: "/img/admin/user-alex.png" },
  { id: 6, name: "Alex Rivera", email: "alex.r@vistas.io", role: "Vendor", joined: "Nov 12, 2023", status: "Pending", image: "/img/admin/user-alex.png" },
];

const stats = [
  { label: "Total Users", value: "24,512", badge: "+12.5%", icon: Users, color: "text-blue-600 bg-blue-50", badgeColor: "text-green-600 bg-green-50" },
  { label: "ID Verifications", value: "182", badge: "Pending", icon: ShieldCheck, color: "text-violet-600 bg-violet-50", badgeColor: "text-amber-600 bg-amber-50" },
  { label: "Flagged Accounts", value: "14", badge: "High", icon: Ban, color: "text-red-600 bg-red-50", badgeColor: "text-red-600 bg-red-50" },
  { label: "Platform Health", value: "Optimal", badge: "100%", icon: TrendingUp, color: "text-green-600 bg-green-50", badgeColor: "text-green-600 bg-green-50" },
];

const tabs = ["All Users", "Renters", "Vendor", "Pending", "Banned"] as const;

function StatusBadge({ status }: { status: UserStatus }) {
  const style = status === "Verified" ? "bg-green-50 text-green-600" : status === "Pending" ? "bg-amber-50 text-amber-600" : "bg-red-50 text-red-600";
  return <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold ${style}`}><CheckCircle2 className="size-3" />{status}</span>;
}

export default function UserManagementPage() {
  const pathname = usePathname();
  const vendorMode = pathname.startsWith("/admin/vendors");
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("All Users");
  const [query, setQuery] = useState("");
  const [verification, setVerification] = useState("All");
  const [selected, setSelected] = useState<number[]>([]);

  const visibleUsers = useMemo(() => (vendorMode ? vendorUsers : users).filter((user) => {
    const tabMatches = activeTab === "All Users" || activeTab === "Renters" && user.role === "Renter" || activeTab === "Vendor" && user.role === "Vendor" || activeTab === user.status;
    const statusMatches = verification === "All" || user.status === verification;
    const searchMatches = `${user.name} ${user.email}`.toLowerCase().includes(query.toLowerCase());
    return tabMatches && statusMatches && searchMatches;
  }), [activeTab, query, vendorMode, verification]);

  const toggleAll = () => setSelected(selected.length === visibleUsers.length ? [] : visibleUsers.map((user) => user.id));
  const toggleUser = (id: number) => setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);

  return (
    <main className="min-h-screen bg-[#f3f3f3] px-4 pb-8 pt-20 sm:px-6 lg:px-8 lg:pt-8">
      <div className="mx-auto max-w-[1380px]">
        <header className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h1 className="text-[28px] font-bold tracking-[-0.03em] text-[#151c23] sm:text-[32px]">{vendorMode ? "Vendor Management" : "User Management"}</h1>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-[#5c5f61] sm:text-base">Search, filter, and moderate platform members. Manage both Renters and Owners, verify identities, and enforce safety protocols.</p>
          </div>
          <div className="flex gap-3">
            <button type="button" className="inline-flex h-10 items-center gap-2 rounded-2xl bg-white px-5 text-sm font-bold text-neutral-400 opacity-70"><Download className="size-4" />Export List</button>
            <button type="button" className="inline-flex h-10 items-center gap-2 rounded-2xl bg-[#f73030] px-5 text-sm font-bold text-white shadow-[0_8px_16px_rgba(252,19,25,0.2)]"><UserPlus className="size-4" />Create User</button>
          </div>
        </header>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4 xl:gap-6">
          {stats.map(({ label, value, badge, icon: Icon, color, badgeColor }) => (
            <div key={label} className="rounded-2xl border border-[#e6e8ec] bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
              <div className="flex items-start justify-between"><div className={`grid size-[38px] place-items-center rounded-lg ${color}`}><Icon className="size-5" /></div><span className={`rounded-full px-2 py-1 text-[10px] font-bold ${badgeColor}`}>{badge}</span></div>
              <p className="mt-4 text-xs font-medium text-[#5c5f61]">{label}</p><p className="mt-1 text-2xl font-bold tracking-tight text-[#151c23]">{value}</p>
            </div>
          ))}
        </section>

        <section className="mt-6 flex flex-col gap-4 rounded-2xl border border-red-200 bg-white p-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="grid grid-cols-2 gap-1 rounded-xl bg-[#f0f0f0] p-1 sm:grid-cols-5">
            {tabs.map((tab) => <button key={tab} type="button" onClick={() => setActiveTab(tab)} className={`h-9 rounded-xl px-5 text-sm transition-all ${activeTab === tab ? "bg-[#f73030] font-bold text-white shadow-sm" : "font-medium text-[#5c5f61] hover:bg-white/70"}`}>{tab}</button>)}
          </div>
          <div className="flex gap-2">
            <label className="relative flex h-10 min-w-0 flex-1 items-center sm:min-w-[205px]">
              <Filter className="pointer-events-none absolute left-3 size-3.5 text-[#77797b]" />
              <select value={verification} onChange={(event) => setVerification(event.target.value)} className="h-full w-full appearance-none rounded-xl border border-red-200 bg-white pl-9 pr-9 text-xs text-[#30353a] outline-none"><option value="All">Verification Status</option><option>Verified</option><option>Pending</option><option>Banned</option></select>
              <ChevronDown className="pointer-events-none absolute right-3 size-3.5 text-[#77797b]" />
            </label>
            <button type="button" aria-label="Download filtered users" className="grid size-10 shrink-0 place-items-center rounded-xl border border-red-200 bg-white text-[#5c5f61]"><Download className="size-4" /></button>
          </div>
        </section>

        <section className="mt-6 overflow-hidden rounded-2xl border border-[#e6e8ec] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <div className="flex flex-col gap-3 border-b border-[#e6e8ec] p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <label className="relative block w-full sm:w-[245px]"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-300" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Quick search users..." className="h-9 w-full rounded-full border border-[#e1e5eb] bg-[#f4f5f7] pl-10 pr-4 text-xs outline-none focus:border-red-300" /></label>
            <button type="button" className="inline-flex items-center gap-2 self-end text-xs font-semibold text-[#5c5f61]"><Settings2 className="size-4" />Bulk Actions{selected.length > 0 && <span className="rounded-full bg-red-50 px-2 py-0.5 text-red-600">{selected.length}</span>}</button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[840px] text-left">
              <thead className="bg-[#f7f8fa] text-[10px] font-bold uppercase tracking-wide text-[#5c5f61]"><tr><th className="w-14 px-6 py-4"><input type="checkbox" aria-label="Select all users" checked={visibleUsers.length > 0 && selected.length === visibleUsers.length} onChange={toggleAll} className="accent-[#f73030]" /></th><th className="px-3 py-4">User Profile</th><th className="px-3 py-4">Role</th><th className="px-3 py-4">Join Date</th><th className="px-3 py-4">ID Status</th><th className="px-3 py-4">Actions</th></tr></thead>
              <tbody className="divide-y divide-[#e6e8ec]">
                {visibleUsers.map((user) => (
                  <tr key={user.id} className={`h-[72px] text-sm ${user.status === "Banned" ? "text-neutral-400" : "text-[#30353a]"}`}>
                    <td className="px-6"><input type="checkbox" aria-label={`Select ${user.name}`} checked={selected.includes(user.id)} onChange={() => toggleUser(user.id)} className="accent-[#f73030]" /></td>
                    <td className="px-3"><div className="flex items-center gap-3"><Image src={user.image} alt="" width={40} height={40} className={`size-10 rounded-full object-cover ${user.status === "Banned" ? "grayscale" : ""}`} /><div><Link href={`/admin/users/${user.id}`} className="font-medium leading-5 hover:text-red-600 hover:underline">{user.name}</Link><p className="text-[10px] text-[#77797b]">{user.email}</p></div></div></td>
                    <td className={`px-3 font-medium ${user.role === "Vendor" ? "text-blue-600" : ""}`}>{user.role}</td><td className="px-3 text-[#77797b]">{user.joined}</td><td className="px-3"><StatusBadge status={user.status} /></td>
                    <td className="px-3"><div className="flex items-center gap-2">{user.status === "Pending" && <button type="button" className="rounded-lg bg-green-600 px-3 py-2 text-[10px] font-bold text-white">Verify ID</button>}{user.status === "Banned" && <button type="button" className="rounded-lg border border-red-500 px-3 py-2 text-[10px] font-bold text-red-500">Reactivate</button>}<button type="button" aria-label={`More actions for ${user.name}`} className="grid size-8 place-items-center"><EllipsisVertical className="size-4" /></button></div></td>
                  </tr>
                ))}
                {visibleUsers.length === 0 && <tr><td colSpan={6} className="px-6 py-14 text-center text-sm text-[#77797b]">No users match the selected filters.</td></tr>}
              </tbody>
            </table>
          </div>

          <footer className="flex flex-col gap-4 border-t border-[#e6e8ec] px-5 py-4 text-[10px] text-[#5c5f61] sm:flex-row sm:items-center sm:justify-between"><p>Showing {visibleUsers.length ? 1 : 0} to {visibleUsers.length} of 24,512 entries</p><nav aria-label="User list pages" className="flex gap-2"><button aria-label="Previous page" className="grid size-9 place-items-center rounded-md border border-neutral-200 text-neutral-300"><ChevronLeft className="size-4" /></button>{[1, 2, 3].map((page) => <button key={page} className={`size-9 rounded-md border text-xs font-semibold ${page === 1 ? "border-[#fe121a] bg-[#fe121a] text-white" : "border-red-200 text-[#5c5f61]"}`}>{page}</button>)}<span className="grid size-9 place-items-center">…</span><button className="size-9 rounded-md border border-red-200">12</button><button aria-label="Next page" className="grid size-9 place-items-center rounded-md border border-red-200"><ChevronRight className="size-4" /></button></nav></footer>
        </section>
      </div>
    </main>
  );
}
