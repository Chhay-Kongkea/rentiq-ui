"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

import Footer from "@/components/footer";

type TabKey = "terms" | "renter" | "owner" | "privacy";

const TABS: { key: TabKey; label: string }[] = [
  { key: "terms", label: "Terms & Conditions" },
  { key: "renter", label: "Renter Policy" },
  { key: "owner", label: "Owner Policy" },
  { key: "privacy", label: "Privacy Policy" },
];

const EFFECTIVE_DATE = "1 September 2026";

function resolveTab(value: string | null): TabKey {
  return TABS.some((tab) => tab.key === value) ? (value as TabKey) : "terms";
}

export default function TermsAndPolicyView() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabKey>(() =>
    resolveTab(searchParams.get("tab")),
  );

  return (
    <div className="min-h-screen bg-[#f3f1ee] text-[#1a1a1a]">
      {/* Page title */}
      <div className="text-center px-5 pt-12 pb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold m-0">
          <span className="text-[#1f3a8f]">Terms and</span>{" "}
          <span className="text-[#e42313]">Policy</span>
        </h1>
        <p className="mt-3 text-sm text-[#6b7280]">
          Please review these terms carefully. By creating an account you agree to be bound by them.
        </p>
      </div>

      {/* Layout */}
      <div className="max-w-[1080px] mx-auto px-6 pb-16 grid grid-cols-1 md:grid-cols-[270px_1fr] gap-6 items-start">
        {/* Sidebar */}
        <aside className="bg-white rounded-2xl p-3.5 shadow-sm md:sticky md:top-24">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              aria-current={activeTab === tab.key ? "page" : undefined}
              className={`w-full px-4 py-3.5 rounded-xl mb-1.5 text-[15px] font-medium text-left transition-colors ${
                activeTab === tab.key
                  ? "bg-[#fdecea] text-[#e42313] font-bold border-l-4 border-[#e42313] pl-3"
                  : "text-[#333] hover:bg-[#f7f6f4]"
              }`}
            >
              {tab.label}
            </button>
          ))}

          <div className="mt-4 bg-[#e42313] text-white rounded-xl p-5">
            <h4 className="text-base font-bold mb-2">Need Help?</h4>
            <p className="text-[13px] leading-relaxed text-[#ffe4e1] mb-4">
              Our support team is available for policy clarifications and account questions.
            </p>
            <a
              href="mailto:support@rentiq.site"
              className="block w-full bg-white text-[#e42313] font-bold text-sm py-2.5 rounded-lg text-center"
            >
              Contact Support
            </a>
          </div>
        </aside>

        {/* Content */}
        <main className="bg-white rounded-2xl px-6 md:px-10 py-9 shadow-sm">
          {activeTab === "terms" && <TermsAndConditions />}
          {activeTab === "renter" && <RenterPolicy />}
          {activeTab === "owner" && <OwnerPolicy />}
          {activeTab === "privacy" && <PrivacyPolicy />}
        </main>
      </div>

      <Footer />
    </div>
  );
}

function SectionHeading({ title }: { title: string }) {
  return (
    <div className="mb-5 border-b border-[#eee] pb-4">
      <h2 className="text-xl font-extrabold m-0">{title}</h2>
      <p className="text-xs text-[#8a8a8a] mt-1.5">Effective date: {EFFECTIVE_DATE}</p>
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

function Clause({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <>
      <h3 className="text-base font-bold mt-6 mb-2.5">{heading}</h3>
      <div className="text-sm leading-7 text-[#3d3d3d] space-y-2.5">{children}</div>
    </>
  );
}

function TermsAndConditions() {
  return (
    <>
      <SectionHeading title="Terms & Conditions" />
      <InfoBox>
        <b className="text-[#e42313] font-bold">Summary:</b> Rentiq is a marketplace that connects
        item owners with renters. Rentiq is not a party to the rental agreement between users and
        does not own, inspect, or take custody of listed items.
      </InfoBox>

      <p className="text-sm leading-7 text-[#3d3d3d]">
        These Terms &amp; Conditions (the &quot;Terms&quot;) govern access to and use of the Rentiq
        website, mobile applications, and related services (together, the &quot;Platform&quot;),
        operated by Rentiq (&quot;Rentiq&quot;, &quot;we&quot;, or &quot;us&quot;). By registering
        for an account or using the Platform, you (&quot;you&quot; or the &quot;User&quot;) accept
        these Terms and the policies referenced within them.
      </p>

      <Clause heading="1. Eligibility and Accounts">
        <p>
          You must be at least 18 years old and able to enter into a legally binding contract to use
          the Platform. You agree to provide accurate registration information, to keep your
          credentials confidential, and to remain responsible for all activity that occurs under
          your account.
        </p>
        <p>
          Rentiq may require identity verification before certain features become available and may
          suspend or close accounts that provide false information or that are associated with
          fraudulent or abusive activity.
        </p>
      </Clause>

      <Clause heading="2. Nature of the Service">
        <p>
          The Platform allows owners to list items for rent and allows renters to discover, book,
          and pay for those items. Any rental contract is formed directly between the owner and the
          renter. Rentiq facilitates listings, bookings, messaging, and payment processing, but is
          not the seller, lessor, or lessee of any item.
        </p>
      </Clause>

      <Clause heading="3. Bookings and Payments">
        <p>
          Prices, deposits, and rental periods are set by the owner and shown before a booking is
          confirmed. When a booking is confirmed, the renter authorises Rentiq and its payment
          partners to charge the rental amount, applicable service fees, and any refundable security
          deposit.
        </p>
        <p>
          Funds for a confirmed booking are held and released to the owner after the rental is
          completed, less the platform service fee. Security deposits are returned to the renter
          after the item is returned in acceptable condition, subject to the dispute process.
        </p>
      </Clause>

      <Clause heading="4. Fees">
        <p>
          Rentiq charges a service fee on completed bookings. The applicable fee is displayed at
          checkout and in the owner payout summary. Rentiq may change its fees on a prospective
          basis with notice through the Platform.
        </p>
      </Clause>

      <Clause heading="5. Cancellations and Refunds">
        <p>
          Each listing displays the cancellation window that applies to it. Cancellations made
          within the permitted window are refunded in full, excluding non-refundable payment
          processing charges where applicable. Cancellations outside the permitted window may be
          partially refunded or non-refundable as stated on the listing.
        </p>
      </Clause>

      <Clause heading="6. Prohibited Conduct">
        <p>You agree not to use the Platform to:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>list items that are illegal, stolen, counterfeit, or unsafe;</li>
          <li>circumvent the booking or payment system, or transact off-platform to avoid fees;</li>
          <li>post false, misleading, or defamatory content, including manipulated reviews;</li>
          <li>infringe the intellectual property or privacy rights of others; or</li>
          <li>interfere with the security or normal operation of the Platform.</li>
        </ul>
      </Clause>

      <Clause heading="7. Disputes Between Users">
        <p>
          Owners and renters are expected to resolve issues directly and in good faith. If that is
          not possible, either party may open a dispute through the Platform within the timeframe
          stated in the Renter and Owner Policies. Rentiq may review booking records, messages,
          inspection photos, and other evidence to make a binding decision on the release of held
          funds and deposits.
        </p>
      </Clause>

      <Clause heading="8. Limitation of Liability">
        <p>
          The Platform is provided on an &quot;as is&quot; and &quot;as available&quot; basis. To
          the fullest extent permitted by law, Rentiq is not liable for indirect, incidental, or
          consequential damages, or for the condition, safety, legality, or performance of any
          listed item. Rentiq&apos;s total liability arising out of or relating to the Platform is
          limited to the service fees it received for the booking giving rise to the claim.
        </p>
      </Clause>

      <Clause heading="9. Suspension and Termination">
        <p>
          Rentiq may suspend or terminate access to the Platform if these Terms or any policy are
          breached, if required by law, or to protect users. You may close your account at any time,
          provided that obligations relating to active bookings and open disputes survive closure.
        </p>
      </Clause>

      <Clause heading="10. Changes to These Terms">
        <p>
          Rentiq may update these Terms from time to time. Material changes will be notified through
          the Platform or by email. Continued use of the Platform after changes take effect
          constitutes acceptance of the revised Terms.
        </p>
      </Clause>

      <Clause heading="11. Governing Law">
        <p>
          These Terms are governed by the laws of the Kingdom of Cambodia, without regard to its
          conflict of law rules. The courts located in Phnom Penh have exclusive jurisdiction over
          any dispute that is not resolved through the Platform dispute process.
        </p>
      </Clause>

      <Clause heading="12. Contact">
        <p>
          Questions about these Terms may be sent to{" "}
          <a href="mailto:legal@rentiq.site" className="text-[#e42313] font-medium hover:underline">
            legal@rentiq.site
          </a>
          .
        </p>
      </Clause>
    </>
  );
}

function RenterPolicy() {
  return (
    <>
      <SectionHeading title="Renter Policy" />
      <InfoBox>
        <b className="text-[#e42313] font-bold">Key requirement:</b> Rented items must be returned by
        the agreed deadline in the same condition in which they were received, allowing for
        reasonable wear.
      </InfoBox>

      <Clause heading="1. General Conduct">
        <p>
          Renters are expected to handle every item with care, to use it only for its intended
          purpose, and to follow any operating instructions supplied by the owner. Respectful and
          timely communication with owners is required throughout the rental period.
        </p>
      </Clause>

      <Clause heading="2. Identity Verification">
        <p>
          Renters must complete identity verification before their first booking is confirmed.
          Rentiq may request additional verification for higher-value items and may decline or
          cancel bookings where verification cannot be completed.
        </p>
      </Clause>

      <Clause heading="3. Security Deposits">
        <p>
          Where a listing requires a security deposit, the amount is held at the time of booking and
          released after the item is returned and inspected. Deductions may be applied for damage,
          loss, cleaning beyond normal use, or late return, supported by evidence from the owner.
        </p>
      </Clause>

      <Clause heading="4. Late Returns">
        <p>
          Returning an item after the agreed window incurs a late fee charged at 1.5 times the daily
          rental rate for each additional day or part day. The renter must contact the owner as soon
          as a delay is anticipated. Persistent late returns may result in account restrictions.
        </p>
      </Clause>

      <Clause heading="5. Damage, Loss, and Theft">
        <p>
          If an item is damaged, lost, or stolen while in the renter&apos;s possession, the renter
          must notify the owner and Rentiq support within 24 hours and cooperate with any
          investigation. Charges are assessed on the basis of documented repair quotes or, for
          irreparable loss, the fair replacement value of the item.
        </p>
      </Clause>

      <Clause heading="6. Opening a Dispute">
        <p>
          A renter who disagrees with a deposit deduction may open a dispute within 72 hours of the
          deduction. Rentiq will review the booking record, inspection photos, and messages and
          issue a binding decision.
        </p>
      </Clause>
    </>
  );
}

function OwnerPolicy() {
  return (
    <>
      <SectionHeading title="Owner Policy" />
      <InfoBox>
        <b className="text-[#e42313] font-bold">Key requirement:</b> Listings must accurately
        represent an item&apos;s condition, availability, specifications, and rental terms at all
        times.
      </InfoBox>

      <Clause heading="1. Listing Accuracy">
        <p>
          Photos, descriptions, and pricing must reflect the actual item being offered. Listings
          that are misleading, duplicated, or that misrepresent condition may be removed. Repeat
          violations can lead to suspension of the owner account.
        </p>
      </Clause>

      <Clause heading="2. Availability and Response Time">
        <p>
          Owners must keep their calendar up to date and respond to booking requests within 24
          hours. Confirmed bookings must be honoured; cancelling a confirmed booking without cause
          may result in a penalty and a lowered visibility ranking.
        </p>
      </Clause>

      <Clause heading="3. Handover and Inspection">
        <p>
          At handover and return, owners should record the item&apos;s condition using dated photos
          through the Platform. These records are the primary evidence used to resolve deposit
          disputes.
        </p>
      </Clause>

      <Clause heading="4. Deposit Claims">
        <p>
          A claim against a renter&apos;s security deposit must be submitted within 48 hours of the
          scheduled return, with photos and a repair or replacement estimate. Claims without
          supporting evidence will not be approved.
        </p>
      </Clause>

      <Clause heading="5. Payouts">
        <p>
          Payouts for completed bookings are released to the owner&apos;s wallet 48 hours after the
          renter confirms return, less the platform service fee. Wallet balances may be withdrawn in
          accordance with the payout schedule shown in the vendor dashboard.
        </p>
      </Clause>

      <Clause heading="6. Compliance">
        <p>
          Owners are responsible for ensuring that they have the right to rent each listed item and
          that the item complies with applicable safety and licensing requirements.
        </p>
      </Clause>
    </>
  );
}

function PrivacyPolicy() {
  return (
    <>
      <SectionHeading title="Privacy Policy" />
      <InfoBox>
        <b className="text-[#e42313] font-bold">In short:</b> Personal data is collected and used to
        operate the marketplace, verify users, process payments, and keep the Platform safe. Rentiq
        does not sell personal data.
      </InfoBox>

      <Clause heading="1. Data We Collect">
        <p>Depending on how the Platform is used, Rentiq may collect:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>account and profile details such as name, email address, and phone number;</li>
          <li>identity verification documents and the results of verification checks;</li>
          <li>listing content, booking history, messages, reviews, and dispute records;</li>
          <li>payment and payout information processed through our payment partners; and</li>
          <li>device, log, and approximate location data used for security and analytics.</li>
        </ul>
      </Clause>

      <Clause heading="2. How We Use Data">
        <p>
          Data is used to create and secure accounts, match renters with owners, process bookings
          and payments, provide customer support, resolve disputes, prevent fraud and abuse, comply
          with legal obligations, and improve the Platform.
        </p>
      </Clause>

      <Clause heading="3. Legal Bases">
        <p>
          Rentiq processes personal data to perform its contract with you, to comply with legal
          obligations, to pursue legitimate interests such as platform security, and, where
          required, on the basis of your consent.
        </p>
      </Clause>

      <Clause heading="4. Sharing">
        <p>
          Rentiq shares data with the counterparty of a booking to the extent needed to complete
          the rental, with service providers acting on our instructions (such as payment processors,
          identity verification, cloud hosting, and communications), and with authorities where
          required by law. Rentiq does not sell personal data.
        </p>
      </Clause>

      <Clause heading="5. Retention">
        <p>
          Personal data is retained for as long as an account is active and thereafter for the
          period required to meet legal, accounting, tax, and dispute-resolution obligations, after
          which it is deleted or anonymised.
        </p>
      </Clause>

      <Clause heading="6. Your Rights">
        <p>
          Subject to applicable law, you may request access to, correction of, or deletion of your
          personal data, object to or restrict certain processing, and request a copy of your data
          in a portable format. Requests can be made from account settings or by email.
        </p>
      </Clause>

      <Clause heading="7. Security">
        <p>
          Rentiq uses technical and organisational measures including encryption in transit, access
          controls, and monitoring to protect personal data. No system is completely secure, and
          users are responsible for safeguarding their own credentials.
        </p>
      </Clause>

      <Clause heading="8. Contact">
        <p>
          Privacy questions and requests may be sent to{" "}
          <a href="mailto:privacy@rentiq.site" className="text-[#e42313] font-medium hover:underline">
            privacy@rentiq.site
          </a>
          .
        </p>
      </Clause>
    </>
  );
}
