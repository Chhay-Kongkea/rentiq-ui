"use client";

import Link from "next/link";
import { useGetMyKycQuery } from "@/redux/services/kycApi";
import { useGetMyVendorApplicationQuery } from "@/redux/services/vendorApi";

const label: Record<string, string> = {
  PENDING: "Under review",
  APPROVED: "Approved",
  REJECTED: "Rejected",
};

export default function VerificationStatus() {
  const { data: kyc, isLoading: kycLoading } = useGetMyKycQuery();
  const { data: application, isLoading: applicationLoading } = useGetMyVendorApplicationQuery();
  const loading = kycLoading || applicationLoading;

  return (
    <div className="mx-auto min-h-screen max-w-3xl bg-slate-100 px-4 py-10 sm:px-6">
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          <span className="text-blue-900">ID Verification</span>{" "}
          <span className="text-red-500">Status</span>
        </h1>
      </header>

      <main className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-blue-50/60 px-6 py-6">
          <h2 className="text-xl font-bold text-slate-900">Identity and vendor verification</h2>
          <p className="mt-1 text-sm text-slate-600">This page now reads your real KYC and vendor application state.</p>
        </div>

        {loading ? (
          <p className="p-6 text-sm text-slate-500">Loading verification status...</p>
        ) : (
          <div className="space-y-5 p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <section className="rounded-xl border border-slate-200 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">KYC status</p>
                <p className="mt-2 text-lg font-bold text-slate-950">{kyc?.verificationStatus ? label[kyc.verificationStatus] || kyc.verificationStatus : "Not submitted"}</p>
                <p className="mt-1 text-xs text-slate-500">Email: {kyc?.emailVerified ? "Verified" : "Not verified"}</p>
                {kyc?.rejectionReason ? <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">{kyc.rejectionReason}</p> : null}
              </section>

              <section className="rounded-xl border border-slate-200 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Vendor application</p>
                <p className="mt-2 text-lg font-bold text-slate-950">{application?.status ? label[application.status] || application.status : "Not submitted"}</p>
                {application?.rejectionReason ? <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">{application.rejectionReason}</p> : null}
              </section>
            </div>

            {kyc?.frontImageUrl || kyc?.backImageUrl ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <div><p className="mb-2 text-xs font-semibold uppercase text-slate-500">Front of ID</p><div className="aspect-video overflow-hidden rounded-xl bg-slate-100">{kyc.frontImageUrl ? <img src={kyc.frontImageUrl} alt="Front of ID" className="h-full w-full object-cover" /> : null}</div></div>
                <div><p className="mb-2 text-xs font-semibold uppercase text-slate-500">Back of ID</p><div className="aspect-video overflow-hidden rounded-xl bg-slate-100">{kyc.backImageUrl ? <img src={kyc.backImageUrl} alt="Back of ID" className="h-full w-full object-cover" /> : null}</div></div>
              </div>
            ) : null}

            <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-5">
              <Link href="/user/become-vendor" className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white">
                {kyc ? "Update / resubmit documents" : "Start verification"}
              </Link>
              {application?.status === "APPROVED" ? <Link href="/vendor/dashboard" className="rounded-lg bg-[#253C95] px-4 py-2.5 text-sm font-semibold text-white">Open vendor dashboard</Link> : null}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
