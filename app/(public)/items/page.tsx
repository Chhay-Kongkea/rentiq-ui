"use client";

import { Suspense, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import RentalCard from "@/components/rental-card";
import type { Item } from "@/lib/types/item.types";
import { useGetCategoriesQuery } from "@/redux/services/categoryApi";
import { useSearchItemsQuery } from "@/redux/services/itemApi";

const FALLBACK_IMAGE = "/img/electronics.png";

function getImage(item: Item): string {
  if (item.primaryImageUrl) return item.primaryImageUrl;
  const firstImage = item.images?.find((image) => image.primary) ?? item.images?.[0];
  return firstImage?.imageUrl ?? firstImage?.thumbnailUrl ?? firstImage?.url ?? FALLBACK_IMAGE;
}

function ItemsResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q")?.trim() ?? "";
  const categoryId = searchParams.get("categoryId") ?? "";
  const location = searchParams.get("location")?.trim() ?? "";
  const timing = searchParams.get("when") ?? "";
  const minPrice = Number(searchParams.get("minPrice")) || undefined;
  const maxPrice = Number(searchParams.get("maxPrice")) || undefined;
  const minimumRating = Number(searchParams.get("minimumRating")) || undefined;
  const pageNumber = Math.max(0, Number(searchParams.get("page")) || 0);
  const { data, error, isLoading, isFetching, refetch } = useSearchItemsQuery({
    keyword: query || undefined,
    categoryId: categoryId || undefined,
    location: location || undefined,
    minPrice,
    maxPrice,
    minimumRating,
    available: true,
    pageNumber,
    pageSize: 12,
    sortBy: searchParams.get("sortBy") || "createdAt",
    sortDirection: searchParams.get("sortDirection") === "asc" ? "asc" : "desc",
  });
  const items = data?.content ?? [];
  const { data: categories = [] } = useGetCategoriesQuery();
  const categoryNames = useMemo(
    () => new Map(categories.map((category) => [String(category.id), category.name])),
    [categories],
  );
  const hasFilters = Boolean(query || categoryId || location || timing || minPrice || maxPrice || minimumRating);
  const categoryLabel = categoryId ? categoryNames.get(categoryId) : undefined;
  const pageHref = (nextPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (nextPage > 0) params.set("page", String(nextPage)); else params.delete("page");
    return `/items${params.size ? `?${params.toString()}` : ""}`;
  };

  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl px-4 py-10 sm:px-8">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold"><span className="text-[#253C95]">{hasFilters ? "Search " : "Rental "}</span><span className="text-[#F73030]">{hasFilters ? "Results" : "Items"}</span></h1>
          <p className="mt-2 text-sm text-neutral-500">
            {hasFilters
              ? `Showing ${data?.totalElements ?? items.length} result${(data?.totalElements ?? items.length) === 1 ? "" : "s"}${query ? ` for “${query}”` : ""}${categoryLabel ? ` in ${categoryLabel}` : ""}${location ? ` near ${location}` : ""}${timing ? ` · ${timing}` : ""}.`
              : "Browse available items from verified owners."}
          </p>
        </div>
        {isFetching && !isLoading ? <span className="text-sm text-neutral-500">Refreshing...</span> : null}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }, (_, index) => <div key={index} className="h-80 animate-pulse rounded-2xl bg-neutral-100" />)}
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="font-semibold text-red-700">Unable to load items.</p>
          <p className="mt-1 text-sm text-red-600">The service may be temporarily unavailable.</p>
          <button type="button" onClick={() => refetch()} className="mt-4 rounded-xl bg-[#F73030] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#de2b2b]">Try again</button>
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-10 text-center">
          <p className="font-semibold text-neutral-700">No matching rental items found.</p>
          <p className="mt-2 text-sm text-neutral-500">Try another keyword or choose a different category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <RentalCard key={item.id} id={String(item.id)} category={item.categoryId ? categoryNames.get(String(item.categoryId)) ?? `Category ${item.categoryId}` : "Rental"} image={getImage(item)} title={item.title ?? "Untitled item"} location={item.locationText ?? "Location unavailable"} rating={item.averageRating ?? 0} price={item.pricePerDay ?? 0} />
          ))}
        </div>
      )}

      {!isLoading && !error && data && data.totalPages > 1 ? (
        <nav aria-label="Items pagination" className="mt-10 flex items-center justify-center gap-3">
          {data.hasPrevious ? <Link href={pageHref(pageNumber - 1)} className="rounded-xl border border-neutral-200 px-4 py-2 text-sm font-semibold text-[#253C95] hover:bg-neutral-50">Previous</Link> : null}
          <span className="text-sm text-neutral-500">Page {data.pageNumber + 1} of {data.totalPages}</span>
          {data.hasNext ? <Link href={pageHref(pageNumber + 1)} className="rounded-xl border border-neutral-200 px-4 py-2 text-sm font-semibold text-[#253C95] hover:bg-neutral-50">Next</Link> : null}
        </nav>
      ) : null}
    </main>
  );
}

export default function ItemsPage() {
  return (
    <Suspense fallback={<main className="mx-auto min-h-screen w-full max-w-7xl px-4 py-10 sm:px-8"><div className="h-80 animate-pulse rounded-2xl bg-neutral-100" /></main>}>
      <ItemsResults />
    </Suspense>
  );
}
