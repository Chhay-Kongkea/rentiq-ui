"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Home,
  Tag,
  RefreshCcw,
  Globe,
  Menu,
  Search,
  Plus,
  Banknote,
  CalendarDays,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Video,
  Car,
  Drill,
  Headphones,
  User,
  Clock,
  MessageCircle,
  Share2,
  Camera,
  Music2,
  PlayCircle,
} from "lucide-react";

type Status = "Urgent" | "Active";

type RequestCard = {
  id: string;
  title: string;
  description: string;
  budget: string;
  dates: string;
  location: string;
  status: Status;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  offerCount: number;
  offerAvatars: number;
};

const TABS = [
  { key: "open", label: "Open", count: 12 },
  { key: "booked", label: "Booked", count: 4 },
  { key: "closed", label: "Closed", count: 28 },
  { key: "expired", label: "Expired", count: 2 },
] as const;

type TabKey = (typeof TABS)[number]["key"];

// How many cards to show per page. Swap this for whatever page size your
// API uses, or read it from a query param if you want it user-configurable.
const PAGE_SIZE = 6;

// Template cards used to synthesize demo data per tab/page. Replace this
// entire block with a real fetch (e.g. `fetchRequests({ tab, page })`)
// that returns { items, totalCount } from your API.
const REQUEST_TEMPLATES: Omit<RequestCard, "id">[] = [
  {
    title: "Cinema Camera Rig",
    description:
      "Looking for a RED or ARRI kit for a 3-day indie film shoot in Downtown.",
    budget: "$200 - $350 / day",
    dates: "Oct 12 - Oct 15",
    location: "Downtown Manhattan, NY",
    status: "Urgent",
    icon: Video,
    iconBg: "bg-[#3E3226]",
    offerCount: 8,
    offerAvatars: 3,
  },
  {
    title: "Tesla Model 3",
    description:
      "Need a clean EV for a weekend road trip. Preferred with FSD enabled if...",
    budget: "$200 - $350 / day",
    dates: "Oct 12 - Oct 15",
    location: "Downtown Manhattan, NY",
    status: "Active",
    icon: Car,
    iconBg: "bg-[#7A1F1F]",
    offerCount: 2,
    offerAvatars: 2,
  },
  {
    title: "Heavy Duty Jackhammer",
    description:
      "Driveway renovation project. Need a reliable electric jackhammer for one...",
    budget: "$200 - $350 / day",
    dates: "Oct 12 - Oct 15",
    location: "Downtown Manhattan, NY",
    status: "Active",
    icon: Drill,
    iconBg: "bg-[#D9D9D9]",
    offerCount: 0,
    offerAvatars: 0,
  },
  {
    title: "DJ Deck & Speakers",
    description:
      "Need a Pioneer CDJ set and two high-powered PA speakers for a private...",
    budget: "$200 - $350 / day",
    dates: "Oct 12 - Oct 15",
    location: "Downtown Manhattan, NY",
    status: "Active",
    icon: Headphones,
    iconBg: "bg-[#1F2937]",
    offerCount: 1,
    offerAvatars: 1,
  },
];

// Builds a page's worth of demo cards for a given tab. Replace with a real
// data fetch keyed by (tabKey, page) — this only exists so pagination has
// something to visibly page through.
function getRequestsForPage(tabKey: TabKey, page: number): RequestCard[] {
  const tab = TABS.find((t) => t.key === tabKey)!;
  const start = (page - 1) * PAGE_SIZE;
  const count = Math.max(0, Math.min(PAGE_SIZE, tab.count - start));

  return Array.from({ length: count }, (_, i) => {
    const template = REQUEST_TEMPLATES[(start + i) % REQUEST_TEMPLATES.length];
    return { ...template, id: `${tabKey}-${start + i + 1}` };
  });
}

export default function MyRequestsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("open");
  const [page, setPage] = useState(1);

  const activeTabMeta = TABS.find((t) => t.key === activeTab)!;
  const totalPages = Math.max(1, Math.ceil(activeTabMeta.count / PAGE_SIZE));

  const requests = useMemo(
    () => getRequestsForPage(activeTab, page),
    [activeTab, page]
  );

  function handleTabChange(tab: TabKey) {
    setActiveTab(tab);
    setPage(1); // reset to page 1 whenever the tab (and its total) changes
  }

  return (
    <div className="min-h-screen bg-[#F2F4F7] text-[#1A2340]">
      <main className="mx-auto max-w-6xl px-6 pb-20 pt-12">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">
              <span className="text-[#1A2E6B]">My </span>
              <span className="text-[#E8402C]">Requests</span>
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Manage your active rental requests and track incoming offers.
            </p>
          </div>
          <Link
            href="/user/requests/post_requests"
            className="flex shrink-0 items-center gap-2 rounded-full bg-[#E8402C] px-5 py-3 text-sm font-semibold text-white hover:bg-[#d6371f]"
          >
            <Plus className="h-4 w-4" />
            New Request
          </Link>
        </div>

        <div className="mt-8 flex gap-8 border-b border-gray-200">
          {TABS.map((tab) => {
            const isActive = tab.key === activeTab;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => handleTabChange(tab.key)}
                className={`flex items-center gap-2 border-b-2 pb-3 text-sm font-medium transition ${
                  isActive
                    ? "border-[#E8402C] text-[#E8402C]"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
                <span
                  className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs ${
                    isActive
                      ? "bg-[#FBE3DF] text-[#E8402C]"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {requests.map((request) => (
            <RequestListCard key={request.id} request={request} />
          ))}
        </div>

        {requests.length === 0 && (
          <p className="mt-16 text-center text-sm text-gray-400">
            No {activeTabMeta.label.toLowerCase()} requests on this page.
          </p>
        )}

        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      </main>
    </div>
  );
}

function RequestListCard({ request }: { request: RequestCard }) {
  const Icon = request.icon;
  const statusStyles =
    request.status === "Urgent"
      ? "bg-[#D6F5E7] text-[#0F9D58]"
      : "bg-[#E4EBFB] text-[#3958A5]";

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_4px_24px_rgba(20,30,60,0.06)]">
      <div className="flex items-start justify-between p-5 pb-0">
        <span
          className={`flex h-14 w-14 items-center justify-center rounded-xl text-white ${request.iconBg}`}
        >
          <Icon className="h-6 w-6" />
        </span>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles}`}
        >
          {request.status}
        </span>
      </div>

      <div className="px-5 pt-4">
        <h3 className="text-lg font-bold text-[#1A2340]">{request.title}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-gray-500">
          {request.description}
        </p>

        <dl className="mt-4 space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Banknote className="h-4 w-4 text-gray-400" />
            <span>Budget: {request.budget}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <CalendarDays className="h-4 w-4 text-gray-400" />
            <span>{request.dates}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4 text-gray-400" />
            <span>{request.location}</span>
          </div>
        </dl>
      </div>

      <div className="mt-5 flex items-center justify-between bg-[#EEF2FC] px-5 py-4">
        <div>
          <p className="text-[11px] font-bold tracking-wide text-gray-500">
            OFFERS RECEIVED
          </p>
          {request.offerCount === 0 ? (
            <p className="mt-1 flex items-center gap-1 text-xs text-gray-400">
              <Clock className="h-3.5 w-3.5" />
              No offers yet
            </p>
          ) : (
            <div className="mt-1 flex items-center">
              {Array.from({ length: Math.min(request.offerAvatars, 3) }).map(
                (_, i) => (
                  <span
                    key={i}
                    className="-ml-1.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-gray-300 text-gray-600 first:ml-0"
                  >
                    <User className="h-3 w-3" />
                  </span>
                )
              )}
              {request.offerCount > request.offerAvatars && (
                <span className="-ml-1.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-[#1A2340] text-[10px] font-semibold text-white">
                  +{request.offerCount - request.offerAvatars}
                </span>
              )}
            </div>
          )}
        </div>
        <Link
          href="/user/requests/requests_detail"
          className="text-sm font-semibold text-[#E8402C] hover:underline"
        >
          {request.offerCount === 0
            ? "No Offers"
            : `View ${request.offerCount} Offer${request.offerCount > 1 ? "s" : ""}`}
        </Link>
      </div>
    </div>
  );
}

// Standard "windowed" pagination range: always shows first, last, the
// current page ± siblingCount, and collapses everything else into a
// single "..." on each side once there's a gap worth collapsing.
type PageItem = number | "left-ellipsis" | "right-ellipsis";

function getPaginationRange(
  current: number,
  total: number,
  siblingCount = 1
): PageItem[] {
  const totalVisible = siblingCount * 2 + 5; // first + last + current + 2*sibling + 2*ellipsis

  if (totalVisible >= total) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const leftSibling = Math.max(current - siblingCount, 1);
  const rightSibling = Math.min(current + siblingCount, total);

  const showLeftEllipsis = leftSibling > 2;
  const showRightEllipsis = rightSibling < total - 1;

  if (!showLeftEllipsis && showRightEllipsis) {
    const leftCount = 3 + siblingCount * 2;
    const leftRange = Array.from({ length: leftCount }, (_, i) => i + 1);
    return [...leftRange, "right-ellipsis", total];
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    const rightCount = 3 + siblingCount * 2;
    const rightRange = Array.from(
      { length: rightCount },
      (_, i) => total - rightCount + i + 1
    );
    return [1, "left-ellipsis", ...rightRange];
  }

  const middleRange = Array.from(
    { length: rightSibling - leftSibling + 1 },
    (_, i) => leftSibling + i
  );
  return [1, "left-ellipsis", ...middleRange, "right-ellipsis", total];
}

function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}) {
  const pages = getPaginationRange(page, totalPages);

  if (totalPages <= 1) return null;

  return (
    <div className="mt-12 flex items-center justify-center gap-2">
      <button
        type="button"
        aria-label="Previous page"
        disabled={page === 1}
        onClick={() => onChange(Math.max(1, page - 1))}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {pages.map((p) =>
        p === "left-ellipsis" || p === "right-ellipsis" ? (
          <span
            key={p}
            className="flex h-9 w-9 items-center justify-center text-sm text-gray-400"
          >
            ...
          </span>
        ) : (
          <button
            key={p}
            type="button"
            aria-current={page === p ? "page" : undefined}
            onClick={() => onChange(p)}
            className={`flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-medium ${
              page === p
                ? "border-[#E8402C] bg-[#E8402C] text-white"
                : "border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        type="button"
        aria-label="Next page"
        disabled={page === totalPages}
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
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

// function SearchBar() {
//   return (
//     <div className="mx-auto max-w-4xl px-6 pt-8">
//       <div className="flex flex-col items-stretch divide-y divide-gray-200 rounded-3xl border border-gray-200 bg-white p-2 shadow-sm sm:flex-row sm:items-center sm:divide-x sm:divide-y-0">
//         <div className="flex-1 px-6 py-2">
//           <p className="text-sm font-semibold">Categories</p>
//           <p className="text-sm text-gray-400">Many choices for you</p>
//         </div>
//         <div className="flex-1 px-6 py-2">
//           <p className="text-sm font-semibold">Where</p>
//           <p className="text-sm text-gray-400">Search destinations</p>
//         </div>
//         <div className="flex flex-1 items-center justify-between px-6 py-2">
//           <div>
//             <p className="text-sm font-semibold">When</p>
//             <p className="text-sm text-gray-400">Add dates</p>
//           </div>
//           <button
//             type="button"
//             aria-label="Search"
//             className="ml-4 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#E8402C] text-white hover:bg-[#d6371f]"
//           >
//             <Search className="h-5 w-5" />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }