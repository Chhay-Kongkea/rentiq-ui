"use client";

import { useEffect, useRef } from "react";
import CategoryCard from "@/components/category-card";
import { useGetCategoriesQuery } from "@/redux/services/categoryApi";

const FALLBACK_ICON = "/img/electronics.png";

export default function CategoriesSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data: categories = [], isLoading, isError, refetch } = useGetCategoriesQuery();
  const activeCategories = categories.filter((category) => category.active);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container || activeCategories.length < 5) return;
    let frame = 0;
    const scroll = () => {
      container.scrollLeft += 0.6;
      if (container.scrollLeft >= container.scrollWidth / 2) container.scrollLeft = 0;
      frame = requestAnimationFrame(scroll);
    };
    frame = requestAnimationFrame(scroll);
    const pause = () => cancelAnimationFrame(frame);
    const resume = () => { frame = requestAnimationFrame(scroll); };
    container.addEventListener("mouseenter", pause);
    container.addEventListener("mouseleave", resume);
    return () => {
      cancelAnimationFrame(frame);
      container.removeEventListener("mouseenter", pause);
      container.removeEventListener("mouseleave", resume);
    };
  }, [activeCategories.length]);

  const visibleCategories = activeCategories.length >= 5 ? [...activeCategories, ...activeCategories] : activeCategories;

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-8">
      <div className="relative overflow-hidden rounded-3xl bg-[#fcfcfc] px-6 py-12 sm:px-8">
        <div className="mb-12 flex flex-col items-center text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-4xl"><span className="text-[#253C95]">Browse By </span><span className="text-[#F73030]">Categories</span></h2>
          <div className="mt-3 h-1 w-24 rounded-full bg-[#F73030]" />
        </div>

        {isLoading ? (
          <div className="flex gap-5">{Array.from({ length: 5 }, (_, index) => <div key={index} className="h-32 w-[160px] shrink-0 animate-pulse rounded-xl bg-neutral-100" />)}</div>
        ) : isError ? (
          <div className="text-center"><p className="text-sm text-red-600">Unable to load categories.</p><button type="button" onClick={() => refetch()} className="mt-3 rounded-xl bg-[#F73030] px-4 py-2 text-xs font-semibold text-white">Try again</button></div>
        ) : activeCategories.length === 0 ? (
          <p className="text-center text-sm text-neutral-500">No active categories are available.</p>
        ) : (
          <div ref={scrollRef} className="flex justify-start gap-5 overflow-x-auto [scrollbar-width:none]">
            {visibleCategories.map((category, index) => <div key={`${category.id}-${index}`} className="w-[140px] shrink-0 sm:w-[160px]"><CategoryCard image={category.iconUrl || FALLBACK_ICON} title={category.name} count="View rentals" href={`/items?categoryId=${category.id}`} /></div>)}
          </div>
        )}
      </div>
    </section>
  );
}
