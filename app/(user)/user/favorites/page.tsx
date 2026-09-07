"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import RentalCard from "@/components/rental-card";
import { useGetFavoritesQuery } from "@/redux/services/renterApi";

export default function FavoritesPage() {
  const { data, isLoading, isError } = useGetFavoritesQuery({ "pageable.page": 0, "pageable.size": 50, "pageable.sort": "favoritedAt,desc" });
  const favorites = Array.isArray(data) ? data : data?.content ?? [];
  return <main className="min-h-screen bg-[#f7f8fb] px-6 pb-20 pt-12"><div className="mx-auto max-w-6xl"><div className="flex items-end justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#F73030]">Your collection</p><h1 className="mt-2 text-3xl font-bold text-[#253C95]">Saved Wishlist</h1><p className="mt-2 text-sm text-slate-500">Items you saved for your next rental.</p></div><Heart className="size-8 fill-[#F73030] text-[#F73030]" /></div>{isLoading ? <p className="mt-12 text-center text-sm text-slate-500">Loading saved items...</p> : isError ? <p className="mt-12 text-center text-sm text-red-600">Unable to load saved items.</p> : favorites.length === 0 ? <div className="mt-12 rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center"><Heart className="mx-auto size-10 text-slate-300" /><p className="mt-4 font-semibold text-slate-700">No saved items yet</p><Link href="/items" className="mt-5 inline-flex rounded-xl bg-[#F73030] px-5 py-3 text-sm font-bold text-white">Browse items</Link></div> : <div className="mt-8 grid grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">{favorites.map((favorite) => <RentalCard key={favorite.itemId} id={favorite.itemId} category="Saved rental" image={favorite.thumbnailUrl || "/img/electronics.png"} title={favorite.title || "Saved item"} location={favorite.locationText || "Location unavailable"} rating={favorite.averageRating ?? 0} price={favorite.pricePerDay ?? 0} totalReviews={favorite.totalReviews} wishlistMode />)}</div>}</div></main>;
}
