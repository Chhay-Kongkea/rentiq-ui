// components/rentals-near-you-banner.tsx
import { MapPin, Map } from "lucide-react";

export default function RentalsNearYouBanner() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 sm:px-8 my-6">
      <div className="relative flex flex-col md:flex-row items-center justify-between bg-[#FF2B2B] rounded-3xl p-6 sm:p-8 text-white shadow-md overflow-hidden">
        {/* Left Side: Icon & Text */}
        <div className="flex items-center gap-5 z-10 text-center md:text-left flex-col md:flex-row">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md">
            <MapPin className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Rentals Near You
            </h2>
            <p className="mt-1 text-sm sm:text-base text-rose-100 font-medium">
              320 items within 5km of Phnom Penh right now
            </p>
          </div>
        </div>

        {/* Right Side: View On Map Button */}
        <div className="mt-6 md:mt-0 z-10">
          <button
            type="button"
            className="flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#FF2B2B] shadow-sm transition-all hover:bg-rose-50 hover:shadow-md active:scale-95"
          >
            <Map className="h-4 w-4" />
            View On Map
          </button>
        </div>

        {/* Optional background decorative circles */}
        <div className="absolute -right-10 -bottom-10 h-48 w-48 rounded-full bg-white/5 blur-2xl pointer-events-none" />
        <div className="absolute -left-10 -top-10 h-48 w-48 rounded-full bg-black/5 blur-2xl pointer-events-none" />
      </div>
    </section>
  );
}