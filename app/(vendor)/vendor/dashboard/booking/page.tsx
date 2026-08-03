"use client";

import React, { useState, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faSliders,
  faDownload,
  faChevronLeft,
  faChevronRight,
  faArrowTrendUp,
  faCheck,
  faXmark,
  faMoneyBillWave,
  faChartPie,
} from "@fortawesome/free-solid-svg-icons";

// ---------------- TYPES & MOCK DATA ----------------
interface Booking {
  id: string;
  gear: string;
  image: string;
  renter: string;
  renterAvatar?: string;
  renterMeta: string;
  period: string;
  periodMeta: string;
  periodMetaColor?: string;
  status: "Pending" | "Approved" | "Completed" | "Cancelled";
  revenue: number;
  paymentStatus?: "Payment Pending" | "Paid" | "Refunded";
}

const INITIAL_BOOKINGS: Booking[] = [
  // PENDING REQUESTS
  {
    id: "#9902",
    gear: "Professional DSLR Rig Kit",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=120&auto=format&fit=crop&q=80",
    renter: "Sarah Jenkins",
    renterAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&auto=format&fit=crop&q=80",
    renterMeta: "Renter ID: #9902",
    period: "Oct 28 - Oct 30, 2026",
    periodMeta: "Awaiting Action",
    status: "Pending",
    revenue: 145.0,
    paymentStatus: "Payment Pending",
  },
  {
    id: "#9903",
    gear: "RED Komodo 6K Starter Pack",
    image: "https://images.unsplash.com/photo-1527011046414-4781f1f94f8c?w=120&auto=format&fit=crop&q=80",
    renter: "Alex Rivera",
    renterAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&auto=format&fit=crop&q=80",
    renterMeta: "Renter ID: #9903",
    period: "Nov 02 - Nov 05, 2026",
    periodMeta: "Awaiting Action",
    status: "Pending",
    revenue: 850.0,
    paymentStatus: "Payment Pending",
  },

  // APPROVED BOOKINGS
  {
    id: "#RT-88219",
    gear: "Sony FX3 Cinema Rig",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=100&auto=format&fit=crop&q=80",
    renter: "Jordan V.",
    renterMeta: "Verified Professional",
    period: "Oct 24 - Oct 27",
    periodMeta: "Starts in 2 days",
    periodMetaColor: "text-emerald-600 font-bold",
    status: "Approved",
    revenue: 450.0,
    paymentStatus: "Paid",
  },
  {
    id: "#RT-88242",
    gear: "Zeiss Prime Set (35, 50, 85)",
    image: "https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=100&auto=format&fit=crop&q=80",
    renter: "Sarah Miller",
    renterMeta: "Studio Agency",
    period: "Oct 25 - Oct 30",
    periodMeta: "5 Day Rental",
    periodMetaColor: "text-slate-400 font-normal",
    status: "Approved",
    revenue: 1200.0,
    paymentStatus: "Paid",
  },
  {
    id: "#RT-88102",
    gear: "DJI Inspire 3 Drone",
    image: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=100&auto=format&fit=crop&q=80",
    renter: "Apex Films",
    renterMeta: "Enterprise Account",
    period: "Nov 01 - Nov 05",
    periodMeta: "Upcoming",
    periodMetaColor: "text-slate-400 font-normal",
    status: "Approved",
    revenue: 3500.0,
    paymentStatus: "Paid",
  },
  {
    id: "#RT-87994",
    gear: "Aputure 600d Light Kit",
    image: "https://images.unsplash.com/photo-1527011046414-4781f1f94f8c?w=100&auto=format&fit=crop&q=80",
    renter: "Liam S.",
    renterMeta: "Independent Creator",
    period: "Oct 24 - Oct 25",
    periodMeta: "Starts tomorrow",
    periodMetaColor: "text-emerald-600 font-bold",
    status: "Approved",
    revenue: 180.0,
    paymentStatus: "Paid",
  },
];

const TABS = ["Pending", "Approved", "Completed", "Cancelled"] as const;
const BAR_DATA = [15, 25, 20, 28, 40, 30, 50, 60, 35, 65, 80, 70, 45];

export default function BookingsOverviewPage() {
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("Pending");
  const [currentPage, setCurrentPage] = useState(1);

  // Dynamic status counts
  const tabCounts = useMemo(() => {
    return TABS.reduce((acc, tab) => {
      acc[tab] = bookings.filter((b) => b.status === tab).length;
      return acc;
    }, {} as Record<string, number>);
  }, [bookings]);

  // Active dataset filtering
  const activeBookings = useMemo(() => {
    return bookings.filter((b) => b.status === activeTab);
  }, [bookings, activeTab]);

  // Smart Analytics calculations for Approved items
  const approvedAnalytics = useMemo(() => {
    const approvedList = bookings.filter((b) => b.status === "Approved");
    const totalRevenue = approvedList.reduce((acc, b) => acc + b.revenue, 0);
    const avgOrderValue = approvedList.length ? totalRevenue / approvedList.length : 0;
    return {
      count: approvedList.length,
      totalRevenue,
      avgOrderValue,
      projectedGrowth: "+12%",
      utilizationRate: "84%",
    };
  }, [bookings]);

  // Handle Approve Action
  const handleApprove = (id: string) => {
    setBookings((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: "Approved" } : item))
    );
  };

  // Handle Reject Action
  const handleReject = (id: string) => {
    setBookings((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: "Cancelled" } : item))
    );
  };

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-6 space-y-6 text-slate-800 font-sans">
      {/* ---------------- 1. PAGE HEADER & STATUS TABS ---------------- */}
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-black text-slate-900">Bookings Overview</h1>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <FontAwesomeIcon icon={faCalendar} className="h-3.5 w-3.5 text-blue-500" />
            <span>Today: October 24, 2026</span>
          </div>
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-2">
          {TABS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setCurrentPage(1);
                }}
                className={`flex items-center gap-2 rounded-full px-5 py-2 text-xs font-extrabold transition ${
                  isActive
                    ? "bg-white text-[#ff3b30] shadow-sm border border-slate-100"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <span>{tab}</span>
                {tabCounts[tab] > 0 && (
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                      isActive ? "bg-red-50 text-[#ff3b30]" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {tabCounts[tab]}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ---------------- 2. APPROVED SMART ANALYTICS BANNER ---------------- */}
      {activeTab === "Approved" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Approved Earnings
              </p>
              <p className="text-2xl font-black text-slate-900 mt-1">
                ${approvedAnalytics.totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
              <p className="text-[11px] font-bold text-emerald-600 mt-1 flex items-center gap-1">
                <FontAwesomeIcon icon={faArrowTrendUp} className="h-3 w-3" />
                <span>{approvedAnalytics.projectedGrowth} vs last month</span>
              </p>
            </div>
            <div className="h-11 w-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg">
              <FontAwesomeIcon icon={faMoneyBillWave} />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Average Booking Value
              </p>
              <p className="text-2xl font-black text-slate-900 mt-1">
                ${approvedAnalytics.avgOrderValue.toFixed(2)}
              </p>
              <p className="text-[11px] font-medium text-slate-400 mt-1">
                Across {approvedAnalytics.count} approved gear rentals
              </p>
            </div>
            <div className="h-11 w-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg">
              <FontAwesomeIcon icon={faChartPie} />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Gear Utilization Rate
              </p>
              <p className="text-2xl font-black text-slate-900 mt-1">
                {approvedAnalytics.utilizationRate}
              </p>
              <p className="text-[11px] font-bold text-emerald-600 mt-1">
                High demand active phase
              </p>
            </div>
            <div className="h-11 w-11 rounded-xl bg-red-50 text-[#ff3b30] flex items-center justify-center text-lg">
              <FontAwesomeIcon icon={faSliders} />
            </div>
          </div>
        </div>
      )}

      {/* ---------------- 3. CONDITIONAL CONTENT BY TAB ---------------- */}
      
      {/* --- PENDING CARDS VIEW (Matching Screenshot 2) --- */}
      {activeTab === "Pending" && (
        <div className="space-y-4">
          {activeBookings.length > 0 ? (
            activeBookings.map((item) => (
              <div
                key={item.id}
                className="flex flex-col md:flex-row md:items-center justify-between rounded-3xl border border-slate-100 bg-white p-5 shadow-sm gap-4 transition hover:shadow-md"
              >
                {/* Left Section: Image & Details */}
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.gear}
                    className="h-20 w-32 rounded-2xl object-cover shrink-0 border border-slate-100"
                  />
                  <div className="space-y-2">
                    <h3 className="text-base font-extrabold text-slate-900">{item.gear}</h3>
                    <div className="flex items-center gap-2">
                      {item.renterAvatar && (
                        <img
                          src={item.renterAvatar}
                          alt={item.renter}
                          className="h-6 w-6 rounded-full object-cover"
                        />
                      )}
                      <div>
                        <p className="text-xs font-bold text-slate-800 leading-none">{item.renter}</p>
                        <p className="text-[10px] text-slate-400 font-medium">{item.renterMeta}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Middle Section: Dates & Payment Badge */}
                <div className="space-y-1.5 md:text-left">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <FontAwesomeIcon icon={faCalendar} className="h-3.5 w-3.5 text-blue-500" />
                    <span>{item.period}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-extrabold text-slate-900">
                    <FontAwesomeIcon icon={faMoneyBillWave} className="h-3.5 w-3.5 text-slate-400" />
                    <span>${item.revenue.toFixed(2)} Total</span>
                  </div>
                  <div>
                    <span className="inline-block rounded-full bg-red-50/80 px-3 py-0.5 text-[10px] font-bold text-red-500">
                      {item.paymentStatus}
                    </span>
                  </div>
                </div>

                {/* Right Section: Action Buttons */}
                <div className="flex items-center gap-3 self-end md:self-center">
                  <button
                    onClick={() => handleReject(item.id)}
                    className="rounded-full border border-red-400 px-6 py-2.5 text-xs font-extrabold text-red-500 hover:bg-red-50 transition"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleApprove(item.id)}
                    className="rounded-full bg-[#ff3b30] px-6 py-2.5 text-xs font-extrabold text-white shadow-sm hover:bg-red-600 transition"
                  >
                    Approve
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center text-xs font-medium text-slate-400">
              No pending booking requests to review right now.
            </div>
          )}
        </div>
      )}

      {/* --- APPROVED QUEUE TABLE & FORECAST VIEW (Matching Screenshot 1) --- */}
      {activeTab !== "Pending" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
            {/* Table Header Controls */}
            <div className="flex items-center justify-between p-5 border-b border-slate-50">
              <h2 className="text-sm font-extrabold text-slate-900">Operational Queue</h2>
              <div className="flex items-center gap-2">
                <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200/80 text-slate-500 hover:bg-slate-50 transition">
                  <FontAwesomeIcon icon={faSliders} className="h-3.5 w-3.5" />
                </button>
                <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200/80 text-slate-500 hover:bg-slate-50 transition">
                  <FontAwesomeIcon icon={faDownload} className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Queue Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[750px] text-left text-xs">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-100 text-[10px] font-black uppercase tracking-wider text-slate-400">
                    <th className="py-3 px-6">Gear & ID</th>
                    <th className="py-3 px-6">Renter</th>
                    <th className="py-3 px-6">Period</th>
                    <th className="py-3 px-6">Status</th>
                    <th className="py-3 px-6 text-right">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {activeBookings.length > 0 ? (
                    activeBookings.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50 transition">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.image}
                              alt={item.gear}
                              className="h-10 w-10 rounded-lg object-cover shrink-0 border border-slate-100"
                            />
                            <div>
                              <p className="font-extrabold text-slate-900 max-w-[180px] leading-snug">
                                {item.gear}
                              </p>
                              <p className="text-[10px] text-slate-400 font-medium">{item.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <p className="font-extrabold text-slate-900">{item.renter}</p>
                          <p className="text-[10px] text-slate-400">{item.renterMeta}</p>
                        </td>
                        <td className="py-4 px-6">
                          <p className="font-extrabold text-slate-800">{item.period}</p>
                          <p className={`text-[10px] ${item.periodMetaColor || "text-slate-400"}`}>
                            {item.periodMeta}
                          </p>
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`inline-block rounded-full px-3 py-1 text-[10px] font-black uppercase ${
                              item.status === "Approved"
                                ? "bg-emerald-50 text-emerald-600"
                                : item.status === "Completed"
                                ? "bg-blue-50 text-blue-600"
                                : "bg-red-50 text-red-600"
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <span className="font-black text-slate-900">
                            ${item.revenue.toFixed(2)}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-xs font-medium text-slate-400">
                        No {activeTab.toLowerCase()} bookings available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-50/40 border-t border-slate-100 text-xs">
              <span className="text-[11px] font-bold text-slate-400">
                Showing {activeBookings.length} of {activeBookings.length} {activeTab.toLowerCase()} bookings
              </span>
              <div className="flex items-center gap-1.5">
                <button className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400">
                  <FontAwesomeIcon icon={faChevronLeft} className="h-2.5 w-2.5" />
                </button>
                <button className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#ff3b30] text-xs font-bold text-white shadow-sm">
                  1
                </button>
                <button className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400">
                  <FontAwesomeIcon icon={faChevronRight} className="h-2.5 w-2.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Revenue Forecast Visualizer */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <h2 className="text-base font-extrabold text-slate-900">Revenue Forecast</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Projected earnings from approved upcoming bookings.
                </p>
              </div>
              <div className="text-left sm:text-right">
                <h2 className="text-2xl font-black text-emerald-600">
                  ${approvedAnalytics.totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </h2>
                <p className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 sm:justify-end mt-0.5">
                  <FontAwesomeIcon icon={faArrowTrendUp} className="h-3 w-3" />
                  <span>+12% vs last month</span>
                </p>
              </div>
            </div>

            <div className="pt-4">
              <div className="flex items-end justify-between gap-2 h-28 border-b border-slate-100 pb-2">
                {BAR_DATA.map((height, i) => (
                  <div
                    key={i}
                    style={{ height: `${height}%` }}
                    className={`w-full rounded-sm transition-all ${
                      i === 8 ? "bg-[#ff3b30]" : "bg-blue-50/80 hover:bg-blue-100"
                    }`}
                  />
                ))}
              </div>
              <div className="flex justify-between pt-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <span>OCT 01</span>
                <span>OCT 07</span>
                <span className="text-slate-900 font-extrabold">TODAY</span>
                <span>OCT 14</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}