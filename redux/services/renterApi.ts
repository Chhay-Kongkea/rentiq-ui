import { api } from "@/redux/api";
import type {
  BookingQrCodeResponse,
  BookingResponse,
  BookingStatusHistoryResponse,
  CreateDisputeRequest,
  DisputeResponse,
  ImageUploadResponse,
  InspectionImageResponse,
  InspectionResponse,
  PageResponse,
  ReportResponse,
  UpdateBookingStatusRequest,
  UpdateDisputeRequest,
  UpsertInspectionRequest,
  WalletResponse,
  WalletTransactionResponse,
} from "@/lib/types/vendor.types";
import type { Category } from "@/lib/types/category.types";
import type { Item } from "@/lib/types/item.types";

type Id = string;
type Body = Record<string, unknown>;
type PageParams = Record<string, string | number | boolean | undefined>;

function normalizeBookings(response: unknown): BookingResponse[] {
  if (Array.isArray(response)) return response as BookingResponse[];
  if (!response || typeof response !== "object") return [];

  const wrapped = response as { content?: unknown; items?: unknown; data?: unknown };
  if (Array.isArray(wrapped.content)) return wrapped.content as BookingResponse[];
  if (Array.isArray(wrapped.items)) return wrapped.items as BookingResponse[];
  if (wrapped.data !== undefined) return normalizeBookings(wrapped.data);
  return [];
}

export const renterApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getFavorites: builder.query<unknown, PageParams | undefined>({ query: (params = {}) => ({ url: "/favorites", params }), providesTags: ["Renter"] }),
    addFavorite: builder.mutation<unknown, Id>({ query: (itemId) => ({ url: `/favorites/${itemId}`, method: "POST" }), invalidatesTags: ["Renter"] }),
    removeFavorite: builder.mutation<void, Id>({ query: (itemId) => ({ url: `/favorites/${itemId}`, method: "DELETE" }), invalidatesTags: ["Renter"] }),

    getNotifications: builder.query<unknown, PageParams | undefined>({ query: (params = {}) => ({ url: "/notifications", params }), providesTags: ["Renter"] }),
    getNotification: builder.query<unknown, Id>({ query: (id) => `/notifications/${id}` }),
    markNotificationRead: builder.mutation<void, Id>({ query: (id) => ({ url: `/notifications/${id}/read`, method: "PATCH" }), invalidatesTags: ["Renter"] }),
    markAllNotificationsRead: builder.mutation<void, void>({ query: () => ({ url: "/notifications/read-all", method: "PATCH" }), invalidatesTags: ["Renter"] }),
    deleteNotification: builder.mutation<void, Id>({ query: (id) => ({ url: `/notifications/${id}`, method: "DELETE" }), invalidatesTags: ["Renter"] }),
    getUnreadNotificationCount: builder.query<unknown, void>({ query: () => "/notifications/unread-count" }),

    getMyBookings: builder.query<BookingResponse[], void>({
      query: () => "/bookings",
      transformResponse: normalizeBookings,
      providesTags: ["Renter"],
    }),
    getBooking: builder.query<BookingResponse, Id>({ query: (id) => `/bookings/${id}`, providesTags: (_result, _error, id) => [{ type: "Renter", id }] }),
    updateBookingStatus: builder.mutation<BookingResponse, { id: Id; body: UpdateBookingStatusRequest }>({ query: ({ id, body }) => ({ url: `/bookings/${id}/status`, method: "PATCH", body }), invalidatesTags: ["Renter"] }),
    getBookingStatusHistory: builder.query<BookingStatusHistoryResponse[], Id>({ query: (id) => `/bookings/${id}/status-history` }),
    getBookingReceipt: builder.query<Blob, Id>({ query: (id) => ({ url: `/bookings/${id}/receipt`, responseHandler: (response) => response.blob() }) }),
    getBookingQrCode: builder.query<BookingQrCodeResponse, Id>({ query: (id) => `/bookings/${id}/qr-code` }),
    getBookingInvoice: builder.query<Blob, Id>({ query: (id) => ({ url: `/bookings/${id}/invoice`, responseHandler: (response) => response.blob() }) }),
    createBookingReview: builder.mutation<unknown, { id: Id; body: Body }>({ query: ({ id, body }) => ({ url: `/bookings/${id}/review`, method: "POST", body }), invalidatesTags: ["Renter"] }),

    getInspection: builder.query<InspectionResponse, Id>({ query: (id) => `/bookings/${id}/inspections`, providesTags: ["Renter"] }),
    createInspection: builder.mutation<InspectionResponse, { id: Id; body: UpsertInspectionRequest }>({ query: ({ id, body }) => ({ url: `/bookings/${id}/inspections`, method: "POST", body }), invalidatesTags: ["Renter"] }),
    updateInspection: builder.mutation<InspectionResponse, { id: Id; body: UpsertInspectionRequest }>({ query: ({ id, body }) => ({ url: `/bookings/${id}/inspections`, method: "PATCH", body }), invalidatesTags: ["Renter"] }),
    getInspectionImages: builder.query<InspectionImageResponse[], Id>({ query: (id) => `/bookings/${id}/inspections/images`, providesTags: ["Renter"] }),
    addInspectionImages: builder.mutation<InspectionImageResponse[], { id: Id; body: Body }>({ query: ({ id, body }) => ({ url: `/bookings/${id}/inspections/images`, method: "POST", body }), invalidatesTags: ["Renter"] }),
    deleteInspectionImage: builder.mutation<void, { id: Id; imageId: Id }>({ query: ({ id, imageId }) => ({ url: `/bookings/${id}/inspections/images/${imageId}`, method: "DELETE" }), invalidatesTags: ["Renter"] }),

    getBookingDisputes: builder.query<DisputeResponse[], Id>({ query: (id) => `/bookings/${id}/disputes`, providesTags: ["Renter"] }),
    createBookingDispute: builder.mutation<DisputeResponse, { id: Id; body: CreateDisputeRequest }>({ query: ({ id, body }) => ({ url: `/bookings/${id}/disputes`, method: "POST", body }), invalidatesTags: ["Renter"] }),
    getDispute: builder.query<DisputeResponse, Id>({ query: (id) => `/disputes/${id}` }),
    updateDispute: builder.mutation<DisputeResponse, { id: Id; body: UpdateDisputeRequest }>({ query: ({ id, body }) => ({ url: `/disputes/${id}`, method: "PATCH", body }), invalidatesTags: ["Renter"] }),

    createOffer: builder.mutation<unknown, { requestId: Id; body: Body }>({ query: ({ requestId, body }) => ({ url: `/item-requests/${requestId}/offers`, method: "POST", body }), invalidatesTags: ["Renter"] }),
    getOffer: builder.query<unknown, Id>({ query: (id) => `/offers/${id}` }),
    updateOffer: builder.mutation<unknown, { offerId: Id; body: Body }>({ query: ({ offerId, body }) => ({ url: `/offers/${offerId}`, method: "PATCH", body }), invalidatesTags: ["Renter"] }),
    withdrawOffer: builder.mutation<void, Id>({ query: (id) => ({ url: `/offers/${id}`, method: "DELETE" }), invalidatesTags: ["Renter"] }),
    acceptOffer: builder.mutation<unknown, { requestId: Id; offerId: Id }>({ query: ({ requestId, offerId }) => ({ url: `/item-requests/${requestId}/offers/${offerId}/accept`, method: "PATCH" }), invalidatesTags: ["Renter"] }),
    rejectOffer: builder.mutation<unknown, { requestId: Id; offerId: Id }>({ query: ({ requestId, offerId }) => ({ url: `/item-requests/${requestId}/offers/${offerId}/reject`, method: "PATCH" }), invalidatesTags: ["Renter"] }),

    getOpenItemRequests: builder.query<unknown, PageParams | undefined>({ query: (params = {}) => ({ url: "/item-requests", params }), providesTags: ["Renter"] }),
    updateItemRequest: builder.mutation<unknown, { id: Id; body: Body }>({ query: ({ id, body }) => ({ url: `/item-requests/${id}`, method: "PATCH", body }), invalidatesTags: ["Renter"] }),
    cancelItemRequest: builder.mutation<void, Id>({ query: (id) => ({ url: `/item-requests/${id}`, method: "DELETE" }), invalidatesTags: ["Renter"] }),
    getNearbyItemRequests: builder.query<unknown, PageParams>({ query: (params = {}) => ({ url: "/item-requests/nearby", params }), providesTags: ["Renter"] }),

    getWallet: builder.query<WalletResponse, void>({ query: () => "/wallets/me", providesTags: ["Wallet"] }),
    getWalletTransactions: builder.query<PageResponse<WalletTransactionResponse>, PageParams | undefined>({ query: (params = {}) => ({ url: "/wallets/me/transactions", params }), providesTags: ["Wallet"] }),
    getWalletTransaction: builder.query<WalletTransactionResponse, Id>({ query: (id) => `/wallets/me/transactions/${id}` }),
    getTopupRequests: builder.query<unknown, PageParams | undefined>({ query: (params = {}) => ({ url: "/wallets/me/topup-requests", params }) }),
    createTopupRequest: builder.mutation<unknown, Body>({ query: (body) => ({ url: "/wallets/me/topup-requests", method: "POST", body }), invalidatesTags: ["Renter"] }),
    getTopupRequest: builder.query<unknown, Id>({ query: (id) => `/wallets/me/topup-requests/${id}` }),

    getSearchSuggestions: builder.query<unknown, PageParams | undefined>({ query: (params = {}) => ({ url: "/search/suggestions", params }) }),
    searchNearby: builder.query<unknown, PageParams>({ query: (params = {}) => ({ url: "/search/nearby", params }) }),
    getSearchLogs: builder.query<unknown, PageParams | undefined>({ query: (params = {}) => ({ url: "/search/logs", params }) }),
    getNearbyItems: builder.query<unknown, PageParams>({ query: (params = {}) => ({ url: "/items/nearby", params }) }),
    getItemReviews: builder.query<unknown, { itemId: Id; params?: PageParams }>({ query: ({ itemId, params }) => ({ url: `/items/${itemId}/reviews`, params }) }),
    getItemAvailability: builder.query<unknown, Id>({ query: (itemId) => `/items/${itemId}/availability` }),

    getReview: builder.query<unknown, Id>({ query: (id) => `/reviews/${id}` }),
    updateReview: builder.mutation<unknown, { id: Id; body: Body }>({ query: ({ id, body }) => ({ url: `/reviews/${id}`, method: "PATCH", body }), invalidatesTags: ["Renter"] }),
    deleteReview: builder.mutation<void, Id>({ query: (id) => ({ url: `/reviews/${id}`, method: "DELETE" }), invalidatesTags: ["Renter"] }),
    createReport: builder.mutation<ReportResponse, Body>({ query: (body) => ({ url: "/reports", method: "POST", body }), invalidatesTags: ["Renter"] }),
    getMyReports: builder.query<PageResponse<ReportResponse>, PageParams | undefined>({ query: (params = {}) => ({ url: "/reports/me", params }), providesTags: ["Renter"] }),
    getMyReport: builder.query<ReportResponse, Id>({ query: (id) => `/reports/${id}` }),

    uploadImage: builder.mutation<ImageUploadResponse, FormData>({ query: (body) => ({ url: "/images/upload", method: "POST", body }) }),
    getImage: builder.query<unknown, Id>({ query: (id) => `/images/${id}` }),
    deleteImage: builder.mutation<void, Id>({ query: (id) => ({ url: `/images/${id}`, method: "DELETE" }) }),
    getCategory: builder.query<unknown, Id>({ query: (id) => `/categories/${id}` }),
    getCategoryItems: builder.query<Item[], { id: Id; params?: PageParams }>({ query: ({ id, params }) => ({ url: `/categories/${id}/items`, params }) }),
    getCategoryChildren: builder.query<Category[], Id>({ query: (id) => `/categories/${id}/children` }),
  }),
});

export const {
  useGetFavoritesQuery, useAddFavoriteMutation, useRemoveFavoriteMutation,
  useGetNotificationsQuery, useGetNotificationQuery, useMarkNotificationReadMutation, useMarkAllNotificationsReadMutation, useDeleteNotificationMutation, useGetUnreadNotificationCountQuery,
  useGetMyBookingsQuery, useGetBookingQuery, useUpdateBookingStatusMutation, useGetBookingStatusHistoryQuery, useGetBookingReceiptQuery, useGetBookingQrCodeQuery, useGetBookingInvoiceQuery, useCreateBookingReviewMutation,
  useGetInspectionQuery, useCreateInspectionMutation, useUpdateInspectionMutation, useGetInspectionImagesQuery, useAddInspectionImagesMutation, useDeleteInspectionImageMutation,
  useGetBookingDisputesQuery, useCreateBookingDisputeMutation, useGetDisputeQuery, useUpdateDisputeMutation,
  useCreateOfferMutation, useGetOfferQuery, useUpdateOfferMutation, useWithdrawOfferMutation, useAcceptOfferMutation, useRejectOfferMutation,
  useGetOpenItemRequestsQuery, useUpdateItemRequestMutation, useCancelItemRequestMutation, useGetNearbyItemRequestsQuery,
  useGetWalletQuery, useGetWalletTransactionsQuery, useGetWalletTransactionQuery, useGetTopupRequestsQuery, useCreateTopupRequestMutation, useGetTopupRequestQuery,
  useGetSearchSuggestionsQuery, useSearchNearbyQuery, useGetSearchLogsQuery, useGetNearbyItemsQuery, useGetItemReviewsQuery, useGetItemAvailabilityQuery,
  useGetReviewQuery, useUpdateReviewMutation, useDeleteReviewMutation, useCreateReportMutation, useGetMyReportsQuery, useGetMyReportQuery,
  useUploadImageMutation, useGetImageQuery, useDeleteImageMutation, useGetCategoryQuery, useGetCategoryItemsQuery, useGetCategoryChildrenQuery,
} = renterApi;
