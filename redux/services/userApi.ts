import type {
  AddressRequest,
  ChangePasswordRequest,
  NotificationPreferences,
  NotificationPreferencesRequest,
  PageResponse,
  PublicUserProfile,
  UserAddress,
  UserItemRequest,
  UserProfile,
  UserReview,
  UpdateProfileRequest,
} from "@/lib/types/user.types";
import { api } from "@/redux/api";

export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMyProfile: builder.query<UserProfile, void>({
      query: () => "/users/me",
      providesTags: [{ type: "User", id: "ME" }],
    }),
    updateMyProfile: builder.mutation<UserProfile, UpdateProfileRequest>({
      query: (body) => ({ url: "/users/me", method: "PATCH", body }),
      invalidatesTags: [{ type: "User", id: "ME" }],
    }),
    getPublicUserProfile: builder.query<PublicUserProfile, string>({
      query: (id) => `/users/${encodeURIComponent(id)}`,
      providesTags: (_result, _error, id) => [{ type: "User", id }],
    }),
    uploadMyAvatar: builder.mutation<{ avatarUrl?: string }, File>({
      query: (file) => {
        const body = new FormData();
        body.append("file", file);
        return { url: "/users/me/avatar", method: "POST", body };
      },
      invalidatesTags: [{ type: "User", id: "ME" }],
    }),
    deleteMyAvatar: builder.mutation<void, void>({
      query: () => ({ url: "/users/me/avatar", method: "DELETE" }),
      invalidatesTags: [{ type: "User", id: "ME" }],
    }),
    getMyAddresses: builder.query<UserAddress[], void>({
      query: () => "/users/me/addresses",
      providesTags: (result) => result ? [...result.map(({ id }) => ({ type: "User" as const, id: `ADDRESS-${id}` })), { type: "User" as const, id: "ADDRESS-LIST" }] : [{ type: "User" as const, id: "ADDRESS-LIST" }],
    }),
    addMyAddress: builder.mutation<UserAddress, AddressRequest>({
      query: (body) => ({ url: "/users/me/addresses", method: "POST", body }),
      invalidatesTags: [{ type: "User", id: "ADDRESS-LIST" }],
    }),
    getMyAddress: builder.query<UserAddress, string>({
      query: (addressId) => `/users/me/addresses/${encodeURIComponent(addressId)}`,
      providesTags: (_result, _error, addressId) => [{ type: "User", id: `ADDRESS-${addressId}` }],
    }),
    updateMyAddress: builder.mutation<UserAddress, { addressId: string; body: AddressRequest }>({
      query: ({ addressId, body }) => ({ url: `/users/me/addresses/${encodeURIComponent(addressId)}`, method: "PATCH", body }),
      invalidatesTags: (_result, _error, { addressId }) => [{ type: "User", id: `ADDRESS-${addressId}` }, { type: "User", id: "ADDRESS-LIST" }],
    }),
    deleteMyAddress: builder.mutation<void, string>({
      query: (addressId) => ({ url: `/users/me/addresses/${encodeURIComponent(addressId)}`, method: "DELETE" }),
      invalidatesTags: [{ type: "User", id: "ADDRESS-LIST" }],
    }),
    setDefaultMyAddress: builder.mutation<UserAddress, string>({
      query: (addressId) => ({ url: `/users/me/addresses/${encodeURIComponent(addressId)}/default`, method: "PATCH" }),
      invalidatesTags: [{ type: "User", id: "ADDRESS-LIST" }],
    }),
    getMyNotificationPreferences: builder.query<NotificationPreferences, void>({
      query: () => "/users/me/notification-preferences",
      providesTags: [{ type: "User", id: "NOTIFICATION-PREFERENCES" }],
    }),
    updateMyNotificationPreferences: builder.mutation<NotificationPreferences, NotificationPreferencesRequest>({
      query: (body) => ({ url: "/users/me/notification-preferences", method: "PATCH", body }),
      invalidatesTags: [{ type: "User", id: "NOTIFICATION-PREFERENCES" }],
    }),
    getMyReviews: builder.query<PageResponse<UserReview>, { page?: number; size?: number; sort?: string }>({
      query: ({ page = 0, size = 20, sort = "createdAt,desc" } = {}) => ({ url: "/users/me/reviews", params: { "pageable.page": page, "pageable.size": size, "pageable.sort": sort } }),
      providesTags: [{ type: "User", id: "REVIEWS" }],
    }),
    createBooking: builder.mutation<{ id: string; status?: string }, { itemId: string; rentalStart: string; rentalEnd: string }>({ query: (body) => ({ url: "/bookings", method: "POST", body }), invalidatesTags: [{ type: "User", id: "BOOKINGS" }] }),
    getItemRequestOffers: builder.query<Array<{ id: string; itemTitle?: string; offeredPrice?: number; currency?: string; message?: string; status?: string; ownerId?: string; createdAt?: string }>, string>({ query: (requestId) => `/item-requests/${requestId}/offers`, providesTags: [{ type: "User", id: "ITEM-REQUESTS" }] }),
    getItemRequest: builder.query<UserItemRequest, string>({ query: (requestId) => `/item-requests/${requestId}`, providesTags: [{ type: "User", id: "ITEM-REQUESTS" }] }),
    createItemRequest: builder.mutation<UserItemRequest, { categoryId: string; title: string; description?: string; budgetMin?: number; budgetMax?: number; neededFrom: string; neededTo: string; latitude: number; longitude: number; radiusKm?: number }>({ query: (body) => ({ url: "/item-requests", method: "POST", body }), invalidatesTags: [{ type: "User", id: "ITEM-REQUESTS" }] }),
    getMyItemRequests: builder.query<PageResponse<UserItemRequest>, { pageNumber?: number; pageSize?: number }>({
      query: ({ pageNumber = 0, pageSize = 20 } = {}) => ({ url: "/users/me/item-requests", params: { pageNumber, pageSize } }),
      providesTags: [{ type: "User", id: "ITEM-REQUESTS" }],
    }),
    changeMyPassword: builder.mutation<void, ChangePasswordRequest>({
      query: (body) => ({ url: "/auth/change-password", method: "POST", body }),
    }),
  }),
});

export const {
  useGetMyProfileQuery,
  useUpdateMyProfileMutation,
  useGetPublicUserProfileQuery,
  useUploadMyAvatarMutation,
  useDeleteMyAvatarMutation,
  useGetMyAddressesQuery,
  useAddMyAddressMutation,
  useGetMyAddressQuery,
  useUpdateMyAddressMutation,
  useDeleteMyAddressMutation,
  useSetDefaultMyAddressMutation,
  useGetMyNotificationPreferencesQuery,
  useUpdateMyNotificationPreferencesMutation,
  useGetMyReviewsQuery,
  useGetMyItemRequestsQuery,
  useCreateItemRequestMutation,
  useGetItemRequestQuery,
  useGetItemRequestOffersQuery,
  useCreateBookingMutation,
  useChangeMyPasswordMutation,
} = userApi;