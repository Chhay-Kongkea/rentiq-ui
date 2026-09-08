import React from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-[#fcfcfd] font-sans text-slate-800">{children}</div>;
}
