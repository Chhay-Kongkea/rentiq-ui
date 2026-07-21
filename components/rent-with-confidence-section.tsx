// components/rent-with-confidence-section.tsx
import Image from "next/image";
import { ShieldCheck, Lock, Headphones } from "lucide-react";

export default function RentWithConfidenceSection() {
  return (
    <section className="w-full bg-white py-24 px-4 sm:px-8 overflow-hidden">
      <div className="mx-auto max-w-7xl flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-16">
        
        {/* Left Content Side */}
        <div className="flex-1 max-w-xl flex flex-col items-center lg:items-start text-center lg:text-left z-10 mx-auto">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
            <span className="text-[#253C95]">Rent with </span>
            <span className="text-[#FF2B2B]">Confidence</span>
          </h2>

          <p className="text-neutral-500 text-base sm:text-lg leading-relaxed mb-8">
            RentalHub bridges the gap between professionals and the high-end machinery they need. Every listing is inspected for quality, and every transaction is backed by our full-coverage guarantee.
          </p>

          {/* Divider Line */}
          <div className="w-full h-[1px] bg-neutral-200 mb-8"></div>

          {/* Features Row */}
          <div className="grid grid-cols-3 gap-6 w-full mx-auto justify-items-center lg:justify-items-start">
            {/* Feature 1 */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-[#FF2B2B]">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <span className="text-sm font-bold text-neutral-800">
                Full Coverage
              </span>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-[#FF2B2B]">
                <Lock className="h-6 w-6" />
              </div>
              <span className="text-sm font-bold text-neutral-800">
                Secure Pay
              </span>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-[#FF2B2B]">
                <Headphones className="h-6 w-6" />
              </div>
              <span className="text-sm font-bold text-neutral-800">
                24/7 Support
              </span>
            </div>
          </div>
        </div>

        {/* Right Illustration / Image Side */}
        <div className="flex-1 flex justify-center w-full relative mx-auto">
          <div className="relative w-full max-w-lg h-[350px] sm:h-[450px] flex items-center justify-center">
            <Image
              src="/img/man.png"
              alt="Rent with Confidence"
              fill
              className="object-cover rounded-3xl shadow-sm"
            />
          </div>
        </div>

      </div>
    </section>
  );
}