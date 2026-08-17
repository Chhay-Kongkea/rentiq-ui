"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { useRegisterMutation } from "@/redux/services/authApi";

const ACCENT = "#F73030";

const formSchema = z
  .object({
    firstName: z.string().min(1, "First name required"),
    lastName: z.string().min(1, "Last name required"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email"),
    password: z.string().min(8, "Min 8 characters"),
    confirmPassword: z.string().min(1, "Confirm password"),
    agreeTerms: z.boolean().refine((val) => val === true, {
      message: "Required",
    }),
    agreePrivacy: z.boolean().refine((val) => val === true, {
      message: "Required",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type SignupFormValues = z.infer<typeof formSchema>;

// Inline error component with absolute positioning to prevent layout shifting
function AbsoluteError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <span className="absolute -bottom-3.5 left-0 text-[10px] font-medium text-red-500 truncate max-w-full">
      {message}
    </span>
  );
}

export default function RegisterForm() {
  const router = useRouter();
  const [register, { isLoading }] = useRegisterMutation();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(formSchema),
    shouldFocusError: false,
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeTerms: false,
      agreePrivacy: false,
    },
  });

  async function onSubmit(data: SignupFormValues) {
    try {
      await register({
        username: data.username,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        password: data.password,
        confirmPassword: data.confirmPassword,
      }).unwrap();

      toast.success("Account created", {
        description: "Continue to Keycloak to sign in.",
        position: "bottom-right",
      });
      router.push("/login");
    } catch (error) {
      const apiError =
        typeof error === "object" && error !== null && "data" in error
          ? error.data
          : undefined;
      const message =
        typeof apiError === "object" &&
        apiError !== null &&
        "message" in apiError &&
        typeof apiError.message === "string"
          ? apiError.message
          : "Registration failed. Please check your details and try again.";

      toast.error("Could not create account", {
        description: message,
        position: "bottom-right",
      });
    }
  }

  return (
    <Card className="mx-auto grid w-full max-w-5xl overflow-hidden rounded-[28px] border border-neutral-100 p-0 shadow-[0_24px_80px_rgba(15,23,42,0.14)] md:min-h-[720px] md:grid-cols-[46%_54%]">
      {/* LEFT: Hero Image Panel */}
      <div
        className="relative hidden h-full w-full bg-cover bg-center p-8 md:flex md:flex-col md:justify-end lg:p-10"
        style={{
          backgroundImage: "url('/img/image-for-register.png')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/5" />

        <div className="relative z-10 rounded-[20px] border border-white/20 bg-black/35 p-6 backdrop-blur-md">
          <h2 className="mb-2 text-3xl font-bold leading-tight text-white">
            Start your rental journey today.
          </h2>
          <p className="mb-5 max-w-sm text-sm leading-6 text-white/80">
            Join thousands of verified users in a marketplace built on trust.
          </p>
          <div className="flex items-center gap-2">
            <div className="flex -space-x-1.5">
              <img
                className="inline-block size-8 rounded-full ring-2 ring-white"
                src="/img/samsreynich.jpg"
                alt="User 1"
              />
              <img
                className="inline-block size-8 rounded-full ring-2 ring-white"
                src="/img/cholna.png"
                alt="User 2"
              />
              <img
                className="inline-block size-8 rounded-full ring-2 ring-white"
                src="/img/chanthat.png"
                alt="User 3"
              />
            </div>
            <span className="text-xs font-medium text-white/90">
              4.9/5 Rating from 10k+ users
            </span>
          </div>
        </div>
      </div>

      {/* RIGHT: Form Panel */}
      <div className="flex flex-col bg-white p-6 sm:p-8 lg:p-10">
        <CardHeader className="space-y-2 p-0 pb-7">
          <CardTitle className="text-3xl font-bold tracking-tight text-[#253C95]">
            <span className="text-[#253C95]">Create your </span>
            <span className="text-[#F73030]">account</span>
          </CardTitle>
          <CardDescription className="text-sm leading-6 text-neutral-500">
            Fill in your details to get started with Rentiq.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          <form
            id="signup-form"
            onSubmit={form.handleSubmit(onSubmit)}
            noValidate
            className="space-y-6"
          >
            {/* NAME ROW */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Controller
                name="firstName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="relative border-none p-0">
                    <FieldLabel
                      htmlFor="signup-form-first-name"
                      className="mb-2 text-xs font-semibold text-neutral-700"
                    >
                      First Name
                    </FieldLabel>
                    <Input
                      {...field}
                      id="signup-form-first-name"
                      aria-invalid={fieldState.invalid}
                      placeholder="John"
                      autoComplete="given-name"
                      className="h-11 rounded-xl border-neutral-200 bg-[#fafafa] px-4 text-sm focus-visible:ring-1 focus-visible:ring-neutral-400"
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

              <Controller
                name="lastName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="relative border-none p-0">
                    <FieldLabel
                      htmlFor="signup-form-last-name"
                      className="mb-2 text-xs font-semibold text-neutral-700"
                    >
                      Last Name
                    </FieldLabel>
                    <Input
                      {...field}
                      id="signup-form-last-name"
                      aria-invalid={fieldState.invalid}
                      placeholder="Doe"
                      autoComplete="family-name"
                      className="h-11 rounded-xl border-neutral-200 bg-[#fafafa] px-4 text-sm focus-visible:ring-1 focus-visible:ring-neutral-400"
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
            </div>

            {/* ACCOUNT ROW */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Controller
                name="username"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="relative border-none p-0">
                    <FieldLabel
                      htmlFor="signup-form-username"
                      className="mb-2 text-xs font-semibold text-neutral-700"
                    >
                      Username
                    </FieldLabel>
                    <Input
                      {...field}
                      id="signup-form-username"
                      aria-invalid={fieldState.invalid}
                      placeholder="johndoe"
                      autoComplete="username"
                      className="h-11 rounded-xl border-neutral-200 bg-[#fafafa] px-4 text-sm focus-visible:ring-1 focus-visible:ring-neutral-400"
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

              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="relative border-none p-0">
                    <FieldLabel
                      htmlFor="signup-form-email"
                      className="mb-2 text-xs font-semibold text-neutral-700"
                    >
                      Email Address
                    </FieldLabel>
                    <Input
                      {...field}
                      id="signup-form-email"
                      type="email"
                      aria-invalid={fieldState.invalid}
                      placeholder="john@example.com"
                      autoComplete="email"
                      className="h-11 rounded-xl border-neutral-200 bg-[#fafafa] px-4 text-sm focus-visible:ring-1 focus-visible:ring-neutral-400"
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
            </div>

            {/* PASSWORDS ROW */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="relative border-none p-0">
                    <FieldLabel
                      htmlFor="signup-form-password"
                      className="mb-2 text-xs font-semibold text-neutral-700"
                    >
                      Password
                    </FieldLabel>
                    <InputGroup className="relative">
                      <InputGroupInput
                        {...field}
                        id="signup-form-password"
                        type={showPassword ? "text" : "password"}
                        aria-invalid={fieldState.invalid}
                        placeholder="********"
                        autoComplete="new-password"
                        className="h-11 rounded-xl border-neutral-200 bg-[#fafafa] px-4 text-sm pr-8 focus-visible:ring-1 focus-visible:ring-neutral-400"
                        style={
                          fieldState.invalid
                            ? { borderColor: ACCENT }
                            : undefined
                        }
                      />
                      <InputGroupAddon
                        align="inline-end"
                        className="absolute right-2.5 top-1/2 -translate-y-1/2"
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

              <Controller
                name="confirmPassword"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="relative border-none p-0">
                    <FieldLabel
                      htmlFor="signup-form-confirm"
                      className="mb-2 text-xs font-semibold text-neutral-700"
                    >
                      Confirm Password
                    </FieldLabel>
                    <InputGroup className="relative">
                      <InputGroupInput
                        {...field}
                        id="signup-form-confirm"
                        type={showConfirm ? "text" : "password"}
                        aria-invalid={fieldState.invalid}
                        placeholder="********"
                        autoComplete="new-password"
                        className="h-11 rounded-xl border-neutral-200 bg-[#fafafa] px-4 text-sm pr-8 focus-visible:ring-1 focus-visible:ring-neutral-400"
                        style={
                          fieldState.invalid
                            ? { borderColor: ACCENT }
                            : undefined
                        }
                      />
                      <InputGroupAddon
                        align="inline-end"
                        className="absolute right-2.5 top-1/2 -translate-y-1/2"
                      >
                        <InputGroupButton
                          type="button"
                          size="icon-xs"
                          aria-label="Toggle confirm password visibility"
                          onClick={() => setShowConfirm((v) => !v)}
                          className="text-neutral-400 hover:text-neutral-600"
                        >
                          {showConfirm ? (
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
            </div>

            {/* CHECKBOXES */}
            <div className="space-y-3 pt-1">
              <Controller
                name="agreeTerms"
                control={form.control}
                render={({ field }) => (
                  <Field
                    orientation="horizontal"
                    className="flex items-center gap-2 border-none p-0"
                  >
                    <Checkbox
                      id="signup-form-terms"
                      checked={!!field.value}
                      onCheckedChange={field.onChange}
                      className="shrink-0 rounded border-neutral-300 data-[state=checked]:bg-[#F73030] data-[state=checked]:border-[#F73030] size-4"
                    />
                    <FieldLabel
                      htmlFor="signup-form-terms"
                      className="text-xs font-normal leading-5 text-neutral-600 cursor-pointer select-none"
                    >
                      I agree to the{" "}
                      <span className="font-medium text-[#F73030] hover:underline">
                        Terms & Conditions
                      </span>
                    </FieldLabel>
                  </Field>
                )}
              />

              <Controller
                name="agreePrivacy"
                control={form.control}
                render={({ field }) => (
                  <Field
                    orientation="horizontal"
                    className="flex items-center gap-2 border-none p-0"
                  >
                    <Checkbox
                      id="signup-form-privacy"
                      checked={!!field.value}
                      onCheckedChange={field.onChange}
                      className="shrink-0 rounded border-neutral-300 data-[state=checked]:bg-[#F73030] data-[state=checked]:border-[#F73030] size-4"
                    />
                    <FieldLabel
                      htmlFor="signup-form-privacy"
                      className="text-xs font-normal leading-5 text-neutral-600 cursor-pointer select-none"
                    >
                      I accept the{" "}
                      <span className="font-medium text-[#F73030] hover:underline">
                        Privacy Policy
                      </span>
                    </FieldLabel>
                  </Field>
                )}
              />
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-2 gap-4 border-none p-0 pt-7">
          <Button
            type="submit"
            form="signup-form"
            disabled={isLoading}
            className="h-12 w-full rounded-xl bg-[#F73030] text-sm font-semibold text-white shadow-md shadow-red-500/20 transition-colors hover:bg-[#F73030]/90"
          >
            {isLoading ? "Creating account..." : "Sign Up"}
          </Button>

          <div className="flex w-full items-center gap-2">
            <div className="h-px flex-1 bg-neutral-200" />
            <span className="text-[9px] font-semibold tracking-wider text-neutral-400">
              OR CONTINUE WITH
            </span>
            <div className="h-px flex-1 bg-neutral-200" />
          </div>

          <div className="flex w-full gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-11 flex-1 rounded-xl border-neutral-200 font-medium text-[11px] text-neutral-700 hover:bg-neutral-50 gap-1.5"
            >
              <svg className="size-4" viewBox="0 0 24 24">
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
              className="h-11 flex-1 rounded-xl border-neutral-200 font-medium text-[11px] text-neutral-700 hover:bg-neutral-50 gap-1.5"
            >
              <svg className="size-3.5 fill-[#1877F2]" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook
            </Button>
          </div>

          {/* LOGIN ROUTE LINK */}
          <p className="mt-1 text-center text-sm leading-6 text-neutral-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-[#F73030] hover:underline"
            >
              Log in
            </Link>
          </p>
        </CardFooter>
      </div>
    </Card>
  );
}
