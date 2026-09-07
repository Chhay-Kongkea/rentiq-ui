"use client";

import AdvertisementBanner from "@/components/advertisement-banner";
import ApiItemsSection from "@/components/api-items-section";
import CategoriesSection from "@/components/categories-section";
import Footer from "@/components/footer";
import HeroBanner from "@/components/hero-banner";
import LocationCard from "@/components/location-card";
import OperationModeSection from "@/components/operation-mode-section";
import ReadyToRentSection from "@/components/ready-to-rent-section";
import RevealSection from "@/components/reveal-section";
import RentalsNearYouBanner from "@/components/rentals-near-you-banner";
import RentWithConfidenceSection from "@/components/rent-with-confidence-section";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="mt-[-25px]"><HeroBanner /></div>
      <RevealSection><CategoriesSection /></RevealSection>
      <AdvertisementBanner />
      <RevealSection delay={80}><ApiItemsSection /></RevealSection>

      <RevealSection direction="left">
      <section className="mx-auto w-full max-w-7xl py-12">
        <div className="mb-10 w-full text-center">
          <h2 className="text-2xl font-bold tracking-tight text-[#253C95] sm:text-3xl md:text-4xl">Popular <span className="text-[#F73030]">Locations</span></h2>
          <p className="mt-1 text-sm text-neutral-500">Explore rentals by popular areas</p>
        </div>
        <div className="grid grid-cols-1 gap-6 px-[18px] sm:px-8 md:grid-cols-4 lg:grid-cols-5">
          <LocationCard image="/img/sok.png" title="Sen Sok" className="min-h-[350px] md:col-span-1 md:row-span-2 md:min-h-[460px] lg:col-span-1" />
          <div className="flex flex-col gap-6 md:col-span-1 lg:col-span-1">
            <LocationCard image="/img/Daun Penh.png" title="Daun Penh" className="h-[210px]" />
            <LocationCard image="/img/location-chamkarmon.jpg" title="Chamkarmon" className="h-[210px]" />
          </div>
          <div className="flex flex-col gap-6 md:col-span-1 lg:col-span-1">
            <LocationCard image="/img/Bkk.png" title="BKK 1" className="h-[210px]" />
            <LocationCard image="/img/location-russian-market.jpg" title="Russian Market" className="h-[210px]" />
          </div>
          <LocationCard image="/img/location-toul-kork.jpg" title="Toul Kork" className="min-h-[350px] md:col-span-1 md:row-span-2 md:min-h-[460px] lg:col-span-2" />
        </div>
      </section>
      </RevealSection>

      <RevealSection direction="right"><RentalsNearYouBanner /></RevealSection>
      <RevealSection><OperationModeSection /></RevealSection>
      <RevealSection direction="left"><RentWithConfidenceSection /></RevealSection>
      <RevealSection direction="right"><ReadyToRentSection /></RevealSection>
      <RevealSection><Footer /></RevealSection>
    </main>
  );
}
