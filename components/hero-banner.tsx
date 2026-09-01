"use client";

import { useEffect, useState } from "react";
import { BANNER_SLIDES } from "./home-content.data";

const AUTOPLAY_DELAY = 3000;

export default function HomeBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);


  useEffect(() => {
    if (paused) return;
    const interval = window.setInterval(() => {
      setCurrentIndex((index) => (index + 1) % BANNER_SLIDES.length);
    }, AUTOPLAY_DELAY);
    return () => window.clearInterval(interval);
  }, [paused]);

  return (
    <section className="mx-auto my-6 w-full max-w-7xl bg-white px-4 sm:px-8">
      <div
        className="group relative aspect-[16/6] min-h-[220px] overflow-hidden rounded-3xl bg-neutral-100 shadow-sm sm:min-h-[280px]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        aria-roledescription="carousel"
        aria-label="Featured rentals"
      >
        <div
          className="flex h-full transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {BANNER_SLIDES.map((slide) => (
            <div key={slide.image} className="h-full w-full shrink-0">
              <img
                src={slide.image}
                alt={slide.alt}
                className="h-full w-full object-cover"
                draggable={false}
              />
            </div>
          ))}
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/30 to-transparent" />

        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/20 px-3 py-2 backdrop-blur-sm">
          {BANNER_SLIDES.map((slide, index) => (
            <button
              key={slide.image}
              type="button"
              onClick={() => setCurrentIndex(index)}
              aria-label={`Show banner ${index + 1}`}
              aria-current={index === currentIndex ? "true" : undefined}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? "w-7 bg-[#F73030]" : "w-2 bg-white/80 hover:bg-white"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
