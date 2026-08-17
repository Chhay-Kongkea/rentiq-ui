import React from "react";
import RentalCard from "./rental-card";
import { FEATURED_RENTALS } from "./home-content.data";

export default function FeaturedRentalsSection() {
  return (
    <section className="mt-10 mx-auto w-full max-w-7xl py-6">
      <div className="px-4 sm:px-8 mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-[#253C95] sm:text-3xl md:text-4xl">
          Featured <span className="text-[#FF2B2B]">Rentals</span>
        </h2>
        <p className="mt-1 text-sm text-neutral-500">
          Top picks from verified owners near you
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4 sm:px-8 justify-items-center">
        {FEATURED_RENTALS.map((item) => (
          <RentalCard
            key={item.id}
            category={item.category}
            image={item.image}
            title={item.title}
            location={item.location}
            rating={item.rating}
            price={item.price}
          />
        ))}
      </div>
    </section>
  );
}
