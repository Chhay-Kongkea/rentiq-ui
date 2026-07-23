"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDays,
  faPen,
  faDownload,
  faEllipsis,
  faInfoCircle,
  faXmarkCircle,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";

// Booking item structure
interface Booking {
  id: number;
  title: string;
  location: string;
  status: "Completed" | "Upcoming" | "Overdue" | "Active" | "Past";
  statusColor: string; // Tailwind color classes for the status badge
  startDateLabel: string; // "Start Date" or "Check-in"
  endDateLabel: string;   // "End Date" or "Check-out"
  startDate: string;
  endDate: string;
  priceLabel: string;     // "TOTAL PAID" or "BALANCE DUE"
  priceSubText?: string;  // e.g. "(Fully Paid)"
  price: string;
  image: string;
}

const SAMPLE_BOOKINGS: Booking[] = [
  {
    id: 1,
    title: "NINJA 400",
    location: "Russy Keo, Phnom Penh",
    status: "Completed",
    statusColor: "bg-emerald-100 text-emerald-600",
    startDateLabel: "Start Date",
    endDateLabel: "End Date",
    startDate: "Oct 12, 2023",
    endDate: "Oct 15, 2023",
    priceLabel: "TOTAL PAID",
    price: "$1,240.00",
    image:
      "https://i.pinimg.com/1200x/b6/6d/2e/b66d2e9d11b38b22eefbcbb876c6d4fa.jpg",
  },
  {
    id: 2,
    title: "Pro Gaming Keyboard Mouse",
    location: "Chom Choa, Phnom Penh",
    status: "Upcoming",
    statusColor: "bg-blue-100 text-blue-600",
    startDateLabel: "Check-in",
    endDateLabel: "Check-out",
    startDate: "Dec 22, 2024",
    endDate: "Dec 27, 2024",
    priceLabel: "BALANCE DUE",
    priceSubText: "(Fully Paid)",
    price: "$0.00",
    image:
      "https://i.pinimg.com/736x/3d/ec/18/3dec184ff7602525eaf3fd8ee1846d59.jpg ",
  },
  {
    id: 3,
    title: "PlayStation 5",
    location: "Chom Choa, Phnom Penh",
    status: "Overdue",
    statusColor: "bg-red-100 text-red-500",
    startDateLabel: "Check-in",
    endDateLabel: "Check-out",
    startDate: "Dec 22, 2024",
    endDate: "Dec 27, 2024",
    priceLabel: "BALANCE DUE",
    priceSubText: "(Fully Paid)",
    price: "$0.00",
    image:
      "https://i.pinimg.com/1200x/1b/fb/e1/1bfbe17efeafbeb1619a149299fa423e.jpg",
  },
];

const TABS = [
  { id: "all", label: "All" },
  { id: "upcoming", label: "Upcoming" },
  { id: "active", label: "Active" },
  { id: "overdue", label: "Overdue" },
  { id: "pasts", label: "Pasts" },
];

export default function MyBookingPage() {
  const [activeTab, setActiveTab] = useState("all");

  // Filter bookings based on active tab
  const filteredBookings = SAMPLE_BOOKINGS.filter((booking) => {
    if (activeTab === "all") return true;
    if (activeTab === "upcoming") return booking.status === "Upcoming";
    if (activeTab === "active") return booking.status === "Active";
    if (activeTab === "overdue") return booking.status === "Overdue";
    if (activeTab === "pasts")
      return booking.status === "Completed" || booking.status === "Past";
    return true;
  });

  return (
    <main className="min-h-screen bg-[#f8fafc] px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-7xl">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">
            <span className="text-new-blue">My </span>
            <span className="text-new-red">Booking</span>
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Manage and track all your past and upcoming rental experiences.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6 border-b border-slate-200">
          <nav className="-mb-px flex gap-8 overflow-x-auto">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-3 text-sm font-semibold transition-colors ${
                    isActive
                      ? "border-b-2 border-new-red text-slate-800"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Booking Items List */}
        {filteredBookings.length === 0 ? (
          <div className="rounded-2xl border border-slate-100 bg-white p-12 text-center text-slate-400">
            <p className="text-sm font-medium">No bookings found in this section.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((item) => (
              <div
                key={item.id}
                className="relative flex flex-col gap-6 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:shadow-md sm:flex-row sm:items-center"
              >
                {/* Product Thumbnail */}
                <div className="relative flex h-36 w-full shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-50 p-2 sm:w-44">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-contain"
                  />
                  {/* Status Tag */}
                  <span
                    className={`absolute top-2 left-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${item.statusColor}`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                    {item.status}
                  </span>
                </div>

                {/* Content Details */}
                <div className="flex flex-1 flex-col justify-between">
                  {/* Header & Price Info */}
                  <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
                    <div>
                      <h2 className="text-lg font-bold text-slate-800">
                        {item.title}
                      </h2>
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-400">
                        <FontAwesomeIcon
                          icon={faLocationDot}
                          className="h-3 w-3 text-slate-300"
                        />
                        {item.location}
                      </p>
                    </div>

                    {/* Price Block */}
                    <div className="text-left sm:text-right">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {item.priceLabel}{" "}
                        {item.priceSubText && (
                          <span className="text-emerald-500 lowercase">
                            {item.priceSubText}
                          </span>
                        )}
                      </p>
                      <p className="text-xl font-extrabold text-slate-800">
                        {item.price}
                      </p>
                    </div>
                  </div>

                  {/* Dates Banner */}
                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-2.5">
                      <FontAwesomeIcon
                        icon={faCalendarDays}
                        className="h-4 w-4 text-slate-400"
                      />
                      <div>
                        <p className="text-[10px] font-medium text-slate-400">
                          {item.startDateLabel}
                        </p>
                        <p className="text-xs font-bold text-slate-800">
                          {item.startDate}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-2.5">
                      <FontAwesomeIcon
                        icon={faCalendarDays}
                        className="h-4 w-4 text-slate-400"
                      />
                      <div>
                        <p className="text-[10px] font-medium text-slate-400">
                          {item.endDateLabel}
                        </p>
                        <p className="text-xs font-bold text-slate-800">
                          {item.endDate}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {item.status === "Completed" ? (
                        <>
                          <button className="inline-flex items-center gap-1.5 rounded-xl bg-new-red px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-red-600 transition">
                            <FontAwesomeIcon icon={faPen} className="h-3 w-3" />
                            Write Review
                          </button>
                          <button className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-white px-4 py-2 text-xs font-semibold text-red-500 hover:bg-red-50 transition">
                            <FontAwesomeIcon icon={faDownload} className="h-3 w-3" />
                            Download Receipt
                          </button>
                        </>
                      ) : (
                        <>
                          <button className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition">
                            <FontAwesomeIcon icon={faInfoCircle} className="h-3 w-3 text-slate-400" />
                            View Details
                          </button>
                          <button className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-white px-4 py-2 text-xs font-semibold text-red-500 hover:bg-red-50 transition">
                            <FontAwesomeIcon icon={faXmarkCircle} className="h-3 w-3" />
                            Cancel Booking
                          </button>
                        </>
                      )}
                    </div>

                    {/* More Action Icon */}
                    <button className="text-slate-400 hover:text-slate-600">
                      <FontAwesomeIcon icon={faEllipsis} className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}