import Footer from "@/components/footer";
import React from "react";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-app-text p-6 md:p-12 font-sans flex flex-col items-center justify-center">
      {children}
      <Footer />
    </div>
  );
}