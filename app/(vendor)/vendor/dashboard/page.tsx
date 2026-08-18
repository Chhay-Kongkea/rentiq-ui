"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarCheck,
  faChartLine,
  faInbox,
  faListCheck,
  faStar,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";
import {
  useGetMyVendorItemsQuery,
  useGetMyVendorOffersQuery,
  useGetVendorBookingsQuery,
  useGetVendorPerformanceQuery,
  useGetVendorWalletQuery,
} from "@/redux/services/vendorApi";

function money(value?: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(value ?? 0);
}

export default function VendorDashboardPage() {
  const { data: performance, isLoading: performanceLoading } = useGetVendorPerformanceQuery();
  const { data: wallet, isLoading: walletLoading } = useGetVendorWalletQuery();
  const { data: items, isLoading: itemsLoading } = useGetMyVendorItemsQuery({ pageSize: 6 });
  const { data: bookings = [], isLoading: bookingsLoading } = useGetVendorBookingsQuery();
  const { data: offers, isLoading: offersLoading } = useGetMyVendorOffersQuery({ pageSize: 6 });

  const inventory = items?.content ?? [];
  const pendingBookings = bookings.filter((booking) => booking.status === "PENDING");
  const activeBookings = bookings.filter((booking) => ["APPROVED", "RENTED"].includes(booking.status));
  const pendingOffers = (offers?.content ?? []).filter((offer) => offer.status === "PENDING");
  const loading = performanceLoading || walletLoading || itemsLoading || bookingsLoading || offersLoading;

  const cards = [
    {
      label: "Total earnings",
      value: money(performance?.totalEarnings, wallet?.currency || "USD"),
      detail: `${performance?.completedBookings ?? 0} completed bookings`,
      icon: faChartLine,
    },
    {
      label: "Active listings",
      value: String(inventory.filter((item) => item.status === "ACTIVE").length),
      detail: `${items?.totalElements ?? inventory.length} total listings`,
      icon: faListCheck,
    },
    {
      label: "Average rating",
      value: (performance?.averageRating ?? 0).toFixed(1),
      detail: `${performance?.reviewCount ?? 0} reviews`,
      icon: faStar,
    },
  ];

  return (
    <div className="mx-auto max-w-[1400px] space-y-6 text-slate-800">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-[#F73030]">Vendor workspace</p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">Live data from your RentiQ vendor endpoints.</p>
        </div>
        <Link href="/vendor/dashboard/listings" className="rounded-xl bg-[#F73030] px-4 py-2.5 text-center text-sm font-semibold text-white">
          Add listing
        </Link>
      </div>

      {loading ? <div className="rounded-2xl border bg-white p-6 text-sm text-slate-500">Loading vendor dashboard...</div> : null}

      <div className="grid gap-5 md:grid-cols-3">
        {cards.map((card) => (
          <div key={card.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-500">{card.label}</p>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-[#253C95]">
                <FontAwesomeIcon icon={card.icon} className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-3 text-2xl font-extrabold text-slate-950">{card.value}</p>
            <p className="mt-1 text-xs text-slate-400">{card.detail}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Link href="/vendor/dashboard/wallet" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-[#253C95]/30">
          <div className="flex items-center gap-3">
            <FontAwesomeIcon icon={faWallet} className="h-5 w-5 text-[#253C95]" />
            <h2 className="font-bold text-slate-950">Wallet</h2>
          </div>
          <p className="mt-4 text-3xl font-extrabold text-[#F73030]">{money(wallet?.balance, wallet?.currency || "USD")}</p>
          <p className="mt-1 text-xs text-slate-500">Frozen: {money(wallet?.frozenBalance, wallet?.currency || "USD")}</p>
        </Link>

        <Link href="/vendor/dashboard/booking" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-[#253C95]/30">
          <div className="flex items-center gap-3">
            <FontAwesomeIcon icon={faCalendarCheck} className="h-5 w-5 text-[#253C95]" />
            <h2 className="font-bold text-slate-950">Bookings</h2>
          </div>
          <p className="mt-4 text-3xl font-extrabold text-slate-950">{bookings.length}</p>
          <p className="mt-1 text-xs text-slate-500">{pendingBookings.length} pending · {activeBookings.length} active</p>
        </Link>

        <Link href="/vendor/dashboard/requests" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-[#253C95]/30">
          <div className="flex items-center gap-3">
            <FontAwesomeIcon icon={faInbox} className="h-5 w-5 text-[#253C95]" />
            <h2 className="font-bold text-slate-950">My offers</h2>
          </div>
          <p className="mt-4 text-3xl font-extrabold text-slate-950">{offers?.totalElements ?? offers?.content?.length ?? 0}</p>
          <p className="mt-1 text-xs text-slate-500">{pendingOffers.length} currently pending</p>
        </Link>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-slate-950">Recent listings</h2>
              <p className="text-xs text-slate-500">Your latest inventory</p>
            </div>
            <Link href="/vendor/dashboard/listings" className="text-sm font-semibold text-[#253C95]">View all</Link>
          </div>
          <div className="mt-4 divide-y divide-slate-100">
            {inventory.length ? inventory.map((item) => (
              <div key={item.id} className="flex items-center gap-3 py-3">
                <div className="h-12 w-12 overflow-hidden rounded-xl bg-slate-100">
                  {item.primaryImageUrl ? <img src={item.primaryImageUrl} alt="" className="h-full w-full object-cover" /> : null}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900">{item.title || "Untitled item"}</p>
                  <p className="text-xs text-slate-500">{money(item.pricePerDay)} / day</p>
                </div>
                <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-600">{item.approvalStatus || item.status}</span>
              </div>
            )) : <p className="py-8 text-center text-sm text-slate-500">No listings yet.</p>}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-slate-950">Pending bookings</h2>
              <p className="text-xs text-slate-500">Requests that need your action</p>
            </div>
            <Link href="/vendor/dashboard/booking" className="text-sm font-semibold text-[#253C95]">Manage</Link>
          </div>
          <div className="mt-4 divide-y divide-slate-100">
            {pendingBookings.length ? pendingBookings.slice(0, 6).map((booking) => (
              <div key={booking.id} className="flex items-center justify-between gap-3 py-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{booking.bookingRef || booking.id}</p>
                  <p className="text-xs text-slate-500">{booking.rentalStart} → {booking.rentalEnd}</p>
                </div>
                <span className="text-sm font-bold text-slate-900">{money(booking.totalAmount, booking.currency || "USD")}</span>
              </div>
            )) : <p className="py-8 text-center text-sm text-slate-500">No pending bookings.</p>}
          </div>
        </section>
      </div>
    </div>
  );
}
