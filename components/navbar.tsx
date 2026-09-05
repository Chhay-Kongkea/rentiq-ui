// components/navbar.tsx
"use client";

import React, { useState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useSession } from "next-auth/react";
import { logout } from "@/app/actions/auth";
import { loginWithKeycloak } from "@/app/(auth)/login/actions";
import { useGetCategoriesQuery } from "@/redux/services/categoryApi";
import { useGetMyBookingsQuery } from "@/redux/services/renterApi";

// Lucide Icons
import {
  Search,
  Globe,
  Home,
  HelpCircle,
  Moon,
  Headphones,
  FileText,
  Store,
  Calendar,
  Heart,
  Bell,
  CheckCircle2,
  MenuIcon,
  Clock,
  LayoutGrid,
  MapPin,
} from "lucide-react";

// Shadcn UI Components
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";


const CAMBODIA_PROVINCES = [
  "Banteay Meanchey", "Battambang", "Kampong Cham", "Kampong Chhnang",
  "Kampong Speu", "Kampong Thom", "Kampot", "Kandal", "Kep", "Koh Kong",
  "Kratie", "Mondulkiri", "Oddar Meanchey", "Pailin", "Phnom Penh",
  "Preah Sihanouk", "Preah Vihear", "Prey Veng", "Pursat", "Ratanakiri",
  "Siem Reap", "Stung Treng", "Svay Rieng", "Takeo", "Tboung Khmum",
] as const;
function getInitials(name?: string | null, email?: string | null): string {
  const words = name?.trim().split(/\s+/).filter(Boolean) ?? [];
  if (words.length >= 2) {
    return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
  }
  if (words.length === 1 && words[0].length >= 2) {
    return words[0].slice(0, 2).toUpperCase();
  }

  const emailName = email?.split("@")[0].replace(/[^a-zA-Z0-9]/g, "") ?? "";
  return (emailName.slice(0, 2) || "US").toUpperCase();
}

function KeycloakLoginButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="py-1.5 text-left transition-colors hover:text-red-600 disabled:cursor-wait disabled:text-gray-400"
    >
      {pending ? "Redirecting..." : "Log in"}
    </button>
  );
}
export default function Navbar() {
const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const darkMode = theme === "dark";
  const [selectedProvince, setSelectedProvince] = useState("All provinces");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedCategoryName, setSelectedCategoryName] = useState("All categories");
  const [selectedTiming, setSelectedTiming] = useState("Anytime");
  const { data: searchCategories = [] } = useGetCategoriesQuery();
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated";
  const isVendor = session?.user?.role?.toUpperCase() === "VENDOR";
  const displayName = session?.user?.name ?? session?.user?.email ?? "User";
  const initials = getInitials(session?.user?.name, session?.user?.email);

  // Helper to check active tab based on current route
  const isActive = (path: string) => pathname === path;

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (selectedProvince !== "All provinces") params.set("location", selectedProvince);
    if (selectedCategoryId) params.set("categoryId", selectedCategoryId);
    if (selectedTiming !== "Anytime") params.set("when", selectedTiming);
    const queryString = params.toString();
    router.push(queryString ? `/items?${queryString}` : "/items");
  }

  return (
    <header className="pt-8 w-full border-b border-gray-100 bg-white px-4 py-3 md:px-8 ml-5 mr-">
      <div className="pb-4 mx-auto flex max-w-7xl flex-col gap-4">
        {/* TOP BAR */}
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1.5">
            <img
              src="/img/rentiq.png"
              alt="Rentiq Logo"
              className="h-8 w-auto object-contain"
            />
          </Link>

          {/* Center Navigation Tabs (URL Driven) */}
          <nav className="hidden items-center gap-8 md:flex">
            {/* Homes Link */}
            <Link
              href="/"
              className={`group flex items-center gap-2 text-base transition-colors ${
                isActive("/")
                  ? "font-semibold text-neutral-900"
                  : "font-medium text-neutral-400 hover:text-neutral-600"
              }`}
            >
              <div className="relative flex size-12 items-center justify-center">
                <img
                  src="/img/image 3.png"
                  alt="Homes"
                  className="size-10 object-contain"
                />
              </div>
              <span>Homes</span>
            </Link>

            {/* Deals Link */}
            <Link
              href="/deals"
              className={`group flex items-center gap-2 text-base transition-colors ${
                pathname.startsWith("/deals")
                  ? "font-semibold text-neutral-900"
                  : "font-medium text-neutral-400 hover:text-neutral-600"
              }`}
            >
              <div className="relative flex size-12 items-center justify-center">
                <img
                  src="/img/image 2.png"
                  alt="Deals"
                  className="size-10 object-contain"
                />
              </div>
              <span>Deals</span>
            </Link>

            {/* Request Link */}
            <Link
              href="/user/requests/myrequests"
              className={`group flex items-center gap-2 text-base transition-colors ${
                pathname.startsWith("/item-requests") || pathname.startsWith("/user/requests")
                  ? "font-semibold text-neutral-900"
                  : "font-medium text-neutral-400 hover:text-neutral-600"
              }`}
            >
              <div className="relative flex size-12 items-center justify-center">
                <img
                  src="/img/image 4.png"
                  alt="Request"
                  className="size-10 object-contain"
                />
              </div>
              <span>Request</span>
            </Link>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <Link
                href="/user/profile"
                aria-label={`Open ${displayName} profile`}
                title={displayName}
                className="flex size-9 items-center justify-center rounded-full bg-rose-100 text-xs font-bold uppercase text-red-900 transition-colors hover:bg-rose-200"
              >
                {initials}
              </Link>
            ) : null}

            {/* Hamburger Dropdown Menu Integration */}
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <button
                    type="button"
                    aria-label="Main Menu"
                    className="flex size-10 items-center justify-center rounded-full border border-gray-300 bg-white transition-shadow hover:shadow-md"
                  >
                    <MenuIcon className="size-5 text-gray-700" />
                  </button>
                }
              />

              <DropdownMenuContent
                align="end"
                className="w-72 rounded-2xl border-gray-100 p-0 shadow-xl"
              >
                {!isLoggedIn ? (
                  /* ---------------- LOGGED OUT VERSION ---------------- */
                  <div className="text-sm text-gray-800">
                    <div className="flex flex-col px-4 py-3 font-semibold">
                      <form action={loginWithKeycloak}>
                        <KeycloakLoginButton />
                      </form>
                      <Link
                        href="/register"
                        className="py-1.5 font-normal text-gray-700 transition-colors hover:text-red-600"
                      >
                        Sign up
                      </Link>
                    </div>

                    <DropdownMenuSeparator className="m-0 bg-gray-100" />

                    <DropdownMenuGroup>
                      <DropdownMenuItem render={<Link href="/register" />} className="cursor-pointer gap-3 rounded-lg px-3 py-2.5 text-gray-700 focus:bg-gray-50 focus:text-gray-900">
                        <Home className="size-4 text-gray-600" />
                        <span>Become a vendor</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer gap-3 rounded-lg px-3 py-2.5 text-gray-700 focus:bg-gray-50 focus:text-gray-900">
                        <HelpCircle className="size-4 text-gray-600" />
                        <span>Why Rentiq?</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer gap-3 rounded-lg px-3 py-2.5 text-gray-700 focus:bg-gray-50 focus:text-gray-900">
                        <HelpCircle className="size-4 text-gray-600" />
                        <span>Help & FAQs</span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator className="m-0 bg-gray-100" />

                    <DropdownMenuGroup>
                      <DropdownMenuItem className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 text-gray-700 focus:bg-gray-50">
                        <div className="flex items-center gap-3">
                          <Globe className="size-4 text-gray-600" />
                          <span>Language</span>
                        </div>
                        <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs font-semibold text-gray-500">
                          KH
                        </span>
                      </DropdownMenuItem>

                      <div className="flex items-center justify-between rounded-lg px-3 py-2.5 text-gray-700 hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                          <Moon className="size-4 text-gray-600" />
                          <span className="text-sm">Dark Mode</span>
                        </div>
                        <Switch
                          checked={darkMode}
                          onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                          className="data-[state=checked]:bg-red-600"
                        />
                      </div>

                      <DropdownMenuItem className="cursor-pointer gap-3 rounded-lg px-3 py-2.5 text-gray-700 focus:bg-gray-50">
                        <Headphones className="size-4 text-gray-600" />
                        <span>Contact support</span>
                      </DropdownMenuItem>

                      <DropdownMenuItem className="cursor-pointer gap-3 rounded-lg px-3 py-2.5 text-gray-700 focus:bg-gray-50">
                        <FileText className="size-4 text-gray-600" />
                        <span>Legal</span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </div>
                ) : (
                  /* ---------------- LOGGED IN VERSION ---------------- */
                  <div className="text-sm text-gray-800">
                    <DropdownMenuGroup>
                      <DropdownMenuLabel className="m-0 p-4 font-normal">
                      <div className="flex items-center gap-3">
                        <div className="flex size-11 items-center justify-center rounded-full bg-rose-100 font-semibold text-red-900">
                          {initials}
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1">
                            <span className="font-bold text-gray-900">
                              {displayName}
                            </span>
                            <CheckCircle2 className="size-4 fill-red-600 text-white" />
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <span>Renter Account</span>
                            <span className="size-1 rounded-full bg-gray-300" />
                            <span className="font-medium text-red-600">
                              Verified
                            </span>
                          </div>
                        </div>
                      </div>
                      </DropdownMenuLabel>
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator className="m-0 bg-gray-100" />

                    <DropdownMenuGroup>
                      <DropdownMenuItem onClick={() => router.push(isVendor ? "/vendor/dashboard" : "/user/become-vendor")} className="cursor-pointer gap-3 rounded-lg px-3 py-2.5 font-semibold text-gray-900 focus:bg-gray-50">
                        <Store className="size-4 text-red-600" />
                        <span>{isVendor ? "Vendor dashboard" : "Become a Vendor"}</span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator className="m-0 bg-gray-100" />

                    <DropdownMenuGroup>
                      <DropdownMenuItem render={<Link href="/user/profile/my-booking" />} className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 text-gray-700 focus:bg-gray-50">
                        <div className="flex items-center gap-3">
                          <Calendar className="size-4 text-gray-600" />
                          <span>My Bookings</span>
                        </div>
                        {bookings.length > 0 ? <span className="flex min-w-5 items-center justify-center rounded-full bg-red-600 px-1.5 py-0.5 text-[10px] font-bold text-white">{bookings.length}</span> : null}
                      </DropdownMenuItem>

                      <DropdownMenuItem onClick={() => router.push("/user/favorites")} className="cursor-pointer gap-3 rounded-lg px-3 py-2.5 text-gray-700 focus:bg-gray-50">
                        <Heart className="size-4 text-gray-600" />
                        <span>Saved Wishlist</span>
                      </DropdownMenuItem>

                      <DropdownMenuItem className="cursor-pointer gap-3 rounded-lg px-3 py-2.5 text-gray-700 focus:bg-gray-50">
                        <Bell className="size-4 text-gray-600" />
                        <span>Notifications</span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator className="m-0 bg-gray-100" />

                    <DropdownMenuGroup>
                      <DropdownMenuItem className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 text-gray-700 focus:bg-gray-50">
                        <div className="flex items-center gap-3">
                          <Globe className="size-4 text-gray-600" />
                          <span>Language</span>
                        </div>
                        <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs font-semibold text-gray-500">
                          KH
                        </span>
                      </DropdownMenuItem>

                      <div className="flex items-center justify-between rounded-lg px-3 py-2.5 text-gray-700 hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                          <Moon className="size-4 text-gray-600" />
                          <span className="text-sm">Dark Mode</span>
                        </div>
                        <Switch
                          checked={darkMode}
                          onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                          className="data-[state=checked]:bg-red-600"
                        />
                      </div>

                      <DropdownMenuItem className="cursor-pointer gap-3 rounded-lg px-3 py-2.5 text-gray-700 focus:bg-gray-50">
                        <Headphones className="size-4 text-gray-600" />
                        <span>Contact support</span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator className="m-0 bg-gray-100" />

                    <DropdownMenuGroup>
                      <form action={logout}>
                        <button
                          type="submit"
                          className="w-full cursor-pointer rounded-lg px-3 py-2 text-left font-semibold text-red-600 hover:bg-red-50"
                        >
                          Log out
                        </button>
                      </form>
                    </DropdownMenuGroup>
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* BOTTOM FLOATING SEARCH BAR */}
        <div className={`${pathname.startsWith("/user/profile") || pathname.startsWith("/user/become-vendor") ? "hidden" : "flex"} justify-center pb-4 pt-1`}>
          <form onSubmit={handleSearch} className="flex w-full max-w-3xl items-center justify-between rounded-full border border-gray-300 bg-white py-1.5 pl-6 pr-2 shadow-sm transition-shadow hover:shadow-md focus-within:border-[#253C95]/40 focus-within:shadow-md">
            <DropdownMenu>
              <DropdownMenuTrigger render={<button type="button" className="flex min-w-0 flex-1 cursor-pointer flex-col items-start text-left focus:outline-none"><span className="text-xs font-semibold text-neutral-800">Categories</span><span className="max-w-36 truncate text-xs text-neutral-400">{selectedCategoryName}</span></button>} />
              <DropdownMenuContent align="start" className="w-60 rounded-2xl p-1.5 shadow-xl">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="px-3 py-2 text-xs font-semibold text-gray-400">Select Category</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-gray-100" />
                  <DropdownMenuItem onClick={() => { setSelectedCategoryId(""); setSelectedCategoryName("All categories"); }} className="cursor-pointer gap-3 rounded-lg px-3 py-2 text-gray-700 focus:bg-gray-50"><LayoutGrid className="size-4 text-[#F73030]" /><span>All categories</span></DropdownMenuItem>
                  {searchCategories.filter((category) => category.active).map((category) => (
                    <DropdownMenuItem key={category.id} onClick={() => { setSelectedCategoryId(String(category.id)); setSelectedCategoryName(category.name); }} className="cursor-pointer gap-3 rounded-lg px-3 py-2 text-gray-700 focus:bg-gray-50"><Store className="size-4 text-gray-600" /><span>{category.name}</span></DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="mx-4 h-8 w-px bg-gray-300" />
            <DropdownMenu>
              <DropdownMenuTrigger render={<button type="button" className="flex min-w-0 flex-[1.5] cursor-pointer flex-col items-start text-left focus:outline-none"><span className="text-xs font-semibold text-neutral-800">Where</span><span className="max-w-44 truncate text-xs text-neutral-400">{selectedProvince}</span></button>} />
              <DropdownMenuContent align="center" className="max-h-80 w-60 overflow-y-auto rounded-2xl p-1.5 shadow-xl">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="px-3 py-2 text-xs font-semibold text-gray-400">Select Province</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-gray-100" />
                  <DropdownMenuItem onClick={() => setSelectedProvince("All provinces")} className="cursor-pointer gap-3 rounded-lg px-3 py-2 text-gray-700 focus:bg-gray-50"><MapPin className="size-4 text-[#F73030]" /><span>All provinces</span></DropdownMenuItem>
                  {CAMBODIA_PROVINCES.map((province) => (
                    <DropdownMenuItem key={province} onClick={() => setSelectedProvince(province)} className="cursor-pointer gap-3 rounded-lg px-3 py-2 text-gray-700 focus:bg-gray-50"><MapPin className="size-4 text-gray-500" /><span>{province}</span></DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="mx-4 h-8 w-px bg-gray-300" />
            <DropdownMenu>
              <DropdownMenuTrigger render={<button type="button" className="flex min-w-0 flex-1 cursor-pointer flex-col items-start text-left focus:outline-none"><span className="text-xs font-semibold text-neutral-800">When</span><span className="text-xs text-neutral-400">{selectedTiming}</span></button>} />
              <DropdownMenuContent align="end" className="w-56 rounded-2xl p-1.5 shadow-xl">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="px-3 py-2 text-xs font-semibold text-gray-400">Duration / Timing</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-gray-100" />
                  {["Anytime", "This Weekend", "Next Month"].map((timing, index) => (
                    <DropdownMenuItem key={timing} onClick={() => setSelectedTiming(timing)} className="cursor-pointer gap-3 rounded-lg px-3 py-2 text-gray-700 focus:bg-gray-50">{index === 0 ? <Clock className="size-4 text-[#F73030]" /> : <Calendar className="size-4 text-gray-600" />}<span>{timing}</span></DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <button type="submit" aria-label="Search" className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#F73030] text-white transition-all hover:bg-[#de2b2b] active:scale-95"><Search className="size-4 stroke-[2.5]" /></button>
          </form>
        </div>
      </div>
    </header>
  );
}



