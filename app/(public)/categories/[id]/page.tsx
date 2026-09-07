"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ChevronRight, LayoutGrid } from "lucide-react";
import RentalCard from "@/components/rental-card";
import Footer from "@/components/footer";
import type { Item } from "@/lib/types/item.types";
import { useGetCategoryQuery } from "@/redux/services/categoryApi";
import { useGetCategoryChildrenQuery, useGetCategoryItemsQuery } from "@/redux/services/renterApi";

const FALLBACK_IMAGE = "/img/electronics.png";

function getImage(item: Item): string {
  if (item.primaryImageUrl) return item.primaryImageUrl;
  const firstImage = item.images?.find((image) => image.primary) ?? item.images?.[0];
  return firstImage?.imageUrl ?? firstImage?.thumbnailUrl ?? firstImage?.url ?? FALLBACK_IMAGE;
}

export default function CategoryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: category, isLoading: isCategoryLoading } = useGetCategoryQuery(id);
  const { data: children = [] } = useGetCategoryChildrenQuery(id);
  const { data: items = [], isLoading: isItemsLoading, isError } = useGetCategoryItemsQuery({ id });

  return (
    <>
      <main className="mx-auto min-h-[65vh] w-full max-w-7xl px-4 py-10 sm:px-8">
        <nav className="mb-5 flex items-center gap-2 text-sm text-neutral-500">
          <Link href="/categories" className="font-semibold hover:text-[#253C95]">Categories</Link>
          <ChevronRight className="size-3.5" />
          <span className="truncate">{isCategoryLoading ? "Loading..." : category?.name ?? "Category"}</span>
        </nav>

        <h1 className="text-3xl font-bold"><span className="text-[#253C95]">{category?.name ?? "Category"}</span></h1>

        {children.length > 0 ? (
          <div className="mt-6 flex flex-wrap gap-2">
            {children.map((child) => (
              <Link key={child.id} href={`/categories/${child.id}`} className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200">
                <LayoutGrid className="size-3.5" /> {child.name}
              </Link>
            ))}
          </div>
        ) : null}

        <div className="mt-8">
          {isItemsLoading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }, (_, index) => <div key={index} className="h-80 animate-pulse rounded-2xl bg-neutral-100" />)}
            </div>
          ) : isError ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center"><p className="font-semibold text-red-700">Unable to load items in this category.</p></div>
          ) : items.length === 0 ? (
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-10 text-center text-neutral-500">No items in this category yet.</div>
          ) : (
            <div className="grid grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {items.map((item) => (
                <RentalCard key={item.id} id={String(item.id)} category={category?.name ?? "Rental"} image={getImage(item)} title={item.title ?? "Untitled item"} location={item.locationText ?? "Location unavailable"} rating={item.averageRating ?? 0} price={item.pricePerDay ?? 0} condition={item.condition} featured={item.featured} available={item.available} totalReviews={item.totalReviews} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
