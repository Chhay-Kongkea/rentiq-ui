"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import type {
  PlatformPricing,
  Promotion,
  PromotionPackage,
  PromotionStatus,
} from "@/lib/types/public.types";
import { useGetPlatformPricingQuery } from "@/redux/services/publicApi";
import { useGetMyVendorItemsQuery } from "@/redux/services/vendorApi";
import {
  useCancelPromotionMutation,
  useCreatePromotionMutation,
  useGetMyPromotionsQuery,
  useGetPromotionStatsByIdQuery,
} from "@/redux/services/promotionApi";

const ACCENT = "#F73030";
const PAGE_SIZE = 10;

const PACKAGE_TYPES = ["BOOST_1_DAY", "BOOST_3_DAYS", "BOOST_7_DAYS"] as const;

const PACKAGE_META: Record<PromotionPackage, { label: string; days: number; blurb: string }> = {
  BOOST_1_DAY: { label: "1-day boost", days: 1, blurb: "Front-page exposure for 24 hours." },
  BOOST_3_DAYS: { label: "3-day boost", days: 3, blurb: "Stay near the top for a long weekend." },
  BOOST_7_DAYS: { label: "7-day boost", days: 7, blurb: "A full week of priority placement." },
};

const STATUS_FILTERS: Array<{ label: string; value: PromotionStatus | "ALL" }> = [
  { label: "All", value: "ALL" },
  { label: "Active", value: "ACTIVE" },
  { label: "Expired", value: "EXPIRED" },
  { label: "Cancelled", value: "CANCELLED" },
  { label: "Suspended", value: "SUSPENDED" },
];

const STATUS_STYLES: Record<PromotionStatus, string> = {
  ACTIVE: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  EXPIRED: "bg-slate-100 text-slate-600 ring-slate-500/20",
  CANCELLED: "bg-amber-50 text-amber-700 ring-amber-600/20",
  SUSPENDED: "bg-red-50 text-red-700 ring-red-600/20",
};

function apiMessage(error: unknown, fallback: string) {
  if (typeof error === "object" && error && "data" in error) {
    const data = (error as { data?: { message?: string; validationErrors?: Record<string, string> } }).data;
    const validation = data?.validationErrors ? Object.values(data.validationErrors).filter(Boolean) : [];
    if (validation.length) return validation.join(" ");
    if (data?.message) return data.message;
  }
  return fallback;
}

function money(value?: number, currency = "USD") {
  if (value == null) return "—";
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(value);
  } catch {
    return `${currency} ${value.toFixed(2)}`;
  }
}

function formatDate(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function packageLabel(packageType?: PromotionPackage) {
  return packageType ? PACKAGE_META[packageType]?.label ?? packageType : "—";
}

function StatusBadge({ status }: { status?: PromotionStatus }) {
  if (!status) return null;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ring-1 ring-inset ${STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Create promotion form (zod-validated)                              */
/* ------------------------------------------------------------------ */

const schema = z.object({
  itemId: z
    .string()
    .min(1, "Select a listing to promote")
    .uuid("That listing reference is not valid"),
  packageType: z.enum(PACKAGE_TYPES, { message: "Choose a boost package" }),
});

type PromotionFormValues = z.infer<typeof schema>;

function packagePrice(pricing: PlatformPricing | undefined, packageType?: PromotionPackage) {
  const entry = pricing?.promotions?.find((promotion) => promotion.packageType === packageType);
  if (!entry?.prices) return null;
  const usd = entry.prices.USD ?? entry.prices.usd;
  const [firstCurrency, firstValue] = Object.entries(entry.prices)[0] ?? [];
  return usd != null
    ? { currency: "USD", amount: usd, days: entry.durationDays }
    : firstCurrency != null
      ? { currency: firstCurrency, amount: firstValue as number, days: entry.durationDays }
      : null;
}

function PromotionForm({
  items,
  isLoadingItems,
}: {
  items: Array<{ id: string; title?: string; status?: string; approvalStatus?: string }>;
  isLoadingItems: boolean;
}) {
  const [createPromotion, { isLoading }] = useCreatePromotionMutation();
  const { data: pricing } = useGetPlatformPricingQuery();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<PromotionFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { itemId: "", packageType: undefined },
  });

  const selectedPackage = watch("packageType");
  const price = packagePrice(pricing, selectedPackage);

  async function onSubmit(values: PromotionFormValues) {
    try {
      await createPromotion(values).unwrap();
      toast.success("Promotion created — your listing is now boosted.");
      reset({ itemId: "", packageType: undefined });
    } catch (error) {
      toast.error(apiMessage(error, "Unable to create the promotion."));
    }
  }

  const noItems = !isLoadingItems && items.length === 0;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-bold text-slate-950">Boost a listing</h2>
        <p className="text-xs text-slate-500">
          Buy a placement package for one of your listings. Matches <code className="text-slate-600">POST /promotions</code>.
        </p>
      </div>

      {noItems ? (
        <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          You need at least one listing before you can promote it.{" "}
          <Link href="/vendor/dashboard/listings" className="font-bold underline">
            Create a listing
          </Link>
          .
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="text-sm font-semibold text-slate-700">
            Listing
            <select
              {...register("itemId")}
              aria-invalid={Boolean(errors.itemId)}
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal aria-[invalid=true]:border-red-400"
            >
              <option value="">{isLoadingItems ? "Loading listings…" : "Select a listing"}</option>
              {items.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title || "Untitled listing"}
                  {item.status && item.status !== "ACTIVE" ? ` (${item.status.toLowerCase()})` : ""}
                </option>
              ))}
            </select>
            {errors.itemId ? (
              <span className="mt-1 block text-xs font-medium text-red-500">{errors.itemId.message}</span>
            ) : null}
          </label>

          <label className="text-sm font-semibold text-slate-700">
            Package
            <select
              {...register("packageType")}
              aria-invalid={Boolean(errors.packageType)}
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal aria-[invalid=true]:border-red-400"
            >
              <option value="">Select a package</option>
              {PACKAGE_TYPES.map((value) => (
                <option key={value} value={value}>
                  {PACKAGE_META[value].label}
                </option>
              ))}
            </select>
            {errors.packageType ? (
              <span className="mt-1 block text-xs font-medium text-red-500">{errors.packageType.message}</span>
            ) : null}
          </label>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm md:col-span-2">
            {selectedPackage ? (
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-bold text-slate-900">{PACKAGE_META[selectedPackage].label}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{PACKAGE_META[selectedPackage].blurb}</p>
                </div>
                <p className="text-right">
                  <span className="text-lg font-extrabold text-slate-900">
                    {price ? money(price.amount, price.currency) : "Price at checkout"}
                  </span>
                  <span className="block text-xs text-slate-500">
                    {(price?.days ?? PACKAGE_META[selectedPackage].days)} day
                    {(price?.days ?? PACKAGE_META[selectedPackage].days) === 1 ? "" : "s"} of priority placement
                  </span>
                </p>
              </div>
            ) : (
              <p className="text-xs text-slate-500">Choose a package to see its price and duration.</p>
            )}
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-xl px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
              style={{ backgroundColor: ACCENT }}
            >
              {isLoading ? "Creating…" : "Create promotion"}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Promotion row with expandable live stats                           */
/* ------------------------------------------------------------------ */

function PromotionRow({
  promotion,
  itemTitle,
  onCancel,
  isCancelling,
}: {
  promotion: Promotion;
  itemTitle: string;
  onCancel: (id: string) => void;
  isCancelling: boolean;
}) {
  const [open, setOpen] = useState(false);
  const { data: stats, isFetching: statsLoading } = useGetPromotionStatsByIdQuery(promotion.id ?? "", {
    skip: !open || !promotion.id,
  });

  const impressions = stats?.impressions ?? promotion.impressionCount ?? 0;
  const clicks = stats?.clicks ?? promotion.clickCount ?? 0;
  const ctr = stats?.ctr != null ? stats.ctr : impressions > 0 ? clicks / impressions : 0;

  return (
    <article className="p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate font-bold text-slate-950">{itemTitle}</h3>
            <StatusBadge status={promotion.status} />
          </div>
          <p className="mt-1 text-sm font-semibold text-[#253C95]">
            {packageLabel(promotion.packageType)} · {money(promotion.price, promotion.currency || "USD")}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {formatDate(promotion.startAt)} → {formatDate(promotion.endAt)} · {promotion.durationDays ?? "—"} days ·{" "}
            {(promotion.impressionCount ?? 0).toLocaleString()} impressions ·{" "}
            {(promotion.clickCount ?? 0).toLocaleString()} clicks
          </p>
          {promotion.status === "SUSPENDED" && promotion.suspensionReason ? (
            <p className="mt-1 text-xs font-medium text-red-600">Suspended: {promotion.suspensionReason}</p>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700"
          >
            {open ? "Hide stats" : "View stats"}
          </button>
          {promotion.status === "ACTIVE" && promotion.id ? (
            <button
              type="button"
              onClick={() => onCancel(promotion.id as string)}
              disabled={isCancelling}
              className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 disabled:opacity-50"
            >
              Cancel
            </button>
          ) : null}
        </div>
      </div>

      {open ? (
        <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-4">
          {statsLoading ? (
            <p className="col-span-full text-sm text-slate-500">Loading stats…</p>
          ) : (
            <>
              <Stat label="Impressions" value={impressions.toLocaleString()} />
              <Stat label="Clicks" value={clicks.toLocaleString()} />
              <Stat label="CTR" value={`${(ctr * 100).toFixed(2)}%`} />
              <Stat label="Spend" value={money(stats?.price ?? promotion.price, stats?.currency || promotion.currency || "USD")} />
            </>
          )}
        </div>
      ) : null}
    </article>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-0.5 text-lg font-extrabold text-slate-900">{value}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                               */
/* ------------------------------------------------------------------ */

export default function VendorPromotionsPage() {
  const [statusFilter, setStatusFilter] = useState<PromotionStatus | "ALL">("ALL");
  const [page, setPage] = useState(0);

  const { data: itemPage, isLoading: itemsLoading } = useGetMyVendorItemsQuery({ pageSize: 100 });
  const items = useMemo(() => itemPage?.content ?? [], [itemPage]);
  const itemTitleById = useMemo(
    () => new Map(items.map((item) => [item.id, item.title || "Untitled listing"])),
    [items],
  );

  const {
    data: promotionsPage,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetMyPromotionsQuery({
    status: statusFilter === "ALL" ? undefined : statusFilter,
    page,
    size: PAGE_SIZE,
    sort: "createdAt,desc",
  });

  const [cancelPromotion, { isLoading: isCancelling }] = useCancelPromotionMutation();

  const promotions = promotionsPage?.content ?? [];
  const totalPages = promotionsPage?.totalPages ?? 0;

  function changeFilter(value: PromotionStatus | "ALL") {
    setStatusFilter(value);
    setPage(0);
  }

  async function handleCancel(id: string) {
    if (!window.confirm("Cancel this promotion? It will stop running immediately.")) return;
    try {
      await cancelPromotion(id).unwrap();
      toast.success("Promotion cancelled.");
    } catch (error) {
      toast.error(apiMessage(error, "Unable to cancel this promotion."));
    }
  }

  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      <div>
        <p className="text-sm font-semibold text-[#F73030]">Marketing</p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-950">Promotions</h1>
        <p className="mt-1 text-sm text-slate-500">
          Boost your listings to the top of search and browse results, then track impressions and clicks.
        </p>
      </div>

      <PromotionForm items={items} isLoadingItems={itemsLoading} />

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 p-4">
          {STATUS_FILTERS.map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => changeFilter(filter.value)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                statusFilter === filter.value
                  ? "bg-[#253C95] text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {filter.label}
            </button>
          ))}
          {isFetching ? <span className="ml-auto text-xs text-slate-400">Refreshing…</span> : null}
        </div>

        {isLoading ? (
          <p className="p-6 text-sm text-slate-500">Loading promotions…</p>
        ) : isError ? (
          <div className="p-8 text-center">
            <p className="font-bold text-red-700">Unable to load your promotions.</p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-4 rounded-xl bg-[#F73030] px-4 py-2 text-sm font-bold text-white"
            >
              Try again
            </button>
          </div>
        ) : promotions.length === 0 ? (
          <p className="p-10 text-center text-sm text-slate-500">
            {statusFilter === "ALL"
              ? "You have not promoted any listings yet."
              : `No ${statusFilter.toLowerCase()} promotions.`}
          </p>
        ) : (
          <div className="divide-y divide-slate-100">
            {promotions.map((promotion) => (
              <PromotionRow
                key={promotion.id ?? `${promotion.itemId}-${promotion.startAt}`}
                promotion={promotion}
                itemTitle={
                  (promotion.itemId && itemTitleById.get(promotion.itemId)) ||
                  (promotion.itemId ? `Listing ${promotion.itemId.slice(0, 8)}…` : "Listing")
                }
                onCancel={handleCancel}
                isCancelling={isCancelling}
              />
            ))}
          </div>
        )}

        {totalPages > 1 ? (
          <div className="flex items-center justify-between gap-3 border-t border-slate-100 p-4">
            <button
              type="button"
              onClick={() => setPage((value) => Math.max(0, value - 1))}
              disabled={promotionsPage?.first ?? page === 0}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 disabled:opacity-40"
            >
              Previous
            </button>
            <span className="text-xs text-slate-500">
              Page {page + 1} of {totalPages} · {promotionsPage?.totalElements ?? 0} total
            </span>
            <button
              type="button"
              onClick={() => setPage((value) => (promotionsPage?.last ? value : value + 1))}
              disabled={promotionsPage?.last ?? true}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        ) : null}
      </section>
    </div>
  );
}
