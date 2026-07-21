"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// List your banner images stored in your /public folder
const bannerImages = [
  "/img/banner.png",
  "/img/banner1.png",
];

export default function HomeBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? bannerImages.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === bannerImages.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <section className="relative w-full">
      <div className="relative overflow-hidden shadow-sm">
        {/* ✅ Dynamic src updates when currentIndex changes */}
        <img
          src={bannerImages[currentIndex]}
          alt="Home Banner"
          className="h-auto w-full object-cover"
        />

        {/* Left Scroll Arrow */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous Banner"
          className="absolute left-3 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-gray-800 shadow-md backdrop-blur-sm transition-all hover:bg-white active:scale-95 md:left-5 md:size-11"
        >
          <ChevronLeft className="size-5 md:size-6" />
        </button>

        {/* Right Scroll Arrow */}
        <button
          type="button"
          onClick={handleNext}
          aria-label="Next Banner"
          className="absolute right-3 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-gray-800 shadow-md backdrop-blur-sm transition-all hover:bg-white active:scale-95 md:right-5 md:size-11"
        >
          <ChevronRight className="size-5 md:size-6" />
        </button>
      </div>
    </section>
  );
}