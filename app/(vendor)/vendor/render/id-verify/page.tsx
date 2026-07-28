"use client";

import React from "react";

type StepState = "complete" | "current" | "upcoming";

interface FlowStep {
  id: string;
  title: string;
  caption: string;
  state: StepState;
}

const STEPS: FlowStep[] = [
  { id: "upload", title: "Upload Documents", caption: "Completed on Dec 12", state: "complete" },
  { id: "review", title: "Verification Review", caption: "Action Required", state: "current" },
  { id: "verified", title: "Verified Access", caption: "Pending success", state: "upcoming" },
];

function StatusBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-lg bg-red-100 px-3.5 py-2 text-sm font-semibold text-red-600">
      <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <circle cx="10" cy="10" r="8.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M10 6v4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="10" cy="13.25" r="0.9" fill="currentColor" />
      </svg>
      Rejected
    </span>
  );
}

function DocumentPreview({
  label,
  overlayText,
  tone,
}: {
  label: string;
  overlayText: string;
  tone: "neutral" | "issue";
}) {
  const isIssue = tone === "issue";

  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <div
        className={`relative flex h-40 items-center justify-center overflow-hidden rounded-xl border border-dashed sm:h-44 ${
          isIssue ? "border-red-200 bg-red-50" : "border-slate-300 bg-slate-100"
        }`}
      >
        <div
          aria-hidden="true"
          className={`absolute h-20 w-32 rounded-lg blur-md sm:h-24 sm:w-40 ${
            isIssue ? "bg-red-200/70" : "bg-slate-300/70"
          }`}
        />
        <div className="relative flex flex-col items-center gap-2 px-4 text-center">
          {isIssue ? (
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="9.25" stroke="#DC2626" strokeWidth="1.6" />
              <path d="M12 7.5v5.25" stroke="#DC2626" strokeWidth="1.6" strokeLinecap="round" />
              <circle cx="12" cy="16" r="0.9" fill="#DC2626" />
            </svg>
          ) : (
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"
                stroke="#64748B"
                strokeWidth="1.5"
              />
              <circle cx="12" cy="12" r="2.5" stroke="#64748B" strokeWidth="1.5" />
              <path d="M3 21 21 3" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          )}
          <span className={`text-xs font-medium ${isIssue ? "text-red-600" : "text-slate-500"}`}>
            {overlayText}
          </span>
        </div>
      </div>
    </div>
  );
}

function StepIcon({ state }: { state: StepState }) {
  if (state === "complete") {
    return (
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-white">
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M4.5 10.5 8 14l7.5-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    );
  }
  if (state === "current") {
    return (
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-red-600 text-white">
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M6 6l8 8M14 6l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </span>
    );
  }
  return (
    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-slate-400">
      <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M10 2 3 6v4c0 4.2 3 7 7 8 4-1 7-3.8 7-8V6l-7-4Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function FlowStepper({ steps }: { steps: FlowStep[] }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {steps.map((step) => (
        <div
          key={step.id}
          className={`relative rounded-xl border bg-white p-5 text-center ${
            step.state === "current"
              ? "border-red-400 shadow-[0_0_0_1px_rgba(220,38,38,0.15)]"
              : "border-slate-200"
          }`}
        >
          {step.state === "current" && (
            <span className="absolute -top-2.5 right-3 rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
              Current
            </span>
          )}
          <div className="flex justify-center">
            <StepIcon state={step.state} />
          </div>
          <p className={`mt-3 text-sm font-semibold ${step.state === "current" ? "text-red-600" : "text-slate-800"}`}>
            {step.title}
          </p>
          <p
            className={`mt-1 text-xs ${
              step.state === "current"
                ? "font-medium text-red-500"
                : step.state === "upcoming"
                ? "text-slate-400"
                : "text-slate-500"
            }`}
          >
            {step.caption}
          </p>
        </div>
      ))}
    </div>
  );
}

export default function VerificationStatus() {
  return (
    <div className="mx-auto min-h-screen max-w-3xl bg-slate-100 px-4 py-10 sm:px-6">
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          <span className="text-blue-900">ID Verification</span>{" "}
          <span className="text-red-500">Status</span>
        </h1>
      </header>

      <main className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-200 bg-blue-50/60 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Identity Verification</h2>
            <p className="mt-1 text-sm text-slate-600">
              Verify your official government documents to gain full marketplace access.
            </p>
          </div>
          <div>
            <StatusBadge />
          </div>
        </div>

        <div className="px-6 py-6">
          <div className="flex gap-3 rounded-lg border border-red-100 bg-red-50 p-4">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className="mt-0.5 flex-shrink-0" aria-hidden="true">
              <path d="M10 2 2 17h16L10 2Z" stroke="#DC2626" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="M10 8v3.5" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="10" cy="14" r="0.9" fill="#DC2626" />
            </svg>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-red-600">Admin Feedback</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-700">
                &ldquo;The photo of the back of your ID is too blurry to read the barcode.
                Please ensure you are in a well-lit area and the text is sharp before
                re-uploading.&rdquo;
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <DocumentPreview label="Front of ID" overlayText="Front View (Blurred)" tone="neutral" />
            <DocumentPreview label="Back of ID" overlayText="Image Issue Detected" tone="issue" />
          </div>

          <hr className="my-6 border-slate-200" />

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-2.5">
              <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
                <svg width="12" height="12" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <circle cx="10" cy="10" r="8" stroke="#DC2626" strokeWidth="1.6" />
                  <path d="M10 6.5v4" stroke="#DC2626" strokeWidth="1.6" strokeLinecap="round" />
                  <circle cx="10" cy="13.25" r="0.8" fill="#DC2626" />
                </svg>
              </span>
              <p className="text-xs leading-relaxed text-slate-600 sm:max-w-sm">
                <span className="font-semibold text-slate-800">Verification Policy:</span>{" "}
                Verified ID required to list items and complete bookings. Your documents are
                stored using AES-256 encryption and are never shared with third parties.
              </p>
            </div>
            <div className="flex flex-shrink-0 gap-3">
              <button
                type="button"
                className="rounded-lg bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                type="button"
                className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                <svg width="15" height="15" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M10 13V4m0 0 3.5 3.5M10 4 6.5 7.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M4 14.5v1.25A2.25 2.25 0 0 0 6.25 18h7.5A2.25 2.25 0 0 0 16 15.75V14.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                </svg>
                Re-upload Documents
              </button>
            </div>
          </div>
        </div>
      </main>

      <div className="mt-6">
        <FlowStepper steps={STEPS} />
      </div>
    </div>
  );
}