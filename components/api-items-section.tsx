"use client";

import Link from "next/link";
import RentalCard from "@/components/rental-card";
import type { Item } from "@/lib/types/item.types";
import { useGetItemsQuery } from "@/redux/services/itemApi";

const FALLBACK_IMAGE = "/img/electronics.png";

function getImage(item: Item) {
  if (item.primaryImageUrl) return item.primaryImageUrl;
  const primary = item.images?.find((image) => image.primary);
  const image = primary ?? item.images?.[0];
  return image?.imageUrl ?? image?.url ?? image?.thumbnailUrl ?? FALLBACK_IMAGE;
}

export default function ApiItemsSection() {
  const { data: items = [], isLoading, isError, refetch } = useGetItemsQuery();

  return (
    <section className="mx-auto w-full max-w-7xl py-10">
      <div className="mb-8 px-[18px] sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-[#253C95] sm:text-3xl md:text-4xl">Available <span className="text-[#F73030]">Rentals</span></h2>
            <p className="mt-1 text-sm text-neutral-500">Live items from verified owners</p>
          </div>
          <Link href="/items" className="text-sm font-semibold text-[#F73030] hover:underline">View all items</Link>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 px-[18px] sm:grid-cols-2 sm:px-8 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => <div key={index} className="h-80 animate-pulse rounded-2xl bg-neutral-100" />)}
        </div>
      ) : isError ? (
        <div className="mx-[18px] rounded-2xl border border-red-100 bg-red-50 p-8 text-center sm:mx-8">
          <p className="text-sm font-semibold text-red-700">Unable to load rental items.</p>
          <button type="button" onClick={() => refetch()} className="mt-4 rounded-xl bg-[#F73030] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#F73030]/90">Try again</button>
        </div>
      ) : items.length === 0 ? (
        <div className="mx-[18px] rounded-2xl border border-neutral-200 bg-neutral-50 p-10 text-center text-neutral-500 sm:mx-8">No rental items are available yet.</div>
      ) : (
        <div className="grid grid-cols-1 justify-items-center gap-6 px-[18px] sm:grid-cols-2 sm:px-8 md:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <RentalCard key={item.id} id={item.id} category={item.categoryId ? `Category ${item.categoryId}` : "Rental"} image={getImage(item)} title={item.title ?? "Untitled item"} location={item.locationText ?? "Location unavailable"} rating={item.averageRating ?? 0} price={item.pricePerDay ?? 0} />
          ))}
        </div>
      )}
    </section>
  );
}