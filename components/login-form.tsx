"use client";

import * as React from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";

const ACCENT = "#FF3333";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

// Inline error component with absolute positioning to prevent layout shifting
function AbsoluteError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <span className="absolute -bottom-3.5 left-0 text-[10px] font-medium text-red-500 truncate max-w-full">
      {message}
    </span>
  );
}

export default function LoginForm() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [authError, setAuthError] = React.useState<string | null>(
    "Incorrect email or password"
  );

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    shouldFocusError: false,
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(data: LoginFormValues) {
    setAuthError(null);
    toast("Welcome back!", {
      description: `Logging in as ${data.email}...`,
      position: "bottom-right",
    });
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#F3F4F6] p-4 overflow-hidden">
      <Card className="mx-auto grid w-full max-w-3xl items-stretch overflow-hidden rounded-3xl border-0 bg-transparent shadow-none md:grid-cols-2">
        {/* LEFT: Hero Illustration Panel */}
        <div className="hidden flex-col items-center justify-center p-6 md:flex">
          <img
            src="/img/login.png"
            alt="Authentication Illustration"
            className="max-h-[260px] w-auto object-contain"
          />
        </div>

        {/* RIGHT: Login Card Panel (No scroll, perfectly flush top & bottom) */}
        <div className="flex h-full my-0 flex-col justify-between rounded-3xl bg-white p-6 shadow-xl">
          <CardHeader className="space-y-1 p-0 text-center">
            <CardTitle className="text-xl font-bold tracking-tight text-neutral-900">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-xs text-neutral-500">
              Access your RentAll account to manage your rentals.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-0 space-y-3 my-auto py-2">
            {/* Global Error Banner */}
            {authError && (
              <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50/80 px-3 py-1.5 text-xs font-medium text-[#FF3333]">
                <AlertCircle className="size-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <form
              id="login-form"
              onSubmit={form.handleSubmit(onSubmit)}
              noValidate
              className="space-y-3"
            >
              {/* EMAIL ADDRESS */}
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="relative border-none p-0">
                    <FieldLabel
                      htmlFor="login-form-email"
                      className="text-xs font-semibold text-neutral-700 mb-1"
                    >
                      Email Address
                    </FieldLabel>
                    <Input
                      {...field}
                      id="login-form-email"
                      type="email"
                      aria-invalid={fieldState.invalid}
                      placeholder="e.g. name@example.com"
                      autoComplete="email"
                      className="h-9 rounded-xl border-neutral-200 text-xs focus-visible:ring-1 focus-visible:ring-neutral-400"
                      style={
                        fieldState.invalid
                          ? { borderColor: ACCENT }
                          : undefined
                      }
                    />
                    <AbsoluteError message={fieldState.error?.message} />
                  </Field>
                )}
              />

              {/* PASSWORD */}
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="relative border-none p-0">
                    <div className="flex items-center justify-between mb-1">
                      <FieldLabel
                        htmlFor="login-form-password"
                        className="text-xs font-semibold text-neutral-700"
                      >
                        Password
                      </FieldLabel>
                      
                      {/* FORGOT PASSWORD LINK */}
                      <Link
                        href="/forgot-password"
                        className="text-xs font-medium text-[#FF3333] hover:underline transition-colors"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <InputGroup className="relative">
                      <InputGroupInput
                        {...field}
                        id="login-form-password"
                        type={showPassword ? "text" : "password"}
                        aria-invalid={fieldState.invalid}
                        placeholder="••••••••"
                        autoComplete="current-password"
                        className="h-9 rounded-xl border-neutral-200 text-xs pr-10 focus-visible:ring-1 focus-visible:ring-neutral-400"
                        style={
                          fieldState.invalid
                            ? { borderColor: ACCENT }
                            : undefined
                        }
                      />
                      <InputGroupAddon
                        align="inline-end"
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        <InputGroupButton
                          type="button"
                          size="icon-xs"
                          aria-label="Toggle password visibility"
                          onClick={() => setShowPassword((v) => !v)}
                          className="text-neutral-400 hover:text-neutral-600"
                        >
                          {showPassword ? (
                            <EyeOff className="size-4" />
                          ) : (
                            <Eye className="size-4" />
                          )}
                        </InputGroupButton>
                      </InputGroupAddon>
                    </InputGroup>
                    <AbsoluteError message={fieldState.error?.message} />
                  </Field>
                )}
              />
            </form>
          </CardContent>

          <CardFooter className="flex flex-col gap-2.5 p-0 border-none">
            {/* LOG IN BUTTON */}
            <Button
              type="submit"
              form="login-form"
              className="mt-2 w-full h-9 rounded-xl bg-[#FF3333] font-bold tracking-wide text-xs text-white hover:bg-[#e02b2b] transition-all"
            >
              LOG IN
            </Button>

            {/* DIVIDER */}
            <div className="flex w-full items-center gap-3">
              <div className="h-px flex-1 bg-neutral-200" />
              <span className="text-[10px] font-medium text-neutral-400">
                or continue with
              </span>
              <div className="h-px flex-1 bg-neutral-200" />
            </div>

            {/* SOCIAL BUTTONS */}
            <div className="flex w-full gap-2.5">
              <Button
                type="button"
                variant="outline"
                className="flex-1 h-8 rounded-xl border-neutral-200 font-semibold text-xs text-neutral-700 hover:bg-neutral-50 gap-2"
              >
                <svg className="size-3.5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                Google
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1 h-8 rounded-xl border-neutral-200 font-semibold text-xs text-neutral-700 hover:bg-neutral-50 gap-2"
              >
                <svg className="size-3.5 fill-[#1877F2]" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </Button>
            </div>

            {/* SIGN UP FOOTER LINK */}
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