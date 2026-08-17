"use client";

import React, { useState } from "react";
import { MapPin, Star, Heart, ShoppingCart } from "lucide-react";
import Link from "next/link";

interface RentalCardProps {
  id?: string;
  category: string;
  image: string;
  title: string;
  location: string;
  rating: number;
  price: number;
  period?: string;
}

export default function RentalCard({
  id = "1",
  category,
  image,
  title,
  location,
  rating,
  price,
  period = "day",
}: RentalCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <Link 
      href={`/items/${id}`}
      className="block w-full max-w-[280px]"
    >
      <div className="group relative flex flex-col justify-between rounded-2xl bg-white p-4 shadow-xs transition-all hover:shadow-md border border-neutral-100 w-full cursor-pointer">
        {/* Top Section: Category & Favorite Button */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold tracking-wider text-[#FF2B2B] uppercase">
            {category}
          </span>
          <button 
            type="button" 
            aria-label={isFavorite ? "Remove from favorites" : "Save to favorites"}
            aria-pressed={isFavorite}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsFavorite((favorite) => !favorite);
            }}
            className={`flex size-9 items-center justify-center rounded-full transition-all active:scale-90 ${
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
        </div>
      </div>
    </Link>
  );
}
