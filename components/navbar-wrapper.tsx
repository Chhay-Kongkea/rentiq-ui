"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "./navbar";


export default function NavbarWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Pages where the Navbar should NOT appear
  const authRoutes = ["/login", "/register", "/forget-password"];

  const isAuthPage = authRoutes.includes(pathname);
  const isAdminPage = pathname.startsWith("/admin");
  const isVendorDashboard = pathname.startsWith("/vendor/dashboard");
  const shouldHideNavbar = isAuthPage || isAdminPage || isVendorDashboard;

  return (
    <>
      {!shouldHideNavbar && <Navbar />}
      {isAuthPage ? (
        <main className="flex min-h-screen w-full items-center justify-center p-4 md:p-8">
          {children}
        </main>
      ) : isAdminPage || isVendorDashboard ? (
        children
      ) : (
        <main>{children}</main>
      )}
    </>
  );
}
