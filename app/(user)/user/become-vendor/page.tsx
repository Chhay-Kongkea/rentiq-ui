"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import {
  useConfirmEmailVerificationMutation,
  useGetMyKycQuery,
  useResubmitKycMutation,
  useStartEmailVerificationMutation,
  useSubmitKycMutation,
} from "@/redux/services/kycApi";
import {
  useAddMyAddressMutation,
  useGetMyAddressesQuery,
  useSetDefaultMyAddressMutation,
  useUpdateMyAddressMutation,
} from "@/redux/services/userApi";
import {
  useGetMyVendorApplicationQuery,
  useSubmitVendorApplicationMutation,
} from "@/redux/services/vendorApi";
import { useGetPlatformPricingQuery } from "@/redux/services/publicApi";

const statusLabel: Record<string, string> = {
  PENDING: "Under review",
  APPROVED: "Approved",
  REJECTED: "Needs resubmission",
};

function getApiMessage(error: unknown, fallback: string) {
  if (typeof error !== "object" || error === null || !("data" in error)) return fallback;
  const data = (error as { data?: unknown }).data;
  if (typeof data === "object" && data !== null && "message" in data) {
    const message = (data as { message?: unknown }).message;
    if (typeof message === "string" && message.trim()) return message;
  }
  return fallback;
}

export default function BecomeVendorPage() {
  const { data: kyc, isLoading: kycLoading } = useGetMyKycQuery();
  const { data: addresses = [], isLoading: addressLoading } = useGetMyAddressesQuery();
  const { data: application, isLoading: applicationLoading, refetch: refetchApplication } =
    useGetMyVendorApplicationQuery();
  const { data: platformPricing } = useGetPlatformPricingQuery();

  const [submitKyc, submitState] = useSubmitKycMutation();
  const [resubmitKyc, resubmitState] = useResubmitKycMutation();
  const [addMyAddress, addAddressState] = useAddMyAddressMutation();
  const [updateMyAddress, updateAddressState] = useUpdateMyAddressMutation();
  const [setDefaultAddress, setDefaultState] = useSetDefaultMyAddressMutation();
  const [submitVendorApplication, vendorApplicationState] = useSubmitVendorApplicationMutation();
  const [startEmailVerification, emailStartState] = useStartEmailVerificationMutation();
  const [confirmEmailVerification, emailConfirmState] = useConfirmEmailVerificationMutation();

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [applicationMessage, setApplicationMessage] = useState("");

  const defaultAddress = useMemo(
    () => addresses.find((address) => address.isDefault) ?? addresses[0],
    [addresses],
  );

  async function saveDefaultAddress(addressLine: string, city: string, country: string) {
    const body = { addressLine, city, country, isDefault: true };

    if (defaultAddress?.id) {
      const saved = await updateMyAddress({ addressId: defaultAddress.id, body }).unwrap();
      if (!saved.isDefault) await setDefaultAddress(saved.id).unwrap();
      return saved;
    }

    const saved = await addMyAddress(body).unwrap();
    if (!saved.isDefault) await setDefaultAddress(saved.id).unwrap();
    return saved;
  }

  async function requestVendor(message?: string) {
    if (application?.status === "PENDING" || application?.status === "APPROVED") return;
    await submitVendorApplication({ message: message?.trim() || undefined }).unwrap();
    await refetchApplication();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const form = new FormData(event.currentTarget);
    const frontImage = form.get("frontImage");
    const backImage = form.get("backImage");
    const addressLine = String(form.get("addressLine") || "").trim();
    const city = String(form.get("city") || "").trim();
    const country = String(form.get("country") || "").trim().toUpperCase();
    const nationalIdCountry = String(form.get("nationalIdCountry") || "").trim().toUpperCase();

    const payload = {
      data: {
        nationalIdNumber: String(form.get("nationalIdNumber") || "").trim(),
        nationalIdType: String(form.get("nationalIdType") || "").trim(),
        nationalIdCountry,
      },
      frontImage: frontImage instanceof File && frontImage.size ? frontImage : undefined,
      backImage: backImage instanceof File && backImage.size ? backImage : undefined,
    };

    if (!payload.data.nationalIdNumber || !payload.data.nationalIdType || nationalIdCountry.length !== 3) {
      setError("Complete your ID number, document type, and 3-letter ID country code.");
      return;
    }
    if (!addressLine || !city || country.length !== 3) {
      setError("Complete your address, city, and 3-letter address country code.");
      return;
    }
    if (!kyc && (!payload.frontImage || !payload.backImage)) {
      setError("Upload both the front and back of your ID.");
      return;
    }

    try {
      await saveDefaultAddress(addressLine, city, country);

      if (kyc) await resubmitKyc(payload).unwrap();
      else await submitKyc(payload).unwrap();

      try {
        await requestVendor(applicationMessage);
        setSuccess("Your KYC, default address, and vendor application were submitted.");
      } catch (applicationError) {
        setSuccess("Your KYC and default address were saved successfully.");
        setError(
          `Vendor application was not created yet: ${getApiMessage(
            applicationError,
            "the backend may require KYC approval before the vendor request can be submitted.",
          )}`,
        );
      }
    } catch (requestError) {
      setError(getApiMessage(requestError, "Unable to submit your vendor onboarding information."));
    }
  }

  async function handleApplicationOnly() {
    setError("");
    setSuccess("");
    try {
      await requestVendor(applicationMessage);
      setSuccess("Vendor application submitted successfully.");
    } catch (requestError) {
      setError(getApiMessage(requestError, "Unable to submit vendor application."));
    }
  }

  async function handleStartEmailVerification() {
    setError("");
    setSuccess("");
    try {
      const result = await startEmailVerification().unwrap();
      setSuccess(result.message || "Email verification started.");
    } catch (requestError) {
      setError(getApiMessage(requestError, "Unable to start email verification."));
    }
  }

  async function handleConfirmEmailVerification() {
    setError("");
    setSuccess("");
    try {
      await confirmEmailVerification().unwrap();
      setSuccess("Email verification confirmed.");
    } catch (requestError) {
      setError(getApiMessage(requestError, "Unable to confirm email verification."));
    }
  }

  const pageLoading = kycLoading || addressLoading || applicationLoading;
  const submitting =
    submitState.isLoading ||
    resubmitState.isLoading ||
    addAddressState.isLoading ||
    updateAddressState.isLoading ||
    setDefaultState.isLoading ||
    vendorApplicationState.isLoading;

  const applicationFinal = application?.status === "PENDING" || application?.status === "APPROVED";

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 sm:px-8">
      <section className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              <span className="text-[#253C95]">Become a</span>{" "}
              <span className="text-[#F73030]">Vendor</span>
            </h1>
            <p className="mt-2 max-w-2xl text-slate-600">
              Complete your default address, identity verification, and vendor application.
            </p>
          </div>

          {application?.status === "APPROVED" ? (
            <Link
              href="/vendor/dashboard"
              className="rounded-lg bg-[#253C95] px-4 py-2.5 text-center text-sm font-semibold text-white"
            >
              Open vendor dashboard
            </Link>
          ) : null}
        </div>

        {pageLoading ? (
          <p className="mt-8 text-slate-500">Loading your onboarding status...</p>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Default address</p>
              <p className="mt-2 font-semibold text-slate-900">{defaultAddress ? "Ready" : "Required"}</p>
            </div>
            <div className="rounded-xl border border-slate-200 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">KYC</p>
              <p className="mt-2 font-semibold text-slate-900">
                {kyc?.verificationStatus ? statusLabel[kyc.verificationStatus] || kyc.verificationStatus : "Not submitted"}
              </p>
              {kyc?.rejectionReason ? <p className="mt-1 text-xs text-red-600">{kyc.rejectionReason}</p> : null}
            </div>
            <div className="rounded-xl border border-slate-200 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Vendor application</p>
              <p className="mt-2 font-semibold text-slate-900">
                {application?.status ? statusLabel[application.status] || application.status : "Not submitted"}
              </p>
              {application?.rejectionReason ? <p className="mt-1 text-xs text-red-600">{application.rejectionReason}</p> : null}
            </div>
          </div>
        )}

        {platformPricing && (platformPricing.promotions?.length || platformPricing.advertisements?.length) ? (
          <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-bold text-slate-800">Advertising &amp; promotion pricing</p>
            <p className="mt-1 text-xs text-slate-500">Once approved, you can boost listings and run ads. Here&apos;s what packages cost.</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {platformPricing.promotions?.length ? (
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Promotions</p>
                  <ul className="mt-1.5 space-y-1 text-xs text-slate-600">
                    {platformPricing.promotions.map((pkg, index) => (
                      <li key={index} className="flex justify-between gap-3"><span>{pkg.packageType} ({pkg.durationDays}d)</span><span className="font-semibold text-slate-800">{Object.entries(pkg.prices ?? {}).map(([currency, amount]) => `${amount} ${currency}`).join(" / ")}</span></li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {platformPricing.advertisements?.length ? (
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Advertisements</p>
                  <ul className="mt-1.5 space-y-1 text-xs text-slate-600">
                    {platformPricing.advertisements.map((pkg, index) => (
                      <li key={index} className="flex justify-between gap-3"><span>{pkg.packageType} ({pkg.durationDays}d)</span><span className="font-semibold text-slate-800">{Object.entries(pkg.prices ?? {}).map(([currency, amount]) => `${amount} ${currency}`).join(" / ")}</span></li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}

        {kyc && !kyc.emailVerified ? (
          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p className="font-semibold text-amber-900">Email verification is not complete</p>
            <p className="mt-1 text-sm text-amber-800">Use the KYC email verification endpoints before final approval if your backend requires it.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleStartEmailVerification}
                disabled={emailStartState.isLoading}
                className="rounded-lg bg-white px-3 py-2 text-sm font-semibold text-amber-900 shadow-sm disabled:opacity-60"
              >
                {emailStartState.isLoading ? "Sending..." : "Send verification"}
              </button>
              <button
                type="button"
                onClick={handleConfirmEmailVerification}
                disabled={emailConfirmState.isLoading}
                className="rounded-lg border border-amber-300 px-3 py-2 text-sm font-semibold text-amber-900 disabled:opacity-60"
              >
                {emailConfirmState.isLoading ? "Confirming..." : "Confirm verification"}
              </button>
            </div>
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="text-sm font-semibold text-slate-700">
              ID number
              <input
                name="nationalIdNumber"
                defaultValue={kyc?.nationalIdNumber || ""}
                required
                className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal outline-none focus:border-[#253C95]"
              />
            </label>
            <label className="text-sm font-semibold text-slate-700">
              Document type
              <input
                name="nationalIdType"
                defaultValue={kyc?.nationalIdType || "NATIONAL_ID"}
                required
                className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal outline-none focus:border-[#253C95]"
              />
            </label>
          </div>

          <label className="block text-sm font-semibold text-slate-700">
            National ID country
            <input
              name="nationalIdCountry"
              maxLength={3}
              minLength={3}
              required
              defaultValue={kyc?.nationalIdCountry || "KHM"}
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal uppercase outline-none focus:border-[#253C95]"
            />
          </label>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="text-sm font-semibold text-slate-700">
              Address
              <input
                name="addressLine"
                required
                defaultValue={defaultAddress?.addressLine || ""}
                className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal outline-none focus:border-[#253C95]"
              />
            </label>
            <label className="text-sm font-semibold text-slate-700">
              City
              <input
                name="city"
                required
                defaultValue={defaultAddress?.city || ""}
                className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal outline-none focus:border-[#253C95]"
              />
            </label>
          </div>

          <label className="block text-sm font-semibold text-slate-700">
            Address country code
            <input
              name="country"
              maxLength={3}
              minLength={3}
              required
              defaultValue={defaultAddress?.country || "KHM"}
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal uppercase outline-none focus:border-[#253C95]"
            />
          </label>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="text-sm font-semibold text-slate-700">
              Front of ID
              <input name="frontImage" type="file" accept="image/*" required={!kyc} className="mt-2 block w-full text-sm font-normal" />
            </label>
            <label className="text-sm font-semibold text-slate-700">
              Back of ID
              <input name="backImage" type="file" accept="image/*" required={!kyc} className="mt-2 block w-full text-sm font-normal" />
            </label>
          </div>

          <label className="block text-sm font-semibold text-slate-700">
            Message to vendor review team
            <textarea
              value={applicationMessage}
              onChange={(event) => setApplicationMessage(event.target.value)}
              rows={3}
              placeholder="Optional message"
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal outline-none focus:border-[#253C95]"
            />
          </label>

          {error ? <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
          {success ? <p className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">{success}</p> : null}

          <div className="flex flex-wrap gap-3">
            <button
              disabled={submitting || application?.status === "APPROVED"}
              className="rounded-lg bg-[#F73030] px-5 py-3 font-semibold text-white transition hover:bg-[#dd2b2b] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Submitting..." : kyc ? "Update KYC and continue" : "Submit KYC and apply"}
            </button>

            {kyc && defaultAddress && !applicationFinal ? (
              <button
                type="button"
                onClick={handleApplicationOnly}
                disabled={vendorApplicationState.isLoading}
                className="rounded-lg border border-[#253C95] px-5 py-3 font-semibold text-[#253C95] disabled:opacity-60"
              >
                {vendorApplicationState.isLoading ? "Submitting..." : application?.status === "REJECTED" ? "Resubmit vendor application" : "Request vendor access"}
              </button>
            ) : null}
          </div>
        </form>
      </section>
    </main>
  );
}
