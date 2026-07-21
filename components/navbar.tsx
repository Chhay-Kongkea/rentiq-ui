"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Lucide Icons
import {
  Search,
  Globe,
  Menu,
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

export default function Navbar() {
  const pathname = usePathname();
  const [darkMode, setDarkMode] = useState(false);

  // Toggle this to switch between Logged In / Logged Out states
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Helper to check active tab based on current route
  const isActive = (path: string) => pathname === path;

  return (
    <header className="w-full border-b border-gray-100 bg-white px-4 py-3 md:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-4">
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
              <div className="relative flex size-7 items-center justify-center">
                <img
                  src="/img/image 3.png"
                  alt="Homes"
                  className="size-6 object-contain"
                />
              </div>
              <span>Homes</span>
            </Link>

            {/* Deals Link */}
            <Link
              href="/deals"
              className={`group flex items-center gap-2 text-base transition-colors ${
                isActive("/deals")
                  ? "font-semibold text-neutral-900"
                  : "font-medium text-neutral-400 hover:text-neutral-600"
              }`}
            >
              <div className="relative flex size-7 items-center justify-center">
                <img
                  src="/img/image 2.png"
                  alt="Deals"
                  className="size-6 object-contain"
                />
              </div>
              <span>Deals</span>
            </Link>

            {/* Request Link */}
            <Link
              href="/request"
              className={`group flex items-center gap-2 text-base transition-colors ${
                isActive("/request")
                  ? "font-semibold text-neutral-900"
                  : "font-medium text-neutral-400 hover:text-neutral-600"
              }`}
            >
              <div className="relative flex size-7 items-center justify-center">
                <img
                  src="/img/image 4.png"
                  alt="Request"
                  className="size-6 object-contain"
                />
              </div>
              <span>Request</span>
            </Link>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Language Selector"
              className="flex size-9 items-center justify-center rounded-full bg-gray-200 text-gray-700 transition-colors hover:bg-gray-300"
            >
              <Globe className="size-4" />
            </button>

            {/* Hamburger Dropdown Menu Integration */}
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <button
                    type="button"
                    aria-label="Main Menu"
                    className="..."
                  />
                }
              >
                <MenuIcon />
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-72 rounded-2xl border-gray-100 p-0 shadow-xl"
              >
                {!isLoggedIn ? (
                  /* ---------------- LOGGED OUT VERSION ---------------- */
                  <div className="text-sm text-gray-800">
                    <div className="flex flex-col px-4 py-3 font-semibold">
                      <Link
                        href="/login"
                        className="py-1.5 transition-colors hover:text-red-600"
                      >
                        Log in
                      </Link>
                      <Link
                        href="/register"
                        className="py-1.5 font-normal text-gray-700 transition-colors hover:text-red-600"
                      >
                        Sign up
                      </Link>
                    </div>

                    <DropdownMenuSeparator className="m-0 bg-gray-100" />

                    <DropdownMenuGroup className="p-1.5">
                      <DropdownMenuItem className="cursor-pointer gap-3 rounded-lg px-3 py-2.5 text-gray-700 focus:bg-gray-50 focus:text-gray-900">
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

                    <DropdownMenuGroup className="p-1.5">
                      <DropdownMenuItem className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 text-gray-700 focus:bg-gray-50">
                        <div className="flex items-center gap-3">
                          <Globe className="size-4 text-gray-600" />
                          <span>Language</span>
                        </div>
                        <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs font-semibold text-gray-500">
                          KH
                        </span>
                      </DropdownMenuItem>

                      {/* Regular div wrapper prevents button-in-button hydration error with Switch */}
                      <div className="flex items-center justify-between rounded-lg px-3 py-2.5 text-gray-700 hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                          <Moon className="size-4 text-gray-600" />
                          <span className="text-sm">Dark Mode</span>
                        </div>
                        <Switch
                          checked={darkMode}
                          onCheckedChange={setDarkMode}
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
                    <DropdownMenuLabel className="m-0 p-4 font-normal">
                      <div className="flex items-center gap-3">
                        <div className="flex size-11 items-center justify-center rounded-full bg-rose-100 font-semibold text-red-900">
                          ST
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1">
                            <span className="font-bold text-gray-900">
                              Saroth Tola
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

                    <DropdownMenuSeparator className="m-0 bg-gray-100" />

                    <DropdownMenuGroup className="p-1.5">
                      <DropdownMenuItem className="cursor-pointer gap-3 rounded-lg px-3 py-2.5 font-semibold text-gray-900 focus:bg-gray-50">
                        <Store className="size-4 text-red-600" />
                        <span>Become a Vendor</span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator className="m-0 bg-gray-100" />

                    <DropdownMenuGroup className="p-1.5">
                      <DropdownMenuItem className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 text-gray-700 focus:bg-gray-50">
                        <div className="flex items-center gap-3">
                          <Calendar className="size-4 text-gray-600" />
                          <span>My Bookings</span>
                        </div>
                        <span className="flex size-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                          2
                        </span>
                      </DropdownMenuItem>

                      <DropdownMenuItem className="cursor-pointer gap-3 rounded-lg px-3 py-2.5 text-gray-700 focus:bg-gray-50">
                        <Heart className="size-4 text-gray-600" />
                        <span>Saved Wishlist</span>
                      </DropdownMenuItem>

                      <DropdownMenuItem className="cursor-pointer gap-3 rounded-lg px-3 py-2.5 text-gray-700 focus:bg-gray-50">
                        <Bell className="size-4 text-gray-600" />
                        <span>Notifications</span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator className="m-0 bg-gray-100" />

                    <DropdownMenuGroup className="p-1.5">
                      <DropdownMenuItem className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 text-gray-700 focus:bg-gray-50">
                        <div className="flex items-center gap-3">
                          <Globe className="size-4 text-gray-600" />
                          <span>Language</span>
                        </div>
                        <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs font-semibold text-gray-500">
                          KH
                        </span>
                      </DropdownMenuItem>

                      {/* Regular div wrapper prevents button-in-button hydration error with Switch */}
                      <div className="flex items-center justify-between rounded-lg px-3 py-2.5 text-gray-700 hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                          <Moon className="size-4 text-gray-600" />
                          <span className="text-sm">Dark Mode</span>
                        </div>
                        <Switch
                          checked={darkMode}
                          onCheckedChange={setDarkMode}
                          className="data-[state=checked]:bg-red-600"
                        />
                      </div>

                      <DropdownMenuItem className="cursor-pointer gap-3 rounded-lg px-3 py-2.5 text-gray-700 focus:bg-gray-50">
                        <Headphones className="size-4 text-gray-600" />
                        <span>Contact support</span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator className="m-0 bg-gray-100" />

                    <DropdownMenuGroup className="p-1.5">
                      <DropdownMenuItem
                        onClick={() => setIsLoggedIn(false)}
                        className="cursor-pointer rounded-lg px-3 py-2 font-semibold text-red-600 focus:bg-red-50 focus:text-red-600"
                      >
                        Log out
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* BOTTOM FLOATING SEARCH BAR */}
        <div className="flex justify-center pb-4 pt-1">
          <div className="flex w-full max-w-3xl items-center justify-between rounded-full border border-gray-300 bg-white py-1.5 pl-6 pr-2 shadow-sm transition-shadow hover:shadow-md">
            {/* Categories */}
            <button
              type="button"
              className="flex flex-1 flex-col items-start text-left"
            >
              <span className="text-xs font-semibold text-neutral-800">
                Categories
              </span>
              <span className="text-xs text-neutral-400">
                Many choices for you
              </span>
            </button>

            {/* Divider */}
            <div className="h-8 w-px bg-gray-300" />

            {/* Where */}
            <button
              type="button"
              className="flex flex-1 flex-col items-start px-6 text-left"
            >
              <span className="text-xs font-semibold text-neutral-800">
                Where
              </span>
              <span className="text-xs text-neutral-400">
                Search destinations
              </span>
            </button>

            {/* Divider */}
            <div className="h-8 w-px bg-gray-300" />

            {/* When */}
            <button
              type="button"
              className="flex flex-1 flex-col items-start px-6 text-left"
            >
              <span className="text-xs font-semibold text-neutral-800">
                When
              </span>
              <span className="text-xs text-neutral-400">Add dates</span>
            </button>

            {/* Search Button */}
            <button
              type="button"
              aria-label="Search"
              className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#FF2B2B] text-white transition-all hover:bg-red-600 active:scale-95"
            >
              <Search className="size-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
