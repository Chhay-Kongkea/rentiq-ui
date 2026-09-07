import { api } from "@/redux/api";
import type {
  BookingQrCodeResponse,
  BookingResponse,
  BookingStatusHistoryResponse,
  CreateDisputeRequest,
  CreateReportRequest,
  DisputeResponse,
  ImageUploadResponse,
  InspectionImageResponse,
  InspectionResponse,
  ItemRequestResponse,
  NotificationResponse,
  NotificationUnreadCountResponse,
  OfferResponse,
  PageResponse,
  ReportResponse,
  ReviewResponse,
  UpdateBookingStatusRequest,
  UpdateDisputeRequest,
  UpsertInspectionRequest,
  WalletResponse,
  WalletTransactionResponse,
} from "@/lib/types/vendor.types";
import type { AvailabilityBlock, FavoriteItem, ItemReviewImage, ItemReviewsResponse, ReviewImageInput } from "@/lib/types/item.types";

type Id = string;
type Body = Record<string, unknown>;
type PageParams = Record<string, string | number | boolean | undefined>;
type FavoritesResponse = FavoriteItem[] | PageResponse<FavoriteItem>;

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
    getFavorites: builder.query<FavoritesResponse, PageParams | undefined>({ query: (params = {}) => ({ url: "/favorites", params }), providesTags: ["Renter"] }),
    addFavorite: builder.mutation<FavoriteItem, Id>({ query: (itemId) => ({ url: `/favorites/${itemId}`, method: "POST" }), invalidatesTags: ["Renter"] }),
    removeFavorite: builder.mutation<void, Id>({ query: (itemId) => ({ url: `/favorites/${itemId}`, method: "DELETE" }), invalidatesTags: ["Renter"] }),

    getNotifications: builder.query<PageResponse<NotificationResponse>, PageParams | undefined>({ query: (params = {}) => ({ url: "/notifications", params }), providesTags: ["Renter"] }),
    getNotification: builder.query<NotificationResponse, Id>({ query: (id) => `/notifications/${id}` }),
    markNotificationRead: builder.mutation<void, Id>({ query: (id) => ({ url: `/notifications/${id}/read`, method: "PATCH" }), invalidatesTags: ["Renter"] }),
    markAllNotificationsRead: builder.mutation<void, void>({ query: () => ({ url: "/notifications/read-all", method: "PATCH" }), invalidatesTags: ["Renter"] }),
    deleteNotification: builder.mutation<void, Id>({ query: (id) => ({ url: `/notifications/${id}`, method: "DELETE" }), invalidatesTags: ["Renter"] }),
    getUnreadNotificationCount: builder.query<NotificationUnreadCountResponse, void>({ query: () => "/notifications/unread-count", providesTags: ["Renter"] }),

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
    createBookingReview: builder.mutation<ReviewResponse, { id: Id; body: Body }>({ query: ({ id, body }) => ({ url: `/bookings/${id}/review`, method: "POST", body }), invalidatesTags: ["Renter"] }),

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

    getOffer: builder.query<OfferResponse, Id>({ query: (id) => `/offers/${id}`, providesTags: (_result, _error, id) => [{ type: "Renter", id }] }),
    acceptOffer: builder.mutation<OfferResponse, { requestId: Id; offerId: Id }>({ query: ({ requestId, offerId }) => ({ url: `/item-requests/${requestId}/offers/${offerId}/accept`, method: "PATCH" }), invalidatesTags: ["Renter"] }),
    rejectOffer: builder.mutation<OfferResponse, { requestId: Id; offerId: Id }>({ query: ({ requestId, offerId }) => ({ url: `/item-requests/${requestId}/offers/${offerId}/reject`, method: "PATCH" }), invalidatesTags: ["Renter"] }),

    getOpenItemRequests: builder.query<PageResponse<ItemRequestResponse>, PageParams | undefined>({ query: (params = {}) => ({ url: "/item-requests", params }), providesTags: ["Renter"] }),
    updateItemRequest: builder.mutation<ItemRequestResponse, { id: Id; body: Body }>({ query: ({ id, body }) => ({ url: `/item-requests/${id}`, method: "PATCH", body }), invalidatesTags: ["Renter"] }),
    cancelItemRequest: builder.mutation<void, Id>({ query: (id) => ({ url: `/item-requests/${id}`, method: "DELETE" }), invalidatesTags: ["Renter"] }),
    getNearbyItemRequests: builder.query<PageResponse<ItemRequestResponse>, PageParams>({ query: (params = {}) => ({ url: "/item-requests/nearby", params }), providesTags: ["Renter"] }),

    getWallet: builder.query<WalletResponse, void>({ query: () => "/wallets/me", providesTags: ["Wallet"] }),
    getWalletTransactions: builder.query<PageResponse<WalletTransactionResponse>, PageParams | undefined>({ query: (params = {}) => ({ url: "/wallets/me/transactions", params }), providesTags: ["Wallet"] }),
    getWalletTransaction: builder.query<WalletTransactionResponse, Id>({ query: (id) => `/wallets/me/transactions/${id}` }),

    getSearchSuggestions: builder.query<Array<{ value?: string; type?: string }>, PageParams | undefined>({ query: (params = {}) => ({ url: "/search/suggestions", params }) }),
    searchNearby: builder.query<PageResponse<import("@/lib/types/item.types").Item>, PageParams>({ query: (params = {}) => ({ url: "/search/nearby", params }) }),
    getSearchLogs: builder.query<PageResponse<{ id: string; keyword?: string; categoryId?: string; latitude?: number; longitude?: number; createdAt?: string }>, PageParams | undefined>({ query: (params = {}) => ({ url: "/search/logs", params }) }),
    getNearbyItems: builder.query<PageResponse<import("@/lib/types/item.types").Item>, PageParams>({ query: (params = {}) => ({ url: "/items/nearby", params }) }),
    getItemReviews: builder.query<ItemReviewsResponse, { itemId: Id; params?: PageParams }>({ query: ({ itemId, params }) => ({ url: `/items/${encodeURIComponent(itemId)}/reviews`, params }) }),
    getItemAvailability: builder.query<AvailabilityBlock[], Id>({ query: (itemId) => `/items/${encodeURIComponent(itemId)}/availability` }),

    getReview: builder.query<ReviewResponse, Id>({ query: (id) => `/reviews/${id}`, providesTags: (_result, _error, id) => [{ type: "Renter", id }] }),
    updateReview: builder.mutation<ReviewResponse, { id: Id; body: Body }>({ query: ({ id, body }) => ({ url: `/reviews/${id}`, method: "PATCH", body }), invalidatesTags: ["Renter", "User"] }),
    deleteReview: builder.mutation<void, Id>({ query: (id) => ({ url: `/reviews/${id}`, method: "DELETE" }), invalidatesTags: ["Renter", "User"] }),
    attachReviewImages: builder.mutation<ItemReviewImage[], { reviewId: Id; images: ReviewImageInput[] }>({
      query: ({ reviewId, images }) => ({
        url: `/reviews/${encodeURIComponent(reviewId)}/images`,
        method: "POST",
        body: { images },
      }),
      invalidatesTags: ["Renter"],
    }),
    removeReviewImage: builder.mutation<void, { reviewId: Id; imageId: Id }>({
      query: ({ reviewId, imageId }) => ({
        url: `/reviews/${encodeURIComponent(reviewId)}/images/${encodeURIComponent(imageId)}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Renter"],
    }),
    createReport: builder.mutation<ReportResponse, CreateReportRequest>({ query: (body) => ({ url: "/reports", method: "POST", body }), invalidatesTags: ["Renter"] }),
    getMyReports: builder.query<PageResponse<ReportResponse>, PageParams | undefined>({ query: (params = {}) => ({ url: "/reports/me", params }), providesTags: ["Renter"] }),
    getMyReport: builder.query<ReportResponse, Id>({ query: (id) => `/reports/${id}` }),

    uploadImage: builder.mutation<ImageUploadResponse, FormData>({ query: (body) => ({ url: "/images/upload", method: "POST", body }) }),
    getCategoryItems: builder.query<import("@/lib/types/item.types").Item[], { id: Id; params?: PageParams }>({ query: ({ id, params }) => ({ url: `/categories/${id}/items`, params }) }),
    getCategoryChildren: builder.query<import("@/lib/types/category.types").Category[], Id>({ query: (id) => `/categories/${id}/children` }),
  }),
});

export const {
  useGetFavoritesQuery, useAddFavoriteMutation, useRemoveFavoriteMutation,
  useGetNotificationsQuery, useGetNotificationQuery, useMarkNotificationReadMutation, useMarkAllNotificationsReadMutation, useDeleteNotificationMutation, useGetUnreadNotificationCountQuery,
  useGetMyBookingsQuery, useGetBookingQuery, useUpdateBookingStatusMutation, useGetBookingStatusHistoryQuery, useLazyGetBookingReceiptQuery, useGetBookingQrCodeQuery, useLazyGetBookingInvoiceQuery, useCreateBookingReviewMutation,
  useGetInspectionQuery, useCreateInspectionMutation, useUpdateInspectionMutation, useGetInspectionImagesQuery, useAddInspectionImagesMutation, useDeleteInspectionImageMutation,
  useGetBookingDisputesQuery, useCreateBookingDisputeMutation, useGetDisputeQuery, useUpdateDisputeMutation,
  useGetOfferQuery, useAcceptOfferMutation, useRejectOfferMutation,
  useGetOpenItemRequestsQuery, useUpdateItemRequestMutation, useCancelItemRequestMutation, useGetNearbyItemRequestsQuery,
  useGetWalletQuery, useGetWalletTransactionsQuery, useGetWalletTransactionQuery,
  useGetSearchSuggestionsQuery, useSearchNearbyQuery, useGetSearchLogsQuery, useGetNearbyItemsQuery, useGetItemReviewsQuery, useGetItemAvailabilityQuery,
  useGetReviewQuery, useUpdateReviewMutation, useDeleteReviewMutation, useAttachReviewImagesMutation, useRemoveReviewImageMutation, useCreateReportMutation, useGetMyReportsQuery, useGetMyReportQuery,
  useUploadImageMutation, useGetCategoryItemsQuery, useGetCategoryChildrenQuery,
} = renterApi;
