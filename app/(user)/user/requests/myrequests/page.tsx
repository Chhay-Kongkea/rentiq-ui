"use client";

import { useEffect, useMemo, useState } from "react";
import { useGetMyItemRequestsQuery } from "@/redux/services/userApi";
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
} from "lucide-react";

type Status = "Urgent" | "Active";

type RequestCard = {
  id: string;
  title: string;
  description: string;
  budget: string;
  dates: string;
  location: string;
  locationUrl?: string;
  latitude?: number;
  longitude?: number;
  status: Status;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  offerCount: number;
  offerAvatars: number;
};

const TABS = [
  { key: "open", label: "Open" },
  { key: "booked", label: "Booked" },
  { key: "closed", label: "Closed" },
  { key: "expired", label: "Expired" },
] as const;

type TabKey = (typeof TABS)[number]["key"];
const STATUS_BY_TAB: Record<TabKey, string> = { open: "OPEN", booked: "MATCHED", closed: "CANCELLED", expired: "EXPIRED" };

// How many cards to show per page. Swap this for whatever page size your
// API uses, or read it from a query param if you want it user-configurable.
const PAGE_SIZE = 6;

export default function MyRequestsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("open");
  const [page, setPage] = useState(1);

  const { data: requestPage, isLoading, isError } = useGetMyItemRequestsQuery({ pageNumber: 0, pageSize: 100 });
  const apiRequests = useMemo(() => requestPage?.content ?? [], [requestPage?.content]);
  const tabCounts: Record<TabKey, number> = {
    open: apiRequests.filter((request) => request.status === STATUS_BY_TAB.open).length,
    booked: apiRequests.filter((request) => request.status === STATUS_BY_TAB.booked).length,
    closed: apiRequests.filter((request) => request.status === STATUS_BY_TAB.closed).length,
    expired: apiRequests.filter((request) => request.status === STATUS_BY_TAB.expired).length,
  };
  const activeTabMeta = { ...TABS.find((tab) => tab.key === activeTab)!, count: tabCounts[activeTab] };
  const requests = useMemo(() => apiRequests.filter((request) => request.status === STATUS_BY_TAB[activeTab]).slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map((request) => ({ id: request.id, title: request.title || "Rental request", description: request.description || "", budget: request.budgetMin != null || request.budgetMax != null ? `${request.budgetMin ?? 0} - ${request.budgetMax ?? 0}` : "Budget not specified", dates: [request.neededFrom, request.neededTo].filter(Boolean).join(" - ") || "Dates flexible", location: request.location || (request.latitude != null && request.longitude != null ? `${request.latitude.toFixed(5)}, ${request.longitude.toFixed(5)}` : "Location not specified"), locationUrl: request.latitude != null && request.longitude != null ? `https://www.google.com/maps?q=${request.latitude},${request.longitude}` : undefined, latitude: request.latitude, longitude: request.longitude, status: request.status === "OPEN" ? "Active" : "Urgent", icon: Tag, iconBg: "bg-[#253C95]", offerCount: request.offerCount || 0, offerAvatars: Math.min(request.offerCount || 0, 3) } as RequestCard)), [apiRequests, activeTab, page]);
  const resolvedLocations = useRequestLocations(requests);
  const totalPages = Math.max(1, Math.ceil(activeTabMeta.count / PAGE_SIZE));

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
                  {tabCounts[tab.key]}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading ? <p className="col-span-full py-12 text-center text-sm text-gray-500">Loading requests...</p> : isError ? <p className="col-span-full py-12 text-center text-sm text-red-500">Unable to load requests.</p> : requests.map((request) => (
            <RequestListCard key={request.id} request={request} resolvedLocation={resolvedLocations[request.id]} />
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

function RequestListCard({ request, resolvedLocation }: { request: RequestCard; resolvedLocation?: string }) {
  const Icon = request.icon;
  const statusStyles = request.status === "Urgent" ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-[#253C95]";
  return (
    <article className="group flex min-h-[390px] flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4"><span className={`flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-sm ${request.iconBg}`}><Icon className="h-5 w-5" /></span><span className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${statusStyles}`}>{request.status}</span></div>
      <div className="flex flex-1 flex-col px-5 py-5"><h3 className="line-clamp-1 text-lg font-bold tracking-tight text-[#1A2340]">{request.title}</h3><p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-slate-500">{request.description || "No description provided."}</p>
        <dl className="mt-5 space-y-3 rounded-xl bg-slate-50 p-3.5"><div className="flex items-center gap-3 text-sm text-slate-600"><Banknote className="h-4 w-4 text-[#253C95]" /><span className="truncate">{request.budget}</span></div><div className="flex items-center gap-3 text-sm text-slate-600"><CalendarDays className="h-4 w-4 text-[#253C95]" /><span className="truncate">{request.dates}</span></div><div className="flex items-center gap-3 text-sm text-slate-600"><MapPin className="h-4 w-4 shrink-0 text-[#F73030]" />{request.locationUrl ? <a href={request.locationUrl} target="_blank" rel="noreferrer" className="truncate font-medium text-[#253C95] underline-offset-2 hover:underline">{resolvedLocation || "Finding village..."}</a> : <span className="truncate">{request.location}</span>}</div></dl>
        <div className="mt-auto flex items-end justify-between gap-3 pt-5"><div><p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">Offers received</p><p className="mt-1 text-sm font-semibold text-slate-700">{request.offerCount} {request.offerCount === 1 ? "offer" : "offers"}</p></div><Link href={`/user/requests/requests_detail?requestId=${request.id}`} className="rounded-lg bg-[#F73030] px-3.5 py-2 text-xs font-bold text-white transition hover:bg-[#dd2b2b]">{request.offerCount ? "View offers" : "View request"}</Link></div>
      </div>
    </article>
  );
}

function useRequestLocations(requests: RequestCard[]) {
  const [locations, setLocations] = useState<Record<string, string>>({});

  useEffect(() => {
    const request = requests.find((entry) => entry.latitude != null && entry.longitude != null && !locations[entry.id]);
    if (!request || request.latitude == null || request.longitude == null) return;
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout> | undefined;

    fetch(`/api/geocode/reverse?lat=${encodeURIComponent(request.latitude)}&lng=${encodeURIComponent(request.longitude)}`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Reverse geocoding failed");
        return response.json() as Promise<{ label?: string }>;
      })
      .then((result) => {
        timer = setTimeout(() => setLocations((current) => ({ ...current, [request.id]: result.label || request.location })), 1100);
      })
      .catch((error: unknown) => {
        if (!(error instanceof DOMException && error.name === "AbortError")) timer = setTimeout(() => setLocations((current) => ({ ...current, [request.id]: request.location })), 1100);
      });

    return () => {
      controller.abort();
      if (timer) clearTimeout(timer);
    };
  }, [locations, requests]);

  return locations;
}
// Standard "windowed" pagination range: always shows first, last, the
// current page ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â± siblingCount, and collapses everything else into a
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
