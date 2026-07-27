"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Home,
  Tag,
  RefreshCcw,
  Globe,
  Menu,
  Search,
  MapPin,
  ShieldCheck,
  MessageCircle,
  Share2,
  Camera,
  Music2,
  PlayCircle,
} from "lucide-react";

const CATEGORIES = [
  "Cameras & Drones",
  "Tools & Equipment",
  "Vehicles",
  "Electronics",
  "Party & Events",
  "Sports & Outdoors",
];

export default function PostRequestPage() {
  const [category, setCategory] = useState("");
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [minBudget, setMinBudget] = useState("");
  const [maxBudget, setMaxBudget] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Wire this up to your API route / server action.
    console.log({
      category,
      itemName,
      description,
      minBudget,
      maxBudget,
      startDate,
      endDate,
      location,
    });
  };

  return (
    <div className="min-h-screen bg-[#F2F4F7] text-[#1A2340]">
      <SiteHeader />
      <SearchBar />

      <main className="mx-auto max-w-3xl px-6 pb-24 pt-14 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          <span className="text-[#1A2E6B]">Post a </span>
          <span className="text-[#E8402C]">Request</span>
        </h1>
        <p className="mt-4 text-sm text-gray-500 sm:text-base">
          Can&apos;t find what you need? Let the community know and get offers
          from lenders.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-10 rounded-2xl bg-white p-8 text-left shadow-[0_4px_24px_rgba(20,30,60,0.06)] sm:p-10"
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Item Category">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full appearance-none rounded-xl bg-[#EEF2FC] px-4 py-3 text-sm text-gray-700 outline-none ring-0 focus:bg-[#E6ECFA]"
              >
                <option value="">Select a category</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="I am looking for...">
              <input
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="e.g. Professional Camera Drone"
                className="w-full rounded-xl bg-[#EEF2FC] px-4 py-3 text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:bg-[#E6ECFA]"
              />
            </Field>
          </div>

          <div className="mt-6">
            <Field label="What do you need? (Description)">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the item, specific features you need, or how you plan to use it..."
                rows={4}
                className="w-full resize-none rounded-xl bg-[#EEF2FC] px-4 py-3 text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:bg-[#E6ECFA]"
              />
            </Field>
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <Field label="Budget Range (Per Day)">
              <div className="flex items-center gap-3">
                <div className="flex flex-1 items-center gap-1 rounded-xl bg-[#EEF2FC] px-4 py-3">
                  <span className="text-sm text-gray-400">$</span>
                  <input
                    type="number"
                    value={minBudget}
                    onChange={(e) => setMinBudget(e.target.value)}
                    placeholder="Min"
                    className="w-full bg-transparent text-sm text-gray-700 placeholder:text-gray-400 outline-none"
                  />
                </div>
                <span className="text-sm text-gray-400">to</span>
                <div className="flex flex-1 items-center gap-1 rounded-xl bg-[#EEF2FC] px-4 py-3">
                  <span className="text-sm text-gray-400">$</span>
                  <input
                    type="number"
                    value={maxBudget}
                    onChange={(e) => setMaxBudget(e.target.value)}
                    placeholder="Max"
                    className="w-full bg-transparent text-sm text-gray-700 placeholder:text-gray-400 outline-none"
                  />
                </div>
              </div>
            </Field>

            <Field label="Rental Period">
              <div className="flex items-center gap-2 rounded-xl bg-[#EEF2FC] px-4 py-3">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-transparent text-sm text-gray-700 outline-none [color-scheme:light]"
                />
                <span className="text-sm text-gray-400">-</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-transparent text-sm text-gray-700 outline-none [color-scheme:light]"
                />
              </div>
            </Field>
          </div>

          <div className="mt-6">
            <Field label="Pickup Location">
              <div className="flex items-center gap-2 rounded-xl bg-[#EEF2FC] px-4 py-3">
                <MapPin className="h-4 w-4 shrink-0 text-[#E8402C]" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Search for a neighborhood or city..."
                  className="w-full bg-transparent text-sm text-gray-700 placeholder:text-gray-400 outline-none"
                />
              </div>
            </Field>
          </div>

          <MapPreview />

          <div className="mt-8 flex flex-col-reverse items-center justify-between gap-4 border-t border-gray-100 pt-6 sm:flex-row">
            <p className="flex items-center gap-2 text-xs text-gray-500">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              Your request is protected by our Trust &amp; Safety policy.
            </p>
            <button
              type="submit"
              className="w-full rounded-xl bg-[#E8402C] px-8 py-3 text-sm font-semibold text-white transition hover:bg-[#d6371f] sm:w-auto"
            >
              Submit Request
            </button>
          </div>
        </form>
      </main>

    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-gray-800">
        {label}
      </span>
      {children}
    </label>
  );
}

function MapPreview() {
  return (
    <div className="relative mt-6 h-56 w-full overflow-hidden rounded-xl bg-[#CFE7EE] sm:h-64">
      <div className="absolute inset-0 opacity-60 [background-image:linear-gradient(#b9dbe4_1px,transparent_1px),linear-gradient(90deg,#b9dbe4_1px,transparent_1px)] [background-size:28px_28px]" />
      <div className="absolute inset-y-0 right-1/3 w-10 -skew-x-12 bg-[#9FD3E0]" />
      <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
        <MapPin className="h-8 w-8 fill-[#7C3AED] text-white drop-shadow" />
        <span className="mt-1 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-medium text-gray-600 shadow-sm">
          Drag to set pickup point
        </span>
      </div>
    </div>
  );
}

function SiteHeader() {
  const navItems = [
    { label: "Homes", icon: "/icons/home.png" },
    { label: "Deals", icon: "/icons/deal.png" },
    { label: "Request", icon: "/icons/requests.png" },
  ];

  return (
    <header className="flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4 sm:px-10">
      <Link href="/" className="flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#E8402C] text-lg font-bold text-white">
          R
        </span>
        <span className="text-xl font-bold text-[#E8402C]">Rentiq</span>
      </Link>

      <nav className="hidden items-center gap-10 md:flex">
        {navItems.map(({ label, icon }) => (
          <Link
            key={label}
            href="#"
            className="flex items-center gap-2 text-gray-700 hover:text-[#1A2340]"
          >
            {/* <Icon className="h-5 w-5 text-[#E8402C]" /> */}
            <img src={icon} alt="" width={54} height={54} />
            {/* <Image src={icon} alt="Logo" width={200} height={200} /> */}
            <span className="text-base">{label}</span>
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Language"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
        >
          <Globe className="h-4 w-4" />
        </button>
        <button
          type="button"
          aria-label="Menu"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
        >
          <Menu className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}

function SearchBar() {
  return (
    <div className="mx-auto max-w-4xl px-6 pt-8">
      <div className="flex flex-col items-stretch divide-y divide-gray-200 rounded-3xl border border-gray-200 bg-white p-2 shadow-sm sm:flex-row sm:items-center sm:divide-x sm:divide-y-0">
        <div className="flex-1 px-6 py-2">
          <p className="text-sm font-semibold">Categories</p>
          <p className="text-sm text-gray-400">Many choices for you</p>
        </div>
        <div className="flex-1 px-6 py-2">
          <p className="text-sm font-semibold">Where</p>
          <p className="text-sm text-gray-400">Search destinations</p>
        </div>
        <div className="flex flex-1 items-center justify-between px-6 py-2">
          <div>
            <p className="text-sm font-semibold">When</p>
            <p className="text-sm text-gray-400">Add dates</p>
          </div>
          <button
            type="button"
            aria-label="Search"
            className="ml-4 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#E8402C] text-white hover:bg-[#d6371f]"
          >
            <Search className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

