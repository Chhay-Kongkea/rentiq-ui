import type { Metadata } from "next";
import DealsContent from "@/components/deals-content";

export const metadata: Metadata = {
  title: "Rental Deals & Promotions | Rentiq",
  description: "Discover promoted rental items from trusted owners on Rentiq.",
};

export default function DealsPage() {
  return <DealsContent />;
}
