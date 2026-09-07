"use client";

import Link from "next/link";
import { useMemo } from "react";
import RentalCard from "@/components/rental-card";
import type { Item } from "@/lib/types/item.types";
import { useGetCategoriesQuery } from "@/redux/services/categoryApi";
import { useGetItemsQuery } from "@/redux/services/itemApi";

const FALLBACK_IMAGE = "/img/electronics.png";
const HOMEPAGE_ITEM_COUNT = 12;

function responsiveItemVisibility(index: number) {
  if (index < 3) return "";
  if (index < 6) return "hidden sm:block";
  if (index < 9) return "hidden md:block";
  return "hidden lg:block";
}

function getImage(item: Item) {
  if (item.primaryImageUrl) return item.primaryImageUrl;
  const primary = item.images?.find((image) => image.primary);
  const image = primary ?? item.images?.[0];
  return image?.imageUrl ?? image?.url ?? image?.thumbnailUrl ?? FALLBACK_IMAGE;
}

export default function ApiItemsSection() {
  const { data, isLoading, isError, refetch } = useGetItemsQuery({
    pageNumber: 0,
    pageSize: HOMEPAGE_ITEM_COUNT,
    available: true,
  });
  const { data: categories = [] } = useGetCategoriesQuery();
  const items = data?.content ?? [];
  const categoryNames = useMemo(
    () => new Map(categories.map((category) => [String(category.id), category.name])),
    [categories],
  );

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
          {Array.from({ length: HOMEPAGE_ITEM_COUNT }, (_, index) => (
            <div
              key={index}
              className={`${responsiveItemVisibility(index)} h-80 animate-pulse rounded-2xl bg-neutral-100`}
            />
          ))}
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
          {items.slice(0, HOMEPAGE_ITEM_COUNT).map((item, index) => (
            <div
              key={item.id}
              className={`${responsiveItemVisibility(index)} w-full max-w-[280px]`}
            >
              <RentalCard id={item.id} category={item.categoryId ? categoryNames.get(String(item.categoryId)) ?? "Rental" : "Rental"} image={getImage(item)} title={item.title ?? "Untitled item"} location={item.locationText ?? "Location unavailable"} rating={item.averageRating ?? 0} price={item.pricePerDay ?? 0} condition={item.condition} featured={item.featured} available={item.available} totalReviews={item.totalReviews} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
