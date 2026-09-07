"use client";

import React, { useState } from "react";
import { MapPin, Star, Heart, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useAddFavoriteMutation, useGetFavoritesQuery, useRemoveFavoriteMutation } from "@/redux/services/renterApi";
import type { ItemCondition } from "@/lib/types/item.types";

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
  id,
  category,
  image,
  title,
  location,
  rating,
  price,
  period = "day",
  wishlistMode = false,
  condition,
  featured = false,
  available = true,
  totalReviews,
}: RentalCardProps) {
  const router = useRouter();
  const { status } = useSession();
  const favoritesParams = { "pageable.page": 0, "pageable.size": 100, "pageable.sort": "favoritedAt,desc" };
  const { data: favoritesResponse } = useGetFavoritesQuery(favoritesParams, {
    skip: status !== "authenticated" || !id,
  });
  const [addFavorite, { isLoading: isAddingFavorite }] = useAddFavoriteMutation();
  const [removeFavorite, { isLoading: isRemovingFavorite }] = useRemoveFavoriteMutation();
  const [favoriteOverride, setFavoriteOverride] = useState<boolean | null>(null);
  const [favoriteError, setFavoriteError] = useState(false);
  const isUpdatingFavorite = isAddingFavorite || isRemovingFavorite;
  const favorites = Array.isArray(favoritesResponse)
    ? favoritesResponse
    : Array.isArray((favoritesResponse as { content?: unknown[] } | undefined)?.content)
      ? (favoritesResponse as { content: unknown[] }).content
      : [];
  const apiFavorite = favorites.some((favorite) => {
    const saved = favorite as { itemId?: string; id?: string; item?: { id?: string } };
    return saved.itemId === id || saved.item?.id === id || saved.id === id;
  });
  const isFavorite = favoriteOverride ?? (wishlistMode || apiFavorite);

  async function toggleFavorite() {
    if (!id || isUpdatingFavorite) return;
    if (status !== "authenticated") {
      router.push("/login");
      return;
    }

    const wasFavorite = isFavorite;
    setFavoriteError(false);
    setFavoriteOverride(!wasFavorite);

    try {
      if (wasFavorite) await removeFavorite(id).unwrap();
      else await addFavorite(id).unwrap();
    } catch {
      setFavoriteOverride(wasFavorite);
      setFavoriteError(true);
    }
  }

  async function removeFromWishlist() {
    if (!id || isUpdatingFavorite) return;
    setFavoriteError(false);
    setFavoriteOverride(false);

    try {
      await removeFavorite(id).unwrap();
    } catch {
      setFavoriteOverride(true);
      setFavoriteError(true);
    }
  }

  return (
    <Link 
      href={id ? `/items/${id}` : "/items"}
      className="block w-full max-w-[280px]"
    >
      <div className="group relative flex flex-col justify-between rounded-2xl bg-white p-4 shadow-xs transition-all hover:shadow-md border border-neutral-100 w-full cursor-pointer">
        {/* Top Section: Category & Favorite Button */}
        <div className="flex items-center justify-between mb-2 gap-2">
          <div className="flex min-w-0 items-center gap-1.5">
            <span className="truncate text-xs font-bold tracking-wider text-[#FF2B2B] uppercase">
              {category}
            </span>
            {condition ? <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">{formatCondition(condition)}</span> : null}
          </div>
          <button 
            type="button" 
            aria-label={isFavorite ? "Remove from favorites" : "Save to favorites"}
            aria-pressed={isFavorite}
            aria-busy={isUpdatingFavorite}
            disabled={!id || isUpdatingFavorite}
            title={favoriteError ? "Unable to update favorites. Please try again." : undefined}
            onClick={async (e) => {
              e.preventDefault();
              e.stopPropagation();
              await toggleFavorite();
            }}
            className={`flex size-9 items-center justify-center rounded-full transition-all active:scale-90 disabled:cursor-not-allowed disabled:opacity-60 ${
              isFavorite
                ? "bg-red-50 text-[#FF2B2B]"
                : "bg-neutral-100 text-neutral-500 hover:text-[#FF2B2B]"
            }`}
          >
            <Heart className={`size-5 transition-all ${isFavorite ? "fill-current" : "fill-transparent"}`} />
          </button>
        </div>

        {/* Product Image */}
        <div className="relative mb-4 flex h-40 w-full items-center justify-center overflow-hidden">
          {featured ? <span className="absolute left-0 top-0 z-10 rounded-full bg-[#253C95] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">Featured</span> : null}
          {!available ? <span className="absolute right-0 top-0 z-10 rounded-full bg-slate-900/85 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">Unavailable</span> : null}
          <img
            src={image}
            alt={title}
            className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* Title */}
        <h3 className="mb-2 text-base font-bold text-neutral-900 truncate">
          {title}
        </h3>

        {/* Location & Rating */}
        <div className="flex items-center justify-between mb-4 text-xs text-neutral-500">
          <div className="flex items-center gap-1 truncate">
            <MapPin className="size-3.5 text-neutral-400 shrink-0" />
            <span className="truncate">{location}</span>
          </div>
          <div className="flex items-center gap-1 shrink-0 font-semibold text-neutral-900">
            <Star className="size-3.5 fill-[#FFB800] text-[#FFB800]" />
            <span>{rating.toFixed(1)}</span>
            {totalReviews != null ? <span className="font-normal text-neutral-400">({totalReviews})</span> : null}
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-[1px] bg-neutral-100 mb-3" />

        {/* Bottom Section: Price & Cart Button */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-[#FF2B2B]">${price}</span>
            <span className="text-xs text-neutral-400">/{period}</span>
          </div>
          {wishlistMode ? (
            <button
              type="button"
              disabled={isUpdatingFavorite}
              onClick={async (e) => {
                e.preventDefault();
                e.stopPropagation();
                await removeFromWishlist();
              }}
              className="rounded-lg border border-red-100 px-3 py-2 text-xs font-bold text-[#FF2B2B] transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isRemovingFavorite ? "Removing..." : "Remove"}
            </button>
          ) : (
            <button 
              type="button"
              aria-label="Add to cart"
              onClick={(e) => {
                e.preventDefault(); // Prevents navigating to detail page when adding to cart
                e.stopPropagation();
              }}
              className="flex size-9 items-center justify-center rounded-full bg-sky-50 text-[#253C95] transition-colors hover:bg-sky-100"
            >
              <ShoppingCart className="size-4" />
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}
