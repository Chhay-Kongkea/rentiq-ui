"use client";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPen,
  faCamera,
  faUser,
  faCalendarDays,
  faPhone,
  faEnvelope,
  faLocationDot,
  faShieldHalved,
  faLock,
  faChevronRight,
  faTriangleExclamation,
  faCircleCheck,
  faIdCard,
} from "@fortawesome/free-solid-svg-icons";

export default function UserProfilePage() {
  return (
    <main className="min-h-screen bg-[#f8fafc] px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-7xl">
        {/* Page Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">
              <span className="text-new-blue">My </span>
              <span className="text-new-red">Profile</span>
            </h1>
            <p className="mt-1.5 text-sm text-slate-400">
              Manage your identity and account preferences.
            </p>
          </div>
          <Link
            href="/user/profile/edit-profile"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-new-red px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-600"
          >
            <FontAwesomeIcon icon={faPen} className="h-3.5 w-3.5" />
            Edit Profile
          </Link>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          {/* Main Content Area */}
          <div className="space-y-6 xl:col-span-8">
            {/* Profile Identity */}
            <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="flex flex-col items-center gap-6 sm:flex-row">
                <div className="relative shrink-0">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAts-TvDX1eFNKPD6s2ln01L3lPuM8iGs5KUWgHHoT-G6L6QishiK89gmxQJFIjUDA4iqrlO8Blt5YLd62tlPJFWZtRYrR3zHdomPwZSJTiZnUNQCAJxDsgU4-Mxfz4LtjJwRBcpFIGMO_G0FRh6wV_StTPPfihBIPKogGl18HO62STNEsU7RBYAvf7o01vArzDwN-Mk7ch3zT5bsZRy5jNHX9_qjmfCrYgSHQ_xK-FdYzb-QjEiGuBJlgqwZMcPQ4HEoolzlN181Fo"
                    alt="Profile"
                    className="h-28 w-28 rounded-3xl object-cover sm:h-32 sm:w-32"
                  />
                  <button className="absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded-full border border-slate-100 bg-white shadow-md hover:bg-slate-50">
                    <FontAwesomeIcon
                      icon={faCamera}
                      className="h-3.5 w-3.5 text-slate-600"
                    />
                  </button>
                </div>

                <div className="min-w-0 flex-1 text-center sm:text-left">
                  <div className="mb-2.5 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
                    <h2 className="text-2xl font-bold text-slate-800">
                      Saroth Tola
                    </h2>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                      <FontAwesomeIcon
                        icon={faCircleCheck}
                        className="h-3 w-3"
                      />
                      Verified Account
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-400 sm:justify-start">
                    <span className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faUser} className="h-3.5 w-3.5" />
                      Renter Hub Member
                    </span>
                    <span className="text-slate-300">|</span>
                    <span className="flex items-center gap-2">
                      <FontAwesomeIcon
                        icon={faCalendarDays}
                        className="h-3.5 w-3.5"
                      />
                      Joined June 2024
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Personal Information */}
            <section className="rounded-2xl border border-slate-100 bg-white p-11 shadow-sm">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-new-red-50 text-new-red">
                  <FontAwesomeIcon icon={faIdCard} className="h-4 w-4" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">
                  Personal Information
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {/* Phone Number */}
                <div>
                  <label className="mb-2 block text-xs font-medium text-slate-400">
                    Phone Number
                  </label>
                  <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <FontAwesomeIcon
                        icon={faPhone}
                        className="h-3.5 w-3.5 text-slate-400"
                      />
                      <span className="text-sm font-semibold text-slate-700">
                        +855 96 888 777
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-500">
                      <FontAwesomeIcon
                        icon={faCircleCheck}
                        className="h-3 w-3"
                      />
                      Verified
                    </span>
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="mb-2 block text-xs font-medium text-slate-400">
                    Email Address
                  </label>
                  <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3.5">
                    <div className="flex items-center gap-3 min-w-0">
                      <FontAwesomeIcon
                        icon={faEnvelope}
                        className="h-3.5 w-3.5 shrink-0 text-slate-400"
                      />
                      <span className="truncate text-sm font-semibold text-slate-700">
                        saroth.tola@example.com
                      </span>
                    </div>
                    <span className="ml-2 inline-flex shrink-0 items-center gap-1 text-xs font-bold text-emerald-500">
                      <FontAwesomeIcon
                        icon={faCircleCheck}
                        className="h-3 w-3"
                      />
                      Verified
                    </span>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div>
                  <label className="mb-2 block text-xs font-medium text-slate-400">
                    Emergency Contact
                  </label>
                  <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <FontAwesomeIcon
                        icon={faTriangleExclamation}
                        className="h-3.5 w-3.5 text-slate-400"
                      />
                      <span className="text-sm font-medium text-slate-400">
                        Not set
                      </span>
                    </div>
                    <button className="text-xs font-bold text-new-red-500 hover:underline">
                      Add
                    </button>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="mb-2 block text-xs font-medium text-slate-400">
                    Address
                  </label>
                  <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3.5">
                    <FontAwesomeIcon
                      icon={faLocationDot}
                      className="h-3.5 w-3.5 text-slate-400"
                    />
                    <span className="truncate text-sm font-semibold text-slate-700">
                      Phnom Penh, Cambodia
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6 xl:col-span-4">
            {/* Trust Score */}
            <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-800">
                  Trust Score
                </h3>
                <FontAwesomeIcon
                  icon={faCircleCheck}
                  className="h-4 w-4 text-emerald-500"
                />
              </div>

              <div className="flex flex-col items-center">
                <div className="relative h-40 w-40">
                  <svg
                    className="h-full w-full -rotate-90"
                    viewBox="0 0 160 160"
                  >
                    <circle
                      cx="80"
                      cy="80"
                      r="64"
                      fill="transparent"
                      className="text-slate-100"
                      stroke="currentColor"
                      strokeWidth="12"
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r="64"
                      fill="transparent"
                      className="text-emerald-500"
                      stroke="currentColor"
                      strokeWidth="12"
                      strokeLinecap="round"
                      strokeDasharray="402"
                      strokeDashoffset="20"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-extrabold text-slate-800">
                      95%
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">
                      Excellent
                    </span>
                  </div>
                </div>

                <p className="mt-4 text-center text-sm font-bold text-emerald-500">
                  Excellent! You&apos;re a top-rated member.
                </p>
                <p className="mt-1 text-center text-xs leading-relaxed text-slate-400">
                  Your score is based on verification levels and community
                  feedback.
                </p>
              </div>
            </section>

            {/* Active Holds */}
            <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-800">
                  Active Holds
                </h3>
                <FontAwesomeIcon
                  icon={faLock}
                  className="h-4 w-4 text-slate-400"
                />
              </div>

              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-extrabold text-slate-800">
                  2
                </span>
                <span className="text-xs text-slate-400">/ 3 Total Limit</span>
              </div>

              <div className="mt-4 flex gap-1.5">
                <div className="h-2 w-full rounded-full bg-slate-800" />
                <div className="h-2 w-full rounded-full bg-slate-800" />
                <div className="h-2 w-full rounded-full bg-slate-100" />
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-500">
                  Available: 1 hold
                </span>
                <a
                  href="#"
                  className="flex items-center gap-1 text-xs font-bold text-red-500 hover:underline"
                >
                  View Bookings
                  <FontAwesomeIcon
                    icon={faChevronRight}
                    className="h-2.5 w-2.5"
                  />
                </a>
              </div>
            </section>
          </aside>

          {/* Full-Width Trust Center Section */}
          <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm xl:col-span-12">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              {/* Header Info */}
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-red-100 text-red-500">
                  <FontAwesomeIcon icon={faShieldHalved} className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">
                    Trust Center
                  </h3>
                  <p className="mt-0.5 text-xs text-slate-400">
                    Maintain your high trust score to enjoy lower deposits and
                    instant approvals.
                  </p>
                </div>
              </div>

              {/* Status Items */}
              <div className="grid grid-cols-3 gap-8 sm:gap-16">
                {/* Email Verification */}
                <div className="flex flex-col items-center text-center">
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-500">
                    <FontAwesomeIcon icon={faEnvelope} className="h-4 w-4" />
                  </div>
                  <p className="text-xs font-bold text-slate-700">
                    Email Verified
                  </p>
                  <p className="mt-0.5 text-[11px] font-semibold text-emerald-500">
                    Verified
                  </p>
                </div>

                {/* Phone Verification */}
                <div className="flex flex-col items-center text-center">
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-500">
                    <FontAwesomeIcon icon={faPhone} className="h-4 w-4" />
                  </div>
                  <p className="text-xs font-bold text-slate-700">
                    Phone Verified
                  </p>
                  <p className="mt-0.5 text-[11px] font-semibold text-emerald-500">
                    Verified
                  </p>
                </div>

                {/* Identity Verification */}
                <div className="flex flex-col items-center text-center">
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-new-red">
                    <FontAwesomeIcon icon={faIdCard} className="h-4 w-4" />
                  </div>
                  <p className="text-xs font-bold text-slate-700">
                    Identity Document
                  </p>
                  <p className="mt-0.5 text-[11px] font-semibold text-new-red">
                    Pending
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
