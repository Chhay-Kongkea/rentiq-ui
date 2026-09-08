"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  CalendarCheck,
  ClipboardList,
  Gauge,
  Headphones,
  Inbox,
  LogOut,
  Megaphone,
  Menu,
  PanelLeft,
  Rocket,
  Star,
  TrendingUp,
  Wallet,
  X,
  type LucideIcon,
} from "lucide-react";
import Footer from "@/components/footer";
import { useGetMyProfileQuery } from "@/redux/services/userApi";
import {
  useGetVendorBookingsQuery,
  useGetVendorUnreadNotificationCountQuery,
} from "@/redux/services/vendorApi";

const SIDEBAR_STORAGE_KEY = "vendor-dashboard-sidebar-collapsed";
const ACCENT = "#ff3b30";

type NavItem = { name: string; href: string; icon: LucideIcon; count?: number };

export default function VendorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // Desktop-only: collapse the sidebar to an icon rail. Seeded from the last
  // choice so a reload keeps it the way the vendor left it.
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try {
      return window.localStorage.getItem(SIDEBAR_STORAGE_KEY) === "true";
    } catch {
      return false;
    }
  });

  const { data: profile } = useGetMyProfileQuery();
  const { data: bookings = [] } = useGetVendorBookingsQuery();
  const { data: unread } = useGetVendorUnreadNotificationCountQuery();
  const pendingBookings = bookings.filter((booking) => booking.status === "PENDING").length;

  const navItems: NavItem[] = [
    { name: "Dashboard", href: "/vendor/dashboard", icon: Gauge },
    { name: "Requests", href: "/vendor/dashboard/requests", icon: Inbox },
    { name: "Booking", href: "/vendor/dashboard/booking", icon: CalendarCheck, count: pendingBookings },
    { name: "Listings", href: "/vendor/dashboard/listings", icon: ClipboardList },
    { name: "Promotions", href: "/vendor/dashboard/promotions", icon: Rocket },
    { name: "Advertisements", href: "/vendor/dashboard/advertisements", icon: Megaphone },
    { name: "Earnings", href: "/vendor/dashboard/earnings", icon: TrendingUp },
    { name: "Reviews", href: "/vendor/dashboard/reviews", icon: Star },
    { name: "Wallet", href: "/vendor/dashboard/wallet", icon: Wallet },
    { name: "Notification", href: "/vendor/dashboard/notifications", icon: Bell, count: Number(unread?.unreadCount || 0) },
  ];

  const setCollapsed = (value: boolean) => {
    setIsCollapsed(value);
    try {
      window.localStorage.setItem(SIDEBAR_STORAGE_KEY, String(value));
    } catch {
      // Ignore persistence failures.
    }
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="flex min-h-screen text-slate-800">
      {/* ---------------- MOBILE TOP BAR ---------------- */}
      <header className="fixed inset-x-0 top-0 z-30 flex h-16 items-center justify-between border-b border-slate-100 bg-white px-4 lg:hidden">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition active:scale-95"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <Link href="/" aria-label="Go to Rentiq home" className="flex items-center">
            <img src="/img/rentiq.png" alt="Rentiq" className="h-7 w-auto object-contain" />
          </Link>
        </div>
        <img
          src={profile?.avatarUrl || "/img/samsreynich.jpg"}
          alt="Vendor profile"
          className="h-9 w-9 rounded-full border border-slate-200 object-cover"
        />
      </header>

      {/* ---------------- MOBILE OVERLAY ---------------- */}
      {isMobileMenuOpen && (
        <div
          onClick={closeMobileMenu}
          className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm transition-opacity lg:hidden"
        />
      )}

      {/* ---------------- SIDEBAR ---------------- */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col justify-between border-r border-slate-200 bg-white transition-[transform,width] duration-300 ease-in-out
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
          ${isCollapsed ? "lg:w-20" : "lg:w-64"}`}
      >
        <div className="flex-1 overflow-y-auto px-3 py-6">
          {/* Logo */}
          <div
            className={`mb-6 flex h-10 items-center px-1 ${
              isCollapsed ? "justify-between lg:justify-center" : "justify-between"
            }`}
          >
            <Link href="/" onClick={closeMobileMenu} aria-label="Go to Rentiq home" className="flex items-center">
              <img
                src="/img/rentiq.png"
                alt="Rentiq"
                className={`h-9 w-auto object-contain ${isCollapsed ? "lg:hidden" : ""}`}
              />
              <img
                src="/img/rentiq-single-logo.png"
                alt="Rentiq"
                className={`h-9 w-9 object-contain ${isCollapsed ? "hidden lg:block" : "hidden"}`}
              />
            </Link>
            <button
              onClick={closeMobileMenu}
              aria-label="Close menu"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/vendor/dashboard"
                  ? pathname === "/vendor/dashboard"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={closeMobileMenu}
                  title={isCollapsed ? item.name : undefined}
                  aria-current={isActive ? "page" : undefined}
                  className={`group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition
                    ${isCollapsed ? "lg:justify-center lg:px-0" : ""}
                    ${
                      isActive
                        ? "bg-red-50 font-semibold text-[#ff3b30]"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                >
                  {isActive && (
                    <span
                      className="pointer-events-none absolute inset-y-1 right-0 w-1 rounded-full"
                      style={{ backgroundColor: ACCENT }}
                    />
                  )}
                  <Icon className="h-5 w-5 shrink-0" strokeWidth={isActive ? 2.25 : 1.75} />
                  <span className={isCollapsed ? "lg:hidden" : ""}>{item.name}</span>
                  {item.count ? (
                    <span
                      className={`ml-auto rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600 ${
                        isCollapsed ? "lg:hidden" : ""
                      }`}
                    >
                      {item.count}
                    </span>
                  ) : null}
                  {item.count && isCollapsed ? (
                    <span
                      className="absolute right-1.5 top-1.5 hidden h-2 w-2 rounded-full lg:block"
                      style={{ backgroundColor: ACCENT }}
                    />
                  ) : null}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Profile footer */}
        <div className="border-t border-slate-100 px-3 py-4">
          <div className={`flex items-center gap-3 px-1 ${isCollapsed ? "lg:justify-center" : ""}`}>
            <img
              src={profile?.avatarUrl || "/img/samsreynich.jpg"}
              alt="Vendor profile"
              className="h-10 w-10 shrink-0 rounded-full object-cover"
            />
            <div className={`min-w-0 flex-1 ${isCollapsed ? "lg:hidden" : ""}`}>
              <p className="truncate text-sm font-bold text-slate-900">
                {profile
                  ? `${profile.firstName ?? ""} ${profile.lastName ?? ""}`.trim() || profile.username
                  : "Vendor"}
              </p>
              <p className="truncate text-xs text-slate-400">{profile?.email || "Vendor account"}</p>
            </div>
          </div>

          <div className={`mt-3 space-y-1 text-sm font-medium text-slate-500 ${isCollapsed ? "lg:hidden" : ""}`}>
            <button
              onClick={() => alert("Support clicked")}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-1.5 transition hover:bg-slate-50 hover:text-slate-900"
            >
              <Headphones className="h-4 w-4" />
              <span>Support</span>
            </button>
            <button
              onClick={() => alert("Logout clicked")}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-1.5 transition hover:bg-slate-50 hover:text-slate-900"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ---------------- MAIN COLUMN ---------------- */}
      <div
        className={`flex min-h-screen min-w-0 flex-1 flex-col transition-[margin] duration-300 ease-in-out ${
          isCollapsed ? "lg:ml-20" : "lg:ml-64"
        }`}
      >
        {/* Desktop header with the collapse toggle */}
        <div className="sticky top-0 z-20 hidden h-14 items-center border-b border-slate-100 bg-white/80 px-4 backdrop-blur lg:flex">
          <button
            onClick={() => setCollapsed(!isCollapsed)}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-pressed={isCollapsed}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50"
          >
            <PanelLeft className="h-5 w-5" />
          </button>
        </div>

        <main className="flex-1 p-4 pt-20 sm:p-6 lg:p-8 lg:pt-8">{children}</main>

        <Footer />
      </div>
    </div>
  );
}
