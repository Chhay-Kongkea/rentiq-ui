"use client";

import Link from "next/link";
import { LogIn, ShieldCheck } from "lucide-react";
import { loginWithKeycloak } from "@/app/(auth)/login/actions";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LoginForm() {
  return (
    <div className="flex h-screen w-full items-center justify-center overflow-hidden bg-[#F3F4F6] p-4">
      <Card className="mx-auto grid w-full max-w-3xl items-stretch overflow-hidden rounded-3xl border-0 bg-transparent shadow-none md:grid-cols-2">
        <div className="hidden flex-col items-center justify-center p-6 md:flex">
          <img
            src="/img/login.png"
            alt="Authentication illustration"
            className="max-h-[260px] w-auto object-contain"
          />
        </div>

        <div className="flex h-full flex-col justify-between rounded-3xl bg-white p-6 shadow-xl">
          <CardHeader className="space-y-1 p-0 text-center">
            <CardTitle className="text-xl font-bold tracking-tight text-neutral-900">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-xs text-neutral-500">
              Sign in securely to manage your rentals.
            </CardDescription>
          </CardHeader>

          <CardContent className="my-8 space-y-5 p-0 text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-red-50 text-[#FF3333]">
              <ShieldCheck className="size-7" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-semibold text-neutral-800">
                Secure login with Keycloak
              </p>
              <p className="mt-1 text-xs leading-relaxed text-neutral-500">
                You will continue to the secure Keycloak login form.
              </p>
            </div>
            <form action={loginWithKeycloak}>
              <button
                type="submit"
                className="inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-xl bg-[#FF3333] px-2.5 text-xs font-bold tracking-wide text-white shadow-md shadow-red-500/20 transition-all hover:bg-[#e02b2b]"
              >
                <LogIn className="size-4" aria-hidden="true" />
                CONTINUE TO LOGIN
              </button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col gap-2 border-none p-0">
            <p className="text-center text-xs text-neutral-500">
              No account?{" "}
              <Link
                href="/register"
                className="font-semibold text-[#FF3333] hover:underline"
              >
                Sign Up
              </Link>
            </p>
          </CardFooter>
        </div>
      </Card>
    </div>
  );
}
