"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Heart, MapPin, Star } from "lucide-react";
import type { ItemCondition } from "@/lib/types/item.types";
import { useAddFavoriteMutation, useGetFavoritesQuery, useRemoveFavoriteMutation } from "@/redux/services/renterApi";

interface RentalCardProps {
  id?: string;
  category: string;
  image: string;
  title: string;
  location: string;
  rating: number;
  price: number;
  period?: string;
  wishlistMode?: boolean;
  condition?: ItemCondition;
  featured?: boolean;
  available?: boolean;
  totalReviews?: number;
}

const formatCondition = (condition?: ItemCondition) =>
  condition?.toLowerCase().replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

export default function RentalCard({
  id, category, image, title, location, rating, price, period = "day",
  wishlistMode = false, condition, featured = false, available = true, totalReviews = 0,
}: RentalCardProps) {
  const router = useRouter();
  const { status } = useSession();
  const { data: favoritesResponse } = useGetFavoritesQuery(
    { "pageable.page": 0, "pageable.size": 100, "pageable.sort": "favoritedAt,desc" },
    { skip: status !== "authenticated" || !id },
  );
  const [addFavorite, { isLoading: isAddingFavorite }] = useAddFavoriteMutation();
  const [removeFavorite, { isLoading: isRemovingFavorite }] = useRemoveFavoriteMutation();
  const [favoriteOverride, setFavoriteOverride] = useState<boolean | null>(null);
  const [favoriteError, setFavoriteError] = useState(false);
  const favorites = Array.isArray(favoritesResponse) ? favoritesResponse : favoritesResponse?.content ?? [];
  const apiFavorite = favorites.some((favorite) => favorite.itemId === id);
  const isFavorite = favoriteOverride ?? (wishlistMode || apiFavorite);
  const isUpdatingFavorite = isAddingFavorite || isRemovingFavorite;
  const href = id ? `/items/${id}` : "/items";

  async function toggleFavorite() {
    if (!id || isUpdatingFavorite) return;
    if (status !== "authenticated") {
      router.push(`/login?callbackUrl=${encodeURIComponent(href)}`);
      return;
    }
    const previous = isFavorite;
    setFavoriteError(false);
    setFavoriteOverride(!previous);
    try {
      if (previous) await removeFavorite(id).unwrap();
      else await addFavorite(id).unwrap();
    } catch {
      setFavoriteOverride(previous);
      setFavoriteError(true);
    }
  }

  return (
    <article className="group relative w-full overflow-hidden rounded-[22px] border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_18px_45px_rgba(15,23,42,0.12)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-white">
        <Link href={href} aria-label={`View ${title}`} className="block size-full">
          <img src={image} alt={title} className="size-full object-cover transition duration-500 group-hover:scale-[1.04]" />
        </Link>
        <div className="pointer-events-none absolute left-3 top-3 flex flex-wrap gap-2 pr-14">
          {featured ? <span className="rounded-full bg-[#253C95] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">Featured</span> : null}
          {!available ? <span className="rounded-full bg-slate-900/85 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-white">Unavailable</span> : null}
        </div>
        <button type="button" aria-label={isFavorite ? "Remove from favorites" : "Save to favorites"} aria-pressed={isFavorite} aria-busy={isUpdatingFavorite} disabled={!id || isUpdatingFavorite} title={favoriteError ? "Unable to update favorites. Please try again." : undefined} onClick={toggleFavorite} className={`absolute right-3 top-3 grid size-10 place-items-center rounded-full border border-white/70 shadow-md backdrop-blur-md transition active:scale-90 disabled:opacity-60 ${isFavorite ? "bg-white text-[#F73030]" : "bg-white/85 text-slate-700 hover:text-[#F73030]"}`}>
          <Heart className={`size-[18px] ${isFavorite ? "fill-current" : ""}`} />
        </button>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between gap-3">
          <span className="truncate text-[11px] font-bold uppercase tracking-[0.12em] text-[#F73030]">{category}</span>
          {condition ? <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-600">{formatCondition(condition)}</span> : null}
        </div>
        <Link href={href} className="mt-2 block"><h3 className="truncate text-[17px] font-bold tracking-tight text-slate-900 transition group-hover:text-[#253C95]">{title}</h3></Link>
        <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-500"><MapPin className="size-3.5 shrink-0 text-slate-400" /><span className="truncate">{location}</span></p>
        <div className="mt-4 flex items-end justify-between gap-3 border-t border-slate-100 pt-4">
          <div><p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">From</p><p className="mt-0.5 text-xl font-extrabold tracking-tight text-slate-900"><span className="text-[#F73030]">${price}</span><span className="text-xs font-medium text-slate-400"> / {period}</span></p></div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700"><Star className="size-4 fill-amber-400 text-amber-400" /><span>{rating.toFixed(1)}</span><span className="font-normal text-slate-400">({totalReviews})</span></div>
        </div>
      </div>
    </article>
  );
}
