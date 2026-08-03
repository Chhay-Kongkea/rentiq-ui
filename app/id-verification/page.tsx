"use client";

const STEPS = [
  { key: "upload", label: "Upload Documents", sub: "Completed on Oct 2", status: "done" },
  { key: "review", label: "Verification Review", sub: "Action Required", status: "current" },
  { key: "verified", label: "Verified Access", sub: "Pending success", status: "upcoming" },
] as const;

export default function IdVerificationStatusPage() {
  const handleReupload = () => {
    // TODO: open file picker / navigate to re-upload flow
    console.log("re-upload documents");
  };

  const handleCancel = () => {
    // TODO: navigate back
    console.log("cancel");
  };

  return (
    <div className="min-h-screen bg-[#f3f1ee] text-[#1a1a1a]">
      {/* Header */}
      <header className="bg-white border-b border-[#e9e7e4] px-6 md:px-10 py-4">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between mb-5">
          <div className="flex items-center gap-1.5 font-extrabold text-xl text-[#e42313]">
            <span className="w-7 h-7 bg-[#e42313] rounded-md flex items-center justify-center text-white text-base">
              R
            </span>
            Rentiq
          </div>

          <nav className="hidden md:flex items-center gap-9">
            <a href="#" className="flex items-center gap-2 text-[15px] font-medium text-[#222]">
              🏠 Homes
            </a>
            <a href="#" className="flex items-center gap-2 text-[15px] font-medium text-[#222]">
              🏷️ Deals
            </a>
            <a href="#" className="flex items-center gap-2 text-[15px] font-medium text-[#222]">
              🔄 Request
            </a>
          </nav>

          <div className="flex gap-2.5">
            <button className="w-9 h-9 rounded-full bg-[#f0efec] flex items-center justify-center text-sm text-[#555]">
              🌐
            </button>
            <button className="w-9 h-9 rounded-full bg-[#f0efec] flex items-center justify-center text-sm text-[#555]">
              ☰
            </button>
          </div>
        </div>

        {/* Search bar */}
        <div className="max-w-[600px] mx-auto">
          <div className="flex items-center border border-[#e9e7e4] rounded-full py-1 pl-6 pr-1.5 shadow-sm bg-white">
            <div className="flex-1">
              <p className="text-xs font-bold m-0">Categories</p>
              <p className="text-[11px] text-[#9ca3af] m-0">Many choices for you</p>
            </div>
            <div className="w-px h-8 bg-[#e9e7e4] mx-4" />
            <div className="flex-1">
              <p className="text-xs font-bold m-0">Where</p>
              <p className="text-[11px] text-[#9ca3af] m-0">Search destinations</p>
            </div>
            <div className="w-px h-8 bg-[#e9e7e4] mx-4" />
            <div className="flex-1">
              <p className="text-xs font-bold m-0">When</p>
              <p className="text-[11px] text-[#9ca3af] m-0">Add dates</p>
            </div>
            <button className="w-9 h-9 rounded-full bg-[#e42313] text-white flex items-center justify-center ml-2 flex-shrink-0">
              🔍
            </button>
          </div>
        </div>
      </header>

      {/* Page title */}
      <div className="text-center px-5 pt-12 pb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold m-0">
          <span className="text-[#1f3a8f]">ID Verification</span>{" "}
          <span className="text-[#e42313]">Status</span>
        </h1>
      </div>

      {/* Card */}
      <div className="max-w-[820px] mx-auto px-6 pb-16">
        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
          {/* Header row */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-extrabold mb-1">Identity Verification</h2>
              <p className="text-sm text-[#6b7280] m-0">
                Verify your official government documents to gain full marketplace access.
              </p>
            </div>
            <span className="flex items-center gap-1.5 bg-[#fdecea] text-[#e42313] text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap">
              ⓘ Rejected
            </span>
          </div>

          {/* Admin feedback */}
          <div className="flex gap-3 border-l-4 border-[#e42313] bg-[#fdf3f2] rounded-lg px-4 py-3 mb-7">
            <span className="text-[#e42313] text-sm mt-0.5">💬</span>
            <div>
              <p className="text-xs font-bold text-[#e42313] tracking-wide mb-1">
                ADMIN FEEDBACK
              </p>
              <p className="text-sm text-[#4b5563] leading-relaxed m-0">
                &quot;The photo of the back of your ID is too blurry to read the barcode. Please
                ensure you are in a well-lit area and the text is sharp before re-uploading.&quot;
              </p>
            </div>
          </div>

          {/* Document previews */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
            <div>
              <p className="text-xs font-bold tracking-wide text-[#374151] mb-2">FRONT OF ID</p>
              <div className="relative aspect-[16/10] rounded-lg bg-[#dbe6f2] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 backdrop-blur-sm bg-white/10" />
                <span className="relative flex flex-col items-center gap-1 text-[#6b7fa3] text-xs">
                  <span className="text-lg">🚫</span>
                  Front view blurred
                </span>
              </div>
            </div>
            <div>
              <p className="text-xs font-bold tracking-wide text-[#374151] mb-2">BACK OF ID</p>
              <div className="relative aspect-[16/10] rounded-lg border-2 border-[#f3b4ac] bg-[#fbe9e7] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 backdrop-blur-sm bg-white/10" />
                <span className="relative flex flex-col items-center gap-1 text-[#e42313] text-xs font-medium">
                  <span className="text-lg">⚠️</span>
                  Image Issue Detected
                </span>
              </div>
            </div>
          </div>

          <hr className="border-[#e9e7e4] mb-5" />

          {/* Policy note + actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="flex items-start gap-2 text-xs text-[#6b7280] max-w-[420px] m-0">
              <span className="text-[#e42313] mt-0.5">🛡️</span>
              <span>
                <b className="text-[#374151]">Verification Policy:</b> Verified ID required to
                list items and complete bookings. Your documents are stored using AES-256
                encryption and are never shared with third parties.
              </span>
            </p>
            <div className="flex gap-2.5 flex-shrink-0">
              <button
                onClick={handleCancel}
                className="border border-[#e9e7e4] text-[#374151] font-medium text-sm px-5 py-2.5 rounded-lg hover:bg-[#f7f6f4] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReupload}
                className="flex items-center gap-1.5 bg-[#e42313] hover:bg-[#c91c0f] text-white font-bold text-sm px-5 py-2.5 rounded-lg transition-colors whitespace-nowrap"
              >
                ⬆ Re-upload Documents
              </button>
            </div>
          </div>
        </div>

        {/* Stepper */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          {STEPS.map((step) => (
            <div
              key={step.key}
              className={`relative rounded-xl border p-4 text-center ${
                step.status === "current"
                  ? "border-[#e42313] bg-white shadow-sm"
                  : "border-[#e9e7e4] bg-white/60"
              }`}
            >
              {step.status === "current" && (
                <span className="absolute -top-2 right-3 bg-[#e42313] text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                  CURRENT
                </span>
              )}
              <div
                className={`w-7 h-7 mx-auto mb-2 rounded-full flex items-center justify-center text-xs ${
                  step.status === "done"
                    ? "bg-[#22c55e] text-white"
                    : step.status === "current"
                    ? "bg-[#e42313] text-white"
                    : "bg-[#e9e7e4] text-[#9ca3af]"
                }`}
              >
                {step.status === "done" ? "✓" : step.status === "current" ? "✕" : "○"}
              </div>
              <p
                className={`text-sm font-bold m-0 ${
                  step.status === "upcoming" ? "text-[#9ca3af]" : "text-[#1a1a1a]"
                }`}
              >
                {step.label}
              </p>
              <p className="text-[11px] text-[#9ca3af] mt-0.5 m-0">{step.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-[#e9e7e4] px-6 md:px-10 pt-12 pb-6">
        <div className="max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-6 gap-6">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-1.5 font-extrabold text-lg text-[#e42313] mb-3">
              <span className="w-7 h-7 bg-[#e42313] rounded-md flex items-center justify-center text-white text-base">
                R
              </span>
              Rentiq
            </div>
            <p className="text-[13px] text-[#6b7280] leading-relaxed max-w-[220px]">
              Cambodia&apos;s trusted marketplace for renting anything, anywhere.
            </p>
            <div className="flex gap-2.5 mt-4">
              {["f", "𝕏", "◎", "♪", "▶"].map((s, i) => (
                <span
                  key={i}
                  className="w-[30px] h-[30px] rounded-full bg-[#f0efec] flex items-center justify-center text-[13px] text-[#555]"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          <FooterCol title="Product" links={["Categories", "Pricing", "For Vendors", "Features"]} />
          <FooterCol title="Company" links={["About Us", "Careers", "Blog", "Press"]} />
          <FooterCol title="Support" links={["Help Center", "Contact Us", "FAQs", "Safety Tips"]} />
          <FooterCol
            title="Legal"
            links={["Privacy Policy", "Terms of Service", "Cookie Policy", "Community Guidelines"]}
          />

          <div className="bg-[#f7f6f4] rounded-xl p-4">
            <h5 className="text-[13px] font-bold mb-1">Download the App</h5>
            <p className="text-xs text-[#6b7280] mb-3">Rent on the go, anytime.</p>
            <div className="flex items-center gap-2 bg-black text-white rounded-lg px-3 py-2 text-xs mb-2">
              ▶ Get it on
              <br />
              Google Play
            </div>
            <div className="flex items-center gap-2 bg-black text-white rounded-lg px-3 py-2 text-xs">
              🍎 Download on
              <br />
              App Store
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-[#6b7280] mt-9 pt-5 border-t border-[#e9e7e4]">
          © 2026 RentalHub. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

function FooterCol({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h5 className="text-sm font-bold mb-3.5">{title}</h5>
      {links.map((link) => (
        <a key={link} href="#" className="block text-[13px] text-[#6b7280] mb-2.5">
          {link}
        </a>
      ))}
    </div>
  );
}