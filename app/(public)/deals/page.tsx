import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgePercent,
  CalendarDays,
  Check,
  Clock3,
  Gift,
  ShieldCheck,
  Sparkles,
  Tag,
} from "lucide-react";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Rental Deals & Promotions | Rentiq",
  description: "Discover limited-time discounts and promotional rental offers on Rentiq.",
};

const promotions = [
  {
    title: "Weekend Drive",
    description: "Explore Cambodia for less with selected cars and scooters.",
    discount: "25% OFF",
    code: "DRIVE25",
    category: "Vehicles",
    image: "/img/admin/promo-car.png",
    validUntil: "August 31, 2026",
    tone: "bg-[#fff0ee]",
  },
  {
    title: "Creator Essentials",
    description: "Save on cameras, drones, lighting, and audio equipment.",
    discount: "20% OFF",
    code: "CREATE20",
    category: "Electronics",
    image: "/img/admin/promo-concept-car.png",
    validUntil: "September 15, 2026",
    tone: "bg-[#eef2ff]",
  },
  {
    title: "Build More, Pay Less",
    description: "Get the equipment you need for your next big project.",
    discount: "$30 OFF",
    code: "BUILD30",
    category: "Tools",
    image: "/img/admin/promo-excavator.png",
    validUntil: "September 30, 2026",
    tone: "bg-[#fff8e8]",
  },
];

const benefits = [
  { icon: ShieldCheck, title: "Verified rentals", text: "Every promoted listing follows the same Rentiq safety standards." },
  { icon: Tag, title: "Clear pricing", text: "Your discount is shown before you confirm the booking." },
  { icon: Gift, title: "Fresh offers", text: "New promotions are added regularly across popular categories." },
];

export default function DealsPage() {
  return (
    <>
      <div className="overflow-hidden bg-[#fcfcfd]">
        <section className="mx-auto max-w-7xl px-4 pb-10 pt-8 sm:px-8 lg:pb-16">
          <div className="relative overflow-hidden rounded-[32px] bg-[#192c78] px-6 py-12 text-white sm:px-10 lg:px-16 lg:py-16">
            <div className="absolute -right-24 -top-28 size-80 rounded-full bg-[#ff4545]/30 blur-3xl" />
            <div className="absolute -bottom-32 left-1/3 size-72 rounded-full bg-blue-400/20 blur-3xl" />

            <div className="relative z-10 grid items-center gap-10 lg:grid-cols-[1.05fr_.95fr]">
              <div className="max-w-2xl">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em]">
                  <Sparkles className="size-4 text-amber-300" />
                  Limited-time promotion
                </span>
                <h1 className="mt-6 text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
                  Rent more.
                  <span className="block text-[#ff5b59]">Spend less.</span>
                </h1>
                <p className="mt-5 max-w-xl text-sm leading-7 text-blue-100 sm:text-base">
                  Unlock special prices on vehicles, homes, electronics, and tools from trusted Rentiq vendors.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href="#promotions" className="inline-flex items-center gap-2 rounded-xl bg-[#ff3535] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-950/20 transition hover:-translate-y-0.5 hover:bg-red-500">
                    Explore deals <ArrowRight className="size-4" />
                  </Link>
                  <Link href="/categories" className="inline-flex items-center rounded-xl border border-white/25 bg-white/10 px-6 py-3.5 text-sm font-bold backdrop-blur-sm transition hover:bg-white/20">
                    Browse categories
                  </Link>
                </div>
              </div>

              <div className="relative mx-auto w-full max-w-lg">
                <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/15 bg-white/10 shadow-2xl">
                  <Image src="/img/admin/promo-car.png" alt="Featured vehicle promotion" fill priority className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c194d]/80 via-transparent to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                    <div>
                      <p className="text-xs font-semibold text-blue-100">Featured deal</p>
                      <p className="mt-1 text-xl font-bold">Weekend vehicles</p>
                    </div>
                    <span className="rounded-2xl bg-white px-4 py-2 text-lg font-extrabold text-[#ff3535]">-25%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="promotions" className="mx-auto max-w-7xl scroll-mt-8 px-4 py-12 sm:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="flex items-center gap-2 text-sm font-bold text-[#ff3535]">
                <BadgePercent className="size-5" /> Current promotions
              </p>
              <h2 className="mt-2 text-3xl font-extrabold text-[#253c95] sm:text-4xl">Deals picked for you</h2>
              <p className="mt-3 text-sm text-neutral-500">Use the promotion code when you make an eligible booking.</p>
            </div>
            <p className="flex items-center gap-2 text-xs font-semibold text-neutral-500">
              <Clock3 className="size-4 text-[#ff3535]" /> Offers are available while supplies last
            </p>
          </div>

          <div className="mt-9 grid gap-6 lg:grid-cols-3">
            {promotions.map((promotion) => (
              <article key={promotion.code} className="group overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className={`relative h-52 overflow-hidden ${promotion.tone}`}>
                  <Image src={promotion.image} alt={promotion.title} fill className="object-cover transition duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                  <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-bold text-[#253c95] shadow-sm">
                    {promotion.category}
                  </span>
                  <span className="absolute bottom-4 left-4 text-2xl font-extrabold text-white">{promotion.discount}</span>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-extrabold text-neutral-900">{promotion.title}</h3>
                  <p className="mt-2 min-h-10 text-sm leading-6 text-neutral-500">{promotion.description}</p>
                  <div className="mt-5 flex items-center justify-between rounded-2xl border border-dashed border-red-200 bg-red-50/60 p-3">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Promo code</p>
                      <p className="mt-1 font-mono text-sm font-extrabold tracking-wider text-[#ff3535]">{promotion.code}</p>
                    </div>
                    <span className="grid size-9 place-items-center rounded-full bg-white text-emerald-600 shadow-sm"><Check className="size-4" /></span>
                  </div>
                  <div className="mt-5 flex items-center justify-between">
                    <p className="flex items-center gap-2 text-xs text-neutral-500">
                      <CalendarDays className="size-4 text-[#ff3535]" /> Until {promotion.validUntil}
                    </p>
                    <Link href="/categories" className="text-xs font-bold text-[#ff3535] hover:underline">View rentals</Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-8">
          <div className="rounded-[32px] border border-red-100 bg-white p-7 shadow-sm sm:p-10">
            <div className="text-center">
              <p className="text-sm font-bold text-[#ff3535]">Why book a Rentiq deal?</p>
              <h2 className="mt-2 text-3xl font-extrabold text-[#253c95]">Promotions without surprises</h2>
            </div>
            <div className="mt-10 grid gap-8 md:grid-cols-3">
              {benefits.map(({ icon: Icon, title, text }) => (
                <div key={title} className="text-center">
                  <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-red-50 text-[#ff3535]"><Icon className="size-6" /></span>
                  <h3 className="mt-4 font-extrabold text-neutral-900">{title}</h3>
                  <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-neutral-500">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-20 pt-6 sm:px-8">
          <div className="flex flex-col items-center justify-between gap-6 rounded-3xl bg-gradient-to-r from-[#fff0f0] to-[#f3f5ff] px-7 py-10 text-center sm:px-10 lg:flex-row lg:text-left">
            <div>
              <h2 className="text-2xl font-extrabold text-[#253c95]">Have something people need?</h2>
              <p className="mt-2 text-sm text-neutral-500">Become a vendor and create your own promotion for thousands of renters.</p>
            </div>
            <Link href="/register" className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#253c95] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#1b2e77]">
              Become a vendor <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
