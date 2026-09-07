"use client";

import { useState } from "react";
import { Flag } from "lucide-react";
import type { ReportResponse } from "@/lib/types/vendor.types";
import { useGetMyReportQuery, useGetMyReportsQuery } from "@/redux/services/renterApi";

function formatLabel(value?: string) {
  if (!value) return "Open";
  return value.toLowerCase().replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function statusStyle(status?: string) {
  if (status === "RESOLVED") return "bg-emerald-100 text-emerald-600";
  if (status === "DISMISSED") return "bg-slate-100 text-slate-600";
  if (status === "UNDER_REVIEW") return "bg-amber-100 text-amber-700";
  return "bg-blue-100 text-blue-600";
}

function formatDate(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(date);
}

export default function MyReportsPage() {
  const { data, isLoading, isError, refetch } = useGetMyReportsQuery({ pageNumber: 0, pageSize: 50 });
  const reports = data?.content ?? [];
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-[#f8fafc] px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-800"><span className="text-new-blue">My </span><span className="text-new-red">Reports</span></h1>
          <p className="mt-1.5 text-sm text-slate-400">Reports you&apos;ve submitted about users, items, or reviews.</p>
        </div>

        {isLoading ? (
          <div className="space-y-3">{Array.from({ length: 3 }, (_, index) => <div key={index} className="h-20 animate-pulse rounded-2xl bg-white" />)}</div>
        ) : isError ? (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-8 text-center">
            <p className="text-sm font-semibold text-red-700">Unable to load your reports.</p>
            <button type="button" onClick={() => refetch()} className="mt-4 rounded-xl bg-new-red px-5 py-2.5 text-sm font-semibold text-white">Try again</button>
          </div>
        ) : reports.length === 0 ? (
          <div className="rounded-2xl border border-slate-100 bg-white p-12 text-center text-slate-400">
            <Flag className="mx-auto mb-3 size-9 text-slate-300" />
            <p className="text-sm font-medium">You haven&apos;t submitted any reports.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xs">
            {reports.map((report, index) => (
              <ReportRow
                key={report.id}
                report={report}
                isLast={index === reports.length - 1}
                isExpanded={expandedId === report.id}
                onToggle={() => setExpandedId((current) => (current === report.id ? null : report.id))}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function ReportRow({ report, isLast, isExpanded, onToggle }: { report: ReportResponse; isLast: boolean; isExpanded: boolean; onToggle: () => void }) {
  const { data: detail, isFetching } = useGetMyReportQuery(report.id, { skip: !isExpanded });
  return (
    <div className={isLast ? "" : "border-b border-slate-100"}>
      <button type="button" onClick={onToggle} className="flex w-full items-center justify-between gap-3 p-4 text-left hover:bg-slate-50">
        <div>
          <p className="text-sm font-bold text-slate-800">{formatLabel(report.reportType)} report</p>
          <p className="text-xs text-slate-400">{formatDate(report.createdAt)}</p>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${statusStyle(report.status)}`}>{formatLabel(report.status)}</span>
      </button>
      {isExpanded ? (
        <div className="border-t border-slate-100 bg-slate-50/60 px-4 py-3 text-xs text-slate-500">
          {isFetching ? "Loading..." : (detail?.description || report.description || "No description provided.")}
        </div>
      ) : null}
    </div>
  );
}
