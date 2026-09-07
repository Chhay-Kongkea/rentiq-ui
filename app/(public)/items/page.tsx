"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Compass, History, Search } from "lucide-react";
import RentalCard from "@/components/rental-card";
import type { Item } from "@/lib/types/item.types";
import { useGetCategoriesQuery } from "@/redux/services/categoryApi";
import { useGetItemsQuery } from "@/redux/services/itemApi";
import { useGetSearchLogsQuery, useGetSearchSuggestionsQuery, useSearchNearbyQuery } from "@/redux/services/renterApi";

const FALLBACK_IMAGE = "/img/electronics.png";

function getImage(item: Item): string {
  if (item.primaryImageUrl) return item.primaryImageUrl;
  const firstImage = item.images?.find((image) => image.primary) ?? item.images?.[0];
  return firstImage?.imageUrl ?? firstImage?.thumbnailUrl ?? firstImage?.url ?? FALLBACK_IMAGE;
}

function ItemsResults() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q")?.trim() ?? "";
  const categoryId = searchParams.get("categoryId") ?? "";
  const location = searchParams.get("location")?.trim() ?? "";
  const timing = searchParams.get("when") ?? "";
  const minPrice = Number(searchParams.get("minPrice")) || undefined;
  const maxPrice = Number(searchParams.get("maxPrice")) || undefined;
  const pageNumber = Math.max(0, Number(searchParams.get("page")) || 0);
  const nearby = searchParams.get("nearby") === "1";

  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState("");

  useEffect(() => {
    if (!nearby || coords || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (position) => setCoords({ lat: position.coords.latitude, lng: position.coords.longitude }),
      () => setLocationError("Unable to access your location."),
    );
  }, [nearby, coords]);

  const keywordQuery = useGetItemsQuery({
    keyword: query || undefined,
    categoryId: categoryId || undefined,
    location: location || undefined,
    minPrice,
    maxPrice,
    available: true,
    pageNumber,
    pageSize: 12,
    sortBy: searchParams.get("sortBy") || "createdAt",
    sortDirection: searchParams.get("sortDirection") === "asc" ? "asc" : "desc",
  }, { skip: nearby });
  const nearbyQuery = useSearchNearbyQuery(
    { latitude: coords?.lat, longitude: coords?.lng, radiusKm: 25, pageNumber, pageSize: 12 },
    { skip: !nearby || !coords },
  );
  const { data, error, isLoading, isFetching, refetch } = nearby ? nearbyQuery : keywordQuery;
  const items = data?.content ?? [];
  const { data: categories = [] } = useGetCategoriesQuery();

  function toggleNearby() {
    const params = new URLSearchParams(searchParams.toString());
    if (nearby) params.delete("nearby");
    else params.set("nearby", "1");
    params.delete("page");
    router.push(`/items${params.size ? `?${params.toString()}` : ""}`);
  }
  const categoryNames = useMemo(
    () => new Map(categories.map((category) => [String(category.id), category.name])),
    [categories],
  );
  const hasFilters = Boolean(query || categoryId || location || timing || minPrice || maxPrice);
  const categoryLabel = categoryId ? categoryNames.get(categoryId) : undefined;
  const pageHref = (nextPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (nextPage > 0) params.set("page", String(nextPage)); else params.delete("page");
    return `/items${params.size ? `?${params.toString()}` : ""}`;
  };

  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl px-4 py-10 sm:px-8">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold"><span className="text-[#253C95]">{hasFilters ? "Search " : "Rental "}</span><span className="text-[#F73030]">{hasFilters ? "Results" : "Items"}</span></h1>
          <p className="mt-2 text-sm text-neutral-500">
            {nearby
              ? `Showing items near you${locationError ? " — " + locationError : coords ? "" : " — locating..."}.`
              : hasFilters
              ? `Showing ${data?.totalElements ?? items.length} result${(data?.totalElements ?? items.length) === 1 ? "" : "s"}${query ? ` for “${query}”` : ""}${categoryLabel ? ` in ${categoryLabel}` : ""}${location ? ` near ${location}` : ""}${timing ? ` · ${timing}` : ""}.`
              : "Browse available items from verified owners."}
          </p>
        </div>
        {isFetching && !isLoading ? <span className="text-sm text-neutral-500">Refreshing...</span> : null}
      </div>

      <div className="mb-8 flex flex-wrap items-center gap-3">
        <ItemSearchBox initialValue={query} />
        <button
          type="button"
          onClick={toggleNearby}
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2.5 text-xs font-semibold transition ${nearby ? "bg-[#253C95] text-white" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"}`}
        >
          <Compass className="size-3.5" /> Near me
        </button>
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
            <RentalCard key={item.id} id={String(item.id)} category={item.categoryId ? categoryNames.get(String(item.categoryId)) ?? `Category ${item.categoryId}` : "Rental"} image={getImage(item)} title={item.title ?? "Untitled item"} location={item.locationText ?? "Location unavailable"} rating={item.averageRating ?? 0} price={item.pricePerDay ?? 0} condition={item.condition} featured={item.featured} available={item.available} totalReviews={item.totalReviews} />
          ))}
        </div>
      )}

      {!isLoading && !error && data && (data.totalPages ?? 0) > 1 ? (
        <nav aria-label="Items pagination" className="mt-10 flex items-center justify-center gap-3">
          {data.hasPrevious ? <Link href={pageHref(pageNumber - 1)} className="rounded-xl border border-neutral-200 px-4 py-2 text-sm font-semibold text-[#253C95] hover:bg-neutral-50">Previous</Link> : null}
          <span className="text-sm text-neutral-500">Page {(data.pageNumber ?? 0) + 1} of {data.totalPages}</span>
          {data.hasNext ? <Link href={pageHref(pageNumber + 1)} className="rounded-xl border border-neutral-200 px-4 py-2 text-sm font-semibold text-[#253C95] hover:bg-neutral-50">Next</Link> : null}
        </nav>
      ) : null}
    </main>
  );
}

function ItemSearchBox({ initialValue }: { initialValue: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(initialValue);
  const [debounced, setDebounced] = useState(initialValue);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value.trim()), 250);
    return () => clearTimeout(timer);
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { data: suggestions = [] } = useGetSearchSuggestionsQuery({ keyword: debounced }, { skip: debounced.length < 2 });
  const { data: recentPage } = useGetSearchLogsQuery({ pageNumber: 0, pageSize: 5 });
  const recentSearches = (recentPage?.content ?? []).filter((entry) => entry.keyword);

  function runSearch(keyword: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (keyword) params.set("q", keyword); else params.delete("q");
    params.delete("page");
    params.delete("nearby");
    setIsOpen(false);
    router.push(`/items${params.size ? `?${params.toString()}` : ""}`);
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <form onSubmit={(event) => { event.preventDefault(); runSearch(value.trim()); }} className="flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2.5 shadow-sm focus-within:border-[#253C95]/40">
        <Search className="size-4 shrink-0 text-neutral-400" />
        <input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder="Search for items..."
          className="w-full bg-transparent text-sm text-neutral-800 outline-none placeholder:text-neutral-400"
        />
      </form>

      {isOpen && (suggestions.length > 0 || recentSearches.length > 0) ? (
        <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-neutral-100 bg-white py-2 shadow-xl">
          {suggestions.length > 0 ? (
            <div>
              <p className="px-4 py-1 text-[10px] font-bold uppercase tracking-wide text-neutral-400">Suggestions</p>
              {suggestions.map((suggestion, index) => (
                <button key={`${suggestion.value}-${index}`} type="button" onClick={() => runSearch(suggestion.value ?? "")} className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50">
                  <Search className="size-3.5 text-neutral-300" /> {suggestion.value}
                </button>
              ))}
            </div>
          ) : null}
          {recentSearches.length > 0 ? (
            <div className={suggestions.length > 0 ? "mt-1 border-t border-neutral-100 pt-1" : ""}>
              <p className="px-4 py-1 text-[10px] font-bold uppercase tracking-wide text-neutral-400">Recent searches</p>
              {recentSearches.map((entry) => (
                <button key={entry.id} type="button" onClick={() => runSearch(entry.keyword ?? "")} className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50">
                  <History className="size-3.5 text-neutral-300" /> {entry.keyword}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export default function ItemsPage() {
  return (
    <Suspense fallback={<main className="mx-auto min-h-screen w-full max-w-7xl px-4 py-10 sm:px-8"><div className="h-80 animate-pulse rounded-2xl bg-neutral-100" /></main>}>
      <ItemsResults />
    </Suspense>
  );
}
