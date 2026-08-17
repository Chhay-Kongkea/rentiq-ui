import type {
  RegisterRequest,
  RegisterResponse,
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
  }),
});

export const { useRegisterMutation } = authApi;
