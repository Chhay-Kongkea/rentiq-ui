import type {
  EmailRequest,
  LoginRequest,
  MessageResponse,
  RefreshTokenRequest,
  RegisterRequest,
  RegisterResponse,
  TokenResponse,
} from "@/lib/types/auth.types";
import { api } from "@/redux/api";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        body,
      }),
    }),
    loginWithPassword: builder.mutation<TokenResponse, LoginRequest>({
      query: (body) => ({ url: "/auth/user/login", method: "POST", body }),
    }),
    refreshAccessToken: builder.mutation<TokenResponse, RefreshTokenRequest>({
      query: (body) => ({ url: "/auth/refresh-token", method: "POST", body }),
    }),
    forgotPassword: builder.mutation<MessageResponse, EmailRequest>({
      query: (body) => ({ url: "/auth/forgot-password", method: "POST", body }),
    }),
    resendVerificationEmail: builder.mutation<MessageResponse, EmailRequest>({
      query: (body) => ({ url: "/auth/resend-verification-email", method: "POST", body }),
    }),
    verifyEmail: builder.query<MessageResponse, string>({
      query: (email) => ({ url: "/auth/verify-email", params: { email } }),
    }),
    getCurrentAuthUser: builder.query<Record<string, unknown>, void>({
      query: () => "/auth/me",
      providesTags: ["Auth"],
    }),
    getBackendLogin: builder.query<void, void>({
      query: () => "/auth/login",
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginWithPasswordMutation,
  useRefreshAccessTokenMutation,
  useForgotPasswordMutation,
  useResendVerificationEmailMutation,
  useVerifyEmailQuery,
  useGetCurrentAuthUserQuery,
  useGetBackendLoginQuery,
} = authApi;
