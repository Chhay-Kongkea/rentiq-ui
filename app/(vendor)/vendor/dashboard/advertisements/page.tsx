"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import type {
  Advertisement,
  AdvertisementPackage,
  AdvertisementStatus,
  PlatformPricing,
} from "@/lib/types/public.types";
import { useGetPlatformPricingQuery } from "@/redux/services/publicApi";
import { useGetMyVendorItemsQuery } from "@/redux/services/vendorApi";
import {
  useCancelAdvertisementMutation,
  useCreateAdvertisementMutation,
  useGetMyAdvertisementsQuery,
  useUpdateAdvertisementMutation,
} from "@/redux/services/advertisementApi";

const ACCENT = "#F73030";
const PAGE_SIZE = 10;

const AD_PACKAGE_TYPES = ["AD_3_DAYS", "AD_7_DAYS", "AD_14_DAYS"] as const;

const PACKAGE_META: Record<AdvertisementPackage, { label: string; days: number; blurb: string }> = {
  AD_3_DAYS: { label: "3-day ad", days: 3, blurb: "A banner spot on the marketplace for 3 days." },
  AD_7_DAYS: { label: "7-day ad", days: 7, blurb: "A full week of homepage banner rotation." },
  AD_14_DAYS: { label: "14-day ad", days: 14, blurb: "Two weeks of maximum reach." },
};

const STATUS_FILTERS: Array<{ label: string; value: AdvertisementStatus | "ALL" }> = [
  { label: "All", value: "ALL" },
  { label: "Pending", value: "PENDING" },
  { label: "Approved", value: "APPROVED" },
  { label: "Active", value: "ACTIVE" },
  { label: "Rejected", value: "REJECTED" },
  { label: "Expired", value: "EXPIRED" },
  { label: "Cancelled", value: "CANCELLED" },
];

const STATUS_STYLES: Record<AdvertisementStatus, string> = {
  PENDING: "bg-blue-50 text-blue-700 ring-blue-600/20",
  APPROVED: "bg-indigo-50 text-indigo-700 ring-indigo-600/20",
  ACTIVE: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  REJECTED: "bg-red-50 text-red-700 ring-red-600/20",
  EXPIRED: "bg-slate-100 text-slate-600 ring-slate-500/20",
  CANCELLED: "bg-amber-50 text-amber-700 ring-amber-600/20",
};

const CANCELLABLE: AdvertisementStatus[] = ["PENDING", "APPROVED", "ACTIVE"];

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

function formatDateTime(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
}

function packageLabel(packageType?: AdvertisementPackage) {
  return packageType ? PACKAGE_META[packageType]?.label ?? packageType : "—";
}

/** ISO string -> value for <input type="datetime-local"> in the viewer's timezone. */
function toLocalInput(iso?: string) {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function StatusBadge({ status }: { status?: AdvertisementStatus }) {
  if (!status) return null;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ring-1 ring-inset ${STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  );
}

function adPackagePrice(pricing: PlatformPricing | undefined, packageType?: AdvertisementPackage) {
  const entry = pricing?.advertisements?.find((ad) => ad.packageType === packageType);
  if (!entry?.prices) return null;
  const usd = entry.prices.USD ?? entry.prices.usd;
  const [firstCurrency, firstValue] = Object.entries(entry.prices)[0] ?? [];
  if (usd != null) return { currency: "USD", amount: usd, days: entry.durationDays };
  if (firstCurrency != null) return { currency: firstCurrency, amount: firstValue as number, days: entry.durationDays };
  return null;
}

/* ------------------------------------------------------------------ */
/* Create / edit form (zod-validated)                                 */
/* ------------------------------------------------------------------ */

function makeSchema(mode: "create" | "edit") {
  return z.object({
    itemId: z.string().min(1, "Select a listing to advertise").uuid("That listing reference is not valid"),
    packageType: z.enum(AD_PACKAGE_TYPES, { message: "Choose an ad package" }),
    title: z.string().trim().min(1, "Title is required").max(200, "Keep the title under 200 characters"),
    description: z.string().trim().max(5000, "Description is too long (max 5000 characters)"),
    imageUrl: z.union([
      z.literal(""),
      z.string().trim().url("Enter a valid image URL").max(500, "URL is too long (max 500 characters)"),
    ]),
    startAt: z
      .string()
      .min(1, "Choose when the ad should start")
      .refine((value) => !Number.isNaN(Date.parse(value)), "That start date/time is not valid")
      .refine(
        (value) => mode === "edit" || Date.parse(value) >= Date.now() - 60_000,
        "Start time can’t be in the past",
      ),
  });
}

type AdFormValues = z.infer<ReturnType<typeof makeSchema>>;

function AdvertisementForm({
  items,
  isLoadingItems,
  editing,
  onDone,
}: {
  items: Array<{ id: string; title?: string; status?: string }>;
  isLoadingItems: boolean;
  editing: Advertisement | null;
  onDone: () => void;
}) {
  const mode = editing ? "edit" : "create";
  const [createAdvertisement, createState] = useCreateAdvertisementMutation();
  const [updateAdvertisement, updateState] = useUpdateAdvertisementMutation();
  const { data: pricing } = useGetPlatformPricingQuery();
  const isSaving = createState.isLoading || updateState.isLoading;

  const defaults: AdFormValues = useMemo(
    () => ({
      itemId: editing?.itemId ?? "",
      packageType: (editing?.packageType ?? "") as AdvertisementPackage,
      title: editing?.title ?? "",
      description: editing?.description ?? "",
      imageUrl: editing?.imageUrl ?? "",
      startAt: toLocalInput(editing?.startAt),
    }),
    [editing],
  );

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<AdFormValues>({
    resolver: zodResolver(makeSchema(mode)),
    defaultValues: defaults,
  });

  useEffect(() => {
    reset(defaults);
  }, [defaults, reset]);

  const selectedPackage = watch("packageType");
  const imageUrl = watch("imageUrl");
  const price = adPackagePrice(pricing, selectedPackage || undefined);

  async function onSubmit(values: AdFormValues) {
    const shared = {
      packageType: values.packageType,
      title: values.title.trim(),
      startAt: new Date(values.startAt).toISOString(),
      description: values.description.trim() || undefined,
      imageUrl: values.imageUrl.trim() || undefined,
    };
    try {
      if (editing?.id) {
        await updateAdvertisement({ id: editing.id, body: shared }).unwrap();
        toast.success("Advertisement updated.");
      } else {
        await createAdvertisement({ itemId: values.itemId, ...shared }).unwrap();
        toast.success("Advertisement submitted — it will run once an admin approves it.");
      }
      reset(mode === "edit" ? defaults : undefined);
      onDone();
    } catch (error) {
      toast.error(apiMessage(error, "Unable to save the advertisement."));
    }
  }

  const noItems = !isLoadingItems && items.length === 0;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-bold text-slate-950">{editing ? "Edit advertisement" : "Advertise a listing"}</h2>
          <p className="text-xs text-slate-500">
            {editing ? (
              <>Matches <code className="text-slate-600">PATCH /advertisements/{"{id}"}</code>.</>
            ) : (
              <>Matches <code className="text-slate-600">POST /advertisements</code>. Ads are reviewed before they go live.</>
            )}
          </p>
        </div>
        {editing ? (
          <button type="button" onClick={onDone} className="text-sm font-semibold text-slate-500">
            Cancel edit
          </button>
        ) : null}
      </div>

      {noItems && !editing ? (
        <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          You need at least one listing before you can advertise it.{" "}
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
              disabled={Boolean(editing)}
              aria-invalid={Boolean(errors.itemId)}
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal disabled:bg-slate-50 aria-[invalid=true]:border-red-400"
            >
              <option value="">{isLoadingItems ? "Loading listings…" : "Select a listing"}</option>
              {items.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title || "Untitled listing"}
                  {item.status && item.status !== "ACTIVE" ? ` (${item.status.toLowerCase()})` : ""}
                </option>
              ))}
            </select>
            {editing ? (
              <span className="mt-1 block text-xs font-normal text-slate-400">The listing can’t be changed after submission.</span>
            ) : null}
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
              {AD_PACKAGE_TYPES.map((value) => (
                <option key={value} value={value}>
                  {PACKAGE_META[value].label}
                </option>
              ))}
            </select>
            {errors.packageType ? (
              <span className="mt-1 block text-xs font-medium text-red-500">{errors.packageType.message}</span>
            ) : null}
          </label>

          <label className="text-sm font-semibold text-slate-700 md:col-span-2">
            Headline
            <input
              {...register("title")}
              maxLength={200}
              aria-invalid={Boolean(errors.title)}
              placeholder="e.g. Weekend camera kit — book now"
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal aria-[invalid=true]:border-red-400"
            />
            {errors.title ? (
              <span className="mt-1 block text-xs font-medium text-red-500">{errors.title.message}</span>
            ) : null}
          </label>

          <label className="text-sm font-semibold text-slate-700 md:col-span-2">
            Description <span className="font-normal text-slate-400">(optional)</span>
            <textarea
              {...register("description")}
              rows={3}
              maxLength={5000}
              aria-invalid={Boolean(errors.description)}
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal aria-[invalid=true]:border-red-400"
            />
            {errors.description ? (
              <span className="mt-1 block text-xs font-medium text-red-500">{errors.description.message}</span>
            ) : null}
          </label>

          <label className="text-sm font-semibold text-slate-700">
            Image URL <span className="font-normal text-slate-400">(optional)</span>
            <input
              {...register("imageUrl")}
              maxLength={500}
              inputMode="url"
              aria-invalid={Boolean(errors.imageUrl)}
              placeholder="https://…"
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal aria-[invalid=true]:border-red-400"
            />
            {errors.imageUrl ? (
              <span className="mt-1 block text-xs font-medium text-red-500">{errors.imageUrl.message}</span>
            ) : null}
          </label>

          <label className="text-sm font-semibold text-slate-700">
            Starts at
            <input
              type="datetime-local"
              {...register("startAt")}
              aria-invalid={Boolean(errors.startAt)}
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal aria-[invalid=true]:border-red-400"
            />
            {errors.startAt ? (
              <span className="mt-1 block text-xs font-medium text-red-500">{errors.startAt.message}</span>
            ) : null}
          </label>

          <div className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm md:col-span-2 sm:grid-cols-[1fr_auto]">
            <div>
              {selectedPackage ? (
                <>
                  <p className="font-bold text-slate-900">{PACKAGE_META[selectedPackage].label}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{PACKAGE_META[selectedPackage].blurb}</p>
                </>
              ) : (
                <p className="text-xs text-slate-500">Choose a package to see its price and duration.</p>
              )}
              {selectedPackage ? (
                <p className="mt-2 text-right sm:hidden">
                  <span className="text-lg font-extrabold text-slate-900">
                    {price ? money(price.amount, price.currency) : "Price at checkout"}
                  </span>
                </p>
              ) : null}
            </div>
            {selectedPackage ? (
              <div className="hidden text-right sm:block">
                <span className="text-lg font-extrabold text-slate-900">
                  {price ? money(price.amount, price.currency) : "Price at checkout"}
                </span>
                <span className="block text-xs text-slate-500">
                  {(price?.days ?? PACKAGE_META[selectedPackage].days)} days of banner placement
                </span>
              </div>
            ) : null}
            {imageUrl && !errors.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageUrl}
                alt="Ad preview"
                className="col-span-full mt-1 h-28 w-full rounded-lg object-cover"
                onError={(event) => {
                  (event.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
            ) : null}
          </div>

          <div className="flex gap-2 md:col-span-2">
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-xl px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
              style={{ backgroundColor: ACCENT }}
            >
              {isSaving ? "Saving…" : editing ? "Save changes" : "Submit advertisement"}
            </button>
            {editing ? (
              <button
                type="button"
                onClick={onDone}
                className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700"
              >
                Cancel
              </button>
            ) : null}
          </div>
        </form>
      )}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Row                                                                */
/* ------------------------------------------------------------------ */

function AdvertisementRow({
  advertisement,
  itemTitle,
  onEdit,
  onCancel,
  isCancelling,
}: {
  advertisement: Advertisement;
  itemTitle: string;
  onEdit: (advertisement: Advertisement) => void;
  onCancel: (id: string) => void;
  isCancelling: boolean;
}) {
  const spend = advertisement.price ?? advertisement.quotedPrice;
  const currency = advertisement.currency || advertisement.quotedCurrency || "USD";

  return (
    <article className="p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 gap-4">
          <div className="h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100">
            {advertisement.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={advertisement.imageUrl} alt="" className="h-full w-full object-cover" />
            ) : null}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate font-bold text-slate-950">{advertisement.title || "Untitled ad"}</h3>
              <StatusBadge status={advertisement.status} />
            </div>
            <p className="mt-1 text-sm font-semibold text-[#253C95]">
              {packageLabel(advertisement.packageType)} · {money(spend, currency)}
              {advertisement.price == null && advertisement.quotedPrice != null ? " (quoted)" : ""}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              For {itemTitle} · {formatDateTime(advertisement.startAt)} → {formatDateTime(advertisement.endAt)}
              {advertisement.durationDays ? ` · ${advertisement.durationDays} days` : ""}
            </p>
            {advertisement.description ? (
              <p className="mt-1 line-clamp-2 text-xs text-slate-500">{advertisement.description}</p>
            ) : null}
            {advertisement.status === "REJECTED" && advertisement.rejectionReason ? (
              <p className="mt-1 text-xs font-medium text-red-600">Rejected: {advertisement.rejectionReason}</p>
            ) : null}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {advertisement.status === "PENDING" ? (
            <button
              type="button"
              onClick={() => onEdit(advertisement)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700"
            >
              Edit
            </button>
          ) : null}
          {advertisement.status && CANCELLABLE.includes(advertisement.status) && advertisement.id ? (
            <button
              type="button"
              onClick={() => onCancel(advertisement.id as string)}
              disabled={isCancelling}
              className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 disabled:opacity-50"
            >
              Cancel
            </button>
          ) : null}
        </div>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                               */
/* ------------------------------------------------------------------ */

export default function VendorAdvertisementsPage() {
  const [statusFilter, setStatusFilter] = useState<AdvertisementStatus | "ALL">("ALL");
  const [page, setPage] = useState(0);
  const [editing, setEditing] = useState<Advertisement | null>(null);

  const { data: itemPage, isLoading: itemsLoading } = useGetMyVendorItemsQuery({ pageSize: 100 });
  const items = useMemo(() => itemPage?.content ?? [], [itemPage]);
  const itemTitleById = useMemo(
    () => new Map(items.map((item) => [item.id, item.title || "Untitled listing"])),
    [items],
  );

  const {
    data: adsPage,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetMyAdvertisementsQuery({
    status: statusFilter === "ALL" ? undefined : statusFilter,
    page,
    size: PAGE_SIZE,
    sort: "createdAt,desc",
  });

  const [cancelAdvertisement, { isLoading: isCancelling }] = useCancelAdvertisementMutation();

  const advertisements = adsPage?.content ?? [];
  const totalPages = adsPage?.totalPages ?? 0;

  function changeFilter(value: AdvertisementStatus | "ALL") {
    setStatusFilter(value);
    setPage(0);
  }

  function startEdit(advertisement: Advertisement) {
    setEditing(advertisement);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleCancel(id: string) {
    if (!window.confirm("Cancel this advertisement? This can’t be undone.")) return;
    try {
      await cancelAdvertisement(id).unwrap();
      toast.success("Advertisement cancelled.");
      if (editing?.id === id) setEditing(null);
    } catch (error) {
      toast.error(apiMessage(error, "Unable to cancel this advertisement."));
    }
  }

  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      <div>
        <p className="text-sm font-semibold text-[#F73030]">Marketing</p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-950">Advertisements</h1>
        <p className="mt-1 text-sm text-slate-500">
          Submit banner ads for your listings. An admin reviews each ad before it runs on the marketplace.
        </p>
      </div>

      <AdvertisementForm
        items={items}
        isLoadingItems={itemsLoading}
        editing={editing}
        onDone={() => setEditing(null)}
      />

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
          <p className="p-6 text-sm text-slate-500">Loading advertisements…</p>
        ) : isError ? (
          <div className="p-8 text-center">
            <p className="font-bold text-red-700">Unable to load your advertisements.</p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-4 rounded-xl bg-[#F73030] px-4 py-2 text-sm font-bold text-white"
            >
              Try again
            </button>
          </div>
        ) : advertisements.length === 0 ? (
          <p className="p-10 text-center text-sm text-slate-500">
            {statusFilter === "ALL"
              ? "You have not created any advertisements yet."
              : `No ${statusFilter.toLowerCase()} advertisements.`}
          </p>
        ) : (
          <div className="divide-y divide-slate-100">
            {advertisements.map((advertisement) => (
              <AdvertisementRow
                key={advertisement.id ?? `${advertisement.itemId}-${advertisement.startAt}`}
                advertisement={advertisement}
                itemTitle={
                  (advertisement.itemId && itemTitleById.get(advertisement.itemId)) ||
                  (advertisement.itemId ? `Listing ${advertisement.itemId.slice(0, 8)}…` : "a listing")
                }
                onEdit={startEdit}
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
              disabled={adsPage?.first ?? page === 0}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 disabled:opacity-40"
            >
              Previous
            </button>
            <span className="text-xs text-slate-500">
              Page {page + 1} of {totalPages} · {adsPage?.totalElements ?? 0} total
            </span>
            <button
              type="button"
              onClick={() => setPage((value) => (adsPage?.last ? value : value + 1))}
              disabled={adsPage?.last ?? true}
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
