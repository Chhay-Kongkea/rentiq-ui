import Link from "next/link";
import {
  Home,
  Tag,
  RefreshCcw,
  Globe,
  Menu,
  Search,
  ArrowLeft,
  CalendarDays,
  Zap,
  MessageSquare,
  MapPin,
  Quote,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Lock,
  Headset,
  ImageIcon,
  MessageCircle,
  Share2,
  Camera,
  Music2,
  PlayCircle,
} from "lucide-react";

type PriceLine = {
  label: string;
  amount: string;
};

const PRICE_LINES: PriceLine[] = [
  { label: "Rental Fee ($45/day x 3)", amount: "$135.00" },
  { label: "Rentiq Service Fee", amount: "$12.50" },
  { label: "Damage Protection", amount: "$8.00" },
];

export default function OfferDetailPage({
  params,
}: {
  params: { id: string; offerId: string };
}) {
  return (
    <div className="min-h-screen bg-[#F2F4F7] text-[#1A2340]">
      {/* <SiteHeader />
      <SearchBar /> */}

      <main className="mx-auto max-w-6xl px-6 pb-20 pt-8">
        <Link
          href={`/requests/${params.id}`}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#1A2340]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Request Details
        </Link>

        <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
          <span className="text-[#1A2E6B]">Offer from </span>
          <span className="text-[#E8402C]">Tith Cholna</span>
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Specialized Pro Renter with 100+ successful transactions.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="rounded-2xl bg-white p-6 shadow-[0_4px_24px_rgba(20,30,60,0.06)] sm:p-8">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 shrink-0 rounded-full bg-gray-200" />
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-base font-bold text-[#1A2340]">
                      Tith Cholna
                    </p>
                    <span className="rounded-full bg-[#D6F5E7] px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-[#0F9D58]">
                      TOP OWNER
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <CalendarDays className="h-3.5 w-3.5" />
                      Member since 2021
                    </span>
                    <span className="flex items-center gap-1">
                      <Zap className="h-3.5 w-3.5 text-[#E8402C]" />
                      98% Response rate
                    </span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="flex w-fit items-center gap-2 rounded-lg border border-[#E8402C] px-4 py-2 text-xs font-semibold text-[#E8402C] hover:bg-[#FBF4F3]"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                Message Owner
              </button>
            </div>

            <div className="mt-6 grid gap-6 border-t border-gray-100 pt-6 sm:grid-cols-2">
              <div>
                <p className="flex items-center gap-1 text-[11px] font-bold tracking-wide text-gray-400">
                  <MapPin className="h-3.5 w-3.5" />
                  PICKUP LOCATION
                </p>
                <p className="mt-1 text-sm font-semibold text-[#1A2340]">
                  Downtown Manhattan, NY
                </p>
                <p className="text-xs text-gray-500">
                  Within 0.5 miles of Wall Street
                </p>
              </div>
              <div>
                <p className="flex items-center gap-1 text-[11px] font-bold tracking-wide text-[#E8402C]">
                  <CalendarDays className="h-3.5 w-3.5" />
                  AVAILABLE DATES
                </p>
                <p className="mt-1 text-sm font-semibold text-[#1A2340]">
                  Oct 12 — Oct 15
                </p>
                <p className="text-xs text-gray-500">3 Full days (72 hours)</p>
              </div>
            </div>

            <div className="relative mt-6 rounded-r-lg border-l-4 border-[#E8402C] bg-[#F7F9FE] px-5 py-4">
              <Quote className="absolute -left-1.5 -top-1 h-5 w-5 fill-[#E8402C] text-[#E8402C]" />
              <p className="pl-3 text-sm italic text-gray-600">
                &ldquo;Hi there! I have the Sony A7R IV available for your
                requested dates. It&apos;s in mint condition and I&apos;ve
                just included two extra batteries and a 128GB SD card at no
                extra cost to make sure your shoot goes perfectly. Pickup is
                flexible between 8 AM and 10 PM. Looking forward to helping
                you out!&rdquo;
              </p>
            </div>

            <div className="mt-8">
              <p className="text-sm font-semibold text-[#1A2340]">
                Attached Photos
              </p>
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div className="col-span-2 row-span-2 flex aspect-[4/3] items-center justify-center rounded-xl bg-gray-200 sm:col-span-1 sm:row-span-2 sm:aspect-auto sm:h-full">
                  <ImageIcon className="h-8 w-8 text-gray-400" />
                </div>
                <div className="flex aspect-square items-center justify-center rounded-xl bg-gray-200">
                  <ImageIcon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="relative flex aspect-square items-center justify-center rounded-xl bg-gray-300">
                  <ImageIcon className="h-6 w-6 text-gray-400" />
                  <span className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/50 text-sm font-bold text-white">
                    +3 More
                  </span>
                </div>
              </div>
            </div>
          </div>

          <aside className="h-fit rounded-2xl bg-white p-6 shadow-[0_4px_24px_rgba(20,30,60,0.06)]">
            <p className="text-sm font-bold text-[#1A2340]">
              Price Breakdown
            </p>
            <div className="mt-4 space-y-3">
              {PRICE_LINES.map((line) => (
                <div
                  key={line.label}
                  className="flex items-center justify-between text-sm text-gray-600"
                >
                  <span>{line.label}</span>
                  <span className="font-medium text-[#1A2340]">
                    {line.amount}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
              <span className="text-sm font-bold text-[#1A2340]">
                Total Price
              </span>
              <span className="text-2xl font-extrabold text-[#E8402C]">
                $155.50
              </span>
            </div>

            <button
              type="button"
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#E8402C] py-3 text-sm font-semibold text-white hover:bg-[#d6371f]"
            >
              Accept Offer
              <CheckCircle2 className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 py-3 text-sm font-semibold text-[#1A2340] hover:bg-gray-50"
            >
              Decline Offer
            </button>

            <div className="mt-5 flex gap-3 rounded-xl border border-gray-100 bg-[#F7F9FE] p-4">
              <ShieldCheck className="h-5 w-5 shrink-0 text-[#1A2E6B]" />
              <div>
                <p className="text-xs font-bold text-[#1A2340]">
                  RentDirect Guarantee
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Your payment is held securely and only released 24 hours
                  after you receive the item.
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <Lock className="h-3.5 w-3.5" />
                Secure Payment
              </span>
              <span className="flex items-center gap-1">
                <Headset className="h-3.5 w-3.5" />
                24/7 Support
              </span>
            </div>
          </aside>
        </div>
      </main>
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
