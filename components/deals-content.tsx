"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgePercent, Gift, ShieldCheck, Sparkles, Tag } from "lucide-react";
import Footer from "@/components/footer";
import RentalCard from "@/components/rental-card";
import type { Item } from "@/lib/types/item.types";
import { useGetCategoriesQuery } from "@/redux/services/categoryApi";
import { useGetFeaturedItemsQuery } from "@/redux/services/itemApi";

const FALLBACK_IMAGE = "/img/electronics.png";

function getImage(item: Item) {
  if (item.primaryImageUrl) return item.primaryImageUrl;
  const primary = item.images?.find((image) => image.primary) ?? item.images?.[0];
  return primary?.imageUrl ?? primary?.thumbnailUrl ?? primary?.url ?? FALLBACK_IMAGE;
}

const benefits = [
  { icon: ShieldCheck, title: "Verified rentals", text: "Every promoted item follows the same Rentiq marketplace standards." },
  { icon: Tag, title: "Clear pricing", text: "See the daily rental price before choosing dates or requesting a booking." },
  { icon: Gift, title: "Fresh discoveries", text: "Featured items help you discover standout rentals from trusted owners." },
];

export default function DealsContent() {
  const { data, isLoading, isError, refetch } = useGetFeaturedItemsQuery({ pageNumber: 0, pageSize: 12 });
  const { data: categories = [] } = useGetCategoriesQuery();
  const items = data?.content ?? [];
  const categoryNames = useMemo(
    () => new Map(categories.map((category) => [String(category.id), category.name])),
    [categories],
  );

  return <>
    <main className="overflow-hidden bg-[#fcfcfd]">
      <section className="mx-auto max-w-7xl px-4 pb-10 pt-8 sm:px-8 lg:pb-16">
        <div className="relative overflow-hidden rounded-[32px] bg-[#192c78] px-6 py-12 text-white sm:px-10 lg:px-16 lg:py-16">
          <div className="absolute -right-24 -top-28 size-80 rounded-full bg-[#ff4545]/30 blur-3xl" />
          <div className="absolute -bottom-32 left-1/3 size-72 rounded-full bg-blue-400/20 blur-3xl" />
          <div className="relative z-10 grid items-center gap-10 lg:grid-cols-[1.05fr_.95fr]">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em]"><Sparkles className="size-4 text-amber-300" /> Promoted rentals</span>
              <h1 className="mt-6 text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">Discover more.<span className="block text-[#ff5b59]">Rent what stands out.</span></h1>
              <p className="mt-5 max-w-xl text-sm leading-7 text-blue-100 sm:text-base">Explore featured rental items selected from the Rentiq marketplace and book directly from trusted owners.</p>
              <div className="mt-8 flex flex-wrap gap-3"><Link href="#promotions" className="inline-flex items-center gap-2 rounded-xl bg-[#ff3535] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-950/20 transition hover:-translate-y-0.5 hover:bg-red-500">Explore promoted items <ArrowRight className="size-4" /></Link><Link href="/items" className="inline-flex items-center rounded-xl border border-white/25 bg-white/10 px-6 py-3.5 text-sm font-bold backdrop-blur-sm transition hover:bg-white/20">Browse all items</Link></div>
            </div>
            <div className="relative mx-auto w-full max-w-lg"><div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/15 bg-white/10 shadow-2xl"><Image src="/img/admin/promo-car.png" alt="Promoted rental item" fill priority className="object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-[#0c194d]/80 via-transparent to-transparent" /><div className="absolute bottom-5 left-5"><p className="text-xs font-semibold text-blue-100">Featured on Rentiq</p><p className="mt-1 text-xl font-bold">Popular rentals, one place</p></div></div></div>
          </div>
        </div>
      </section>

      <section id="promotions" className="mx-auto max-w-7xl scroll-mt-8 px-4 py-12 sm:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><p className="flex items-center gap-2 text-sm font-bold text-[#ff3535]"><BadgePercent className="size-5" /> Current promotions</p><h2 className="mt-2 text-3xl font-extrabold text-[#253c95] sm:text-4xl">Promoted items for you</h2><p className="mt-3 text-sm text-neutral-500">Live featured rentals from the Rentiq API.</p></div><Link href="/items" className="inline-flex items-center gap-2 text-sm font-bold text-[#F73030] hover:underline">View all items <ArrowRight className="size-4" /></Link></div>

        {isLoading ? <div className="mt-9 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">{Array.from({ length: 8 }, (_, index) => <div key={index} className="h-[360px] animate-pulse rounded-[22px] bg-slate-100" />)}</div>
        : isError ? <div className="mt-9 rounded-3xl border border-red-100 bg-red-50 p-10 text-center"><p className="font-bold text-red-700">Unable to load promoted items.</p><p className="mt-2 text-sm text-red-600">The promotion service may be temporarily unavailable.</p><button type="button" onClick={() => refetch()} className="mt-5 rounded-xl bg-[#F73030] px-5 py-2.5 text-sm font-bold text-white">Try again</button></div>
        : items.length === 0 ? <div className="mt-9 rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center"><Sparkles className="mx-auto size-9 text-slate-300" /><p className="mt-4 font-bold text-slate-700">No promoted items right now</p><p className="mt-2 text-sm text-slate-500">Browse all rentals while new featured items are being prepared.</p><Link href="/items" className="mt-5 inline-flex rounded-xl bg-[#253C95] px-5 py-3 text-sm font-bold text-white">Browse rentals</Link></div>
        : <div className="mt-9 grid grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">{items.map((item) => <RentalCard key={item.id} id={item.id} category={item.categoryId ? categoryNames.get(String(item.categoryId)) ?? "Promoted rental" : "Promoted rental"} image={getImage(item)} title={item.title ?? "Untitled item"} location={item.locationText ?? "Location unavailable"} rating={item.averageRating ?? 0} price={item.pricePerDay ?? 0} condition={item.condition} featured available={item.available} totalReviews={item.totalReviews} />)}</div>}
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 pt-10 sm:px-8"><div className="rounded-[32px] border border-red-100 bg-white p-7 shadow-sm sm:p-10"><div className="text-center"><p className="text-sm font-bold text-[#ff3535]">Why explore a Rentiq promotion?</p><h2 className="mt-2 text-3xl font-extrabold text-[#253c95]">Standout rentals without surprises</h2></div><div className="mt-10 grid gap-8 md:grid-cols-3">{benefits.map(({ icon: Icon, title, text }) => <div key={title} className="text-center"><span className="mx-auto grid size-12 place-items-center rounded-2xl bg-red-50 text-[#ff3535]"><Icon className="size-6" /></span><h3 className="mt-4 font-extrabold text-neutral-900">{title}</h3><p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-neutral-500">{text}</p></div>)}</div></div></section>
    </main>
    <Footer />
  </>;
}
