"use client";
import Link from "next/link";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCamera,
  faUser,
  faPhone,
  faEnvelope,
  faLocationDot,
  faShield,
  faEye,
  faEyeSlash,
  faCircleCheck,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";

export default function EditProfilePage() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <main className="min-h-screen bg-[#f8fafc] px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-4xl">
        {/* Back Button */}
        <Link
          href="/user/profile"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="h-3.5 w-3.5" />
          Back to Profile
        </Link>

        {/* Page Header */}
        <div className="mt-4 mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">
            <span className="text-new-blue">Edit </span>
            <span className="text-new-red">Profile</span>
          </h1>
          <p className="mt-1.5 text-sm text-slate-400">
            Manage your public identity and account security preferences.
          </p>
        </div>

        {/* Profile Avatar Section */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAts-TvDX1eFNKPD6s2ln01L3lPuM8iGs5KUWgHHoT-G6L6QishiK89gmxQJFIjUDA4iqrlO8Blt5YLd62tlPJFWZtRYrR3zHdomPwZSJTiZnUNQCAJxDsgU4-Mxfz4LtjJwRBcpFIGMO_G0FRh6wV_StTPPfihBIPKogGl18HO62STNEsU7RBYAvf7o01vArzDwN-Mk7ch3zT5bsZRy5jNHX9_qjmfCrYgSHQ_xK-FdYzb-QjEiGuBJlgqwZMcPQ4HEoolzlN181Fo"
              alt="Profile"
              className="h-32 w-32 rounded-full border-4 border-white object-cover shadow-sm"
            />
            <button
              type="button"
              className="absolute bottom-0 right-1 flex h-8 w-8 items-center justify-center rounded-full bg-[#ef4444] text-white shadow-md hover:bg-red-600 transition"
            >
              <FontAwesomeIcon icon={faCamera} className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Section 1: Personal Information */}
          <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-500">
                <FontAwesomeIcon icon={faUser} className="h-4 w-4" />
              </div>
              <h2 className="text-lg font-bold text-slate-800">
                Personal Information
              </h2>
            </div>

            <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
              {/* First & Last Name */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-semibold text-slate-700">
                    First Name
                  </label>
                  <input
                    type="text"
                    defaultValue="Saroth"
                    className="w-full rounded-2xl border-0 bg-slate-50 px-4 py-3.5 text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-200"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-semibold text-slate-700">
                    Last Name
                  </label>
                  <input
                    type="text"
                    defaultValue="Tola"
                    className="w-full rounded-2xl border-0 bg-slate-50 px-4 py-3.5 text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-200"
                  />
                </div>
              </div>

              {/* Verified Account Badge */}
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600">
                  <FontAwesomeIcon icon={faCircleCheck} className="h-3 w-3" />
                  Verified Account
                </span>
              </div>

              {/* Phone & Email */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {/* Phone */}
                <div>
                  <label className="mb-2 block text-xs font-semibold text-slate-700">
                    Phone Number
                  </label>
                  <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <FontAwesomeIcon
                        icon={faPhone}
                        className="h-3.5 w-3.5 text-slate-400"
                      />
                      <input
                        type="text"
                        defaultValue="+855 96 888 777"
                        className="w-full bg-transparent text-sm font-medium text-slate-800 focus:outline-none"
                      />
                    </div>
                    <span className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-emerald-500">
                      <FontAwesomeIcon
                        icon={faCircleCheck}
                        className="h-3 w-3"
                      />
                      Verified
                    </span>
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="mb-2 block text-xs font-semibold text-slate-700">
                    Email Address
                  </label>
                  <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3.5">
                    <div className="flex items-center gap-3 min-w-0">
                      <FontAwesomeIcon
                        icon={faEnvelope}
                        className="h-3.5 w-3.5 shrink-0 text-slate-400"
                      />
                      <input
                        type="email"
                        defaultValue="saroth.tola@example.com"
                        className="w-full truncate bg-transparent text-sm font-medium text-slate-800 focus:outline-none"
                      />
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
              </div>

              {/* Emergency Contact & Address */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {/* Emergency Contact */}
                <div>
                  <label className="mb-2 block text-xs font-semibold text-slate-700">
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
                    <button
                      type="button"
                      className="text-xs font-bold text-red-500 hover:underline"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="mb-2 block text-xs font-semibold text-slate-700">
                    Address
                  </label>
                  <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3.5">
                    <FontAwesomeIcon
                      icon={faLocationDot}
                      className="h-3.5 w-3.5 text-slate-400"
                    />
                    <input
                      type="text"
                      defaultValue="Phnom Penh, Cambodia"
                      className="w-full bg-transparent text-sm font-medium text-slate-800 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="rounded-xl bg-[#ef4444] px-6 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-red-600 transition"
                >
                  Update Information
                </button>
              </div>
            </form>
          </section>

          {/* Section 2: Security & Password */}
          <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-500">
                <FontAwesomeIcon icon={faShield} className="h-4 w-4" />
              </div>
              <h2 className="text-lg font-bold text-slate-800">
                Security & Password
              </h2>
            </div>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="max-w-md space-y-5"
            >
              {/* Current Password */}
              <div>
                <label className="mb-2 block text-xs font-semibold text-slate-700">
                  Current Password
                </label>
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3.5">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    defaultValue="********"
                    className="w-full bg-transparent text-sm font-medium text-slate-800 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <FontAwesomeIcon
                      icon={showCurrentPassword ? faEyeSlash : faEye}
                      className="h-3.5 w-3.5"
                    />
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="mb-2 block text-xs font-semibold text-slate-700">
                  New Password
                </label>
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3.5">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Min. 8 characters"
                    className="w-full bg-transparent text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <FontAwesomeIcon
                      icon={showNewPassword ? faEyeSlash : faEye}
                      className="h-3.5 w-3.5"
                    />
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="mb-2 block text-xs font-semibold text-slate-700">
                  Confirm New Password
                </label>
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3.5">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Repeat new password"
                    className="w-full bg-transparent text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <FontAwesomeIcon
                      icon={showConfirmPassword ? faEyeSlash : faEye}
                      className="h-3.5 w-3.5"
                    />
                  </button>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="rounded-xl border border-red-200 bg-white px-5 py-2 text-xs font-semibold text-red-500 hover:bg-red-50 transition"
                >
                  Update Password
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
