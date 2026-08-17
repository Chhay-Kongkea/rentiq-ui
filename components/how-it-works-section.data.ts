import { Calendar, QrCode, RotateCcw, Search } from "lucide-react";

export const HOW_IT_WORKS_STEPS = [
  {
    icon: Search,
    title: "Search",
    description: "Browse or filter by category, location & price",
    iconBg: "bg-[#00B4D8]",
  },
  {
    icon: Calendar,
    title: "Book",
    description: "Pick your dates and confirm the booking",
    iconBg: "bg-[#06D6A0]",
  },
  {
    icon: QrCode,
    title: "QR Pickup",
    description: "Show QR code, owner scans to confirm handover",
    iconBg: "bg-[#FF2B2B]",
  },
  {
    icon: RotateCcw,
    title: "Return",
    description: "Return on time, leave a review, done",
    iconBg: "bg-[#3A86EF]",
  },
] as const;
