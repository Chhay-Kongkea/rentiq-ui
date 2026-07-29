"use client";

import { useState } from "react";
import Image from "next/image";

type TabKey = "renter" | "owner" | "privacy";

const TABS: { key: TabKey; label: string; icon: string }[] = [
  { key: "renter", label: "Renter Policy", icon: "👤" },
  { key: "owner", label: "Owner Policy", icon: "🏢" },
  { key: "privacy", label: "Privacy Policy", icon: "🛡️" },
];

export default function TermsAndPolicyPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("renter");

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
          <span className="text-[#1f3a8f]">Terms and</span>{" "}
          <span className="text-[#e42313]">Policy</span>
        </h1>
      </div>

      {/* Layout */}
      <div className="max-w-[1080px] mx-auto px-6 pb-16 grid grid-cols-1 md:grid-cols-[270px_1fr] gap-6 items-start">
        {/* Sidebar */}
        <aside className="bg-white rounded-2xl p-3.5 shadow-sm">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl mb-1.5 text-[15px] font-medium text-left transition-colors ${
                activeTab === tab.key
                  ? "bg-[#fdecea] text-[#e42313] font-bold border-l-4 border-[#e42313] pl-3"
                  : "text-[#333] hover:bg-[#f7f6f4]"
              }`}
            >
              {tab.label}
              <span className={activeTab === tab.key ? "text-[#e42313]" : "opacity-60"}>
                {tab.icon}
              </span>
            </button>
          ))}

          <div className="mt-4 bg-[#e42313] text-white rounded-xl p-5">
            <h4 className="text-base font-bold mb-2">Need Help?</h4>
            <p className="text-[13px] leading-relaxed text-[#ffe4e1] mb-4">
              Our support team is available 24/7 for policy clarifications.
            </p>
            <button className="w-full bg-white text-[#e42313] font-bold text-sm py-2.5 rounded-lg">
              Contact Support
            </button>
          </div>
        </aside>

        {/* Content */}
        <main className="bg-white rounded-2xl px-6 md:px-10 py-9 shadow-sm">
          {activeTab === "renter" && <RenterPolicy />}
          {activeTab === "owner" && <OwnerPolicy />}
          {activeTab === "privacy" && <PrivacyPolicy />}
        </main>
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

function SectionHeading({ icon, title }: { icon: string; title: string }) {
  return (
    <div className="flex items-center gap-3.5 mb-5">
      <div className="w-9 h-9 rounded-full bg-[#fdecea] flex items-center justify-center text-[#e42313] text-lg">
        {icon}
      </div>
      <h2 className="text-xl font-extrabold m-0">{title}</h2>
    </div>
  );
}

function InfoBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 bg-[#eaf1ff] border-l-4 border-[#3b5bdb] rounded-lg px-4 py-3.5 mb-7 text-sm leading-relaxed">
      <span className="text-[#3b5bdb] text-base mt-0.5">ⓘ</span>
      <span>{children}</span>
    </div>
  );
}

function RenterPolicy() {
  return (
    <>
      <SectionHeading icon="👤" title="Renter Policy" />
      <InfoBox>
        <b className="text-[#e42313] font-bold">Key Requirement:</b> User must return item back
        in the same condition as received by the specified deadline.
      </InfoBox>

      <h3 className="text-base font-bold mt-6 mb-2.5">1. General Conduct</h3>
      <p className="text-sm leading-7 text-[#3d3d3d] mb-1.5">
        Renters are expected to treat every item as if it were their own — handling it with
        care, using it only for its intended purpose, and following any usage guidelines
        provided by the owner. Respectful communication with owners is expected at all times.
      </p>

      <h3 className="text-base font-bold mt-6 mb-2.5">2. Late Returns</h3>
      <p className="text-sm leading-7 text-[#3d3d3d] mb-1.5">
        Returning an item after the agreed-upon window will incur late fees calculated at 1.5x
        the daily rental rate. Communication with the owner regarding delays is mandatory.
      </p>

      <h3 className="text-base font-bold mt-6 mb-2.5">3. Damage and Loss</h3>
      <p className="text-sm leading-7 text-[#3d3d3d] mb-1.5">
        In the event of damage or loss, the Renter must notify both the Owner and Rentiq support
        within 2 hours. Fees will be assessed based on professional repair estimates.
      </p>

      <div className="relative w-full h-[280px] md:h-[320px] rounded-xl overflow-hidden my-5">
        <Image
          src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1000&q=80"
          alt="Camera equipment"
          fill
          className="object-cover"
        />
      </div>

      <h3 className="text-base font-bold mt-6 mb-2.5">4. Verification</h3>
      <p className="text-sm leading-7 text-[#3d3d3d] mb-1.5">
        All renters must undergo a baseline identity verification process to ensure the security
        of the marketplace community.
      </p>
    </>
  );
}

function OwnerPolicy() {
  return (
    <>
      <SectionHeading icon="🏢" title="Owner Policy" />
      <InfoBox>
        <b className="text-[#e42313] font-bold">Key Requirement:</b> Listings must accurately
        represent the item&apos;s condition, availability, and rental terms at all times.
      </InfoBox>

      <h3 className="text-base font-bold mt-6 mb-2.5">1. Listing Accuracy</h3>
      <p className="text-sm leading-7 text-[#3d3d3d] mb-1.5">
        Photos, descriptions, and pricing must reflect the actual item being offered. Misleading
        listings may be removed and repeat offenses can lead to account suspension.
      </p>

      <h3 className="text-base font-bold mt-6 mb-2.5">2. Response Time</h3>
      <p className="text-sm leading-7 text-[#3d3d3d] mb-1.5">
        Owners are expected to respond to booking requests within 24 hours to keep the
        marketplace reliable for renters.
      </p>

      <h3 className="text-base font-bold mt-6 mb-2.5">3. Payouts</h3>
      <p className="text-sm leading-7 text-[#3d3d3d] mb-1.5">
        Payouts are released 48 hours after confirmed return of the item, minus any applicable
        platform fees.
      </p>
    </>
  );
}

function PrivacyPolicy() {
  return (
    <>
      <SectionHeading icon="🛡️" title="Privacy Policy" />
      <InfoBox>
        <b className="text-[#e42313] font-bold">Key Requirement:</b> Personal data is only used
        to facilitate bookings, verification, and platform safety.
      </InfoBox>

      <h3 className="text-base font-bold mt-6 mb-2.5">1. Data We Collect</h3>
      <p className="text-sm leading-7 text-[#3d3d3d] mb-1.5">
        We collect basic profile information, identity verification documents, and booking
        history to keep the marketplace secure and functional.
      </p>

      <h3 className="text-base font-bold mt-6 mb-2.5">2. Data Sharing</h3>
      <p className="text-sm leading-7 text-[#3d3d3d] mb-1.5">
        We never sell personal data. Information is only shared with the counterparty of a
        booking as needed to complete the rental.
      </p>
    </>
  );
}