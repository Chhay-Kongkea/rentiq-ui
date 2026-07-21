import React from "react";
import RentalCard from "./rental-card";


const rentalsList = [
  {
    id: 1,
    category: "VIHECLES",
    image: "/img/porsche.png",
    title: "Porsche 718 Cayman",
    location: "BKK1, Phnom Penh",
    rating: 4.9,
    price: 60,
  },
  {
    id: 2,
    category: "HOMES",
    image: "/img/modern-house.png",
    title: "Modern Studio in BKK1",
    location: "BKK1, Phnom Penh",
    rating: 4.7,
    price: 35,
  },
  {
    id: 3,
    category: "ELECTRONICS",
    image: "/img/camera-sony.png",
    title: "Sony A7III Camera",
    location: "Chamkarmon",
    rating: 4.9,
    price: 15,
  },
  {
    id: 4,
    category: "TOOLS",
    image: "/img/makita-tools.png",
    title: "Makita Drill Set",
    location: "BKK1, Phnom Penh",
    rating: 4.5,
    price: 60,
  },
];

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
        {rentalsList.map((item) => (
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