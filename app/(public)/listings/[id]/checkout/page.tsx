"use client";

import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Info,
  Check,
  Copy,
  Download,
  Share2,
  AlertCircle,
  MapPin,
  Calendar,
  MessageSquare,
  Camera,
  DownloadCloud,
  Flag,
  Fuel,
  Ban,
  Dog,
  CheckCircle2,
  Circle,
  ChevronDown,
  UploadCloud,
  ShieldAlert,
  Clock,
  Phone,
  Receipt,
  HelpCircle,
  X,
} from "lucide-react";

// ==========================================
// MOCK DATA
// ==========================================
const CHECKOUT_MOCK = {
  listing: {
    id: "porsche-911-carrera",
    title: "Porsche 911 Carrera S",
    subtitle: "Stuttgart Edition • 2023 Model",
    owner: "Julian Thorne",
    ownerRating: "4.9",
    ownerReviews: "124",
    ownerAvatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
    category: "LUXURY CAR",
    image:
      "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=800&q=80",
    dailyRate: 299.0,
    location: "San Francisco, CA",
  },
  booking: {
    bookingId: "RQ-882190",
    status: "Approved / Ready for Pickup",
    estimatedPickup: "Tomorrow, 10:00 AM",
    minBookingDays: 2,
    qrCodeUrl:
      "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=RQ-882190",
  },
  fees: {
    platformFee: 42.0,
    securityDeposit: 1000.0,
  },
  policy: {
    cancellation:
      "Free cancellation until 48 hours before the trip. Full refund of security deposit always guaranteed upon safe return.",
    escrowNote: "Held securely in escrow",
  },
};

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function formatDate(date: Date | null) {
  if (!date) return "Select date";
  return (
    date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }) + ", 10:00 AM"
  );
}

// ==========================================
// MAIN COMPONENT
// ==========================================
export default function RentalFlowPage() {
  const data = CHECKOUT_MOCK;

  // View States: "checkout" | "confirmed" | "detail" | "report-issue" | "cancellation-confirmed"
  const [viewState, setViewState] = useState<
    "checkout" | "confirmed" | "detail" | "report-issue" | "cancellation-confirmed"
  >("checkout");

  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState("");

  // Cancellation Modal State
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  // Report Form State
  const [issueCategory, setIssueCategory] = useState("");
  const [issueDescription, setIssueDescription] = useState("");
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);

  // Calendar State (Nov 2026)
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(10);
  const [startDate, setStartDate] = useState<Date | null>(new Date(2026, 10, 12));
  const [endDate, setEndDate] = useState<Date | null>(new Date(2026, 10, 14));
  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleDateClick = (date: Date) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(date);
      setEndDate(null);
    } else if (startDate && !endDate) {
      if (date < startDate) {
        setStartDate(date);
      } else {
        setEndDate(date);
      }
    }
  };

  const getDateStatus = (date: Date) => {
    const time = date.getTime();
    const startTime = startDate ? startDate.getTime() : null;
    const endTime = endDate ? endDate.getTime() : null;
    const hoverTime = hoverDate ? hoverDate.getTime() : null;

    const isStart = startTime && time === startTime;
    const isEnd = endTime && time === endTime;

    let isInRange = false;
    if (startTime && endTime) {
      isInRange = time > startTime && time < endTime;
    } else if (startTime && hoverTime && !endTime) {
      isInRange = time > startTime && time <= hoverTime;
    }

    return { isStart, isEnd, isInRange };
  };

  const calculateDuration = () => {
    if (!startDate || !endDate) return 0;
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const durationDays = calculateDuration();
  const rentalTotal = data.listing.dailyRate * (durationDays || 2);
  const totalPayable =
    durationDays > 0
      ? rentalTotal + data.fees.platformFee + data.fees.securityDeposit
      : 1640.0;

  const copyBookingId = () => {
    navigator.clipboard.writeText(data.booking.bookingId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const confirmCancelAction = () => {
    setShowCancelModal(false);
    setViewState("cancellation-confirmed");
  };

  const renderMonthGrid = (year: number, month: number) => {
    const totalDays = getDaysInMonth(year, month);
    const startDayOfWeek = getFirstDayOfMonth(year, month);
    const prevMonthDays = getDaysInMonth(year, month - 1);

    const leadingPadding = Array.from({ length: startDayOfWeek }, (_, i) => {
      return prevMonthDays - startDayOfWeek + i + 1;
    });

    const days = Array.from({ length: totalDays }, (_, i) => i + 1);

    return (
      <div className="flex-1">
        <h3 className="font-bold text-slate-900 mb-4 text-left text-sm">
          {MONTH_NAMES[month]} {year}
        </h3>

        <div className="grid grid-cols-7 gap-1 text-[11px] text-slate-400 mb-3 font-semibold uppercase text-center">
          <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
        </div>

        <div className="grid grid-cols-7 gap-y-1.5 text-xs text-slate-700 font-medium text-center">
          {leadingPadding.map((dayNum) => (
            <span key={`prev-${dayNum}`} className="text-slate-300 py-1.5 select-none">
              {dayNum}
            </span>
          ))}

          {days.map((day) => {
            const thisDate = new Date(year, month, day);
            const { isStart, isEnd, isInRange } = getDateStatus(thisDate);

            return (
              <div
                key={day}
                onClick={() => handleDateClick(thisDate)}
                onMouseEnter={() => setHoverDate(thisDate)}
                onMouseLeave={() => setHoverDate(null)}
                className={`relative flex items-center justify-center cursor-pointer transition-all ${
                  isInRange ? "bg-rose-100/70 text-[#FF2B2B] font-semibold" : ""
                } ${isStart ? "rounded-l-full bg-rose-100/70" : ""} ${
                  isEnd ? "rounded-r-full bg-rose-100/70" : ""
                }`}
              >
                <span
                  className={`h-7 w-7 flex items-center justify-center rounded-full text-xs font-bold transition ${
                    isStart || isEnd
                      ? "bg-[#FF2B2B] text-white shadow-xs"
                      : "hover:bg-slate-100"
                  }`}
                >
                  {day}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const nextMonthYear = currentMonth === 11 ? currentYear + 1 : currentYear;
  const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;

  return (
    <>
      {/* ==========================================
          CANCELLATION CONFIRMATION MODAL
      ========================================== */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-[#FF2B2B]">
                <AlertCircle className="w-5 h-5" />
                <h3 className="font-extrabold text-slate-900 text-base">Cancel Booking</h3>
              </div>
              <button
                onClick={() => setShowCancelModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Are you sure you want to cancel booking <strong className="text-slate-800">#{data.booking.bookingId}</strong>?
            </p>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Reason for Cancellation
              </label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700 font-medium focus:outline-none focus:border-red-500 cursor-pointer"
              >
                <option value="">Select a reason</option>
                <option value="plans-changed">Change of plans</option>
                <option value="found-alternative">Found another vehicle</option>
                <option value="emergency">Personal emergency</option>
                <option value="other">Other reason</option>
              </select>
            </div>

            <div className="bg-rose-50 border border-rose-100 rounded-2xl p-3.5 space-y-1 text-xs">
              <span className="font-bold text-red-600 block">Cancellation Policy Notice</span>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                A cancellation fee of $150.00 will apply. The remaining $1,090.00 will be refunded to your original payment method.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-3 rounded-xl transition cursor-pointer"
              >
                Keep Booking
              </button>
              <button
                onClick={confirmCancelAction}
                className="flex-1 bg-[#FF2B2B] hover:bg-red-600 text-white font-extrabold text-xs py-3 rounded-xl shadow-md shadow-rose-100 transition cursor-pointer"
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          VIEW 4: REPORT AN ISSUE PAGE
      ========================================== */}
      {viewState === "report-issue" && (
        <div className="min-h-screen bg-[#F4F5F7] text-slate-800 py-10 px-4 sm:px-6 font-sans">
          <div className="mx-auto max-w-5xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  Report an Issue
                </h1>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Were sorry to hear something went wrong. Please provide details so we can assist you promptly.
                </p>
              </div>
              <button
                onClick={() => setViewState("detail")}
                className="text-xs font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 px-4 py-2 rounded-xl transition cursor-pointer"
              >
                ← Back to Details
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-6">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    alert("Dispute submitted successfully!");
                    setViewState("detail");
                  }}
                  className="space-y-5"
                >
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      ISSUE CATEGORY
                    </label>
                    <div className="relative">
                      <select
                        value={issueCategory}
                        onChange={(e) => setIssueCategory(e.target.value)}
                        className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-xs text-slate-700 font-medium focus:border-red-500 focus:bg-white focus:outline-none transition cursor-pointer"
                      >
                        <option value="" disabled>Select an issue category</option>
                        <option value="vehicle-condition">Vehicle Condition / Damage</option>
                        <option value="late-pickup">Late Pickup / No Show</option>
                        <option value="cleanliness">Cleanliness Issue</option>
                        <option value="incorrect-listing">Incorrect Listing Details</option>
                        <option value="other">Other Issue</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      DETAILED DESCRIPTION
                    </label>
                    <textarea
                      rows={5}
                      value={issueDescription}
                      onChange={(e) => setIssueDescription(e.target.value)}
                      placeholder="Describe the issue in detail. The more information you provide, the faster we can resolve it."
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 p-4 text-xs text-slate-700 font-medium focus:border-red-500 focus:bg-white focus:outline-none transition resize-none placeholder:text-slate-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      EVIDENCE & PHOTOS
                    </label>
                    <label className="border-2 border-dashed border-indigo-100 bg-indigo-50/30 hover:bg-indigo-50/60 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition group">
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => setEvidenceFile(e.target.files?.[0] || null)}
                        accept="image/png, image/jpeg, image/webp"
                      />
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 shadow-2xs flex items-center justify-center text-slate-500 group-hover:scale-105 transition">
                        <UploadCloud className="w-5 h-5 text-slate-400" />
                      </div>
                      <span className="text-xs font-bold text-slate-800 mt-3">
                        Click to upload or drag and drop
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium mt-0.5">
                        PNG, JPG or WEBP (Max. 10MB per file)
                      </span>
                      {evidenceFile && (
                        <span className="mt-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                          Selected: {evidenceFile.name}
                        </span>
                      )}
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#FF2B2B] hover:bg-red-600 text-white font-extrabold text-xs py-3.5 rounded-2xl shadow-md shadow-rose-100 flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <ShieldAlert className="w-4 h-4" />
                    SUBMIT DISPUTE
                  </button>

                  <p className="text-[10px] text-center text-slate-400 font-medium">
                    By submitting, you agree to our{" "}
                    <a href="#" className="text-red-500 hover:underline">
                      Dispute Policy
                    </a>
                  </p>
                </form>
              </div>

              <div className="lg:col-span-5 space-y-5">
                <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
                  <div className="relative h-44 w-full">
                    <img
                      src={data.listing.image}
                      alt={data.listing.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-3 left-3 bg-red-600 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                      Active Rental
                    </span>
                  </div>

                  <div className="p-5 space-y-3">
                    <h3 className="font-extrabold text-slate-900 text-base">
                      {data.listing.title}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium flex items-center gap-2">
                      <span>Oct 12 - Oct 15</span>
                      <span>•</span>
                      <span>{data.listing.location}</span>
                    </p>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-400">Rental ID:</span>
                      <span className="text-slate-800 font-bold">#{data.booking.bookingId}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-rose-50/50 border border-rose-100 rounded-3xl p-5 space-y-3">
                  <div className="flex items-center gap-2 text-[#FF2B2B]">
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    <h4 className="text-xs font-extrabold tracking-wider uppercase">
                      ESCROW PROTECTION ACTIVE
                    </h4>
                  </div>

                  <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                    Your payment is held securely in Rentiqs escrow system. By filing this report, the payout to the owner is automatically paused. Our resolution team will review the evidence provided and mediate a fair outcome within 48 hours.
                  </p>

                  <ul className="space-y-2 text-[11px] font-semibold text-slate-700 pt-1">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      <span>Funds are frozen until resolution.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      <span>Fair mediation by certified agents.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      <span>Full refund eligibility for valid claims.</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200/80 p-5 space-y-4 shadow-xs">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    WHAT HAPPENS NEXT?
                  </h4>

                  <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                    <div className="relative">
                      <div className="w-5 h-5 rounded-full bg-red-500 text-white absolute -left-6 top-0 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                      </div>
                      <p className="text-xs font-bold text-slate-900">Submission</p>
                      <p className="text-[10px] text-slate-400 font-medium">
                        Your report and photos are sent to our dispute department.
                      </p>
                    </div>

                    <div className="relative">
                      <Circle className="w-5 h-5 text-slate-300 absolute -left-6 top-0 bg-white" />
                      <p className="text-xs font-bold text-slate-600">Review & Outreach</p>
                      <p className="text-[10px] text-slate-400 font-medium">
                        We contact the other party for their perspective and details.
                      </p>
                    </div>

                    <div className="relative">
                      <Circle className="w-5 h-5 text-slate-300 absolute -left-6 top-0 bg-white" />
                      <p className="text-xs font-bold text-slate-600">Final Resolution</p>
                      <p className="text-[10px] text-slate-400 font-medium">
                        An impartial decision is made based on evidence provided.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          VIEW 5: CANCELLATION CONFIRMED PAGE
      ========================================== */}
      {viewState === "cancellation-confirmed" && (
        <div className="min-h-screen bg-[#F4F5F7] text-slate-800 py-12 px-4 sm:px-6 flex flex-col justify-between items-center font-sans">
          <div className="w-full max-w-xl space-y-6">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#FF2B2B] text-white shadow-md">
                <Check className="w-6 h-6 stroke-[3]" />
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Cancellation Confirmed
              </h1>
              <p className="text-xs text-slate-500 font-medium max-w-sm mx-auto">
                Your booking has been successfully cancelled. A refund process has been initiated.
              </p>
            </div>

            <div className="bg-white rounded-3xl border border-rose-100/80 p-6 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 text-[#FF2B2B]">
                <Receipt className="w-4 h-4" />
                <span className="text-xs font-extrabold uppercase tracking-wider">
                  Refund breakdown
                </span>
              </div>

              <div className="space-y-3 text-xs font-medium pt-1">
                <div className="flex justify-between text-slate-500">
                  <span>Original Total</span>
                  <span className="text-slate-900 font-extrabold">$1,240.00</span>
                </div>

                <div className="flex justify-between text-[#FF2B2B]">
                  <span>Cancellation Fee</span>
                  <span className="font-extrabold">-$150.00</span>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
                  <span className="text-slate-700 font-bold">Amount to be refunded</span>
                  <span className="text-lg font-black text-[#FF2B2B]">$1,090.00</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-3xl border border-rose-100/80 p-5 shadow-2xs space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-[#FF2B2B]">
                    <Clock className="w-4 h-4" />
                    <span className="text-[10px] font-extrabold uppercase tracking-wider">
                      ESTIMATED ARRIVAL
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                    The refund will be credited back to your original payment method (Visa ending in 4242).
                  </p>
                </div>

                <div className="bg-[#F0F3FA] text-slate-700 text-xs font-bold px-3 py-2.5 rounded-xl flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>3-5 business days</span>
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-rose-100/80 p-5 shadow-2xs space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-[#FF2B2B]">
                    <HelpCircle className="w-4 h-4" />
                    <span className="text-[10px] font-extrabold uppercase tracking-wider">
                      NEED ASSISTANCE?
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                    Our support team is available 24/7 for any questions regarding your refund.
                  </p>
                </div>

                <div className="space-y-2 pt-1">
                  <button className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200/60 text-slate-700 text-xs font-bold py-2.5 px-3 rounded-xl flex items-center justify-between transition cursor-pointer">
                    <span className="flex items-center gap-2">
                      <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                      Live Chat Support
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  <button className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200/60 text-slate-700 text-xs font-bold py-2.5 px-3 rounded-xl flex items-center justify-between transition cursor-pointer">
                    <span className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      Call Help Desk
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </div>
              </div>
            </div>

            <div className="relative rounded-3xl overflow-hidden h-36 border border-slate-200/80 shadow-xs">
              <img
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80"
                alt="City Skyline"
                className="w-full h-full object-cover brightness-[0.4]"
              />
              <div className="absolute inset-0 p-5 flex flex-col justify-end text-white">
                <p className="text-xs font-bold">Find your next perfect stay</p>
                <p className="text-[10px] text-slate-300 font-medium mt-0.5">
                  Explore our curated collection of luxury properties and exclusive deals.
                </p>
              </div>
            </div>

            <div className="text-center pt-2">
              <button
                onClick={() => setViewState("checkout")}
                className="bg-[#FF2B2B] hover:bg-red-600 text-white font-extrabold text-xs px-8 py-3.5 rounded-full shadow-md shadow-rose-200 transition cursor-pointer"
              >
                Return to Homepage
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          VIEW 3: BOOKING DETAIL PAGE
      ========================================== */}
      {viewState === "detail" && (
        <div className="min-h-screen bg-[#F4F5F7] text-slate-800 py-8 px-4 sm:px-8">
          <div className="mx-auto max-w-5xl space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400 font-medium mb-1">
                  <button onClick={() => setViewState("checkout")} className="hover:underline">My Bookings</button> &gt; ID: {data.booking.bookingId}
                </div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-black text-slate-900">
                    Booking <span className="text-[#FF2B2B]">Detail</span>
                  </h1>
                  <span className="inline-flex items-center gap-1.5 bg-green-100/80 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    {data.booking.status}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    Estimated Pickup: {data.booking.estimatedPickup}
                  </span>
                </div>
              </div>

              {/* ACTION: TRIGGER CANCELLATION MODAL */}
              <button
                onClick={() => setShowCancelModal(true)}
                className="text-xs font-bold text-rose-500 bg-rose-50 border border-rose-200 hover:bg-rose-100 px-4 py-2 rounded-xl transition cursor-pointer"
              >
                Cancel Booking
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              <div className="lg:col-span-8 space-y-5">
                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col sm:flex-row items-start justify-between gap-4">
                  <div className="flex gap-4">
                    <img
                      src={data.listing.image}
                      alt={data.listing.title}
                      className="w-36 h-24 rounded-xl object-cover"
                    />
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase">
                        {data.listing.category}
                      </span>
                      <h3 className="font-extrabold text-slate-900 text-lg leading-tight">
                        {data.listing.title}
                      </h3>
                      <p className="text-xs text-slate-400 font-medium">
                        {data.listing.subtitle}
                      </p>

                      <div className="flex items-center gap-2 pt-2">
                        <img
                          src={data.listing.ownerAvatar}
                          alt={data.listing.owner}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span className="text-xs font-bold text-slate-700">
                          {data.listing.owner}
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold">
                          ★ {data.listing.ownerRating} ({data.listing.ownerReviews} reviews)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-end justify-between w-full sm:w-auto h-full space-y-3">
                    <div className="text-right">
                      <p className="text-[10px] text-slate-400 font-medium uppercase">Total Amount</p>
                      <p className="text-xl font-black text-[#FF2B2B]">
                        ${totalPayable.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition cursor-pointer">
                      <MessageSquare className="w-3.5 h-3.5" />
                      Contact Owner
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <div className="md:col-span-4 bg-slate-50 border border-slate-100 rounded-xl p-3 flex flex-col items-center justify-center text-center space-y-2">
                      <span className="text-[10px] font-bold text-slate-700 uppercase">Pickup QR Code</span>
                      <div className="p-2 bg-white rounded-lg border border-slate-100 shadow-2xs">
                        <img src={data.booking.qrCodeUrl} alt="QR Code" className="w-24 h-24" />
                      </div>
                      <p className="text-[9px] text-slate-400 font-medium leading-tight">
                        Show this to the owner at the time of pickup.
                      </p>
                    </div>

                    <div className="md:col-span-8 space-y-3">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        BOOKING DETAILS
                      </h4>
                      
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="bg-slate-50 p-3 rounded-xl">
                          <span className="text-[10px] text-slate-400 block font-medium">Dates</span>
                          <span className="font-extrabold text-slate-900">Nov 12 - Nov 14</span>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-xl">
                          <span className="text-[10px] text-slate-400 block font-medium">Duration</span>
                          <span className="font-extrabold text-slate-900">{durationDays || 2} Days</span>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-xl">
                          <span className="text-[10px] text-slate-400 block font-medium">Security Deposit</span>
                          <span className="font-extrabold text-amber-600">Hold in Escrow</span>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-xl">
                          <span className="text-[10px] text-slate-400 block font-medium">Payment Status</span>
                          <span className="font-extrabold text-slate-900">Awaiting Pickup</span>
                        </div>
                      </div>

                      <div className="bg-rose-50/60 border border-rose-100 rounded-xl p-3 flex items-start gap-2 text-rose-900">
                        <AlertCircle className="w-4 h-4 text-[#FF2B2B] shrink-0 mt-0.5" />
                        <p className="text-[10px] font-medium leading-relaxed">
                          Pay the owner directly when you meet. The owner scans this QR code to confirm both pickup and payment automatically.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
                  <h4 className="text-xs font-extrabold text-slate-900">Inspection Records</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="border-2 border-dashed border-rose-200 bg-rose-50/30 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-rose-50/60 transition">
                      <Camera className="w-6 h-6 text-[#FF2B2B] mb-2" />
                      <span className="text-xs font-extrabold text-slate-800">Check-in Photos</span>
                      <span className="text-[10px] text-slate-400 font-medium">Upload photos at pickup (Required)</span>
                    </div>

                    <div className="border border-slate-100 bg-slate-50/60 rounded-2xl p-6 flex flex-col items-center justify-center text-center opacity-60">
                      <Camera className="w-6 h-6 text-slate-400 mb-2" />
                      <span className="text-xs font-bold text-slate-600">Check-out Photos</span>
                      <span className="text-[10px] text-slate-400 font-medium">Enabled after rental starts</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 space-y-5">
                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    TIMELINE
                  </h4>

                  <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                    <div className="relative">
                      <CheckCircle2 className="w-4 h-4 text-[#FF2B2B] absolute -left-6 top-0 bg-white" />
                      <p className="text-xs font-bold text-slate-900">Booking Requested</p>
                      <p className="text-[10px] text-slate-400 font-medium">Nov 10, 2026 • 02:30 PM</p>
                    </div>

                    <div className="relative">
                      <CheckCircle2 className="w-4 h-4 text-[#FF2B2B] absolute -left-6 top-0 bg-white" />
                      <p className="text-xs font-bold text-slate-900">Request Approved</p>
                      <p className="text-[10px] text-slate-400 font-medium">Nov 10, 2026 • 04:15 PM</p>
                    </div>

                    <div className="relative">
                      <div className="w-4 h-4 rounded-full border-2 border-[#FF2B2B] bg-white absolute -left-6 top-0 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#FF2B2B]"></div>
                      </div>
                      <p className="text-xs font-bold text-[#FF2B2B]">Awaiting QR Scan</p>
                      <p className="text-[10px] text-slate-400 font-medium">Pending pickup on Nov 12</p>
                    </div>

                    <div className="relative opacity-40">
                      <Circle className="w-4 h-4 text-slate-300 absolute -left-6 top-0 bg-white" />
                      <p className="text-xs font-bold text-slate-700">Item Returned</p>
                    </div>

                    <div className="relative opacity-40">
                      <Circle className="w-4 h-4 text-slate-300 absolute -left-6 top-0 bg-white" />
                      <p className="text-xs font-bold text-slate-700">Booking Completed</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 space-y-2">
                    <button className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer">
                      <DownloadCloud className="w-4 h-4" />
                      Download Receipt
                    </button>

                    <button
                      onClick={() => setViewState("report-issue")}
                      className="w-full text-center text-xs font-bold text-rose-500 hover:underline flex items-center justify-center gap-1 py-1 cursor-pointer"
                    >
                      <Flag className="w-3 h-3" /> Report an Issue
                    </button>
                  </div>
                </div>

                <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-5 space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    QUICK RULES
                  </h4>

                  <div className="space-y-3 text-xs">
                    <div className="flex items-start gap-2.5">
                      <Fuel className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-slate-800">Full to Full</p>
                        <p className="text-[10px] text-slate-500">Return the vehicle with a full tank of premium gas.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <Ban className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-slate-800">No Smoking</p>
                        <p className="text-[10px] text-slate-500">Cleaning fees up to $250 apply if violated.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <Dog className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-slate-800">No Pets</p>
                        <p className="text-[10px] text-slate-500">Allergic reactions may occur for future renters.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          VIEW 2: BOOKING CONFIRMED PAGE
      ========================================== */}
      {viewState === "confirmed" && (
        <div className="min-h-screen bg-[#F4F5F7] text-slate-800 py-12 px-4 sm:px-6 flex flex-col justify-between items-center">
          <div className="w-full max-w-2xl space-y-6">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#FF2B2B] text-white shadow-md">
                <Check className="w-6 h-6 stroke-[3]" />
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Booking <span className="text-[#FF2B2B]">Confirmed!</span>
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Your rental request has been approved by the owner.
              </p>

              <div className="inline-flex items-center gap-1.5 bg-slate-200/60 text-slate-700 px-3 py-1 rounded-md text-[11px] font-bold">
                <span>BOOKING ID:</span>
                <span className="text-slate-900">{data.booking.bookingId}</span>
                <button
                  onClick={copyBookingId}
                  className="hover:text-[#FF2B2B] transition cursor-pointer ml-0.5"
                  title="Copy ID"
                >
                  {copied ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="flex flex-col items-center justify-center p-4 border-b md:border-b-0 md:border-r border-slate-100 text-center space-y-2">
                <div className="p-3 bg-white rounded-2xl border border-slate-100 shadow-inner">
                  <img
                    src={data.booking.qrCodeUrl}
                    alt="Pickup QR Code"
                    className="w-40 h-40 object-contain"
                  />
                </div>
                <p className="text-[10px] font-bold tracking-wide uppercase text-[#FF2B2B] mt-2">
                  PICKUP QR CODE
                </p>
                <p className="text-[10px] text-slate-400 font-medium leading-tight max-w-[200px]">
                  Show this to the owner during the meetup to confirm pickup and release payment.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">Total Due at Pickup</span>
                  <span className="text-xl font-black text-[#FF2B2B]">
                    ${totalPayable.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="bg-blue-50/60 border border-blue-100/80 rounded-2xl p-3.5 flex items-start gap-2.5 text-blue-950">
                  <AlertCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <p className="text-[10px] leading-relaxed font-medium">
                    <strong>Instructions:</strong> Pay the owner directly when you meet. The owner scans this QR to confirm both pickup and payment.
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  <div className="flex gap-2">
                    <button className="flex-1 bg-[#FF2B2B] hover:bg-red-600 text-white font-extrabold text-xs py-3 rounded-xl shadow-md shadow-rose-100 flex items-center justify-center gap-2 transition cursor-pointer">
                      <Download className="w-3.5 h-3.5" /> Download QR
                    </button>
                    <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-3 rounded-xl transition cursor-pointer">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setViewState("detail")}
                      className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs py-2.5 rounded-xl transition cursor-pointer"
                    >
                      View Booking Details
                    </button>
                    <button
                      onClick={() => setShowCancelModal(true)}
                      className="bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-500 font-bold text-xs px-3 py-2.5 rounded-xl transition cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 flex items-center justify-between shadow-2xs">
              <div className="flex items-center gap-3">
                <img src={data.listing.image} alt={data.listing.title} className="w-14 h-11 rounded-lg object-cover" />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 text-xs">{data.listing.title}</h4>
                    <span className="bg-rose-100 text-[#FF2B2B] text-[8px] font-bold px-1.5 py-0.5 rounded uppercase">{data.listing.category}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-slate-400 font-medium mt-1">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Nov 12 - Nov 14 ({durationDays || 2} days)</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {data.listing.owner}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          VIEW 1: INITIAL CHECKOUT / DATE SELECTION
      ========================================== */}
      {viewState === "checkout" && (
        <div className="min-h-screen bg-[#F4F5F7] text-slate-800 py-10 px-4 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                Select your <span className="text-[#FF2B2B]">dates</span>
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Choose the start and end date for your rental. Minimum booking duration is {data.booking.minBookingDays} days.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button onClick={handlePrevMonth} className="p-1.5 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-600 cursor-pointer">
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <button onClick={handleNextMonth} className="p-1.5 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-600 cursor-pointer">
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                    <button onClick={() => { setStartDate(null); setEndDate(null); }} className="text-xs font-bold text-[#FF2B2B] hover:underline cursor-pointer">
                      Clear selection
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {renderMonthGrid(currentYear, currentMonth)}
                    {renderMonthGrid(nextMonthYear, nextMonth)}
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center gap-6 text-xs text-slate-500 font-medium">
                    <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#FF2B2B]"></span><span>Selected</span></div>
                    <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-slate-200"></span><span>Available</span></div>
                    <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-slate-300"></span><span>Blocked</span></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Message to owner (optional)</label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Introduce yourself and tell the owner about your plans..."
                    className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-xs text-slate-800 focus:border-[#FF2B2B] focus:outline-none transition"
                  />
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-6">
                  <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
                    <img src={data.listing.image} alt={data.listing.title} className="w-20 h-16 rounded-xl object-cover" />
                    <div className="space-y-1">
                      <h3 className="font-bold text-slate-900 text-base leading-tight">{data.listing.title}</h3>
                      <p className="text-[11px] text-slate-400 font-medium">Managed by {data.listing.owner}</p>
                      <span className="inline-block bg-slate-100 text-slate-600 text-[9px] font-bold px-2 py-0.5 rounded-md uppercase">{data.listing.category}</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs border-b border-slate-100 pb-4">
                    <div className="flex justify-between"><span className="text-slate-500">Duration</span><span className="font-bold text-slate-900">{durationDays > 0 ? `${durationDays} days selected` : "Select dates"}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Pick-up</span><span className="font-bold text-slate-900">{formatDate(startDate)}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Drop-off</span><span className="font-bold text-slate-900">{formatDate(endDate)}</span></div>
                  </div>

                  <div className="space-y-2.5 text-xs border-b border-slate-100 pb-4 text-slate-600">
                    <div className="flex justify-between"><span>${data.listing.dailyRate.toFixed(2)} × {durationDays || 2} days</span><span className="font-bold text-slate-900">${rentalTotal.toFixed(2)}</span></div>
                    <div className="flex justify-between items-center"><span className="flex items-center gap-1">Platform Fee <Info className="h-3 w-3 text-slate-400" /></span><span className="font-bold text-slate-900">${data.fees.platformFee.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span>Security Deposit (Refundable)</span><span className="font-bold text-slate-900">${data.fees.securityDeposit.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span></div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Payable</span>
                      <span className="text-2xl font-black text-[#FF2B2B]">${totalPayable.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium"><ShieldCheck className="h-3.5 w-3.5 text-rose-500" /><span>{data.policy.escrowNote}</span></div>
                  </div>

                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3.5 space-y-1 text-slate-600">
                    <p className="text-[11px] font-bold text-slate-900">Cancellation Policy</p>
                    <p className="text-[10px] text-slate-500 leading-relaxed">{data.policy.cancellation}</p>
                  </div>

                  <button 
                    onClick={() => setViewState("confirmed")}
                    disabled={durationDays < data.booking.minBookingDays}
                    className={`w-full font-extrabold text-sm py-3.5 rounded-2xl shadow-lg transition ${
                      durationDays < data.booking.minBookingDays
                        ? "bg-slate-300 text-slate-500 cursor-not-allowed shadow-none"
                        : "bg-[#FF2B2B] hover:bg-red-600 text-white shadow-rose-200 cursor-pointer"
                    }`}
                  >
                    {durationDays < data.booking.minBookingDays
                      ? `Select min. ${data.booking.minBookingDays} days`
                      : "Confirm Booking"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}