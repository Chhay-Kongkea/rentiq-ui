"use client";

import { useState } from "react";

const REASONS = [
  "Spam",
  "Fake or fraudulent review",
  "Offensive or inappropriate language",
  "Misleading information",
  "Other",
];

const MAX_CHARS = 1000;

export default function ReportReviewPage() {
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");

  const handleSubmit = () => {
    // TODO: wire up to API route / server action
    console.log({ reason, details });
  };

  const handleCancel = () => {
    setReason("");
    setDetails("");
  };

  return (
    <div className="min-h-screen bg-[#f3f1ee] text-[#1a1a1a]">
      {/* Header */}
      <header className="bg-white border-b border-[#e9e7e4] px-6 md:px-10 py-4">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between mb-5">
          <div className="flex items-center gap-1.5 font-extrabold text-xl text-[#e42313]">
            <span className="w-7 h-7 bg-[#e42313] rounded-md flex items-center justify-center text-white text-base">
              R
            </span>
            Rentiq
          </div>

          <nav className="hidden md:flex items-center gap-9">
            <a href="#" className="flex items-center gap-2 text-[15px] font-medium text-[#222]">
              🏠 Homes
            </a>
            <a href="#" className="flex items-center gap-2 text-[15px] font-medium text-[#222]">
              🏷️ Deals
            </a>
            <a href="#" className="flex items-center gap-2 text-[15px] font-medium text-[#222]">
              🔄 Request
            </a>
          </nav>

          <div className="flex gap-2.5">
            <button className="w-9 h-9 rounded-full bg-[#f0efec] flex items-center justify-center text-sm text-[#555]">
              🌐
            </button>
            <button className="w-9 h-9 rounded-full bg-[#f0efec] flex items-center justify-center text-sm text-[#555]">
              ☰
            </button>
          </div>
        </div>

        {/* Search bar */}
        <div className="max-w-[600px] mx-auto">
          <div className="flex items-center border border-[#e9e7e4] rounded-full py-1 pl-6 pr-1.5 shadow-sm bg-white">
            <div className="flex-1">
              <p className="text-xs font-bold m-0">Categories</p>
              <p className="text-[11px] text-[#9ca3af] m-0">Many choices for you</p>
            </div>
            <div className="w-px h-8 bg-[#e9e7e4] mx-4" />
            <div className="flex-1">
              <p className="text-xs font-bold m-0">Where</p>
              <p className="text-[11px] text-[#9ca3af] m-0">Search destinations</p>
            </div>
            <div className="w-px h-8 bg-[#e9e7e4] mx-4" />
            <div className="flex-1">
              <p className="text-xs font-bold m-0">When</p>
              <p className="text-[11px] text-[#9ca3af] m-0">Add dates</p>
            </div>
            <button className="w-9 h-9 rounded-full bg-[#e42313] text-white flex items-center justify-center ml-2 flex-shrink-0">
              🔍
            </button>
          </div>
        </div>
      </header>

      {/* Page title */}
      <div className="text-center px-5 pt-12 pb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold m-0">
          <span className="text-[#1f3a8f]">Report</span>{" "}
          <span className="text-[#e42313]">Review</span>
        </h1>
      </div>

      {/* Card */}
      <div className="max-w-[720px] mx-auto px-6 pb-16">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-[260px_1fr]">
          {/* Left panel */}
          <div className="bg-[#eaf1ff] p-6 flex flex-col">
            <div className="w-8 h-8 rounded-full bg-[#e42313] text-white flex items-center justify-center text-sm mb-4">
              !
            </div>
            <h2 className="text-lg font-extrabold mb-2">Report Review</h2>
            <p className="text-xs text-[#5b6472] leading-relaxed mb-5">
              Help us maintain a high-trust marketplace by reporting suspicious or
              inappropriate content.
            </p>

            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-[#f0efec] flex items-center justify-center text-xs">
                  👤
                </div>
                <div>
                  <p className="text-xs font-bold m-0">Mark Thompson</p>
                  <p className="text-[10px] text-[#e42313] m-0">★★★★★</p>
                </div>
              </div>
              <p className="text-xs text-[#4b5563] leading-relaxed italic m-0">
                &quot;The camera I rented arrived broken and the owner refused to admit it.
                I&apos;ve used this site for years but this was&quot;
              </p>
            </div>

            <p className="flex items-start gap-1.5 text-[10px] text-[#6b7280] mt-auto pt-6">
              <span>📍</span>
              Our trust & safety team will review this within 24 hours.
            </p>
          </div>

          {/* Right panel — form */}
          <div className="p-6">
            <h3 className="text-sm font-bold mb-3">Why are you reporting this?</h3>

            <div className="flex flex-col gap-2.5 mb-5">
              {REASONS.map((r) => (
                <label
                  key={r}
                  className={`flex items-center gap-3 border rounded-lg px-4 py-2.5 text-sm cursor-pointer transition-colors ${
                    reason === r
                      ? "border-[#e42313] bg-[#fdecea]"
                      : "border-[#e9e7e4] hover:bg-[#f7f6f4]"
                  }`}
                >
                  <input
                    type="radio"
                    name="reason"
                    value={r}
                    checked={reason === r}
                    onChange={() => setReason(r)}
                    className="accent-[#e42313] w-4 h-4"
                  />
                  {r}
                </label>
              ))}
            </div>

            <div className="mb-5">
              <label className="text-xs font-bold block mb-2">
                Additional Details <span className="font-normal text-[#9ca3af]">(Optional)</span>
              </label>
              <textarea
                value={details}
                onChange={(e) => {
                  if (e.target.value.length <= MAX_CHARS) setDetails(e.target.value);
                }}
                placeholder="Provide any additional context or evidence for your report..."
                rows={3}
                className="w-full border border-[#e9e7e4] rounded-lg px-3 py-2.5 text-sm placeholder:text-[#b0b7c3] resize-none focus:outline-none focus:ring-2 focus:ring-[#e42313]"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleSubmit}
                disabled={!reason}
                className="flex items-center gap-1.5 bg-[#e42313] hover:bg-[#c91c0f] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm px-5 py-2.5 rounded-lg transition-colors"
              >
                Submit Report ➤
              </button>
              <button
                onClick={handleCancel}
                className="border border-[#e9e7e4] text-[#374151] font-medium text-sm px-5 py-2.5 rounded-lg hover:bg-[#f7f6f4] transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-[#e9e7e4] px-6 md:px-10 pt-12 pb-6">
        <div className="max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-6 gap-6">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-1.5 font-extrabold text-lg text-[#e42313] mb-3">
              <span className="w-7 h-7 bg-[#e42313] rounded-md flex items-center justify-center text-white text-base">
                R
              </span>
              Rentiq
            </div>
            <p className="text-[13px] text-[#6b7280] leading-relaxed max-w-[220px]">
              Cambodia&apos;s trusted marketplace for renting anything, anywhere.
            </p>
            <div className="flex gap-2.5 mt-4">
              {["f", "𝕏", "◎", "♪", "▶"].map((s, i) => (
                <span
                  key={i}
                  className="w-[30px] h-[30px] rounded-full bg-[#f0efec] flex items-center justify-center text-[13px] text-[#555]"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          <FooterCol title="Product" links={["Categories", "Pricing", "For Vendors", "Features"]} />
          <FooterCol title="Company" links={["About Us", "Careers", "Blog", "Press"]} />
          <FooterCol title="Support" links={["Help Center", "Contact Us", "FAQs", "Safety Tips"]} />
          <FooterCol
            title="Legal"
            links={["Privacy Policy", "Terms of Service", "Cookie Policy", "Community Guidelines"]}
          />

          <div className="bg-[#f7f6f4] rounded-xl p-4">
            <h5 className="text-[13px] font-bold mb-1">Download the App</h5>
            <p className="text-xs text-[#6b7280] mb-3">Rent on the go, anytime.</p>
            <div className="flex items-center gap-2 bg-black text-white rounded-lg px-3 py-2 text-xs mb-2">
              ▶ Get it on
              <br />
              Google Play
            </div>
            <div className="flex items-center gap-2 bg-black text-white rounded-lg px-3 py-2 text-xs">
              🍎 Download on
              <br />
              App Store
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-[#6b7280] mt-9 pt-5 border-t border-[#e9e7e4]">
          © 2026 RentalHub. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

function FooterCol({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h5 className="text-sm font-bold mb-3.5">{title}</h5>
      {links.map((link) => (
        <a key={link} href="#" className="block text-[13px] text-[#6b7280] mb-2.5">
          {link}
        </a>
      ))}
    </div>
  );
}