import Link from "next/link";
import {
  Home,
  Tag,
  RefreshCcw,
  Globe,
  Menu,
  Search,
  CheckCircle2,
  Camera,
  Banknote,
  CalendarDays,
  MapPin,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
  Mic2,
  Aperture,
  MessageCircle,
  Share2,
  Music2,
  PlayCircle,
} from "lucide-react";
import SiteFooter from "@/components/requestsComponents/footer";

type RequestSummary = {
  itemCategory: string;
  budgetRange: string;
  rentalDates: string;
  location: string;
};

// Swap this for the real submitted request (server data / query params / DB lookup).
const requestSummary: RequestSummary = {
  itemCategory: "Cinema Camera",
  budgetRange: "$80 – $120 / day",
  rentalDates: "Oct 12 – Oct 15",
  location: "Sen Sok, Phnom Penh",
};

const steps = [
  {
    number: 1,
    title: "Review Offers",
    description: "Compare rates and equipment quality from local owners.",
  },
  {
    number: 2,
    title: "Chat with Owners",
    description: "Ask questions about maintenance and pickup logistics.",
  },
  {
    number: 3,
    title: "Confirm & Pay",
    description: "Secure your booking through our protected payment portal.",
  },
];

export default function RequestSuccessPage() {
  return (
    <div className="min-h-screen bg-[#F2F4F7] text-[#1A2340]">
      <SiteHeader />
      <SearchBar />

      <main className="mx-auto max-w-4xl px-6 pb-8 pt-14 text-center">
        <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
          <span className="absolute inset-0 rounded-full bg-[#FBE3DF]" />
          <span className="absolute right-1 top-1 h-4 w-4 rounded-full bg-[#BFD6F6]" />
          <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-[#E8402C]">
            <CheckCircle2 className="h-9 w-9 text-white" strokeWidth={2.5} />
          </span>
        </div>

        <h1 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl">
          <span className="text-[#1A2E6B]">Request Submitted </span>
          <span className="text-[#E8402C]">Successfully!</span>
        </h1>
        <p className="mt-3 text-sm text-gray-500 sm:text-base">
          Owners in your area have been notified. You&apos;ll start receiving
          offers soon.
        </p>

        <div className="mt-10 overflow-hidden rounded-2xl border border-[#F3D9D4] bg-white text-left shadow-[0_4px_24px_rgba(20,30,60,0.06)]">
          <div className="border-b border-[#F3D9D4] bg-[#FBF4F3] px-6 py-3">
            <p className="text-xs font-bold tracking-wide text-[#1A2E6B]">
              REQUEST SUMMARY
            </p>
          </div>
          <div className="grid gap-6 px-6 py-6 sm:grid-cols-2 sm:gap-x-10">
            <SummaryRow
              icon={Camera}
              label="Item Category"
              value={requestSummary.itemCategory}
            />
            <SummaryRow
              icon={Banknote}
              label="Budget Range"
              value={requestSummary.budgetRange}
            />
            <SummaryRow
              icon={CalendarDays}
              label="Rental Dates"
              value={requestSummary.rentalDates}
            />
            <SummaryRow
              icon={MapPin}
              label="Location"
              value={requestSummary.location}
            />
          </div>
        </div>

        <h2 className="mt-14 text-xl font-bold text-[#1A2340]">
          What&apos;s Next?
        </h2>

        <div className="relative mt-8 grid gap-10 sm:grid-cols-3 sm:gap-6">
          <div className="pointer-events-none absolute left-0 right-0 top-6 hidden h-px bg-[#F1C7BE] sm:block" />
          {steps.map((step) => (
            <div key={step.number} className="relative flex flex-col items-center">
              <span className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-[#E8402C] text-lg font-bold text-white">
                {step.number}
              </span>
              <p className="mt-3 text-sm font-semibold text-[#1A2340]">
                {step.title}
              </p>
              <p className="mt-1 max-w-[220px] text-sm text-gray-500">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/requests"
            className="w-full rounded-lg bg-[#E8402C] px-8 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#d6371f] sm:w-auto"
          >
            View My Requests
          </Link>
          <Link
            href="/"
            className="w-full rounded-lg border border-[#1A2E6B] px-8 py-3 text-center text-sm font-semibold text-[#1A2E6B] transition hover:bg-[#1A2E6B]/5 sm:w-auto"
          >
            Back to Home
          </Link>
        </div>

        <div className="mt-14 grid gap-6 pb-16 text-left sm:grid-cols-[2fr_1fr]">
          <PromoBanner />
          <ProtectionCard />
        </div>
      </main>

      
    </div>
  );
}

function SummaryRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#EEF2FC] text-[#1A2E6B]">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-base font-semibold text-[#1A2340]">{value}</p>
      </div>
    </div>
  );
}

function PromoBanner() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#3E6E85]">
      <div className="absolute inset-0 bg-gradient-to-r from-[#2E4F63]/90 via-[#3E6E85]/70 to-[#5F93A8]/40" />
      <div className="absolute -right-6 bottom-0 top-0 hidden w-1/2 items-center justify-center opacity-70 sm:flex">
        <Aperture className="h-40 w-40 text-white/30" strokeWidth={1} />
        <Mic2 className="absolute right-16 top-10 h-16 w-16 text-white/40" strokeWidth={1} />
      </div>
      <div className="relative flex h-full flex-col justify-center gap-3 px-8 py-10 sm:py-14">
        <h3 className="text-2xl font-bold text-white sm:text-3xl">
          Elevate your production
        </h3>
        <p className="max-w-sm text-sm text-white/85">
          Build your dream kit with professional-grade lenses, lighting, and
          audio equipment available for your dates.
        </p>
        <Link
          href="#"
          className="mt-2 inline-flex w-fit items-center gap-2 text-sm font-bold tracking-wide text-white"
        >
          EXPLORE GEAR
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

function ProtectionCard() {
  return (
    <div className="flex flex-col rounded-2xl border border-[#F3D9D4] bg-white px-6 py-8">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FBE3DF]">
        <ShieldCheck className="h-7 w-7 text-[#E8402C]" />
      </span>
      <h3 className="mt-4 text-lg font-bold text-[#1A2340]">
        Renter Protection
      </h3>
      <p className="mt-2 text-sm text-gray-500">
        Every rental is covered by our comprehensive insurance policy, giving
        you peace of mind on every set.
      </p>
      <Link
        href="#"
        className="mt-4 inline-flex w-fit items-center gap-1 text-xs font-bold tracking-wide text-[#E8402C]"
      >
        LEARN MORE
        <ExternalLink className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}

function SiteHeader() {
  const navItems = [
    { label: "Homes", icon: Home },
    { label: "Deals", icon: Tag },
    { label: "Request", icon: RefreshCcw },
  ];

  return (
    <header className="flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4 sm:px-10">
      <Link href="/" className="flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#E8402C] text-lg font-bold text-white">
          R
        </span>
        <span className="text-xl font-bold text-[#E8402C]">Rentiq</span>
      </Link>

      <nav className="hidden items-center gap-10 md:flex">
        {navItems.map(({ label, icon: Icon }) => (
          <Link
            key={label}
            href="#"
            className="flex items-center gap-2 text-gray-700 hover:text-[#1A2340]"
          >
            <Icon className="h-5 w-5 text-[#E8402C]" />
            <span className="text-base">{label}</span>
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Language"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
        >
          <Globe className="h-4 w-4" />
        </button>
        <button
          type="button"
          aria-label="Menu"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
        >
          <Menu className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}

function SearchBar() {
  return (
    <div className="mx-auto max-w-4xl px-6 pt-8">
      <div className="flex flex-col items-stretch divide-y divide-gray-200 rounded-3xl border border-gray-200 bg-white p-2 shadow-sm sm:flex-row sm:items-center sm:divide-x sm:divide-y-0">
        <div className="flex-1 px-6 py-2">
          <p className="text-sm font-semibold">Categories</p>
          <p className="text-sm text-gray-400">Many choices for you</p>
        </div>
        <div className="flex-1 px-6 py-2">
          <p className="text-sm font-semibold">Where</p>
          <p className="text-sm text-gray-400">Search destinations</p>
        </div>
        <div className="flex flex-1 items-center justify-between px-6 py-2">
          <div>
            <p className="text-sm font-semibold">When</p>
            <p className="text-sm text-gray-400">Add dates</p>
          </div>
          <button
            type="button"
            aria-label="Search"
            className="ml-4 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#E8402C] text-white hover:bg-[#d6371f]"
          >
            <Search className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

