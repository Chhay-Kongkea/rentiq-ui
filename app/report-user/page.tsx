"use client";

import { useState } from "react";

const CATEGORIES = [
  "Item damaged beyond normal wear",
  "Item not returned on time",
  "Item significantly not as described",
  "Owner unresponsive / no-show",
  "Inappropriate behavior",
  "Other",
];

const MAX_PHOTOS = 5;
const MAX_CHARS = 2000;

export default function ReportUserPage() {
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const remaining = MAX_PHOTOS - photos.length;
    const newFiles = Array.from(files).slice(0, remaining);
    setPhotos((prev) => [...prev, ...newFiles]);
    e.target.value = "";
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    // TODO: wire up to API route / server action
    console.log({ category, description, photos });
  };

  return (
    <div className="min-h-screen bg-[#f3f1ee] text-[#1a1a1a]">
      {/* Header */}
      <header className="bg-white border-b border-[#e9e7e4] px-6 md:px-10 py-4">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
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
      </header>

      {/* Page title */}
      <div className="text-center px-5 pt-12 pb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold m-0">
          <span className="text-[#1f3a8f]">Report</span>{" "}
          <span className="text-[#e42313]">User</span>
        </h1>
      </div>

      {/* Card */}
      <div className="max-w-[880px] mx-auto px-6 pb-16">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* Item summary */}
          <div className="flex items-center justify-between gap-4 bg-[#eaf1ff] px-6 py-5">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg bg-black flex items-center justify-center text-2xl">
                📷
              </div>
              <div>
                <p className="text-[11px] font-bold tracking-wide text-[#3b5bdb] mb-1">
                  REPORTING ITEM
                </p>
                <p className="text-base font-bold m-0">Sony Alpha A7 IV Kit</p>
                <p className="text-xs text-[#6b7280] mt-1">
                  Order ID: #VR-9283-X10 • Rented from Alex Thompson
                </p>
              </div>
            </div>
            <span className="flex items-center gap-1.5 bg-[#fdecea] text-[#e42313] text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap">
              ⚠️ High Priority
            </span>
          </div>

          {/* Form */}
          <div className="px-6 md:px-8 py-8">
            {/* 1. Category */}
            <div className="mb-8">
              <h3 className="text-base font-bold mb-1">1. Nature of the Issue</h3>
              <p className="text-sm text-[#6b7280] mb-3">
                Select the category that best describes your experience.
              </p>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#eaf1ff] border border-[#c9d9ff] rounded-lg px-4 py-3 text-sm text-[#1a1a1a] appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#3b5bdb]"
              >
                <option value="">Select a report category...</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Description */}
            <div className="mb-8">
              <h3 className="text-base font-bold mb-1">2. Detailed Description</h3>
              <p className="text-sm text-[#6b7280] mb-3">
                Please provide as much detail as possible to help our trust & safety team
                investigate.
              </p>
              <textarea
                value={description}
                onChange={(e) => {
                  if (e.target.value.length <= MAX_CHARS) setDescription(e.target.value);
                }}
                placeholder="Describe what happened, including dates, times, and specific details..."
                rows={5}
                className="w-full bg-[#eaf1ff] border border-[#c9d9ff] rounded-lg px-4 py-3 text-sm placeholder:text-[#8b9bc7] resize-none focus:outline-none focus:ring-2 focus:ring-[#3b5bdb]"
              />
              <p className="text-xs text-[#9ca3af] text-right mt-1.5">
                {description.length} / {MAX_CHARS} characters
              </p>
            </div>

            {/* 3. Photos */}
            <div className="mb-2">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-base font-bold">
                  3. Evidence Photos <span className="font-normal text-[#6b7280]">(Optional)</span>
                </h3>
                <span className="text-xs font-medium bg-[#eef2ff] text-[#3b5bdb] px-2.5 py-1 rounded-full">
                  {photos.length}/{MAX_PHOTOS} Files
                </span>
              </div>
              <p className="text-sm text-[#6b7280] mb-4">
                Upload up to 5 clear photos of the damage or relevant screenshots.
              </p>

              <div className="grid grid-cols-5 gap-3">
                <label className="aspect-square border-2 border-dashed border-[#d6ddf5] rounded-lg flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:bg-[#f7f8fd] transition-colors">
                  <span className="text-lg">📷</span>
                  <span className="text-[11px] text-[#3b5bdb] font-medium">Upload Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handlePhotoUpload}
                    disabled={photos.length >= MAX_PHOTOS}
                  />
                </label>

                {Array.from({ length: MAX_PHOTOS - 1 }).map((_, i) => {
                  const photo = photos[i];
                  return (
                    <div
                      key={i}
                      className="aspect-square rounded-lg bg-[#eef1fb] flex items-center justify-center relative overflow-hidden"
                    >
                      {photo ? (
                        <>
                          <img
                            src={URL.createObjectURL(photo)}
                            alt={`Evidence ${i + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={() => removePhoto(i)}
                            className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white text-xs flex items-center justify-center"
                          >
                            ×
                          </button>
                        </>
                      ) : (
                        <span className="text-[#c3cbe8] text-lg">🖼️</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <hr className="my-7 border-[#e9e7e4]" />

            {/* Footer actions */}
            <div className="flex items-center justify-between gap-6">
              <p className="flex items-start gap-2 text-xs text-[#9ca3af] max-w-[420px]">
                <span className="text-[#e42313] mt-0.5">ⓘ</span>
                By submitting this report, you confirm that the information provided is
                accurate and truthful. False reporting may lead to account suspension.
              </p>
              <button
                onClick={handleSubmit}
                disabled={!category || !description}
                className="bg-[#e42313] hover:bg-[#c91c0f] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm px-7 py-3 rounded-lg whitespace-nowrap transition-colors"
              >
                Submit Report
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