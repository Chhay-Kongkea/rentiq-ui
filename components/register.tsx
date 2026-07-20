"use client";

import * as React from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Eye, EyeOff, ImagePlus } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ACCENT = "#FF3333";

const COUNTRY_CODES = [
  { code: "+855", label: "KH" },
  { code: "+66", label: "TH" },
  { code: "+84", label: "VN" },
  { code: "+1", label: "US" },
];

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png"];

const idPhotoSchema = z
  .instanceof(File, { message: "Photo required" })
  .refine((file) => file.size <= MAX_FILE_SIZE, "Max size 5MB")
  .refine(
    (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
    "JPG or PNG only",
  );

const formSchema = z
  .object({
    fullName: z.string().min(3, "Full name required"),
    email: z.string().email("Invalid email"),
    countryCode: z.string(),
    phoneNumber: z.string().min(6, "Phone required"),
    password: z.string().min(8, "Min 8 characters"),
    confirmPassword: z.string().min(1, "Confirm password"),
    frontPhoto: idPhotoSchema,
    backPhoto: idPhotoSchema,
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

function FileDropField({
  label,
  file,
  onChange,
  error,
}: {
  label: string;
  file: File | undefined;
  onChange: (file: File | undefined) => void;
  error?: string;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className="relative flex-1">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={`flex w-full items-center justify-center gap-2 rounded-xl border border-dashed px-3 py-2 transition-all ${
          error
            ? "border-red-500 bg-red-50/30"
            : file
              ? "border-red-400 bg-red-50/20"
              : "border-neutral-300 bg-neutral-50/50 hover:bg-neutral-100/50"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png"
          hidden
          onChange={(e) => onChange(e.target.files?.[0])}
        />
        <ImagePlus
          size={16}
          className={file ? "text-[#FF3333]" : "text-neutral-400"}
          aria-hidden="true"
        />
        <span className="truncate text-xs font-medium text-neutral-600">
          {file ? file.name : label}
        </span>
      </button>
      <AbsoluteError message={error} />
    </div>
  );
}

export default function RegisterForm() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(formSchema),
    shouldFocusError: false,
    defaultValues: {
      fullName: "",
      email: "",
      countryCode: "+855",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      frontPhoto: undefined,
      backPhoto: undefined,
      agreeTerms: false,
      agreePrivacy: false,
    },
  });

  function onSubmit(data: SignupFormValues) {
    toast("Account created", {
      description: `Welcome to Rentiq, ${data.fullName}.`,
      position: "bottom-right",
    });
    form.reset();
  }

  return (
    <Card className="mx-auto grid max-h-[95vh] w-full max-w-4xl overflow-hidden rounded-3xl border-0 p-0 shadow-2xl md:grid-cols-2">
      {/* LEFT: Hero Image Panel */}
      <div
        className="relative hidden h-full w-full bg-cover bg-center p-6 md:flex md:flex-col md:justify-end"
        style={{
          backgroundImage: "url('/img/image-for-register.png')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        <div className="relative z-10 rounded-2xl border border-white/20 bg-black/40 p-4 backdrop-blur-md">
          <h2 className="mb-1 text-xl font-bold leading-snug text-white">
            Start your rental journey today.
          </h2>
          <p className="mb-3 text-[11px] leading-relaxed text-white/80">
            Join thousands of verified users in a marketplace built on trust.
          </p>
          <div className="flex items-center gap-2">
            <div className="flex -space-x-1.5">
              <img
                className="inline-block size-6 rounded-full ring-2 ring-white"
                src="/img/samsreynich.jpg"
                alt="User 1"
              />
              <img
                className="inline-block size-6 rounded-full ring-2 ring-white"
                src="/img/cholna.png"
                alt="User 2"
              />
              <img
                className="inline-block size-6 rounded-full ring-2 ring-white"
                src="/img/chanthat.png"
                alt="User 3"
              />
            </div>
            <span className="text-[11px] font-medium text-white/90">
              4.9/5 Rating from 10k+ users
            </span>
          </div>
        </div>
      </div>

      {/* RIGHT: Form Panel */}
      <div className="flex flex-col justify-between bg-white p-5 md:p-6 overflow-hidden">
        <CardHeader className="p-0 pb-1 space-y-0.5">
          <CardTitle className="text-xl font-bold tracking-tight text-neutral-900">
            Create your account
          </CardTitle>
          <CardDescription className="text-[11px] text-neutral-500">
            Fill in your details to get started with Rentiq.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          <form
            id="signup-form"
            onSubmit={form.handleSubmit(onSubmit)}
            noValidate
            className="space-y-4"
          >
            {/* FULL NAME & EMAIL ROW */}
            <div className="grid grid-cols-2 gap-2.5">
              <Controller
                name="fullName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="relative border-none p-0">
                    <FieldLabel
                      htmlFor="signup-form-fullname"
                      className="text-[11px] font-semibold text-neutral-700 mb-1"
                    >
                      Full Name
                    </FieldLabel>
                    <Input
                      {...field}
                      id="signup-form-fullname"
                      aria-invalid={fieldState.invalid}
                      placeholder="John Doe"
                      autoComplete="name"
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

              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="relative border-none p-0">
                    <FieldLabel
                      htmlFor="signup-form-email"
                      className="text-[11px] font-semibold text-neutral-700 mb-1"
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
            </div>

            {/* PHONE NUMBER */}
            <Field className="relative border-none p-0">
              <FieldLabel
                htmlFor="signup-form-phone"
                className="text-[11px] font-semibold text-neutral-700 mb-1"
              >
                Phone Number
              </FieldLabel>
              <div className="flex items-center gap-2">
                <Controller
                  name="countryCode"
                  control={form.control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-[90px] !h-9 rounded-xl border-neutral-200 text-xs font-medium flex items-center justify-between px-2.5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {COUNTRY_CODES.map((c) => (
                          <SelectItem key={c.code} value={c.code}>
                            {c.code}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <Controller
                  name="phoneNumber"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Input
                      {...field}
                      id="signup-form-phone"
                      aria-invalid={fieldState.invalid}
                      placeholder="123456789"
                      autoComplete="tel"
                      style={{
                        height: "36px",
                        ...(fieldState.invalid
                          ? { borderColor: ACCENT }
                          : {}),
                      }}
                      className="flex-1 !h-9 rounded-xl border-neutral-200 text-xs focus-visible:ring-1 focus-visible:ring-neutral-400"
                    />
                  )}
                />
              </div>
              <AbsoluteError
                message={form.formState.errors.phoneNumber?.message}
              />
            </Field>

            {/* PASSWORDS ROW */}
            <div className="grid grid-cols-2 gap-2.5">
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="relative border-none p-0">
                    <FieldLabel
                      htmlFor="signup-form-password"
                      className="text-[11px] font-semibold text-neutral-700 mb-1"
                    >
                      Password
                    </FieldLabel>
                    <InputGroup className="relative">
                      <InputGroupInput
                        {...field}
                        id="signup-form-password"
                        type={showPassword ? "text" : "password"}
                        aria-invalid={fieldState.invalid}
                        placeholder="••••••••"
                        autoComplete="new-password"
                        className="h-9 rounded-xl border-neutral-200 text-xs pr-8 focus-visible:ring-1 focus-visible:ring-neutral-400"
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
                            <EyeOff className="size-3.5" />
                          ) : (
                            <Eye className="size-3.5" />
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
                      className="text-[11px] font-semibold text-neutral-700 mb-1"
                    >
                      Confirm Password
                    </FieldLabel>
                    <InputGroup className="relative">
                      <InputGroupInput
                        {...field}
                        id="signup-form-confirm"
                        type={showConfirm ? "text" : "password"}
                        aria-invalid={fieldState.invalid}
                        placeholder="••••••••"
                        autoComplete="new-password"
                        className="h-9 rounded-xl border-neutral-200 text-xs pr-8 focus-visible:ring-1 focus-visible:ring-neutral-400"
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
                            <EyeOff className="size-3.5" />
                          ) : (
                            <Eye className="size-3.5" />
                          )}
                        </InputGroupButton>
                      </InputGroupAddon>
                    </InputGroup>
                    <AbsoluteError message={fieldState.error?.message} />
                  </Field>
                )}
              />
            </div>

            {/* IDENTITY VERIFICATION */}
            <Field className="relative space-y-1 border-none p-0">
              <FieldLabel className="text-[11px] font-semibold text-neutral-700">
                Identity Verification (ID/Passport)
              </FieldLabel>
              <div className="flex gap-2">
                <Controller
                  name="frontPhoto"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <FileDropField
                      label="Front Photo"
                      file={field.value as File | undefined}
                      onChange={field.onChange}
                      error={fieldState.error?.message}
                    />
                  )}
                />
                <Controller
                  name="backPhoto"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <FileDropField
                      label="Back Photo"
                      file={field.value as File | undefined}
                      onChange={field.onChange}
                      error={fieldState.error?.message}
                    />
                  )}
                />
              </div>
            </Field>

            {/* CHECKBOXES */}
            <div className="space-y-1 pt-1">
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
                      className="shrink-0 rounded border-neutral-300 data-[state=checked]:bg-[#FF3333] data-[state=checked]:border-[#FF3333] size-3.5"
                    />
                    <FieldLabel
                      htmlFor="signup-form-terms"
                      className="text-[11px] font-normal leading-none text-neutral-600 cursor-pointer select-none"
                    >
                      I agree to the{" "}
                      <span className="font-medium text-[#FF3333] hover:underline">
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
                      className="shrink-0 rounded border-neutral-300 data-[state=checked]:bg-[#FF3333] data-[state=checked]:border-[#FF3333] size-3.5"
                    />
                    <FieldLabel
                      htmlFor="signup-form-privacy"
                      className="text-[11px] font-normal leading-none text-neutral-600 cursor-pointer select-none"
                    >
                      I accept the{" "}
                      <span className="font-medium text-[#FF3333] hover:underline">
                        Privacy Policy
                      </span>
                    </FieldLabel>
                  </Field>
                )}
              />
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-2 p-0 pt-2 border-none">
          <Button
            type="submit"
            form="signup-form"
            className="w-full h-9 rounded-xl bg-[#FF3333] text-xs font-semibold text-white hover:bg-[#e02b2b] transition-all shadow-md shadow-red-500/20"
          >
            Sign Up
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
              className="flex-1 h-8 rounded-xl border-neutral-200 font-medium text-[11px] text-neutral-700 hover:bg-neutral-50 gap-1.5"
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
              className="flex-1 h-8 rounded-xl border-neutral-200 font-medium text-[11px] text-neutral-700 hover:bg-neutral-50 gap-1.5"
            >
              <svg className="size-3.5 fill-[#1877F2]" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook
            </Button>
          </div>

          {/* LOGIN ROUTE LINK */}
          <p className="mt-1 text-center text-[11px] text-neutral-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-[#FF3333] hover:underline"
            >
              Log in
            </Link>
          </p>
        </CardFooter>
      </div>
    </Card>
  );
}