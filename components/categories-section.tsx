// components/categories-section.tsx
"use client";

import React, { useEffect, useRef } from "react";
import CategoryCard from "@/components/category-card";

const categoriesList = [
  { id: 1, image: "/img/electronics.png", title: "Electronics", count: "520+ items" },
  { id: 2, image: "/img/travel.png", title: "Travel", count: "320+ items" },
  { id: 3, image: "/img/tools.png", title: "Tools", count: "450+ items" },
  { id: 4, image: "/img/home.png", title: "Home Stay", count: "180+ stays" },
  { id: 5, image: "/img/electronics.png", title: "Electronics", count: "520+ items" },
  { id: 6, image: "/img/sport.png", title: "Sports", count: "250+ items" },
  { id: 7, image: "/img/camera.png", title: "Camera", count: "220+ items" },
  { id: 8, image: "/img/room.png", title: "Home Stay", count: "180+ stays" },
];

export default function CategoriesSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationFrameId: number;
    let speed = 1;

    const autoScroll = () => {
      if (scrollContainer) {
        scrollContainer.scrollLeft += speed;
        
        if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
          scrollContainer.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(autoScroll);
    };

    animationFrameId = requestAnimationFrame(autoScroll);

    const handleMouseEnter = () => cancelAnimationFrame(animationFrameId);
    const handleMouseLeave = () => {
      animationFrameId = requestAnimationFrame(autoScroll);
    };

    scrollContainer.addEventListener("mouseenter", handleMouseEnter);
    scrollContainer.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (scrollContainer) {
        scrollContainer.removeEventListener("mouseenter", handleMouseEnter);
        scrollContainer.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []);

  return (
    <section className="mt-6 mx-auto w-full max-w-7xl py-6 overflow-hidden">
      {/* Clean container tracking the layout alignment */}
      <div className="px-4 sm:px-8">
        <h2 className="mb-12 text-2xl font-bold tracking-tight text-[#253C95] sm:text-3xl md:text-4xl">
          Browse By <span className="text-[#FF2B2B]">Categories</span>
        </h2>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-hidden px-4 sm:px-8 whitespace-nowrap"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {[...categoriesList, ...categoriesList].map((cat, index) => (
          <div key={`${cat.id}-${index}`} className="w-[140px] flex-shrink-0 sm:w-[160px]">
            <CategoryCard
              image={cat.image}
              title={cat.title}
              count={cat.count}
            />
          </div>
        ))}
      </div>
    </section>
  );
}