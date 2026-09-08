import { Suspense } from "react";

import TermsAndPolicyView from "./terms-and-policy-view";

export const metadata = {
  title: "Terms and Policy | Rentiq",
  description: "Renter Policy, Owner Policy, and Privacy Policy for the Rentiq marketplace.",
};

export default function TermsAndPolicyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f3f1ee]" />}>
      <TermsAndPolicyView />
    </Suspense>
  );
}
