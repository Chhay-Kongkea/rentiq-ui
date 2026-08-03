"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Home,
  Tag,
  RefreshCcw,
  Globe,
  Menu,
  Search,
  FileText,
  BadgeCheck,
  CalendarDays,
  MapPin,
  XCircle,
  Timer,
  Tags,
  ChevronDown,
  MessageSquare,
  Star,
  MessageCircle,
  Share2,
  Camera,
  Music2,
  PlayCircle,
} from "lucide-react";

type Offer = {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  title: string;
  quote: string;
  totalPrice: number;
  perDay: number;
  bestMatch?: boolean;
};

const OFFERS: Offer[] = [
  {
    id: "1",
    name: "Tith Cholna",
    rating: 4.9,
    reviewCount: 124,
    title: "Full Kit with Extra Battery",
    quote:
      "Hey! I saw your request. I have the exact Sony setup you need. I'll include a 128GB...",
    totalPrice: 135,
    perDay: 45,
    bestMatch: true,
  },
  {
    id: "2",
    name: "T. Seyha",
    rating: 4.7,
    reviewCount: 42,
    title: "Body Only - Low Usage",
    quote:
      "Body only, but it's practically new. I can meet you for the handoff in DUMBO on...",
    totalPrice: 120,
    perDay: 40,
  },
  {
    id: "3",
    name: "K. Chanthorn",
    rating: 5.0,
    reviewCount: 8,
    title: "Standard Offer",
    quote: "Available for the requested dates. Pickup in Williamsburg.",
    totalPrice: 150,
    perDay: 50,
  },
];

const EXPIRES_IN_SECONDS = 4 * 3600 + 22 * 60 + 15;

export default function RequestDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [sortAsc, setSortAsc] = useState(true);
  const sortedOffers = [...OFFERS].sort((a, b) =>
    sortAsc ? a.totalPrice - b.totalPrice : b.totalPrice - a.totalPrice
  );

  return (
    <div className="min-h-screen bg-[#F2F4F7] text-[#1A2340]">
      {/* <SiteHeader />
      <SearchBar /> */}

      <main className="mx-auto max-w-6xl px-6 pb-20 pt-10">
        <div className="flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-6 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm text-gray-500">
              History{" "}
              <span className="mx-1 text-gray-300">&gt;</span> Requests{" "}
              <span className="mx-1 text-gray-300">&gt;</span>
              <span className="font-semibold text-[#E8402C]">
                Request #{params.id}
              </span>
            </p>
            <h1 className="mt-1 text-2xl font-bold text-[#1A2340]">
              Request Details &amp; Offers
            </h1>
          </div>
          <ExpiryCountdown initialSeconds={EXPIRES_IN_SECONDS} />
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[400px_1fr]">
          <RequestSummaryCard />

          <section>
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-2 text-sm font-semibold text-[#1A2340]">
                <Tags className="h-4 w-4 text-[#1A2E6B]" />
                Incoming Offers{" "}
                <span className="text-[#E8402C]">({sortedOffers.length})</span>
              </p>
              <button
                type="button"
                onClick={() => setSortAsc((v) => !v)}
                className="flex items-center gap-1 rounded-full bg-[#E4EBFB] px-4 py-2 text-xs font-semibold text-[#1A2E6B]"
              >
                Sort by Price
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="mt-5 space-y-5">
              {sortedOffers.map((offer) => (
                <OfferCard key={offer.id} offer={offer} />
              ))}
            </div>

            <p className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-400">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Wait for more lenders to respond...
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}

function ExpiryCountdown({ initialSeconds }: { initialSeconds: number }) {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");

  return (
    <div className="flex items-center gap-3 rounded-xl bg-[#E8402C] px-5 py-3 text-white">
      <Timer className="h-6 w-6" />
      <div>
        <p className="text-[11px] font-bold tracking-wide">EXPIRES IN</p>
        <p className="text-lg font-bold leading-none">
          {h}h {m}m {s}s
        </p>
      </div>
    </div>
  );
}

function RequestSummaryCard() {
  return (
    <div className="h-fit rounded-2xl bg-white p-6 shadow-[0_4px_24px_rgba(20,30,60,0.06)]">
      <p className="flex items-center gap-2 text-sm font-semibold text-[#1A2340]">
        <FileText className="h-4 w-4 text-[#E8402C]" />
        Request Summary
      </p>

      <div className="mt-4 flex gap-4">
        <div className="h-20 w-24 shrink-0 overflow-hidden rounded-lg bg-gray-200" />
        <div>
          <h2 className="text-base font-bold leading-snug text-[#1A2340]">
            Sony Alpha a7 IV + 24-70mm Lens
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Electronics &amp; Photography
          </p>
          <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-[#E4EBFB] px-3 py-1 text-xs font-semibold text-[#1A2E6B]">
            <BadgeCheck className="h-3.5 w-3.5" />
            Verified Request
          </span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 border-t border-gray-100 pt-6">
        <div>
          <p className="text-xs font-bold tracking-wide text-gray-400">
            BUDGET
          </p>
          <p className="mt-1 text-lg font-bold text-[#E8402C]">
            $45.00 / day
          </p>
        </div>
        <div>
          <p className="text-xs font-bold tracking-wide text-gray-400">
            DURATION
          </p>
          <p className="mt-1 text-lg font-bold text-[#1A2340]">3 Days</p>
        </div>
      </div>

      <div className="mt-6 border-t border-gray-100 pt-6">
        <p className="flex items-center gap-2 text-xs font-bold tracking-wide text-gray-400">
          <CalendarDays className="h-4 w-4" />
          RENTAL PERIOD
        </p>
        <p className="mt-1 text-sm font-semibold text-[#1A2340]">
          Oct 12, 2024 — Oct 15, 2024
        </p>
      </div>

      <div className="mt-6 border-t border-gray-100 pt-6">
        <p className="flex items-center gap-2 text-xs font-bold tracking-wide text-gray-400">
          <MapPin className="h-4 w-4" />
          LOCATION
        </p>
        <div className="relative mt-3 h-40 w-full overflow-hidden rounded-xl bg-[#EAF1E4]">
          <div className="absolute inset-0 opacity-70 [background-image:linear-gradient(#d7e6cc_1px,transparent_1px),linear-gradient(90deg,#d7e6cc_1px,transparent_1px)] [background-size:22px_22px]" />
          <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
            <MapPin className="h-7 w-7 fill-[#E8402C] text-white drop-shadow" />
            <span className="mt-1 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-gray-600 shadow-sm">
              Central Market
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 border-t border-gray-100 pt-6">
        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#E8402C] py-3 text-sm font-semibold text-[#E8402C] hover:bg-[#FBF4F3]"
        >
          <XCircle className="h-4 w-4" />
          Cancel Request
        </button>
        <p className="mt-3 text-center text-xs text-gray-400">
          Canceling will notify all potential lenders and clear your current
          offers.
        </p>
      </div>
    </div>
  );
}

function OfferCard({ offer }: { offer: Offer }) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-white p-6 shadow-[0_4px_24px_rgba(20,30,60,0.06)] ${
        offer.bestMatch ? "border-2 border-[#1A2E6B]" : "border border-transparent"
      }`}
    >
      {offer.bestMatch && (
        <span className="absolute right-0 top-0 rounded-bl-lg bg-[#1A2E6B] px-4 py-1.5 text-xs font-bold tracking-wide text-white">
          BEST MATCH
        </span>
      )}

      <div className="flex gap-4">
        <div className="h-14 w-14 shrink-0 rounded-full bg-gray-200" />

        <div className="flex-1">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-base font-bold text-[#1A2340]">
              {offer.title}
            </h3>
            <div className="shrink-0 text-right">
              <p className="text-[11px] font-bold tracking-wide text-gray-400">
                TOTAL OFFER
              </p>
              <p className="text-xl font-bold text-[#E8402C]">
                ${offer.totalPrice.toFixed(2)}
              </p>
              <p className="text-xs text-gray-400">
                ${offer.perDay.toFixed(2)}/day
              </p>
            </div>
          </div>
          <p className="mt-1 text-sm italic text-gray-500">
            &ldquo;{offer.quote}&rdquo;
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 pl-[72px] text-sm">
        <span className="font-semibold text-[#1A2340]">{offer.name}</span>
        <span className="flex items-center gap-0.5 text-amber-500">
          <Star className="h-3.5 w-3.5 fill-amber-500" />
          <span className="text-gray-600">
            {offer.rating.toFixed(1)} ({offer.reviewCount})
          </span>
        </span>
      </div>

      <div className="mt-5 flex flex-col gap-3 border-t border-gray-100 pt-5 sm:flex-row">
        <button
          type="button"
          className={`flex-1 rounded-xl py-3 text-sm font-semibold transition ${
            offer.bestMatch
              ? "bg-[#E8402C] text-white hover:bg-[#d6371f]"
              : "bg-[#E4EBFB] text-[#1A2E6B] hover:bg-[#d7e2f8]"
          }`}
        >
          View Full Offer
        </button>
        <button
          type="button"
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 py-3 text-sm font-semibold text-[#1A2340] hover:bg-gray-50"
        >
          <MessageSquare className="h-4 w-4" />
          Chat
        </button>
      </div>
    </div>
  );
}

function SiteHeader() {
  const navItems = [
    { label: "Homes", icon: Home },
    { label: "Deals", icon: Tag },
    { label: "Request", icon: RefreshCcw },
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
        {navItems.map(({ label, icon: Icon }) => (
          <Link
            key={label}
            href="#"
            className="flex items-center gap-2 text-gray-700 hover:text-[#1A2340]"
          >
            <Icon className="h-5 w-5 text-[#E8402C]" />
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
