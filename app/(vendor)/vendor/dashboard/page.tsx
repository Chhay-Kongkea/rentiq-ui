"use client";

import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faWallet,
  faPlus,
  faPenToSquare,
  faCircleInfo,
  faQrcode,
  faChartLine,
  faLock,
  faEllipsisVertical,
  faStar,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";

// ---------------- MOCK DATA ----------------
const INITIAL_INBOUND_REQUESTS = [
  {
    id: 1,
    renter: { name: "Sokchea Neang", rating: "4.9 (32)", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" },
    asset: { name: "Sony A7 IV", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=100&auto=format&fit=crop&q=80" },
    period: "May 24–May 27, 2025",
    days: "3 days",
    totalValue: "$135.00",
    expiresIn: "05 : 47 : 32",
  },
  {
    id: 2,
    renter: { name: "Pich Sovann", rating: "4.8 (18)", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" },
    asset: { name: "Sigma 24-70mm", image: "https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=100&auto=format&fit=crop&q=80" },
    period: "May 25–May 28, 2025",
    days: "3 days",
    totalValue: "$90.00",
    expiresIn: "08 : 27 : 42",
  },
];

const INITIAL_INVENTORY = [
  {
    id: 1,
    name: "Sony A7 IV",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=100&auto=format&fit=crop&q=80",
    dailyRate: "$45.00",
    securityDeposit: "$150.00",
    status: "Active",
    available: true,
  },
  {
    id: 2,
    name: "Sigma 24-70 mm f/2.8 DG DN",
    image: "https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=100&auto=format&fit=crop&q=80",
    dailyRate: "$30.00",
    securityDeposit: "$100.00",
    status: "Active",
    available: true,
  },
];

export default function VendorDashboardPage() {
  // State variables for interactive elements
  const [walletBalance, setWalletBalance] = useState(5.0);
  const [requests, setRequests] = useState(INITIAL_INBOUND_REQUESTS);
  const [inventory, setInventory] = useState(INITIAL_INVENTORY);
  const [activeDeployments, setActiveDeployments] = useState(2);
  const [overdueCount, setOverdueCount] = useState(1);

  // Handlers for interactive buttons
  const handleTopUpWallet = () => {
    setWalletBalance((prev) => prev + 10);
    alert("Top-up successful! Added $10.00 to System Credit Wallet.");
  };

  const handleAcceptRequest = (id: number) => {
    setRequests((prev) => prev.filter((item) => item.id !== id));
    alert("Request Accepted!");
  };

  const handleDeclineRequest = (id: number) => {
    setRequests((prev) => prev.filter((item) => item.id !== id));
    alert("Request Declined.");
  };

  const handleToggleAvailability = (id: number) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, available: !item.available } : item
      )
    );
  };

  const handleConfirmReturnDeployment = () => {
    if (activeDeployments > 0) {
      setActiveDeployments((prev) => prev - 1);
      alert("Return confirmed for deployment!");
    }
  };

  const handleConfirmReturnOverdue = () => {
    if (overdueCount > 0) {
      setOverdueCount((prev) => prev - 1);
      alert("Overdue item returned successfully!");
    }
  };

  const handleAddNewListing = () => {
    const newItemName = prompt("Enter new asset name:");
    if (!newItemName) return;

    const newListing = {
      id: Date.now(),
      name: newItemName,
      image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=100&auto=format&fit=crop&q=80",
      dailyRate: "$35.00",
      securityDeposit: "$100.00",
      status: "Active",
      available: true,
    };
    setInventory((prev) => [...prev, newListing]);
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto text-slate-800">
      
      {/* ---------------- 1. TOP STAT CARDS ---------------- */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {/* Gross Revenue */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">
              Gross Revenue <FontAwesomeIcon icon={faCircleInfo} className="ml-1 text-slate-300" />
            </span>
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 text-blue-600 font-bold text-xs">
              $
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-3">
            <p className="text-2xl font-extrabold text-slate-900">$2,845.60</p>
            {/* SVG Sparkline Graph */}
            <div className="h-6 w-20">
              <svg viewBox="0 0 100 30" className="h-full w-full stroke-emerald-500 fill-none stroke-[2.5]">
                <path d="M0 25 Q25 20, 40 15 T80 5 T100 2" />
              </svg>
            </div>
          </div>
          <p className="mt-1 text-[11px] text-emerald-600 font-semibold">
            +18.6% <span className="text-slate-400 font-normal">vs last 30 days</span>
          </p>
        </div>

        {/* Asset Utilization Rate */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400">
                Asset Utilization Rate <FontAwesomeIcon icon={faCircleInfo} className="ml-1 text-slate-300" />
              </p>
              <p className="mt-2 text-2xl font-extrabold text-slate-900">80%</p>
              <p className="mt-1 text-[11px] text-slate-400">4 of 5 active listings deployed</p>
            </div>
            {/* Donut Progress Circle */}
            <div className="relative flex h-14 w-14 items-center justify-center rounded-full border-4 border-red-500 text-xs font-bold text-slate-700">
              80%
            </div>
          </div>
        </div>

        {/* Active Listings */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400">
                Active Listings <FontAwesomeIcon icon={faCircleInfo} className="ml-1 text-slate-300" />
              </p>
              <p className="mt-2 text-2xl font-extrabold text-slate-900">{inventory.length}</p>
              <p className="mt-1 text-[11px] text-slate-400">Visible on marketplace</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-50 text-[#ff3b30]">
              <FontAwesomeIcon icon={faLock} className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- 2. WALLET & TOP EARNING ASSETS ---------------- */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* System Credit Wallet */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm lg:col-span-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">System Credit Wallet</h3>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <FontAwesomeIcon icon={faWallet} className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Current Balance</p>
            <p className="text-3xl font-extrabold text-[#ff3b30]">${walletBalance.toFixed(2)}</p>
          </div>

          <div className="mt-6 space-y-4">
            <button
              onClick={handleTopUpWallet}
              className="w-full rounded-xl bg-[#ff3b30] py-3 text-xs font-bold text-white transition hover:bg-red-600 active:scale-[0.99]"
            >
              Top-up Wallet
            </button>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
              <div>
                <p className="font-bold text-slate-800">Top-up via KHQR</p>
                <p className="text-[10px] text-slate-400">Scan to add system credits instantly</p>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                <FontAwesomeIcon icon={faQrcode} className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Top Earning Assets */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm lg:col-span-7 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Top Earning Assets</h3>
            <p className="text-[11px] text-slate-400">Based on completed rentals</p>

            <div className="mt-4 space-y-3">
              {/* Asset 1 */}
              <div className="flex items-center justify-between rounded-xl bg-slate-50/60 p-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-400">1</span>
                  <img
                    src="https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=100&auto=format&fit=crop&q=80"
                    alt="Sigma"
                    className="h-10 w-10 rounded-lg object-cover"
                  />
                  <span className="text-xs font-bold text-slate-800">Sigma 24-70mm f/2.8</span>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-900">$875.00</p>
                  <p className="text-[10px] uppercase font-semibold text-slate-400">Revenue</p>
                </div>
              </div>

              {/* Asset 2 */}
              <div className="flex items-center justify-between rounded-xl bg-slate-50/60 p-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-400">2</span>
                  <img
                    src="https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=100&auto=format&fit=crop&q=80"
                    alt="DJI Mavic"
                    className="h-10 w-10 rounded-lg object-cover"
                  />
                  <span className="text-xs font-bold text-slate-800">DJI Mavic 3 Pro</span>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-900">$525.00</p>
                  <p className="text-[10px] uppercase font-semibold text-slate-400">Revenue</p>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => alert("Navigating to Analytics view...")}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-600 transition hover:bg-slate-50"
          >
            <FontAwesomeIcon icon={faChartLine} className="h-3.5 w-3.5 text-slate-400" />
            View All Analytics
          </button>
        </div>
      </div>

      {/* ---------------- 3. INBOUND REQUESTS ---------------- */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900">Inbound Requests</h3>
            <span className="text-xs font-medium text-slate-400">(Action Required)</span>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#ff3b30] text-[10px] font-bold text-white">
              {requests.length}
            </span>
          </div>
          <button
            onClick={() => alert("Navigating to all requests...")}
            className="text-xs font-semibold text-slate-400 hover:text-slate-600"
          >
            View all
          </button>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[650px]">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="pb-3">Renter</th>
                <th className="pb-3">Asset</th>
                <th className="pb-3">Rental Period</th>
                <th className="pb-3">Total Value</th>
                <th className="pb-3 text-center">Expires In</th>
                <th className="pb-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {requests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 font-medium">
                    No active inbound requests at the moment.
                  </td>
                </tr>
              ) : (
                requests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/50 transition">
                    {/* Renter */}
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={req.renter.avatar}
                          alt={req.renter.name}
                          className="h-9 w-9 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-bold text-slate-900 flex items-center gap-1">
                            {req.renter.name}
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-500 inline-block" />
                          </p>
                          <p className="text-[10px] text-slate-400 flex items-center gap-1">
                            <FontAwesomeIcon icon={faStar} className="text-amber-400 text-[9px]" />
                            {req.renter.rating}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Asset */}
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <img
                          src={req.asset.image}
                          alt={req.asset.name}
                          className="h-8 w-8 rounded-lg object-cover"
                        />
                        <span className="font-semibold text-slate-800">{req.asset.name}</span>
                      </div>
                    </td>

                    {/* Rental Period */}
                    <td className="py-4">
                      <p className="font-semibold text-slate-800">{req.period}</p>
                      <p className="text-[10px] text-slate-400">{req.days}</p>
                    </td>

                    {/* Total Value */}
                    <td className="py-4">
                      <p className="font-bold text-slate-900">{req.totalValue}</p>
                      <p className="text-[10px] text-slate-400">Incl. deposit</p>
                    </td>

                    {/* Expires In */}
                    <td className="py-4 text-center">
                      <span className="font-mono text-xs font-bold text-[#ff3b30]">
                        {req.expiresIn}
                      </span>
                      <p className="text-[9px] text-slate-400 uppercase tracking-widest mt-0.5">
                        HRS MIN SEC
                      </p>
                    </td>

                    {/* Action */}
                    <td className="py-4 text-center space-y-1.5">
                      <button
                        onClick={() => handleAcceptRequest(req.id)}
                        className="w-24 rounded-lg bg-[#ff3b30] py-1.5 text-xs font-bold text-white transition hover:bg-red-600"
                      >
                        Accept
                      </button>
                      <br />
                      <button
                        onClick={() => handleDeclineRequest(req.id)}
                        className="w-24 rounded-lg border border-slate-200 py-1 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
                      >
                        Decline
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ---------------- 4. OPERATIONS TRACKER ---------------- */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900">Operations Tracker</h3>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          
          {/* Approved Reservations */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-extrabold uppercase text-amber-600 tracking-wider">
                  Approved Reservations
                </span>
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white">
                  2
                </span>
              </div>

              <div className="rounded-xl bg-slate-50 p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                      alt="Chanrithy"
                      className="h-7 w-7 rounded-full object-cover"
                    />
                    <span className="text-xs font-bold text-slate-900">Chanrithy P.</span>
                    <FontAwesomeIcon icon={faCheckCircle} className="text-blue-500 text-xs" />
                  </div>
                </div>
                <p className="text-[10px] text-slate-400">May 23, 2025 • 10:00 AM</p>

                <div className="flex items-center gap-2 pt-1 border-t border-slate-200/60">
                  <img
                    src="https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=100&auto=format&fit=crop&q=80"
                    alt="DJI RS"
                    className="h-7 w-7 rounded-md object-cover"
                  />
                  <div>
                    <p className="text-[11px] font-bold text-slate-800">DJI RS 3 Pro</p>
                    <p className="text-[10px] text-slate-400">Security Deposit: <span className="text-amber-600 font-bold">$100.00</span></p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Active Deployments */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-extrabold uppercase text-red-600 tracking-wider">
                  Active Deployments
                </span>
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {activeDeployments}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-xl bg-slate-50 p-2.5">
                  <div className="flex items-center gap-2">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                      alt="Sokleap"
                      className="h-7 w-7 rounded-full object-cover"
                    />
                    <span className="text-xs font-bold text-slate-800">Sokleap Ch.</span>
                  </div>
                  <img
                    src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=100&auto=format&fit=crop&q=80"
                    alt="Item"
                    className="h-6 w-6 rounded-md object-cover"
                  />
                </div>

                <div className="flex items-center justify-between rounded-xl bg-slate-50 p-2.5">
                  <div className="flex items-center gap-2">
                    <img
                      src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80"
                      alt="Ratha Sok"
                      className="h-7 w-7 rounded-full object-cover"
                    />
                    <span className="text-xs font-bold text-slate-800">Ratha Sok</span>
                  </div>
                  <img
                    src="https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=100&auto=format&fit=crop&q=80"
                    alt="Item"
                    className="h-6 w-6 rounded-md object-cover"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleConfirmReturnDeployment}
              className="w-full rounded-xl bg-[#ff3b30] py-2.5 text-xs font-bold text-white transition hover:bg-red-600"
            >
              Confirm Return
            </button>
          </div>

          {/* Overdue */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-extrabold uppercase text-red-600 tracking-wider">
                  Overdue
                </span>
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                  {overdueCount}
                </span>
              </div>

              {overdueCount > 0 ? (
                <div className="rounded-xl bg-slate-50 p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <img
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80"
                      alt="Bunthoeurn"
                      className="h-7 w-7 rounded-full object-cover"
                    />
                    <span className="text-xs font-bold text-slate-900">Bunthoeurn Lim</span>
                    <FontAwesomeIcon icon={faCheckCircle} className="text-blue-500 text-xs" />
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Was due: May 20, 2025 • 11:00 AM
                  </p>
                  <p className="text-[10px] font-bold text-red-600">
                    Overdue by: 2h 45m
                  </p>
                </div>
              ) : (
                <div className="p-4 text-center text-xs text-slate-400 font-medium">
                  No overdue items.
                </div>
              )}
            </div>

            <button
              onClick={handleConfirmReturnOverdue}
              className="w-full rounded-xl bg-[#ff3b30] py-2.5 text-xs font-bold text-white transition hover:bg-red-600"
            >
              Confirm Return
            </button>
          </div>

        </div>
      </div>

      {/* ---------------- 5. INVENTORY (LISTINGS) ---------------- */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-900">Inventory (Listings)</h3>
          <button
            onClick={handleAddNewListing}
            className="flex items-center gap-2 rounded-xl bg-black px-4 py-2 text-xs font-bold text-white transition hover:bg-slate-800"
          >
            <FontAwesomeIcon icon={faPlus} className="h-3 w-3" />
            New Listing
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[600px]">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="pb-3">Asset</th>
                <th className="pb-3">Daily Rate</th>
                <th className="pb-3">Security Deposit</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Availability</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {inventory.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition">
                  {/* Asset */}
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-10 w-10 rounded-lg object-cover"
                      />
                      <span className="font-bold text-slate-900">{item.name}</span>
                    </div>
                  </td>

                  {/* Daily Rate */}
                  <td className="py-4 font-bold text-slate-800">{item.dailyRate}</td>

                  {/* Security Deposit */}
                  <td className="py-4 text-slate-600 font-medium">{item.securityDeposit}</td>

                  {/* Status Badge */}
                  <td className="py-4">
                    <span className="inline-block rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600 border border-emerald-100">
                      {item.status}
                    </span>
                  </td>

                  {/* Availability Toggle Switch */}
                  <td className="py-4">
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={item.available}
                        onChange={() => handleToggleAvailability(item.id)}
                        className="sr-only peer"
                      />
                      <div className="relative w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                      <span className="text-xs text-slate-500 font-medium">
                        {item.available ? "Available" : "Unavailable"}
                      </span>
                    </label>
                  </td>

                  {/* Actions */}
                  <td className="py-4 text-right">
                    <div className="flex items-center justify-end gap-2 text-slate-400">
                      <button
                        onClick={() => alert(`Editing item: ${item.name}`)}
                        className="p-1 hover:text-slate-700"
                      >
                        <FontAwesomeIcon icon={faPenToSquare} className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => alert(`Options for: ${item.name}`)}
                        className="p-1 hover:text-slate-700"
                      >
                        <FontAwesomeIcon icon={faEllipsisVertical} className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}