"use client";

import { FormEvent, useState } from "react";
import { useGetMyKycQuery, useResubmitKycMutation, useSubmitKycMutation } from "@/redux/services/kycApi";
import { useAddMyAddressMutation, useGetMyAddressesQuery, useUpdateMyAddressMutation } from "@/redux/services/userApi";

const statusLabel: Record<string, string> = {
  PENDING: "Under review",
  APPROVED: "Approved",
  REJECTED: "Needs resubmission",
};

export default function BecomeVendorPage() {
  const { data: kyc, isLoading } = useGetMyKycQuery();
  const [submitKyc, submitState] = useSubmitKycMutation();
  const [resubmitKyc, resubmitState] = useResubmitKycMutation();
  const { data: addresses = [] } = useGetMyAddressesQuery();
  const [addMyAddress] = useAddMyAddressMutation();
  const [updateMyAddress] = useUpdateMyAddressMutation();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
    const payload = {
      data: {
        nationalIdNumber: String(form.get("nationalIdNumber") || "").trim(),
        nationalIdType: String(form.get("nationalIdType") || "").trim(),
        nationalIdCountry: String(form.get("nationalIdCountry") || "").trim() || undefined,
      },
      frontImage: frontImage instanceof File && frontImage.size ? frontImage : undefined,
      backImage: backImage instanceof File && backImage.size ? backImage : undefined,
    };
    if (!payload.data.nationalIdNumber || !payload.data.nationalIdType || !payload.data.nationalIdCountry || payload.data.nationalIdCountry.length !== 3) {
      setError("Complete your ID number, document type, and 3-letter country code.");
      return;
    }
    if (!addressLine || !city || country.length !== 3) {
      setError("Complete your address, city, and 3-letter country code.");
      return;
    }
    if (!payload.frontImage || !payload.backImage) {
      setError("Upload both the front and back of your ID.");
      return;
    }
    try {
      if (kyc) await resubmitKyc(payload).unwrap();
      else await submitKyc(payload).unwrap();
      const existingAddress = addresses.find((address) => address.isDefault) ?? addresses[0];
      const addressBody = { addressLine, city, country, isDefault: true };
      if (existingAddress?.id) await updateMyAddress({ addressId: existingAddress.id, body: addressBody }).unwrap();
      else await addMyAddress(addressBody).unwrap();
      setSuccess("Your vendor application and address were submitted for review.");
    } catch (requestError) {
      setError(typeof requestError === "object" && requestError && "data" in requestError ? String((requestError as { data?: { message?: string } }).data?.message || "Unable to submit application.") : "Unable to submit application.");
    }
  }

  const pending = submitState.isLoading || resubmitState.isLoading;
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 sm:px-8">
      <section className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
        <h1 className="text-3xl font-bold tracking-tight"><span className="text-[#253C95]">Become a</span>{" "}<span className="text-[#F73030]">Vendor</span></h1>
        <p className="mt-2 text-slate-600">Submit your identity documents to start listing rental items.</p>
        {isLoading ? <p className="mt-8 text-slate-500">Loading your application...</p> : kyc?.verificationStatus ? <div className="mt-6 rounded-xl bg-blue-50 p-4 text-blue-900">Application status: <strong>{statusLabel[kyc.verificationStatus] || kyc.verificationStatus}</strong>{kyc.rejectionReason ? <p className="mt-1 text-sm text-red-700">{kyc.rejectionReason}</p> : null}</div> : null}
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="text-sm font-semibold text-slate-700">ID number<input name="nationalIdNumber" defaultValue={kyc?.nationalIdNumber || ""} required className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal outline-none focus:border-[#253C95]" /></label>
            <label className="text-sm font-semibold text-slate-700">Document type<input name="nationalIdType" defaultValue={kyc?.nationalIdType || "NATIONAL_ID"} required className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal outline-none focus:border-[#253C95]" /></label>
          </div>
          <label className="block text-sm font-semibold text-slate-700">National ID country *<input name="nationalIdCountry" maxLength={3} required defaultValue={kyc?.nationalIdCountry || "KHM"} className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal uppercase outline-none focus:border-[#253C95]" /></label>
          <div className="grid gap-5 sm:grid-cols-2"><label className="text-sm font-semibold text-slate-700">Address *<input name="addressLine" required defaultValue={(addresses.find((address) => address.isDefault) ?? addresses[0])?.addressLine || ""} className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal outline-none focus:border-[#253C95]" /></label><label className="text-sm font-semibold text-slate-700">City *<input name="city" required defaultValue={(addresses.find((address) => address.isDefault) ?? addresses[0])?.city || ""} className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal outline-none focus:border-[#253C95]" /></label></div><label className="block text-sm font-semibold text-slate-700">Address country code *<input name="country" maxLength={3} minLength={3} required defaultValue={(addresses.find((address) => address.isDefault) ?? addresses[0])?.country || "KHM"} className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal uppercase outline-none focus:border-[#253C95]" /></label><div className="grid gap-5 sm:grid-cols-2"><label className="text-sm font-semibold text-slate-700">Front of ID<input name="frontImage" type="file" accept="image/*" required={!kyc} className="mt-2 block w-full text-sm font-normal" /></label><label className="text-sm font-semibold text-slate-700">Back of ID<input name="backImage" type="file" accept="image/*" required={!kyc} className="mt-2 block w-full text-sm font-normal" /></label></div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}{success ? <p className="text-sm text-emerald-600">{success}</p> : null}
          <button disabled={pending} className="rounded-lg bg-[#F73030] px-5 py-3 font-semibold text-white transition hover:bg-[#dd2b2b] disabled:cursor-not-allowed disabled:opacity-60">{pending ? "Submitting..." : kyc ? "Resubmit application" : "Submit application"}</button>
        </form>
      </section>
    </main>
  );
}