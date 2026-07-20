"use client";

import * as React from "react";
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
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
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

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png"];

const idPhotoSchema = z
  .instanceof(File, { message: "This photo is required" })
  .refine((file) => file.size <= MAX_FILE_SIZE, "File must be under 5MB")
  .refine(
    (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
    "Files must be JPG or PNG",
  );

const formSchema = z
  .object({
    fullName: z.string().min(3, "Full name is required"),
    email: z.string().email("Invalid email address"),
    countryCode: z.string(),
    phoneNumber: z.string().min(6, "Phone number is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    frontPhoto: idPhotoSchema,
    backPhoto: idPhotoSchema,
    agreeTerms: z.boolean().refine((val) => val === true, {
      message: "You must accept the Terms & Conditions.",
    }),
    agreePrivacy: z.boolean().refine((val) => val === true, {
      message: "You must accept the Privacy Policy.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type SignupFormValues = z.infer<typeof formSchema>;

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
    <div className="flex-1">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={`flex w-full flex-col items-center justify-center gap-1 rounded-2xl border border-dashed p-4 transition-all ${
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
          size={20}
          className={file ? "text-[#FF3333]" : "text-neutral-400"}
          aria-hidden="true"
        />
        <span className="text-xs font-medium text-neutral-600">
          {file ? file.name : label}
        </span>
      </button>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

export function LoginForm() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(formSchema),
    shouldFocusError: false, // Prevents mobile browser auto-zoom on validation error focus
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
    <Card className="mx-auto grid w-full max-w-5xl overflow-hidden rounded-3xl border-0 p-0 shadow-2xl md:grid-cols-2">
      {/* LEFT: Hero Image Panel (Full Coverage) */}
      <div
        className="relative hidden h-full min-h-[720px] w-full bg-cover bg-center p-8 md:flex md:flex-col md:justify-end"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {/* Glassmorphism Overlay Card */}
        <div className="relative z-10 rounded-2xl border border-white/20 bg-black/40 p-6 backdrop-blur-md">
          <h2 className="mb-2 text-2xl font-bold text-white leading-snug">
            Start your rental journey today.
          </h2>
          <p className="mb-4 text-xs leading-relaxed text-white/80">
            Join thousands of verified owners and renters in a marketplace built
            on trust, security, and speed.
          </p>
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              <img
                className="inline-block size-7 rounded-full ring-2 ring-white"
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop"
                alt="User 1"
              />
              <img
                className="inline-block size-7 rounded-full ring-2 ring-white"
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop"
                alt="User 2"
              />
              <img
                className="inline-block size-7 rounded-full ring-2 ring-white"
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop"
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
      <div className="flex flex-col justify-center bg-white p-6 md:p-8">
        <CardHeader className="space-y-1 p-0 pb-4">
          <CardTitle className="text-2xl font-bold tracking-tight text-neutral-900">
            Create your account
          </CardTitle>
          <CardDescription className="text-xs text-neutral-500">
            Fill in your details to get started with Rentiq.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0 space-y-4">
          <form
            id="signup-form"
            onSubmit={form.handleSubmit(onSubmit)}
            noValidate
          >
            <FieldGroup className="space-y-4 border-none p-0">
              {/* FULL NAME */}
              <Controller
                name="fullName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="signup-form-fullname"
                      className="text-xs font-semibold text-neutral-700"
                    >
                      Full Name
                    </FieldLabel>
                    <Input
                      {...field}
                      id="signup-form-fullname"
                      aria-invalid={fieldState.invalid}
                      placeholder="John Doe"
                      autoComplete="name"
                      className="rounded-xl border-neutral-200 text-base md:text-sm h-11 focus-visible:ring-1 focus-visible:ring-neutral-400"
                      style={
                        fieldState.invalid ? { borderColor: ACCENT } : undefined
                      }
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* EMAIL */}
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="signup-form-email"
                      className="text-xs font-semibold text-neutral-700"
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
                      className="rounded-xl border-neutral-200 text-base md:text-sm h-11 focus-visible:ring-1 focus-visible:ring-neutral-400"
                      style={
                        fieldState.invalid ? { borderColor: ACCENT } : undefined
                      }
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* PHONE NUMBER */}
              <Field data-invalid={!!form.formState.errors.phoneNumber}>
                <FieldLabel
                  htmlFor="signup-form-phone"
                  className="text-xs font-semibold text-neutral-700"
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
                        <SelectTrigger
                          style={{ height: "44px" }}
                          className="w-[105px] !h-[44px] rounded-xl border-neutral-200 text-sm font-medium flex items-center justify-between px-3"
                        >
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
                          height: "44px",
                          ...(fieldState.invalid
                            ? { borderColor: ACCENT }
                            : {}),
                        }}
                        className="flex-1 !h-[44px] rounded-xl border-neutral-200 text-base md:text-sm focus-visible:ring-1 focus-visible:ring-neutral-400"
                      />
                    )}
                  />
                </div>
                {form.formState.errors.phoneNumber && (
                  <FieldError errors={[form.formState.errors.phoneNumber]} />
                )}
              </Field>

              {/* PASSWORDS ROW */}
              <div className="grid grid-cols-2 gap-3">
                <Controller
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel
                        htmlFor="signup-form-password"
                        className="text-xs font-semibold text-neutral-700"
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
                          className="rounded-xl border-neutral-200 text-base md:text-sm h-11 pr-10 focus-visible:ring-1 focus-visible:ring-neutral-400"
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
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="confirmPassword"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel
                        htmlFor="signup-form-confirm"
                        className="text-xs font-semibold text-neutral-700"
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
                          className="rounded-xl border-neutral-200 text-base md:text-sm h-11 pr-10 focus-visible:ring-1 focus-visible:ring-neutral-400"
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
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>

              {/* IDENTITY VERIFICATION */}
              <Field className="space-y-1">
                <FieldLabel className="text-xs font-semibold text-neutral-700">
                  Identity Verification (ID/Passport)
                </FieldLabel>
                <div className="flex gap-3">
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
                <p className="text-[11px] text-neutral-400 mt-1">
                  Files must be JPG or PNG, max 5MB.
                </p>
              </Field>

              {/* CHECKBOXES */}
              <div className="space-y-2.5 pt-1">
                <Controller
                  name="agreeTerms"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field
                      orientation="horizontal"
                      className="flex items-start gap-2.5 border-none p-0"
                      data-invalid={fieldState.invalid}
                    >
                      <Checkbox
                        id="signup-form-terms"
                        checked={!!field.value}
                        onCheckedChange={field.onChange}
                        className="mt-0.5 shrink-0 rounded border-neutral-300 data-[state=checked]:bg-[#FF3333] data-[state=checked]:border-[#FF3333]"
                      />
                      <FieldLabel
                        htmlFor="signup-form-terms"
                        className="text-xs font-normal leading-snug text-neutral-600 cursor-pointer select-none"
                      >
                        I agree to the{" "}
                        <span className="font-medium text-[#FF3333] hover:underline">
                          Terms & Conditions
                        </span>{" "}
                        of Rentiq.
                      </FieldLabel>
                    </Field>
                  )}
                />

                <Controller
                  name="agreePrivacy"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field
                      orientation="horizontal"
                      className="flex items-start gap-2.5 border-none p-0"
                      data-invalid={fieldState.invalid}
                    >
                      <Checkbox
                        id="signup-form-privacy"
                        checked={!!field.value}
                        onCheckedChange={field.onChange}
                        className="mt-0.5 shrink-0 rounded border-neutral-300 data-[state=checked]:bg-[#FF3333] data-[state=checked]:border-[#FF3333]"
                      />
                      <FieldLabel
                        htmlFor="signup-form-privacy"
                        className="text-xs font-normal leading-snug text-neutral-600 cursor-pointer select-none"
                      >
                        I have read and understand the{" "}
                        <span className="font-medium text-[#FF3333] hover:underline">
                          Privacy Policy
                        </span>{" "}
                        regarding my data.
                      </FieldLabel>
                    </Field>
                  )}
                />
              </div>
            </FieldGroup>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-4 p-0 pt-4 border-none">
          {/* SUBMIT BUTTON */}
          <Button
            type="submit"
            form="signup-form"
            className="w-full h-11 rounded-xl bg-[#FF3333] font-semibold text-white hover:bg-[#e02b2b] transition-all shadow-lg shadow-red-500/20"
          >
            Sign Up
          </Button>

          {/* DIVIDER */}
          <div className="flex w-full items-center gap-3 my-1">
            <div className="h-px flex-1 bg-neutral-200" />
            <span className="text-[10px] font-semibold tracking-wider text-neutral-400">
              OR CONTINUE WITH
            </span>
            <div className="h-px flex-1 bg-neutral-200" />
          </div>

          {/* SOCIAL BUTTONS */}
          <div className="flex w-full gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1 h-11 rounded-xl border-neutral-200 font-medium text-xs text-neutral-700 hover:bg-neutral-50 gap-2"
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
              className="flex-1 h-11 rounded-xl border-neutral-200 font-medium text-xs text-neutral-700 hover:bg-neutral-50 gap-2"
            >
              <svg className="size-4 fill-[#1877F2]" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook
            </Button>
          </div>
        </CardFooter>
      </div>
    </Card>
  );
}
