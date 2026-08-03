"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  BadgeDollarSign,
  BellRing,
  BookOpenCheck,
  CircleHelp,
  ClipboardCheck,
  LayoutGrid,
  Gauge,
  LogOut,
  Menu,
  Megaphone,
  Settings,
  ShieldAlert,
  Store,
  Users,
  WalletCards,
  X,
} from "lucide-react";
import { useState } from "react";

const navigation = [
  { label: "Dashboard", href: "/admin/dashboard", icon: Gauge },
  { label: "User Management", href: "/admin/users", icon: Users },
  { label: "Revenue", href: "/admin/financial-reports/revenue", icon: BadgeDollarSign },
  { label: "Investigations", href: "/admin/disputes", icon: ShieldAlert },
  { label: "Vendor Management", href: "/admin/vendors", icon: Store },
  { label: "Listing Approvals", href: "/admin/listings", icon: ClipboardCheck },
  { label: "Categories", href: "/admin/categories", icon: LayoutGrid },
  { label: "Booking Monitor", href: "/admin/bookings", icon: BookOpenCheck },
  { label: "Wallet & Payments", href: "/admin/payments", icon: WalletCards },
  { label: "Promotions", href: "/admin/advertisements/promotions", icon: Megaphone },
];

const systemNavigation = [
  { label: "Reports & Moderation", href: "/admin/reports", icon: BellRing },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

function NavigationLink({
  label,
  href,
  icon: Icon,
  onNavigate,
}: (typeof navigation)[number] & { onNavigate: () => void }) {
  const pathname = usePathname();
  const active = pathname === href ||
    (href !== "/admin/dashboard" && pathname.startsWith(`${href}/`)) ||
    (label === "Wallet & Payments" && pathname === "/admin/commissions");

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={`relative flex h-12 items-center gap-3 rounded-lg px-4 text-[15px] font-bold transition-colors ${
        active
          ? "bg-red-50 text-[#5c5f61] after:absolute after:inset-y-0 after:right-0 after:w-1 after:rounded-full after:bg-[#fe121a]"
          : "text-[#5c5f61] hover:bg-neutral-50"
      }`}
    >
      <Icon className="size-[19px] shrink-0" strokeWidth={1.8} />
      <span>{label}</span>
    </Link>
  );
}

export default function AdminSidebar() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <>
      <button
        type="button"
        aria-label="Open admin menu"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="fixed left-4 top-4 z-40 grid size-10 place-items-center rounded-lg border border-neutral-200 bg-white text-neutral-700 shadow-sm lg:hidden"
      >
        <Menu className="size-5" />
      </button>

      {open && (
        <button
          type="button"
          aria-label="Close admin menu"
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={close}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[300px] flex-col border-r border-[#e2e8f0] bg-white transition-transform duration-200 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex min-h-0 flex-1 flex-col px-6 pt-5">
          <div className="mb-5 flex h-12 items-center justify-between">
            <Link href="/admin/dashboard" onClick={close} aria-label="Rentiq admin dashboard">
              <Image src="/img/Rentiq.png" alt="Rentiq" width={133} height={46} className="h-[46px] w-[133px] object-contain" priority />
            </Link>
            <button type="button" aria-label="Close admin menu" onClick={close} className="lg:hidden">
              <X className="size-5" />
            </button>
          </div>

          <nav aria-label="Admin navigation" className="min-h-0 flex-1 space-y-1 overflow-y-auto pr-1">
            {navigation.map((item) => (
              <NavigationLink key={item.href} {...item} onNavigate={close} />
            ))}
            <p className="px-4 pb-2 pt-5 text-xs font-bold uppercase tracking-[0.08em] text-[#eabcb6]">System</p>
            {systemNavigation.map((item) => (
              <NavigationLink key={item.href} {...item} onNavigate={close} />
            ))}
          </nav>
        </div>

        <div className="border-t border-rose-100/50 px-4 py-5">
          <div className="mb-3 flex items-center gap-3 px-4">
            <div className="grid size-10 shrink-0 place-items-center rounded-full bg-pink-100 text-sm font-bold text-pink-600">N</div>
            <div>
              <p className="text-sm font-bold text-[#151c23]">Nadia Chan</p>
              <p className="text-[10px] font-bold uppercase text-green-600">Super Admin</p>
            </div>
          </div>
          <Link href="/admin/support" className="flex items-center gap-3 rounded-lg px-4 py-2 text-sm text-[#5c5f61] hover:bg-neutral-50">
            <CircleHelp className="size-4" /> Support
          </Link>
          <button type="button" className="flex w-full items-center gap-3 rounded-lg px-4 py-2 text-sm text-[#5c5f61] hover:bg-neutral-50">
            <LogOut className="size-4" /> Logout
          </button>
        </div>
      </aside>
    </>
  );
}
