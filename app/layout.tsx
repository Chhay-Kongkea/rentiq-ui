import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import NavbarWrapper from "@/components/navbar-wrapper";
import StoreProvider from "./store-provider";
import AuthSessionProvider from "./auth-session-provider";
import { ThemeProvider } from "@/components/theme-provider";

const plusJakartaSans = Plus_Jakarta_Sans({ variable: "--font-plus-jakarta", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = { title: "Rentiq", description: "Create your account" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${plusJakartaSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full w-full bg-white font-sans text-neutral-900">
        <AuthSessionProvider>
          <ThemeProvider>
            <StoreProvider>
              <NavbarWrapper>{children}</NavbarWrapper>
              <Toaster position="top-center" richColors closeButton />
            </StoreProvider>
          </ThemeProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}