"use client";

import React, { useState } from "react";

type ReportReasonId =
  | "spam"
  | "fake_review"
  | "offensive_language"
  | "misleading_info"
  | "other";

interface ReportReason {
  id: ReportReasonId;
  label: string;
}

const REASONS: ReportReason[] = [
  { id: "spam", label: "Spam" },
  { id: "fake_review", label: "Fake or fraudulent review" },
  { id: "offensive_language", label: "Offensive or inappropriate language" },
  { id: "misleading_info", label: "Misleading information" },
  { id: "other", label: "Other" },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="13"
          height="13"
          viewBox="0 0 20 20"
          fill={i < rating ? "#DC2626" : "none"}
          stroke="#DC2626"
          strokeWidth="1"
          aria-hidden="true"
        >
          <path d="M10 1.5l2.6 5.4 5.9.8-4.3 4.2 1 5.9L10 15l-5.2 2.8 1-5.9L1.5 7.7l5.9-.8L10 1.5Z" />
        </svg>
      ))}
    </div>
  );
}

function ReasonOption({
  label,
  selected,
  onSelect,
}: {
  label: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left text-sm transition ${
        selected
          ? "border-red-400 bg-red-50/60"
          : "border-slate-200 bg-white hover:border-slate-300"
      }`}
    >
      <span
        className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 ${
          selected ? "border-red-500" : "border-slate-300"
        }`}
      >
        {selected && <span className="h-2.5 w-2.5 rounded-full bg-red-500" />}
      </span>
      <span className="text-slate-700">{label}</span>
    </button>
  );
}

export default function ReportReview() {
  const [selectedReason, setSelectedReason] = useState<ReportReasonId | null>(
    null
  );
  const [details, setDetails] = useState("");

  return (
    <div className="mx-auto min-h-screen max-w-3xl bg-slate-100 px-4 py-10 sm:px-6">
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          <span className="text-blue-900">Report</span>{" "}
          <span className="text-red-500">Review</span>
        </h1>
      </header>

      <main className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)]">
          {/* Left sidebar */}
          <div className="flex flex-col bg-blue-50/60 px-6 py-8 sm:px-8">
            <div>
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-600 text-white">
                {/* <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M10 1.7 1.7 6v8L10 18.3 18.3 14V6L10 1.7Z" fill="currentColor" />
                  <path d="M10 6.5v4" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
                  <circle cx="10" cy="13" r="0.9" fill="white" />
                </svg> */}
                <svg
  width="48"
  height="48"
  viewBox="0 0 48 48"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  {/* Red octagon */}
  <path
    d="M16 2H32L46 16V32L32 46H16L2 32V16L16 2Z"
    fill="#C8102E"
  />

  {/* Exclamation line */}
  <rect
    x="22"
    y="11"
    width="4"
    height="17"
    rx="2"
    fill="white"
  />

  {/* Exclamation dot */}
  <circle
    cx="24"
    cy="34"
    r="2.5"
    fill="white"
  />
</svg>
              </span>

              <h2 className="mt-5 text-2xl font-extrabold text-slate-900">
                Report Review
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                Help us maintain a high-trust marketplace by reporting
                suspicious or inappropriate content.
              </p>

              <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-500">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <circle cx="12" cy="8.5" r="3.25" stroke="currentColor" strokeWidth="1.6" />
                      <path
                        d="M4.5 19.5c1.4-3.4 4.3-5.25 7.5-5.25s6.1 1.85 7.5 5.25"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Mark Thompson
                    </p>
                    <StarRating rating={5} />
                  </div>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  &ldquo;The camera I rented arrived broken and the owner
                  refused to admit it. I&apos;ve used this site for years but
                  this was&rdquo;
                </p>
              </div>
            </div>

            <div className="mt-auto flex gap-2.5 border-t border-slate-300/60 pt-30 text-xs text-slate-500 sm:mt-24">
              <svg
                width="15"
                height="15"
                viewBox="0 0 20 20"
                fill="none"
                className="mt-0.5 flex-shrink-0"
                aria-hidden="true"
              >
                <path
                  d="M10 1.7 2.5 4.5v5c0 4.6 3.2 7.7 7.5 9.3 4.3-1.6 7.5-4.7 7.5-9.3v-5L10 1.7Z"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinejoin="round"
                />
                <path
                  d="M6.8 10.1l2.1 2.1 4.3-4.3"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p>Our trust &amp; safety team will review this within 24 hours.</p>
            </div>
          </div>

          {/* Right form */}
          <div className="border-t border-slate-200 px-6 py-8 sm:border-l sm:border-t-0 sm:px-8">
            <h2 className="text-xl font-bold text-slate-900">
              Why are you reporting this?
            </h2>

            <div className="mt-4 flex flex-col gap-3" role="radiogroup">
              {REASONS.map((reason) => (
                <ReasonOption
                  key={reason.id}
                  label={reason.label}
                  selected={selectedReason === reason.id}
                  onSelect={() => setSelectedReason(reason.id)}
                />
              ))}
            </div>

            <div className="mt-6">
              <label
                htmlFor="report-details"
                className="text-sm font-semibold text-slate-900"
              >
                Additional Details (Optional)
              </label>
              <textarea
                id="report-details"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Provide any additional context or evidence for your report..."
                rows={5}
                className="mt-2 w-full resize-none rounded-xl border border-slate-200 px-4 py-3.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-red-400 focus:outline-none"
              />
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() =>
                  console.log("submit report", { selectedReason, details })
                }
                className="flex items-center justify-center gap-2 rounded-xl bg-red-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-800 sm:flex-1"
              >
                Submit Report
                <svg width="15" height="15" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path
                    d="M4 4l13 6-13 6 3-6-3-6Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                type="button"
                className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}