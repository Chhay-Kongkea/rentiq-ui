"use client";

import React, { Suspense, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useCreateVendorReportMutation } from "@/redux/services/vendorApi";

const MAX_PHOTOS = 5;
const MAX_DESCRIPTION_LENGTH = 2000;

interface ReportCategory {
  id: string;
  label: string;
}

const CATEGORIES: ReportCategory[] = [
  { id: "damaged_item", label: "Item returned damaged" },
  { id: "no_show", label: "Renter did not show up" },
  { id: "payment_issue", label: "Payment or billing issue" },
  { id: "unsafe_behavior", label: "Unsafe or inappropriate behavior" },
  { id: "other", label: "Other" },
];

function PriorityBadge({ priority }: { priority: "High" | "Medium" | "Low" }) {
  const styles: Record<string, string> = {
    High: "bg-red-100 text-red-600",
    Medium: "bg-amber-100 text-amber-700",
    Low: "bg-slate-200 text-slate-600",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${styles[priority]}`}
    >
      <svg width="13" height="13" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <circle cx="10" cy="10" r="8.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M10 6v4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="10" cy="13.25" r="0.9" fill="currentColor" />
      </svg>
      {priority} Priority
    </span>
  );
}

function FormSection({
  step,
  title,
  helperText,
  trailingLabel,
  children,
}: {
  step: number;
  title: string;
  helperText?: string;
  trailingLabel?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-bold text-slate-900">
          {step}. {title}
        </h3>
        {trailingLabel}
      </div>
      {helperText && <p className="mt-1 text-sm text-slate-500">{helperText}</p>}
      <div className="mt-3">{children}</div>
    </section>
  );
}

function CategorySelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-xl border border-blue-200 bg-blue-50/70 px-4 py-3.5 text-sm text-slate-700 focus:border-red-400 focus:outline-none"
      >
        <option value="" disabled>
          Select a report category...
        </option>
        {CATEGORIES.map((category) => (
          <option key={category.id} value={category.id}>
            {category.label}
          </option>
        ))}
      </select>
      <svg
        width="16"
        height="16"
        viewBox="0 0 20 20"
        fill="none"
        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
        aria-hidden="true"
      >
        <path d="M5 7.5 10 13l5-5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function DescriptionField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <textarea
        value={value}
        maxLength={MAX_DESCRIPTION_LENGTH}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Describe what happened, including dates, times, and specific details..."
        rows={6}
        className="w-full resize-none rounded-xl border border-blue-200 bg-blue-50/70 px-4 py-3.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-red-400 focus:outline-none"
      />
      <p className="mt-1.5 text-right text-xs text-slate-500">
        {value.length} / {MAX_DESCRIPTION_LENGTH} characters
      </p>
    </div>
  );
}

function PhotoUploadGrid({
  photos,
  onAdd,
  onRemove,
}: {
  photos: string[];
  onAdd: (files: FileList) => void;
  onRemove: (index: number) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const emptySlots = Math.max(MAX_PHOTOS - photos.length - 1, 0);

  return (
    <div className="flex flex-wrap gap-4">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files) onAdd(e.target.files);
          e.target.value = "";
        }}
      />

      {photos.length < MAX_PHOTOS && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex h-28 w-28 flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-red-300 text-red-500 transition hover:border-red-400 hover:bg-red-50/40"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M4 8.5A1.5 1.5 0 0 1 5.5 7h2l1-1.5h7l1 1.5h2A1.5 1.5 0 0 1 20 8.5v9A1.5 1.5 0 0 1 18.5 19h-13A1.5 1.5 0 0 1 4 17.5v-9Z"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
            <circle cx="12" cy="12.5" r="2.6" stroke="currentColor" strokeWidth="1.4" />
            <path d="M17 8.5h2M18 7.5v2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          <span className="text-xs font-medium">Upload Photo</span>
        </button>
      )}

      {photos.map((src, index) => (
        <div
          key={src + index}
          className="group relative h-28 w-28 overflow-hidden rounded-xl border border-slate-200 bg-slate-100"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={`Evidence photo ${index + 1}`} className="h-full w-full object-cover" />
          <button
            type="button"
            onClick={() => onRemove(index)}
            aria-label={`Remove evidence photo ${index + 1}`}
            className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-slate-900/70 text-white opacity-0 transition group-hover:opacity-100"
          >
            <svg width="10" height="10" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M5 5l10 10M15 5 5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      ))}

      {Array.from({ length: emptySlots }).map((_, i) => (
        <div key={`empty-${i}`} className="flex h-28 w-28 items-center justify-center rounded-xl bg-slate-100">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="3.5" y="4.5" width="17" height="15" rx="1.5" stroke="#CBD5E1" strokeWidth="1.4" />
            <circle cx="8.5" cy="9.5" r="1.5" stroke="#CBD5E1" strokeWidth="1.4" />
            <path d="M4 16.5 8.5 12l3 3 4-4.5L20 16" stroke="#CBD5E1" strokeWidth="1.4" strokeLinejoin="round" />
          </svg>
        </div>
      ))}
    </div>
  );
}

export default function ReportUser() {
  return (
    <Suspense fallback={null}>
      <ReportUserContent />
    </Suspense>
  );
}

function ReportUserContent() {
  const searchParams = useSearchParams();
  const reportedUserId = searchParams.get("userId") || "";
  const [createReport, createReportState] = useCreateVendorReportMutation();
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitError, setSubmitError] = useState("");

  const handleAddPhotos = (files: FileList) => {
    const remaining = MAX_PHOTOS - photos.length;
    const nextFiles = Array.from(files).slice(0, remaining);
    const nextUrls = nextFiles.map((file) => URL.createObjectURL(file));
    setPhotos((prev) => [...prev, ...nextUrls]);
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmitReport = async () => {
    setSubmitError("");
    setSubmitMessage("");
    if (!reportedUserId) {
      setSubmitError("Missing userId. Open this page with ?userId=<reported-user-id>.");
      return;
    }
    if (!category || !description.trim()) {
      setSubmitError("Choose a report category and enter a description.");
      return;
    }
    try {
      await createReport({
        reportType: "USER",
        reportedUserId,
        description: `[${category}] ${description.trim()}`,
      }).unwrap();
      setSubmitMessage("Report submitted successfully.");
    } catch (error) {
      const message = typeof error === "object" && error && "data" in error
        ? (error as { data?: { message?: string } }).data?.message
        : undefined;
      setSubmitError(message || "Unable to submit report.");
    }
  };

  return (
    <div className="mx-auto min-h-screen max-w-3xl bg-slate-100 px-4 py-10 sm:px-6">
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          <span className="text-blue-900">Report</span>{" "}
          <span className="text-red-500">User</span>
        </h1>
      </header>

      <main className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Item header banner */}
        <div className="flex flex-col gap-4 border-b border-slate-200 bg-blue-50/60 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div
              className="h-16 w-16 flex-shrink-0 rounded-xl"
              role="img"
              aria-label="Sony Alpha A7 IV camera kit"
              style={{ backgroundImage: "linear-gradient(135deg, #1f2937 0%, #0f172a 100%)" }}
            />
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-red-500">
                Reporting Item
              </p>
              <h2 className="mt-0.5 text-xl font-bold text-slate-900">
                Sony Alpha A7 IV Kit
              </h2>
              <p className="mt-0.5 text-sm text-slate-500">
                Order ID: #VR-9283-X10 &bull; Rented from{" "}
                <span className="font-semibold text-slate-700">Alex Thompson</span>
              </p>
            </div>
          </div>
          <div className="sm:self-start">
            <PriorityBadge priority="High" />
          </div>
        </div>

        <div className="flex flex-col gap-8 px-6 py-7">
          <FormSection
            step={1}
            title="Nature of the Issue"
            helperText="Select the category that best describes your experience."
          >
            <CategorySelect value={category} onChange={setCategory} />
          </FormSection>

          <FormSection
            step={2}
            title="Detailed Description"
            helperText="Please provide as much detail as possible to help our trust & safety team investigate."
          >
            <DescriptionField value={description} onChange={setDescription} />
          </FormSection>

          <FormSection
            step={3}
            title="Evidence Photos"
            helperText="Upload up to 5 clear photos of the damage or relevant screenshots."
            trailingLabel={
              <span className="flex-shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                {photos.length}/{MAX_PHOTOS} Files
              </span>
            }
          >
            <PhotoUploadGrid photos={photos} onAdd={handleAddPhotos} onRemove={handleRemovePhoto} />
          </FormSection>

          <hr className="border-slate-200" />

          <div className="flex flex-col-reverse items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-2.5 text-xs text-slate-500">
              <svg width="15" height="15" viewBox="0 0 20 20" fill="none" className="mt-0.5 flex-shrink-0" aria-hidden="true">
                <circle cx="10" cy="10" r="8" stroke="#DC2626" strokeWidth="1.4" />
                <path d="M10 9v4.5" stroke="#DC2626" strokeWidth="1.4" strokeLinecap="round" />
                <circle cx="10" cy="6.75" r="0.8" fill="#DC2626" />
              </svg>
              <p className="max-w-sm leading-relaxed">
                By submitting this report, you confirm that the information
                provided is accurate and truthful. False reporting may lead to
                account suspension.
              </p>
            </div>
            <div className="w-full sm:w-auto">
              {submitError ? <p className="mb-2 text-xs font-medium text-red-600">{submitError}</p> : null}
              {submitMessage ? <p className="mb-2 text-xs font-medium text-emerald-600">{submitMessage}</p> : null}
              {photos.length ? <p className="mb-2 text-[11px] text-amber-700">The current report API has no evidence-image field, so selected photos are preview-only.</p> : null}
              <button
                type="button"
                onClick={handleSubmitReport}
                disabled={createReportState.isLoading}
                className="w-full flex-shrink-0 rounded-xl bg-red-700 px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-red-800 disabled:opacity-60 sm:w-auto"
              >
                {createReportState.isLoading ? "Submitting..." : "Submit Report"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}