"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import {
  Star,
  MapPin,
  Flag,
  Calendar as CalendarIcon,
  Heart,
  Share2,
  ChevronDown,
  Gauge,
  Users,
  Volume2,
  Zap,
  Fuel,
  Camera,
} from "lucide-react";

// ==========================================
// 1. MOCK DATA
// ==========================================
const CAR_DETAILS_MOCK = {
  id: "porsche-911-carrera",
  title: "Porsche 911 Carrera",
  isFeatured: true,
  isVerified: true,
  location: "Beverly Hills, California",
  pickupLocation: "Sen Sok",
  rating: 4.9,
  reviewsCount: 124,
  description:
    "Experience the pinnacle of German engineering with this pristine 2024 Porsche 911 Carrera. Finished in a deep obsidian black, this masterpiece offers a perfect blend of high-performance capabilities and daily-driver comfort. Whether you’re cruising through the Pacific Coast Highway or heading to a high-profile business meeting, the 911 makes every mile an occasion.",
  rates: {
    daily: 299,
    weekly: 250,
    monthly: 200,
  },
  fees: {
    days: 2,
    serviceFee: 48,
    insurancePremium: 83,
  },
  dates: {
    checkIn: "Nov 12, 2026",
    checkOut: "Nov 14, 2026",
  },
  host: {
    name: "Thoeun Vanny",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    isOnline: true,
  },
  images: {
    main: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80",
    side: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80",
    interior:
      "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=600&q=80",
  },
  specifications: [
    {
      id: 1,
      title: "Automatic",
      sub: "PDK Transmission",
      icon: <Gauge className="text-rose-500 h-4 w-4" />,
    },
    {
      id: 2,
      title: "2 Seats",
      sub: "Sport Plus",
      icon: <Users className="text-rose-500 h-4 w-4" />,
    },
    {
      id: 3,
      title: "Premium Audio",
      sub: "Bose Surround",
      icon: <Volume2 className="text-rose-500 h-4 w-4" />,
    },
    {
      id: 4,
      title: "200 Miles",
      sub: "Included per day",
      icon: <Zap className="text-rose-500 h-4 w-4" />,
    },
    {
      id: 5,
      title: "91 Octane",
      sub: "Premium Fuel Only",
      icon: <Fuel className="text-rose-500 h-4 w-4" />,
    },
    {
      id: 6,
      title: "Parking Cam",
      sub: "360-Degree View",
      icon: <Camera className="text-rose-500 h-4 w-4" />,
    },
  ],
  reviews: [
    {
      id: 1,
      name: "David Miller",
      date: "March 2024",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      rating: 5,
      text: "The car was immaculate and drove like a dream. Marcus was extremely communicative and made the pick-up process seamless. Highly recommend for any weekend getaways.",
    },
    {
      id: 2,
      name: "Sarah Jenkins",
      date: "February 2024",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
      rating: 5,
      text: "Incredible experience. The Porsche 911 is truly a work of art. The Bose sound system was a great touch. Will definitely be renting again next time I'm in LA.",
    },
  ],
};

// ==========================================
// 2. MAIN COMPONENT
// ==========================================
interface ListingDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function ListingDetailPage({ params }: ListingDetailPageProps) {
  const { id } = use(params);
  const [rateType, setRateType] = useState<"daily" | "weekly" | "monthly">(
    "daily"
  );

  const car = CAR_DETAILS_MOCK;
  const currentPrice = car.rates[rateType];
  const totalBasePrice = currentPrice * car.fees.days;
  const totalPrice = totalBasePrice + car.fees.serviceFee + car.fees.insurancePremium;

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-800 pb-20 pt-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* TOP SECTION: GRID LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN (8 COLS): GALLERY & DETAILS */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* 1. IMAGE GALLERY GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 rounded-2xl overflow-hidden">
              <div className="sm:col-span-2 aspect-4/3 bg-slate-200 overflow-hidden">
                <img
                  src={car.images.main}
                  alt={`${car.title} Front View`}
                  className="w-full h-full object-cover hover:scale-105 transition duration-500"
                />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-1 gap-3">
                <div className="aspect-4/3 sm:aspect-auto sm:h-[185px] bg-slate-200 overflow-hidden rounded-lg sm:rounded-none">
                  <img
                    src={car.images.side}
                    alt={`${car.title} Side View`}
                    className="w-full h-full object-cover hover:scale-105 transition duration-500"
                  />
                </div>
                <div className="aspect-4/3 sm:aspect-auto sm:h-[185px] bg-slate-200 overflow-hidden rounded-lg sm:rounded-none">
                  <img
                    src={car.images.interior}
                    alt={`${car.title} Interior`}
                    className="w-full h-full object-cover hover:scale-105 transition duration-500"
                  />
                </div>
              </div>
            </div>

            {/* 2. TITLE & HOST CARD */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {car.isFeatured && (
                    <span className="bg-rose-100 text-[#FF2B2B] text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">
                      Featured
                    </span>
                  )}
                  {car.isVerified && (
                    <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">
                      Verified
                    </span>
                  )}
                </div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                  {car.title}
                </h1>
                <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    {car.location}
                  </span>
                  <span className="flex items-center gap-1 font-bold text-slate-900">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    {car.rating}{" "}
                    <span className="font-normal text-slate-400">
                      ({car.reviewsCount} reviews)
                    </span>
                  </span>
                </div>
              </div>

              {/* Host Box & Actions */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl p-2.5 shadow-xs">
                  <div className="relative">
                    <img
                      src={car.host.avatar}
                      alt={car.host.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    {car.host.isOnline && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                    )}
                  </div>
                  <div>
                    <p className="text-[10px] font-medium text-slate-400">
                      Hosted by
                    </p>
                    <p className="text-xs font-bold text-slate-900">
                      {car.host.name}
                    </p>
                  </div>
                  <button className="ml-2 border border-rose-200 text-[#FF2B2B] hover:bg-rose-50 text-xs font-bold px-3 py-1.5 rounded-xl transition">
                    Contact Owner
                  </button>
                </div>
                <button
                  className="text-slate-400 hover:text-slate-600"
                  title="Report this item"
                >
                  <Flag className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* 3. ABOUT VEHICLE */}
            <div className="space-y-3 pb-6 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-900">
                About this vehicle
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                {car.description}
              </p>
              <button className="text-xs font-bold text-[#FF2B2B] inline-flex items-center gap-1 hover:underline">
                Read more <ChevronDown className="h-3 w-3" />
              </button>
            </div>

            {/* 4. SPECIFICATIONS & AMENITIES */}
            <div className="space-y-4 pb-6 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-900">
                Specifications & Amenities
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {car.specifications.map((spec) => (
                  <SpecItem
                    key={spec.id}
                    icon={spec.icon}
                    title={spec.title}
                    sub={spec.sub}
                  />
                ))}
              </div>
            </div>

            {/* 5. GUEST REVIEWS */}
            <div className="space-y-4 pb-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">
                  Guest Reviews
                </h2>
                <button className="text-xs font-bold text-[#FF2B2B] hover:underline">
                  View all {car.reviewsCount} reviews
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {car.reviews.map((rev) => (
                  <ReviewCard
                    key={rev.id}
                    name={rev.name}
                    date={rev.date}
                    avatar={rev.avatar}
                    rating={rev.rating}
                    text={rev.text}
                  />
                ))}
              </div>
            </div>

            {/* 6. AVAILABILITY CALENDAR */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">
                  Availability
                </h2>
                <span className="text-[10px] text-slate-400 font-medium">
                  Updated 2 hours ago
                </span>
              </div>

              {/* Dual Month Calendar Mockup */}
              <div className="bg-slate-100/60 border border-slate-200/60 rounded-2xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center text-xs">
                  {/* Nov 2026 */}
                  <div>
                    <h3 className="font-bold text-slate-800 mb-4 text-left">
                      November 2026
                    </h3>
                    <div className="grid grid-cols-7 gap-1 text-[10px] text-slate-400 mb-2 font-semibold">
                      <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-slate-600 font-medium">
                      <span className="text-slate-300">27</span><span className="text-slate-300">28</span><span className="text-slate-300">29</span><span className="text-slate-300">30</span><span className="text-slate-300">31</span><span>1</span><span>2</span>
                      <span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span><span>9</span>
                      <span>10</span><span>11</span>
                      <span className="bg-[#FF2B2B] text-white rounded-l-md font-bold py-1">12</span>
                      <span className="bg-[#FF2B2B]/20 py-1">13</span>
                      <span className="bg-[#FF2B2B] text-white rounded-r-md font-bold py-1">14</span>
                      <span>15</span><span>16</span><span>17</span><span>18</span><span>19</span><span>20</span><span>21</span><span>22</span><span>23</span>
                    </div>
                  </div>

                  {/* Dec 2026 */}
                  <div>
                    <h3 className="font-bold text-slate-800 mb-4 text-left">
                      December 2026
                    </h3>
                    <div className="grid grid-cols-7 gap-1 text-[10px] text-slate-400 mb-2 font-semibold">
                      <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-slate-600 font-medium">
                      <span></span><span></span><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>
                      <span>6</span><span>7</span><span>8</span><span>9</span><span>10</span><span>11</span><span>12</span>
                      <span>13</span><span>14</span><span>15</span><span>16</span><span>17</span><span>18</span><span>19</span>
                      <span>20</span><span>21</span><span>22</span><span>23</span><span>24</span><span>25</span><span>26</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN (4 COLS): STICKY BOOKING WIDGET */}
          <div className="lg:col-span-4 sticky top-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xl space-y-6">
              
              {/* Pricing Header */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-3xl font-black text-slate-900">
                    ${currentPrice}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {" "}/ {rateType === "daily" ? "day" : rateType === "weekly" ? "week" : "month"}
                  </span>
                </div>

                {/* Billing Frequency Toggle */}
                <div className="bg-slate-100 p-1 rounded-full flex text-[10px] font-bold text-slate-500">
                  {(["daily", "weekly", "monthly"] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setRateType(type)}
                      className={`px-2.5 py-1 rounded-full capitalize transition ${
                        rateType === type ? "bg-white text-slate-900 shadow-xs" : ""
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date Selector Inputs */}
              <div className="grid grid-cols-2 gap-2 border border-slate-200 rounded-2xl p-2.5 bg-slate-50/50 text-xs">
                <div className="space-y-0.5">
                  <span className="text-[9px] font-bold uppercase text-slate-400">
                    Check-in
                  </span>
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <CalendarIcon className="h-3.5 w-3.5 text-[#FF2B2B]" />
                    <span>{car.dates.checkIn}</span>
                  </div>
                </div>
                <div className="space-y-0.5 border-l border-slate-200 pl-2.5">
                  <span className="text-[9px] font-bold uppercase text-slate-400">
                    Check-out
                  </span>
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <CalendarIcon className="h-3.5 w-3.5 text-[#FF2B2B]" />
                    <span>{car.dates.checkOut}</span>
                  </div>
                </div>
              </div>

              {/* Pick-up Location Selector */}
              <div className="border border-slate-200 rounded-2xl p-2.5 bg-slate-50/50 text-xs space-y-0.5">
                <span className="text-[9px] font-bold uppercase text-slate-400">
                  Pick-up Location
                </span>
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  <MapPin className="h-3.5 w-3.5 text-[#FF2B2B]" />
                  <span>{car.pickupLocation}</span>
                </div>
              </div>

              {/* Price Calculation Breakdown */}
              <div className="space-y-2 text-xs border-b border-slate-100 pb-4 text-slate-500 font-medium">
                <div className="flex justify-between">
                  <span>${currentPrice} × {car.fees.days} days</span>
                  <span className="font-bold text-slate-800">${totalBasePrice}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service Fee</span>
                  <span className="font-bold text-slate-800">${car.fees.serviceFee}</span>
                </div>
                <div className="flex justify-between">
                  <span>Insurance Premium</span>
                  <span className="font-bold text-slate-800">${car.fees.insurancePremium}</span>
                </div>
              </div>

              {/* Total Calculation */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-base font-bold text-slate-900">Total</span>
                <span className="text-2xl font-black text-[#FF2B2B]">${totalPrice}</span>
              </div>

              {/* Book Button */}
              <Link href={`/listings/${id}/checkout`} className="block w-full">
                <button className="w-full bg-[#FF2B2B] hover:bg-red-600 text-white font-extrabold text-sm py-3.5 rounded-2xl shadow-lg shadow-rose-200 transition">
                  Book Now
                </button>
              </Link>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 text-xs font-bold text-slate-700">
                <button className="flex items-center justify-center gap-1.5 border border-slate-200 rounded-xl py-2.5 hover:bg-slate-50 transition">
                  <Heart className="h-3.5 w-3.5 text-slate-400" />
                  <span>Save</span>
                </button>
                <button className="flex items-center justify-center gap-1.5 border border-slate-200 rounded-xl py-2.5 hover:bg-slate-50 transition">
                  <Share2 className="h-3.5 w-3.5 text-slate-400" />
                  <span>Share</span>
                </button>
              </div>

              <p className="text-[10px] text-center text-slate-400 font-medium">
                Free cancellation until 48 hours before start.
              </p>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// ==========================================
// 3. HELPER COMPONENTS
// ==========================================

function SpecItem({
  icon,
  title,
  sub,
}: {
  icon: React.ReactNode;
  title: string;
  sub: string;
}) {
  return (
    <div className="flex items-center gap-3 bg-white border border-slate-200/80 rounded-2xl p-3 shadow-2xs">
      <div className="p-2 bg-rose-50 rounded-xl">{icon}</div>
      <div>
        <p className="text-xs font-bold text-slate-900">{title}</p>
        <p className="text-[10px] text-slate-400 font-medium">{sub}</p>
      </div>
    </div>
  );
}

function ReviewCard({
  name,
  date,
  avatar,
  rating,
  text,
}: {
  name: string;
  date: string;
  avatar: string;
  rating: number;
  text: string;
}) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-4 space-y-3 shadow-2xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <img
            src={avatar}
            alt={name}
            className="w-8 h-8 rounded-full object-cover"
          />
          <div>
            <p className="text-xs font-bold text-slate-900">{name}</p>
            <p className="text-[10px] text-slate-400">{date}</p>
          </div>
        </div>
        <div className="flex gap-0.5">
          {[...Array(rating)].map((_, i) => (
            <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
          ))}
        </div>
      </div>
      <p className="text-xs text-slate-600 italic leading-relaxed">{text}</p>
    </div>
  );
}