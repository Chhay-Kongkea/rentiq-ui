"use client";

import React, { useState } from "react";

type PolicyId = "renter" | "owner" | "privacy";

interface PolicySection {
  heading: string;
  body: string;
  showImage?: boolean;
}

interface PolicyData {
  id: PolicyId;
  navLabel: string;
  title: string;
  keyRequirement: { prefix: string; highlight: string; suffix: string };
  sections: PolicySection[];
}

const POLICIES: PolicyData[] = [
  {
    id: "renter",
    navLabel: "Renter Policy",
    title: "Renter Policy",
    keyRequirement: {
      prefix: "Key Requirement: ",
      highlight: "User must return item back",
      suffix: " in the same condition as received by the specified deadline.",
    },
    sections: [
      {
        heading: "1. General Conduct",
        body: "Renters must treat every item as if it were their own. Communicate promptly with the owner, follow the pickup and return instructions in the listing, and report any concerns as soon as they arise.",
      },
      {
        heading: "2. Late Returns",
        body: "Returning an item after the agreed-upon window will incur late fees calculated at 1.5x the daily rental rate. Communication with the owner regarding delays is mandatory.",
      },
      {
        heading: "3. Damage and Loss",
        body: "In the event of damage or loss, the Renter must notify both the Owner and VibrantRent support within 2 hours. Fees will be assessed based on professional repair estimates.",
        showImage: true,
      },
      {
        heading: "4. Verification",
        body: "All renters must undergo a baseline identity verification process to ensure the security of the marketplace community.",
      },
    ],
  },
  {
    id: "owner",
    navLabel: "Owner Policy",
    title: "Owner Policy",
    keyRequirement: {
      prefix: "Key Requirement: ",
      highlight: "Listings must accurately reflect the item's condition",
      suffix: " at the time of every booking.",
    },
    sections: [
      {
        heading: "1. Listing Accuracy",
        body: "Owners must keep photos, descriptions, and availability calendars current. Misleading listings may be removed and repeated violations can result in account suspension.",
      },
      {
        heading: "2. Handover Standards",
        body: "Items must be clean, functional, and include all accessories described in the listing at the time of handover. Owners should confirm condition together with the renter before the rental period begins.",
        showImage: true,
      },
      {
        heading: "3. Pricing and Fees",
        body: "Owners set their own daily rate, but VibrantRent's service fee is deducted automatically from each completed booking. Refunds for cancellations follow the standard marketplace schedule.",
      },
      {
        heading: "4. Dispute Response",
        body: "Owners are expected to respond to any damage, loss, or late-return dispute within 24 hours to keep the resolution process moving quickly for both parties.",
      },
    ],
  },
  {
    id: "privacy",
    navLabel: "Privacy Policy",
    title: "Privacy Policy",
    keyRequirement: {
      prefix: "Key Requirement: ",
      highlight: "Personal data is never sold",
      suffix: " to third parties and is only used to operate the marketplace safely.",
    },
    sections: [
      {
        heading: "1. Data We Collect",
        body: "We collect the information you provide when creating a listing or booking, including contact details, payment information, and identity verification documents.",
      },
      {
        heading: "2. How We Use It",
        body: "Your data is used to facilitate bookings, verify identity, prevent fraud, and improve the marketplace experience. We do not use your data for purposes beyond these without your consent.",
      },
      {
        heading: "3. Data Storage and Security",
        body: "All sensitive documents, including identity verification photos, are stored using AES-256 encryption and are accessible only to authorized trust & safety staff.",
        showImage: true,
      },
      {
        heading: "4. Your Rights",
        body: "You may request a copy of your data or ask us to delete your account at any time, subject to legal record-keeping requirements for completed transactions.",
      },
    ],
  },
];

function PolicyIcon({ id, className }: { id: PolicyId; className?: string }) {
  if (id === "renter") {
    return (
      <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
        <circle cx="10" cy="6.5" r="3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M3.5 17c1.2-3.3 3.9-5 6.5-5s5.3 1.7 6.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  if (id === "owner") {
    return (
      <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
        <path d="M3 7.5 4 3h12l1 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M3 7.5v8A1.5 1.5 0 0 0 4.5 17h11a1.5 1.5 0 0 0 1.5-1.5v-8" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M8 17v-4.5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1V17" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <path d="M10 2.5 4 4.75v4.5c0 4 2.5 6.5 6 7.75 3.5-1.25 6-3.75 6-7.75v-4.5L10 2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function PolicyNav({
  activeId,
  onSelect,
}: {
  activeId: PolicyId;
  onSelect: (id: PolicyId) => void;
}) {
  return (
    <nav className="flex flex-col gap-3">
      {POLICIES.map((policy) => {
        const isActive = policy.id === activeId;
        return (
          <button
            key={policy.id}
            type="button"
            onClick={() => onSelect(policy.id)}
            className={`flex items-center justify-between rounded-xl border bg-white px-4 py-3.5 text-left text-sm font-semibold transition ${
              isActive
                ? "border-red-500 border-l-4 text-red-600"
                : "border-slate-200 text-slate-700 hover:border-slate-300"
            }`}
          >
            {policy.navLabel}
            <PolicyIcon id={policy.id} className={`h-5 w-5 ${isActive ? "text-red-500" : "text-slate-400"}`} />
          </button>
        );
      })}
    </nav>
  );
}

function NeedHelpCard() {
  return (
    <div className="rounded-xl bg-red-700 px-5 py-5 text-white">
      <p className="text-base font-bold">Need Help?</p>
      <p className="mt-1.5 text-xs leading-relaxed text-red-100">
        Our support team is available 24/7 for policy clarifications.
      </p>
      <button
        type="button"
        className="mt-4 w-full rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-50"
      >
        Contact Support
      </button>
    </div>
  );
}

function KeyRequirementNote({
  prefix,
  highlight,
  suffix,
}: {
  prefix: string;
  highlight: string;
  suffix: string;
}) {
  return (
    <div className="flex gap-3 rounded-xl border-l-4 border-blue-900 bg-blue-50/60 px-5 py-4">
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className="mt-0.5 flex-shrink-0" aria-hidden="true">
        <circle cx="10" cy="10" r="8" stroke="#1E3A8A" strokeWidth="1.5" />
        <circle cx="10" cy="6.75" r="0.9" fill="#1E3A8A" />
        <path d="M10 9.5v4.5" stroke="#1E3A8A" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <p className="text-sm leading-relaxed text-slate-700">
        {prefix}
        <span className="font-semibold text-red-600">{highlight}</span>
        {suffix}
      </p>
    </div>
  );
}

function PolicySectionBlock({ section }: { section: PolicySection }) {
  return (
    <section>
      <h3 className="text-base font-bold text-slate-900">{section.heading}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">{section.body}</p>
      {section.showImage && (
        <div
          className="mt-4 h-56 w-full rounded-xl bg-cover bg-center sm:h-64"
          role="img"
          aria-label="Illustrative photo of rental equipment"
          style={{
            backgroundImage:
              "linear-gradient(135deg, #3f5568 0%, #23303d 55%, #12181f 100%)",
          }}
        />
      )}
    </section>
  );
}

export default function TermsPolicy() {
  const [activeId, setActiveId] = useState<PolicyId>("renter");
  const activePolicy = POLICIES.find((policy) => policy.id === activeId)!;

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-slate-100 px-4 py-10 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          <span className="text-blue-900">Terms and</span>{" "}
          <span className="text-red-500">Policy</span>
        </h1>
      </header>

      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 px-4 py-8 sm:grid-cols-[240px_minmax(0,1fr)] sm:px-6">
        <aside className="flex flex-col gap-6">
          <PolicyNav activeId={activeId} onSelect={setActiveId} />
          <NeedHelpCard />
        </aside>

        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-7 sm:px-8 sm:py-8">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-red-100 text-red-600">
              <PolicyIcon id={activePolicy.id} className="h-5 w-5" />
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900">
              {activePolicy.title}
            </h2>
          </div>

          <div className="mt-6">
            <KeyRequirementNote
              prefix={activePolicy.keyRequirement.prefix}
              highlight={activePolicy.keyRequirement.highlight}
              suffix={activePolicy.keyRequirement.suffix}
            />
          </div>

          <div className="mt-8 flex flex-col gap-8">
            {activePolicy.sections.map((section) => (
              <PolicySectionBlock key={section.heading} section={section} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}