"use client";

import React, { useState } from "react";
import { useGetMyProfileQuery } from "@/redux/services/userApi";
import { useGetVendorBookingsQuery, useGetVendorUnreadNotificationCountQuery } from "@/redux/services/vendorApi";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Footer from "@/components/footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faInbox,
  faCalendarCheck,
  faListCheck,
  faChartLine,
  faWallet,
  faBell,
  faHeadphonesSimple,
  faRightFromBracket,
  faBars,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

export default function VendorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: profile } = useGetMyProfileQuery();
  const { data: bookings = [] } = useGetVendorBookingsQuery();
  const { data: unread } = useGetVendorUnreadNotificationCountQuery();
  const pendingBookings = bookings.filter((booking) => booking.status === "PENDING").length;

  const navItems = [
    { name: "Dashboard", href: "/vendor/dashboard", icon: faHouse },
    { name: "Requests", href: "/vendor/dashboard/requests", icon: faInbox },
    { name: "Booking", href: "/vendor/dashboard/booking", icon: faCalendarCheck, count: pendingBookings },
    { name: "Listings", href: "/vendor/dashboard/listings", icon: faListCheck },
    { name: "Earnings", href: "/vendor/dashboard/earnings", icon: faChartLine },
    { name: "Wallet", href: "/vendor/dashboard/wallet", icon: faWallet },
    { name: "Notification", href: "/vendor/dashboard/notifications", icon: faBell, count: Number(unread?.unreadCount || 0) },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const handleNavClick = () => {
    // Close mobile menu when navigating on small screens
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <div className="flex min-h-screen  text-slate-800">
      
      {/* ---------------- MOBILE TOP BAR ---------------- */}
      <header className="fixed top-0 left-0 right-0 z-30 flex h-16 items-center justify-between border-b  bg-white px-4 lg:hidden">
        <div className="flex items-center gap-3">
          <button
            onClick={toggleMobileMenu}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition active:scale-95"
            aria-label="Toggle Navigation Menu"
          >
            <FontAwesomeIcon icon={isMobileMenuOpen ? faXmark : faBars} className="h-5 w-5" />
          </button>
          <img
            src="/img/Rentiq.png"
            alt="Rentiq Logo"
            className="h-7 w-auto object-contain"
          />
        </div>

        <img
          src={profile?.avatarUrl || "/img/samsreynich.jpg"}
          alt="Vendor Profile"
          className="h-9 w-9 rounded-full object-cover border border-slate-200"
        />
      </header>

      {/* ---------------- MOBILE OVERLAY ---------------- */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm transition-opacity lg:hidden"
        />
      )}

      {/* ---------------- RESPONSIVE SIDEBAR ---------------- */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex w-64 flex-col justify-between border-r border-slate-200 bg-white p-6 transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div>
          {/* Logo & Close Button (Mobile) */}
          <div className="mb-6 flex items-center justify-between">
            <div className="h-10 w-32 flex items-center">
              <img
                src="/img/Rentiq.png"
                alt="Rentiq Logo"
                className="h-auto max-h-10 w-auto object-contain"
              />
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 lg:hidden"
            >
              <FontAwesomeIcon icon={faXmark} className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive =
                item.href === "/vendor/dashboard"
                  ? pathname === "/vendor/dashboard"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={handleNavClick}
                  className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-red-50/80 font-semibold text-[#ff3b30]"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <FontAwesomeIcon icon={item.icon} className="h-4 w-4" />
                    <span>{item.name}</span>
                  </div>
                  {isActive && (
                    <span className="h-2 w-1.5 rounded-full bg-[#ff3b30]" />
                  )}
                  {!isActive && item.count !== undefined && (
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600">
                      {item.count}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Profile Footer */}
        <div className="space-y-4 border-t border-slate-100 pt-4">
          <div className="flex items-center gap-3">
            <img
              src={profile?.avatarUrl || "/img/samsreynich.jpg"}
              alt="Vendor Profile"
              className="h-10 w-10 rounded-full object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-slate-900">
                {profile ? `${profile.firstName} ${profile.lastName}`.trim() || profile.username : "Vendor"}
              </p>
              <p className="truncate text-xs text-slate-400">{profile?.email || "Vendor account"}</p>
              <span className="mt-1 inline-block rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                Verified
              </span>
            </div>
          </div>

          <div className="space-y-1 pt-2 text-sm font-medium text-slate-500">
            <button
              onClick={() => alert("Support clicked")}
              className="flex w-full items-center gap-3 rounded-lg px-2 py-1.5 transition hover:bg-slate-50 hover:text-slate-900"
            >
              <FontAwesomeIcon icon={faHeadphonesSimple} className="h-4 w-4" />
              <span>Support</span>
            </button>
            <button
              onClick={() => alert("Logout clicked")}
              className="flex w-full items-center gap-3 rounded-lg px-2 py-1.5 transition hover:bg-slate-50 hover:text-slate-900"
            >
              <FontAwesomeIcon icon={faRightFromBracket} className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      <div className="flex min-h-screen min-w-0 flex-1 flex-col lg:ml-64">
        {/* ---------------- MAIN CONTENT AREA ---------------- */}
        <main className="flex-1 p-4 pt-20 sm:p-6 lg:p-8 lg:pt-8">
          {children}
        </main>

        <Footer />
      </div>
    </div>
  );
}
