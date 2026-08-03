// components/ready-to-rent-section.tsx
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function ReadyToRentSection() {
  return (
    <section className="w-full bg-gradient-to-r from-[#FFF5F5] via-[#FFF1F2] to-[#FFD8D8] py-16 px-4 sm:px-8 relative overflow-hidden border-t border-b border-rose-100/50">
      <div className="mx-auto max-w-7xl flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
        
        {/* Left Text Content */}
        <div className="flex flex-col items-start text-left max-w-xl">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#253C95] mb-3">
            Ready to Rent Smarter?
          </h2>
          <p className="text-neutral-500 text-base sm:text-lg leading-relaxed">
            Join thousands of Cambodians who trust RentalHub for safe, simple, and smart rentals.
          </p>
        </div>

        {/* Right Action Buttons */}
        <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto justify-start lg:justify-end">
          <Link
            href="/rent"
            className="flex items-center justify-center gap-2 bg-[#FF2B2B] hover:bg-[#e02424] text-white font-semibold px-8 py-4 rounded-xl shadow-lg shadow-rose-500/20 transition-all duration-300 hover:scale-[1.02]"
          >
            Start Renting
            <ArrowRight className="h-5 w-5" />
          </Link>

          <Link
            href="/vendor/register"
            className="flex items-center justify-center gap-2 bg-white/80 hover:bg-white text-[#FF2B2B] font-semibold px-8 py-4 rounded-xl border border-rose-200/60 shadow-sm transition-all duration-300 hover:scale-[1.02]"
          >
            Become a Vendor
            <ArrowRight className="h-5 w-5 text-[#FF2B2B]" />
          </Link>
        </div>

      </div>

      {/* Background Decorative Soft Glow */}
      <div className="absolute right-0 top-0 bottom-0 w-[500px] bg-gradient-to-l from-rose-300/40 via-rose-200/20 to-transparent pointer-events-none rounded-full blur-2xl"></div>
    </section>
  );
}