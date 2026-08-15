import React from "react";

export default function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background font-sans text-app-text">
      {children}
    </div>
  );
}
