"use client";

import { useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faMagnifyingGlass,
  faLocationDot,
  faStar,
  faShoppingCart,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

// Sample mock data for items in the favorites list
const INITIAL_FAVORITES = [
  {
    id: 1,
    title: "Lamborghini Aventador",
    category: "VEHICLES",
    location: "BKK1, Phnom Penh",
    rating: 4.9,
    price: null,
    image:
      "https://i.pinimg.com/1200x/66/ee/a9/66eea93dbd62e9d9f65303efe3da1352.jpg", // Placeholder drill / tool
  },
  {
    id: 2,
    title: "2025 PCX",
    category: "VEHICLES",
    location: "BKK1, Phnom Penh",
    rating: 4.9,
    price: null,
    image:
      "https://i.pinimg.com/736x/66/4a/aa/664aaa7f1e2f9055fae5f5402ea93068.jpg", // Placeholder Porsche
  },
  {
    id: 3,
    title: "iPhone 14 Pro",
    category: "PHONE",
    location: "BKK1, Phnom Penh",
    rating: 4.9,
    price: 60,
    image:
      "https://i.pinimg.com/736x/ca/43/a1/ca43a11d6672b910f1c19b2c537ba2da.jpg", // Placeholder Laptop
  },
  {
    id: 4,
    title: "Preloved Macbook Air",
    category: "COMPUTER",
    location: "BKK1, Phnom Penh",
    rating: 4.9,
    price: 60,
    image:
      "https://i.pinimg.com/1200x/ed/68/70/ed687071fd2cfed9710411eab706662a.jpg", // Placeholder Camera
  },
];

export default function FavoritesPage() {
  // Toggle favorites array state to demonstrate both views dynamically
  const [favorites, setFavorites] = useState(INITIAL_FAVORITES);

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => prev.filter((item) => item.id !== id));
  };

  const hasFavorites = favorites.length > 0;

  return (
    <main className="min-h-screen bg-[#f8fafc] px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-7xl">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">
            <span className="text-[#253C95]">My </span>
            <span className="text-[#ef4444]">Favorites</span>
          </h1>
          {hasFavorites && (
            <p className="mt-1.5 text-sm text-slate-400">
              Discover and manage your curated selection of luxury vehicles.
            </p>
          )}
        </div>

        {/* CONDITION 1: EMPTY STATE */}
        {!hasFavorites ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            {/* Heart Icon Badge */}
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#ef4444] text-white shadow-md">
              <FontAwesomeIcon icon={faHeart} className="h-9 w-9" />
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">
              <span className="text-new-blue">Get started with </span>
              <span className="text-new-red">Favorites</span>
            </h2>

            {/* Description */}
            <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-400">
              Tap the heart icon to save your favorite vehicles to a list and
              compare them later.
            </p>

            {/* Call to action */}
            <Link
              href="/"
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-[#ef4444] px-6 py-3 text-xs font-semibold text-white shadow-md transition hover:bg-red-600"
            >
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className="h-3.5 w-3.5"
              />
              Find new favorites
            </Link>
          </div>
        ) : (
          /* CONDITION 2: FOUND STATE (POPULATED GRID) */
          <div className="space-y-10">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {/* Render Favorite Cards */}
              {favorites.map((item) => (
                <div
                  key={item.id}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition hover:shadow-md"
                >
                  <div>
                    {/* Top Tag & Un-favorite Button */}
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-[10px] font-bold tracking-wider text-red-500 uppercase">
                        {item.category}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleFavorite(item.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-red-50 text-red-500 transition hover:bg-red-100"
                      >
                        <FontAwesomeIcon icon={faHeart} className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Image Placeholder */}
                    <div className="mb-4 flex h-36 items-center justify-center overflow-hidden rounded-xl bg-slate-50">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-contain p-2"
                      />
                    </div>

                    {/* Title */}
                    <h3 className="text-sm font-bold text-slate-800">
                      {item.title}
                    </h3>

                    {/* Location & Rating */}
                    <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <FontAwesomeIcon
                          icon={faLocationDot}
                          className="h-3 w-3 text-slate-300"
                        />
                        {item.location}
                      </span>
                      <span className="flex items-center gap-1 font-bold text-slate-700">
                        <FontAwesomeIcon
                          icon={faStar}
                          className="h-3 w-3 text-amber-400"
                        />
                        {item.rating}
                      </span>
                    </div>
                  </div>

                  {/* Pricing / Action Section */}
                  {item.price !== null && (
                    <div className="mt-4 flex items-center justify-between border-t border-slate-50 pt-3">
                      <div>
                        <span className="text-sm font-extrabold text-red-500">
                          $ {item.price}
                        </span>
                        <span className="text-xs text-slate-400">/day</span>
                      </div>
                      <button
                        type="button"
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-50 text-sky-500 hover:bg-sky-100"
                      >
                        <FontAwesomeIcon
                          icon={faShoppingCart}
                          className="h-3.5 w-3.5"
                        />
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {/* "Add more favorites" Card Slot */}
              <div className="flex min-h-[260px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white p-6 text-center transition hover:border-slate-300">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-500">
                  <FontAwesomeIcon icon={faPlus} className="h-4 w-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-800">
                  Add more favorites
                </h4>
                <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
                  Browse our premium fleet to expand your collection.
                </p>
              </div>
            </div>

            {/* Bottom Button */}
            <div className="flex justify-center pt-4">
              <Link
                href="/"
                className="rounded-xl border border-red-200 bg-white px-6 py-2.5 text-xs font-bold text-red-500 shadow-sm transition hover:bg-red-50"
              >
                Browse More Listings
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}