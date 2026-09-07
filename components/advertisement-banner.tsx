"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Megaphone } from "lucide-react";
import { useGetActiveAdvertisementsQuery } from "@/redux/services/publicApi";

export default function AdvertisementBanner() {
  const { data, isLoading } = useGetActiveAdvertisementsQuery();
  const ads = data?.content ?? [];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (ads.length < 2) return;
    const timer = setInterval(() => setIndex((current) => (current + 1) % ads.length), 6000);
    return () => clearInterval(timer);
  }, [ads.length]);

  if (isLoading || ads.length === 0) return null;
  const ad = ads[index % ads.length];

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-8">
      <div className="relative overflow-hidden rounded-3xl bg-[#1A2340]">
        <Link href={ad.itemId ? `/items/${ad.itemId}` : "/items"} className="flex flex-col items-center gap-6 p-6 sm:flex-row sm:p-10">
          {ad.imageUrl ? (
            <img src={ad.imageUrl} alt={ad.title || "Sponsored"} className="h-32 w-full rounded-2xl object-cover sm:h-28 sm:w-48" />
          ) : (
            <div className="flex h-28 w-full items-center justify-center rounded-2xl bg-white/10 sm:w-48"><Megaphone className="size-8 text-white/60" /></div>
          )}
          <div className="min-w-0 flex-1 text-center sm:text-left">
            <span className="inline-flex rounded-full bg-[#F73030] px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white">Sponsored</span>
            <h3 className="mt-2 truncate text-xl font-bold text-white">{ad.title || "Featured listing"}</h3>
            {ad.description ? <p className="mt-1 line-clamp-2 text-sm text-white/70">{ad.description}</p> : null}
          </div>
        </Link>

        {ads.length > 1 ? (
          <div className="absolute right-4 top-4 flex gap-1.5">
            <button type="button" aria-label="Previous ad" onClick={() => setIndex((current) => (current - 1 + ads.length) % ads.length)} className="grid size-7 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"><ChevronLeft className="size-3.5" /></button>
            <button type="button" aria-label="Next ad" onClick={() => setIndex((current) => (current + 1) % ads.length)} className="grid size-7 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"><ChevronRight className="size-3.5" /></button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
