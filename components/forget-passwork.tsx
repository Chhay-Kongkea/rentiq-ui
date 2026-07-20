"use client";



import * as React from "react";

import Link from "next/link";

import { zodResolver } from "@hookform/resolvers/zod";

import { Controller, useForm } from "react-hook-form";

import { toast } from "sonner";

import { RotateCcw, ArrowLeft, Lock } from "lucide-react";

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



const forgotPasswordSchema = z.object({

  email: z.string().email("Invalid email address"),

});



type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;



export function ForgotPasswordForm() {

  const form = useForm<ForgotPasswordValues>({

    resolver: zodResolver(forgotPasswordSchema),

    defaultValues: {

      email: "",

    },

  });



  function onSubmit(data: ForgotPasswordValues) {

    toast("Reset link sent!", {

      description: `A password reset link has been sent to ${data.email}`,

      position: "bottom-right",

    });

  }



  return (

    <div className="flex min-h-screen w-full items-center justify-center bg-[#F4F4F6] p-4">

      {/* CARD CONTAINER: Reduced space-y to tighten gaps overall */}

      <Card className="flex w-full max-w-lg flex-col items-center justify-center space-y-3 rounded-2xl border-0 bg-white p-8 shadow-xl text-center">

        

        {/* ICON HEADER */}

        <div className="flex size-14 items-center justify-center rounded-full bg-red-50 text-[#FF3333]">

          <div className="relative flex items-center justify-center">

            <RotateCcw className="size-6 stroke-[2.2]" />

            <Lock className="absolute size-2.5 translate-y-[0.5px]" />

          </div>

        </div>



        {/* HEADER TEXT */}

        <CardHeader className="p-0 space-y-1.5 w-full flex flex-col items-center justify-center">

          <CardTitle className="text-lg font-bold tracking-tight text-neutral-800">

            Forgot Password?

          </CardTitle>

          <CardDescription className="text-xs text-neutral-500 leading-relaxed max-w-sm">

            Enter your email address and we'll send you a link to reset your password.

          </CardDescription>

        </CardHeader>



        {/* FORM CONTENT */}

        <CardContent className="p-0 w-full">

          <form

            id="forgot-password-form"

            onSubmit={form.handleSubmit(onSubmit)}

            noValidate

          >

            <Controller

              name="email"

              control={form.control}

              render={({ field, fieldState }) => (

                <Field className="relative border-none p-0 text-left">

                  <FieldLabel

                    htmlFor="forgot-email"

                    className="text-xs font-semibold text-neutral-700 mb-1.5 block text-left"

                  >

                    Email Address

                  </FieldLabel>

                  <Input

                    {...field}

                    id="forgot-email"

                    type="email"

                    placeholder="john@example.com"

                    autoComplete="email"

                    className="h-10 rounded-xl border-red-200 text-xs placeholder:text-neutral-300 focus-visible:ring-1 focus-visible:ring-[#FF3333]"

                  />

                  {fieldState.error && (

                    <span className="mt-1 block text-[10px] font-medium text-red-500">

                      {fieldState.error.message}

                    </span>

                  )}

                </Field>

              )}

            />

          </form>

        </CardContent>



        {/* FOOTER & BUTTONS */}

        <CardFooter className="flex w-full flex-col items-center justify-center gap-3 p-0 border-none pt-1">

          <Button

            type="submit"

            form="forgot-password-form"

            className="w-full h-10 rounded-xl bg-[#FF3333] font-semibold text-xs text-white hover:bg-[#e02b2b] transition-all shadow-sm"

          >

            Send Reset Link

          </Button>



          <Link

            href="/login"

            className="pb-4 inline-flex items-center justify-center gap-1.5 text-xs font-medium text-neutral-600 hover:text-neutral-900 transition-colors"

          >

            <ArrowLeft className="size-3.5" />

            Back to Log In

          </Link>

        </CardFooter>

      </Card>

    </div>

  );

}