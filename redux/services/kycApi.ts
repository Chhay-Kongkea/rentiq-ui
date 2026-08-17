
import type { KycResponse, KycSubmission } from "@/lib/types/kyc.types";
import { api } from "@/redux/api";

export const kycApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMyKyc: builder.query<KycResponse, void>({
      query: () => "/kyc/me",
      providesTags: ["Kyc"],
    }),
    submitKyc: builder.mutation<KycResponse, KycSubmission>({
      query: ({ data, frontImage, backImage }) => {
        const body = new FormData();
        body.append("data", new Blob([JSON.stringify(data)], { type: "application/json" }));
        if (frontImage) body.append("frontImage", frontImage);
        if (backImage) body.append("backImage", backImage);
        return { url: "/kyc", method: "POST", body };
      },
      invalidatesTags: ["Kyc"],
    }),
    resubmitKyc: builder.mutation<KycResponse, KycSubmission>({
      query: ({ data, frontImage, backImage }) => {
        const body = new FormData();
        body.append("data", new Blob([JSON.stringify(data)], { type: "application/json" }));
        if (frontImage) body.append("frontImage", frontImage);
        if (backImage) body.append("backImage", backImage);
        return { url: "/kyc/me", method: "PATCH", body };
      },
      invalidatesTags: ["Kyc"],
    }),
    startEmailVerification: builder.mutation<{ message?: string }, void>({
      query: () => ({ url: "/kyc/me/verify-email", method: "POST" }),
      invalidatesTags: ["Kyc"],
    }),
    confirmEmailVerification: builder.mutation<KycResponse, void>({
      query: () => ({ url: "/kyc/me/verify-email/confirm", method: "POST" }),
      invalidatesTags: ["Kyc"],
    }),
  }),
});

export const {
  useGetMyKycQuery,
  useSubmitKycMutation,
  useResubmitKycMutation,
  useStartEmailVerificationMutation,
  useConfirmEmailVerificationMutation,
} = kycApi;