// app/page.tsx (Updated with Footer integrated at the bottom of the home page)
"use client";

import { useState } from "react";
import CategoriesSection from "@/components/categories-section";
import HeroBanner from "@/components/hero-banner";
import RentalCard from "@/components/rental-card";
import LocationCard from "@/components/location-card";
import RentalsNearYouBanner from "@/components/rentals-near-you-banner";
import OperationModeSection from "@/components/operation-mode-section";
import RentWithConfidenceSection from "@/components/rent-with-confidence-section";
import ReadyToRentSection from "@/components/ready-to-rent-section";
import Footer from "@/components/footer";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Mock data structured by pages (12 items per page - exactly 3 rows of 4 cards)
const allRecommendations = [
  // Page 1
  [
    {
      category: "VIHECLES",
      image:
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80",
      title: "Tesla Model 3",
      location: "BKK1, Phnom Penh",
      rating: 4.8,
      price: 50,
    },
    {
      category: "HOMES",
      image:
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80",
      title: "Luxury Penthouse Loft",
      location: "Tonle Bassac, Phnom Penh",
      rating: 4.9,
      price: 85,
    },
    {
      category: "ELECTRONICS",
      image:
        "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80",
      title: "Canon EOS R5 Camera",
      location: "Chamkarmon",
      rating: 4.7,
      price: 40,
    },
    {
      category: "TOOLS",
      image:
        "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=600&q=80",
      title: "DeWalt Cordless Combo Kit",
      location: "Sen Sok, Phnom Penh",
      rating: 4.6,
      price: 25,
    },
    {
      category: "VIHECLES",
      image:
        "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=600&q=80",
      title: "Chevrolet Corvette",
      location: "Toul Kork, Phnom Penh",
      rating: 4.9,
      price: 120,
    },
    {
      category: "HOMES",
      image:
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80",
      title: "Cozy Garden Villa",
      location: "BKK2, Phnom Penh",
      rating: 4.8,
      price: 65,
    },
    {
      category: "ELECTRONICS",
      image:
        "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80",
      title: "DJI Mavic 3 Drone",
      location: "Daun Penh, Phnom Penh",
      rating: 4.9,
      price: 30,
    },
    {
      category: "TOOLS",
      image:
        "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80",
      title: "Bosch Rotary Hammer",
      location: "Meanchey, Phnom Penh",
      rating: 4.4,
      price: 20,
    },
    {
      category: "VIHECLES",
      image:
        "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=600&q=80",
      title: "Ford Mustang GT",
      location: "BKK1, Phnom Penh",
      rating: 4.7,
      price: 90,
    },
    {
      category: "HOMES",
      image:
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80",
      title: "Modern Riverside Condo",
      location: "Chroy Changvar",
      rating: 4.6,
      price: 45,
    },
    {
      category: "ELECTRONICS",
      image:
        "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80",
      title: "MacBook Pro 16 M3",
      location: "BKK1, Phnom Penh",
      rating: 5.0,
      price: 35,
    },
    {
      category: "TOOLS",
      image:
        "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&w=600&q=80",
      title: "Heavy-Duty Pressure Washer",
      location: "Russey Keo, Phnom Penh",
      rating: 4.5,
      price: 18,
    },
  ],
  // Page 2
  [
    {
      category: "VIHECLES",
      image:
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80",
      title: "Audi R8 Spyder",
      location: "BKK1, Phnom Penh",
      rating: 4.9,
      price: 150,
    },
    {
      category: "HOMES",
      image:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
      title: "Suburban Family Home",
      location: "Sen Sok, Phnom Penh",
      rating: 4.7,
      price: 70,
    },
    {
      category: "ELECTRONICS",
      image:
        "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&q=80",
      title: "Apple Watch Ultra",
      location: "BKK1, Phnom Penh",
      rating: 4.8,
      price: 15,
    },
    {
      category: "TOOLS",
      image:
        "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=600&q=80",
      title: "Milwaukee M18 Tool Set",
      location: "Toul Kork, Phnom Penh",
      rating: 4.9,
      price: 30,
    },
    {
      category: "VIHECLES",
      image:
        "https://images.unsplash.com/photo-1541348263662-e0626628d0cf?auto=format&fit=crop&w=600&q=80",
      title: "BMW M4 Competition",
      location: "Daun Penh, Phnom Penh",
      rating: 4.8,
      price: 110,
    },
    {
      category: "HOMES",
      image:
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80",
      title: "Minimalist Townhouse",
      location: "Chbar Ampov",
      rating: 4.5,
      price: 55,
    },
    {
      category: "ELECTRONICS",
      image:
        "https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=600&q=80",
      title: 'Sony 65" 4K OLED TV',
      location: "Chamkarmon",
      rating: 4.9,
      price: 45,
    },
    {
      category: "TOOLS",
      image:
        "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80",
      title: "Makita Circular Saw",
      location: "Meanchey, Phnom Penh",
      rating: 4.6,
      price: 15,
    },
    {
      category: "VIHECLES",
      image:
        "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=600&q=80",
      title: "Mercedes-Benz C-Class",
      location: "BKK1, Phnom Penh",
      rating: 4.7,
      price: 80,
    },
    {
      category: "HOMES",
      image:
        "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=600&q=80",
      title: "Skyline Duplex Suite",
      location: "Tonle Bassac, Phnom Penh",
      rating: 4.9,
      price: 95,
    },
    {
      category: "ELECTRONICS",
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
      title: "Sony WH-1000XM5",
      location: "BKK1, Phnom Penh",
      rating: 4.8,
      price: 10,
    },
    {
      category: "TOOLS",
      image:
        "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80",
      title: "Ryobi Cordless Grinder",
      location: "Russey Keo, Phnom Penh",
      rating: 4.3,
      price: 12,
    },
  ],
  // Page 3
  [
    {
      category: "VIHECLES",
      image:
        "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=600&q=80",
      title: "Vespa Primavera Scooter",
      location: "BKK1, Phnom Penh",
      rating: 4.9,
      price: 15,
    },
    {
      category: "HOMES",
      image:
        "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=600&q=80",
      title: "Luxury Pool Villa",
      location: "Chroy Changvar",
      rating: 5.0,
      price: 130,
    },
    {
      category: "ELECTRONICS",
      image:
        "https://images.unsplash.com/photo-1585060544812-6b45742d762f?auto=format&fit=crop&w=600&q=80",
      title: "JBL PartyBox Speaker",
      location: "Toul Kork, Phnom Penh",
      rating: 4.7,
      price: 25,
    },
    {
      category: "TOOLS",
      image:
        "https://images.unsplash.com/photo-1508873696983-2df5c92063c7?auto=format&fit=crop&w=600&q=80",
      title: "Black & Decker Tool Box",
      location: "Sen Sok, Phnom Penh",
      rating: 4.5,
      price: 18,
    },
    {
      category: "VIHECLES",
      image:
        "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=600&q=80",
      title: "Lexus RX 350",
      location: "BKK1, Phnom Penh",
      rating: 4.8,
      price: 75,
    },
    {
      category: "HOMES",
      image:
        "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=80",
      title: "Urban Studio Apartment",
      location: "Chamkarmon",
      rating: 4.6,
      price: 30,
    },
    {
      category: "ELECTRONICS",
      image:
        "https://images.unsplash.com/photo-1616440347437-b1c73416efc2?auto=format&fit=crop&w=600&q=80",
      title: "GoPro Hero 12 Black",
      location: "Daun Penh, Phnom Penh",
      rating: 4.9,
      price: 20,
    },
    {
      category: "TOOLS",
      image:
        "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&w=600&q=80",
      title: "Honda Portable Generator",
      location: "Meanchey, Phnom Penh",
      rating: 4.9,
      price: 40,
    },
    {
      category: "VIHECLES",
      image:
        "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80",
      title: "Range Rover Sport",
      location: "BKK1, Phnom Penh",
      rating: 4.9,
      price: 140,
    },
    {
      category: "HOMES",
      image:
        "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=600&q=80",
      title: "Riverside Pentheader",
      location: "Chroy Changvar",
      rating: 4.8,
      price: 100,
    },
    {
      category: "ELECTRONICS",
      image:
        "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=600&q=80",
      title: "PlayStation 5 Console",
      location: "BKK1, Phnom Penh",
      rating: 5.0,
      price: 20,
    },
    {
      category: "TOOLS",
      image:
        "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80",
      title: "Craftsman Air Compressor",
      location: "Russey Keo, Phnom Penh",
      rating: 4.6,
      price: 22,
    },
  ],
];

export default function HomePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = allRecommendations.length;

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <HeroBanner />
      <CategoriesSection />

      {/* Featured Rentals Section */}
      <section className="mx-auto w-full max-w-7xl py-10">
        <div className="mb-8 pl-[18px] sm:pl-8">
          <h2 className="text-2xl font-bold tracking-tight text-[#253C95] sm:text-3xl md:text-4xl">
            Featured <span className="text-[#FF2B2B]">Rentals</span>
          </h2>
          <p className="mt-1 text-sm text-neutral-500">
            Top picks from verified owners near you
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pl-[18px] sm:pl-8 justify-items-start">
          <RentalCard
            category="VIHECLES"
            image="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80"
            title="Tesla Model 3"
            location="BKK1, Phnom Penh"
            rating={4.8}
            price={50}
            period="day"
          />
          <RentalCard
            category="HOMES"
            image="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80"
            title="Luxury Penthouse Loft"
            location="Tonle Bassac, Phnom Penh"
            rating={4.9}
            price={85}
            period="day"
          />
          <RentalCard
            category="ELECTRONICS"
            image="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80"
            title="Canon EOS R5 Camera"
            location="Chamkarmon"
            rating={4.7}
            price={40}
            period="day"
          />
          <RentalCard
            category="TOOLS"
            image="https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=600&q=80"
            title="DeWalt Cordless Combo Kit"
            location="Sen Sok, Phnom Penh"
            rating={4.6}
            price={25}
            period="day"
          />
        </div>
      </section>

      {/* Top Recommendations Section */}
      <section className="mx-auto w-full max-w-7xl py-10">
        <div className="mb-8 pl-[18px] sm:pl-8">
          <h2 className="text-2xl font-bold tracking-tight text-[#253C95] sm:text-3xl md:text-4xl">
            Top <span className="text-[#FF2B2B]">Recommendations</span>
          </h2>
          <p className="mt-1 text-sm text-neutral-500">
            Best verified rentals.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pl-[18px] sm:pl-8 justify-items-start transition-opacity duration-300">
          {allRecommendations[currentPage - 1].map((item, index) => (
            <RentalCard
              key={index}
              category={item.category}
              image={item.image}
              title={item.title}
              location={item.location}
              rating={item.rating}
              price={item.price}
              period="day"
            />
          ))}
        </div>

        {/* Pagination Section */}
        <div className="mt-12 flex w-full items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Previous Page"
            className={`flex h-10 w-10 items-center justify-center rounded-xl border border-rose-200/60 bg-neutral-50/50 text-neutral-400 transition-colors ${
              currentPage === 1
                ? "opacity-40 cursor-not-allowed"
                : "hover:bg-neutral-100 hover:text-neutral-700"
            }`}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={() => handlePageChange(1)}
            className={`flex h-10 w-10 items-center justify-center rounded-xl font-semibold transition-all ${
              currentPage === 1
                ? "bg-[#FF2B2B] text-white shadow-sm"
                : "border border-rose-200/60 bg-neutral-50/50 text-neutral-700 hover:bg-neutral-100"
            }`}
          >
            1
          </button>

          <button
            type="button"
            onClick={() => handlePageChange(2)}
            className={`flex h-10 w-10 items-center justify-center rounded-xl font-semibold transition-all ${
              currentPage === 2
                ? "bg-[#FF2B2B] text-white shadow-sm"
                : "border border-rose-200/60 bg-neutral-50/50 text-neutral-700 hover:bg-neutral-100"
            }`}
          >
            2
          </button>

          <button
            type="button"
            onClick={() => handlePageChange(3)}
            className={`flex h-10 w-10 items-center justify-center rounded-xl font-semibold transition-all ${
              currentPage === 3
                ? "bg-[#FF2B2B] text-white shadow-sm"
                : "border border-rose-200/60 bg-neutral-50/50 text-neutral-700 hover:bg-neutral-100"
            }`}
          >
            3
          </button>

          <button
            type="button"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Next Page"
            className={`flex h-10 w-10 items-center justify-center rounded-xl border border-rose-200/60 bg-neutral-50/50 text-[#253C95] transition-colors ${
              currentPage === totalPages
                ? "opacity-40 cursor-not-allowed"
                : "hover:bg-neutral-100"
            }`}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </section>

      {/* Popular Locations Section */}
      <section className="mx-auto w-full max-w-7xl py-12">
        <div className="mb-10 w-full text-center">
          <h2 className="text-2xl font-bold tracking-tight text-[#253C95] sm:text-3xl md:text-4xl">
            Popular <span className="text-[#FF2B2B]">Locations</span>
          </h2>
          <p className="mt-1 text-sm text-neutral-500">
            Explore rentals by popular areas
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-6 pl-[18px] pr-[18px] sm:pl-8 sm:pr-8">
          <LocationCard
            image="/img/sok.png"
            title="Sen sok"
            className="md:col-span-1 lg:col-span-1 md:row-span-2 min-h-[350px] md:min-h-[460px]"
          />
          <div className="flex flex-col gap-6 md:col-span-1 lg:col-span-1">
            <LocationCard
              image="https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=600&q=80"
              title="Daun Penh"
              className="h-[210px]"
            />
            <LocationCard
              image="https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=600&q=80"
              title="Chamkarmon"
              className="h-[210px]"
            />
          </div>
          <div className="flex flex-col gap-6 md:col-span-1 lg:col-span-1">
            <LocationCard
              image="/img/Bkk.png"
              title="BKK 1"
              className="h-[210px]"
            />
            <LocationCard
              image="/img/psar-thom.png"
              title="Russian Market"
              className="h-[210px]"
            />
          </div>
          <LocationCard
            image="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80"
            title="Toul Kork"
            className="md:col-span-1 lg:col-span-2 md:row-span-2 min-h-[350px] md:min-h-[460px]"
          />
        </div>
      </section>

      <RentalsNearYouBanner />

      <OperationModeSection />

      <RentWithConfidenceSection />

      <ReadyToRentSection />

      <Footer />
    </main>
  );
}