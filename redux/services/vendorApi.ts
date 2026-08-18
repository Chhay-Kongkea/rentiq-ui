import { api } from "@/redux/api";
import type {
  AvailabilityBlock,
  BookingQrCodeResponse,
  BookingResponse,
  BookingStatusHistoryResponse,
  CreateAvailabilityBlockRequest,
  CreateItemRequest,
  CreateOfferRequest,
  CreateTopupRequest,
  CreateDisputeRequest,
  CreateReportRequest,
  DisputeResponse,
  AddInspectionImagesRequest,
  InspectionImageResponse,
  InspectionResponse,
  ItemRequestFilter,
  ItemRequestResponse,
  NotificationResponse,
  NotificationUnreadCountResponse,
  OfferResponse,
  OfferStatusResponse,
  PageResponse,
  QrScanRequest,
  ReportResponse,
  ReviewResponse,
  SpringPage,
  TopupRequestResponse,
  UpdateBookingStatusRequest,
  UpdateDisputeRequest,
  UpdateItemAvailabilityRequest,
  UpdateItemImageRequest,
  UpdateItemRequest,
  UpdateItemStatusRequest,
  UpdateOfferRequest,
  UpsertInspectionRequest,
  VendorApplicationRequest,
  VendorApplicationResponse,
  VendorEarningsReportResponse,
  VendorItem,
  VendorItemImage,
  VendorItemsResponse,
  VendorPerformanceResponse,
  WalletResponse,
  WalletTransactionResponse,
} from "@/lib/types/vendor.types";

export type Paging = {
  page?: number;
  size?: number;
  sort?: string | string[];
};

const pageableParams = ({ page = 0, size = 20, sort }: Paging = {}) => ({
  page,
  size,
  ...(sort ? { sort } : {}),
});

export const vendorApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Become vendor
    getMyVendorApplication: builder.query<VendorApplicationResponse, void>({
      query: () => "/vendor-applications/me",
      providesTags: [{ type: "Vendor", id: "APPLICATION" }],
    }),
    submitVendorApplication: builder.mutation<VendorApplicationResponse, VendorApplicationRequest | void>({
      query: (body) => ({
        url: "/vendor-applications",
        method: "POST",
        body: body ?? {},
      }),
      invalidatesTags: [{ type: "Vendor", id: "APPLICATION" }],
    }),

    // Vendor dashboard / reports
    getVendorPerformance: builder.query<VendorPerformanceResponse, void>({
      query: () => "/vendors/me/performance",
      providesTags: [{ type: "Vendor", id: "PERFORMANCE" }],
    }),
    getVendorEarnings: builder.query<
      VendorEarningsReportResponse,
      { from: string; to?: string; groupBy?: "DAY" | "MONTH"; page?: number; size?: number; sort?: string | string[] }
    >({
      query: ({ from, to, groupBy = "DAY", page = 0, size = 50, sort }) => ({
        url: "/vendors/me/reports/earnings",
        params: { from, to, groupBy, ...pageableParams({ page, size, sort }) },
      }),
      providesTags: [{ type: "Vendor", id: "EARNINGS" }],
    }),

    // Vendor inventory
    getMyVendorItems: builder.query<
      VendorItemsResponse,
      { pageNumber?: number; pageSize?: number; sortBy?: string; sortDirection?: "asc" | "desc" } | void
    >({
      query: (args) => {
        const { pageNumber = 0, pageSize = 100, sortBy = "createdAt", sortDirection = "desc" } = args ?? {};
        return { url: "/vendors/me/items", params: { pageNumber, pageSize, sortBy, sortDirection } };
      },
      providesTags: (result) => [
        { type: "Vendor", id: "ITEMS" },
        ...(result?.content ?? []).map((item) => ({ type: "Item" as const, id: item.id })),
      ],
    }),
    getMyVendorItem: builder.query<VendorItem, string>({
      query: (itemId) => `/vendors/me/items/${encodeURIComponent(itemId)}`,
      providesTags: (_result, _error, itemId) => [{ type: "Item", id: itemId }],
    }),
    createVendorItem: builder.mutation<VendorItem, CreateItemRequest>({
      query: (body) => ({ url: "/items", method: "POST", body }),
      invalidatesTags: [{ type: "Vendor", id: "ITEMS" }, { type: "Vendor", id: "PERFORMANCE" }],
    }),
    updateVendorItem: builder.mutation<VendorItem, { itemId: string; body: UpdateItemRequest }>({
      query: ({ itemId, body }) => ({ url: `/items/${encodeURIComponent(itemId)}`, method: "PATCH", body }),
      invalidatesTags: (_result, _error, { itemId }) => [{ type: "Item", id: itemId }, { type: "Vendor", id: "ITEMS" }],
    }),
    deleteVendorItem: builder.mutation<void, string>({
      query: (itemId) => ({ url: `/items/${encodeURIComponent(itemId)}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Vendor", id: "ITEMS" }, { type: "Vendor", id: "PERFORMANCE" }],
    }),
    updateVendorItemStatus: builder.mutation<VendorItem, { itemId: string; body: UpdateItemStatusRequest }>({
      query: ({ itemId, body }) => ({ url: `/items/${encodeURIComponent(itemId)}/status`, method: "PATCH", body }),
      invalidatesTags: (_result, _error, { itemId }) => [{ type: "Item", id: itemId }, { type: "Vendor", id: "ITEMS" }],
    }),
    updateVendorItemAvailability: builder.mutation<VendorItem, { itemId: string; body: UpdateItemAvailabilityRequest }>({
      query: ({ itemId, body }) => ({ url: `/items/${encodeURIComponent(itemId)}/availability`, method: "PATCH", body }),
      invalidatesTags: (_result, _error, { itemId }) => [{ type: "Item", id: itemId }, { type: "Vendor", id: "ITEMS" }, { type: "Vendor", id: `AVAILABILITY-${itemId}` }],
    }),
    getVendorItemAvailabilityBlocks: builder.query<AvailabilityBlock[], string>({
      query: (itemId) => `/items/${encodeURIComponent(itemId)}/availability`,
      providesTags: (_result, _error, itemId) => [{ type: "Vendor", id: `AVAILABILITY-${itemId}` }],
    }),
    createVendorItemAvailabilityBlock: builder.mutation<AvailabilityBlock, { itemId: string; body: CreateAvailabilityBlockRequest }>({
      query: ({ itemId, body }) => ({ url: `/items/${encodeURIComponent(itemId)}/availability-block`, method: "POST", body }),
      invalidatesTags: (_result, _error, { itemId }) => [{ type: "Vendor", id: `AVAILABILITY-${itemId}` }, { type: "Item", id: itemId }],
    }),
    deleteVendorItemAvailabilityBlock: builder.mutation<void, { itemId: string; blockId: string }>({
      query: ({ itemId, blockId }) => ({ url: `/items/${encodeURIComponent(itemId)}/availability-block/${encodeURIComponent(blockId)}`, method: "DELETE" }),
      invalidatesTags: (_result, _error, { itemId }) => [{ type: "Vendor", id: `AVAILABILITY-${itemId}` }, { type: "Item", id: itemId }],
    }),
    getVendorItemImages: builder.query<VendorItemImage[], string>({
      query: (itemId) => `/items/${encodeURIComponent(itemId)}/images`,
      providesTags: (_result, _error, itemId) => [{ type: "Vendor", id: `IMAGES-${itemId}` }],
    }),
    uploadVendorItemImages: builder.mutation<VendorItemImage[], { itemId: string; files: File[] }>({
      query: ({ itemId, files }) => {
        const body = new FormData();
        files.forEach((file) => body.append("files", file));
        return { url: `/items/${encodeURIComponent(itemId)}/images`, method: "POST", body };
      },
      invalidatesTags: (_result, _error, { itemId }) => [{ type: "Vendor", id: `IMAGES-${itemId}` }, { type: "Item", id: itemId }, { type: "Vendor", id: "ITEMS" }],
    }),
    updateVendorItemImage: builder.mutation<VendorItemImage, { itemId: string; imageId: string; body: UpdateItemImageRequest }>({
      query: ({ itemId, imageId, body }) => ({ url: `/items/${encodeURIComponent(itemId)}/images/${encodeURIComponent(imageId)}`, method: "PATCH", body }),
      invalidatesTags: (_result, _error, { itemId }) => [{ type: "Vendor", id: `IMAGES-${itemId}` }, { type: "Item", id: itemId }, { type: "Vendor", id: "ITEMS" }],
    }),
    deleteVendorItemImage: builder.mutation<void, { itemId: string; imageId: string }>({
      query: ({ itemId, imageId }) => ({ url: `/items/${encodeURIComponent(itemId)}/images/${encodeURIComponent(imageId)}`, method: "DELETE" }),
      invalidatesTags: (_result, _error, { itemId }) => [{ type: "Vendor", id: `IMAGES-${itemId}` }, { type: "Item", id: itemId }, { type: "Vendor", id: "ITEMS" }],
    }),

    // Item requests and offers
    getOpenItemRequestsForVendor: builder.query<PageResponse<ItemRequestResponse>, ItemRequestFilter | void>({
      query: (filter) => ({
        url: "/item-requests",
        params: {
          status: "OPEN",
          pageNumber: 0,
          pageSize: 20,
          sortBy: "createdAt",
          sortDirection: "desc",
          ...(filter ?? {}),
        },
      }),
      providesTags: [{ type: "Offer", id: "OPEN-REQUESTS" }],
    }),
    getMyVendorOffers: builder.query<PageResponse<OfferResponse>, { pageNumber?: number; pageSize?: number } | void>({
      query: (args) => {
        const { pageNumber = 0, pageSize = 50 } = args ?? {};
        return { url: "/vendors/me/offers", params: { pageNumber, pageSize } };
      },
      providesTags: [{ type: "Offer", id: "MY-OFFERS" }],
    }),
    getVendorOffer: builder.query<OfferResponse, string>({
      query: (offerId) => `/offers/${encodeURIComponent(offerId)}`,
      providesTags: (_result, _error, offerId) => [{ type: "Offer", id: offerId }],
    }),
    getVendorOfferStatus: builder.query<OfferStatusResponse, string>({
      query: (offerId) => `/vendors/me/offers/${encodeURIComponent(offerId)}/status`,
      providesTags: (_result, _error, offerId) => [{ type: "Offer", id: offerId }],
    }),
    createVendorOffer: builder.mutation<OfferResponse, { requestId: string; body: CreateOfferRequest }>({
      query: ({ requestId, body }) => ({ url: `/item-requests/${encodeURIComponent(requestId)}/offers`, method: "POST", body }),
      invalidatesTags: [{ type: "Offer", id: "MY-OFFERS" }, { type: "Offer", id: "OPEN-REQUESTS" }],
    }),
    updateVendorOffer: builder.mutation<OfferResponse, { offerId: string; body: UpdateOfferRequest }>({
      query: ({ offerId, body }) => ({ url: `/offers/${encodeURIComponent(offerId)}`, method: "PATCH", body }),
      invalidatesTags: (_result, _error, { offerId }) => [{ type: "Offer", id: offerId }, { type: "Offer", id: "MY-OFFERS" }],
    }),
    withdrawVendorOffer: builder.mutation<void, string>({
      query: (offerId) => ({ url: `/offers/${encodeURIComponent(offerId)}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Offer", id: "MY-OFFERS" }, { type: "Offer", id: "OPEN-REQUESTS" }],
    }),

    // Vendor bookings
    getVendorBookings: builder.query<BookingResponse[], void>({
      query: () => "/vendors/me/bookings",
      providesTags: [{ type: "Booking", id: "VENDOR-LIST" }],
    }),
    getVendorSchedule: builder.query<BookingResponse[], { from?: string; to?: string } | void>({
      query: (args) => ({ url: "/vendors/me/bookings/schedule", params: args ?? {} }),
      providesTags: [{ type: "Booking", id: "VENDOR-SCHEDULE" }],
    }),
    getVendorBooking: builder.query<BookingResponse, string>({
      query: (bookingId) => `/bookings/${encodeURIComponent(bookingId)}`,
      providesTags: (_result, _error, bookingId) => [{ type: "Booking", id: bookingId }],
    }),
    updateVendorBookingStatus: builder.mutation<BookingResponse, { bookingId: string; body: UpdateBookingStatusRequest }>({
      query: ({ bookingId, body }) => ({ url: `/bookings/${encodeURIComponent(bookingId)}/status`, method: "PATCH", body }),
      invalidatesTags: (_result, _error, { bookingId }) => [
        { type: "Booking", id: bookingId },
        { type: "Booking", id: "VENDOR-LIST" },
        { type: "Booking", id: "VENDOR-SCHEDULE" },
        { type: "Vendor", id: "PERFORMANCE" },
        { type: "Vendor", id: "EARNINGS" },
      ],
    }),
    getVendorBookingStatusHistory: builder.query<BookingStatusHistoryResponse[], string>({
      query: (bookingId) => `/bookings/${encodeURIComponent(bookingId)}/status-history`,
      providesTags: (_result, _error, bookingId) => [{ type: "Booking", id: `HISTORY-${bookingId}` }],
    }),
    getVendorBookingQrCode: builder.query<BookingQrCodeResponse, string>({
      query: (bookingId) => `/bookings/${encodeURIComponent(bookingId)}/qr-code`,
      providesTags: (_result, _error, bookingId) => [{ type: "Booking", id: `QR-${bookingId}` }],
    }),
    scanVendorBookingQrCode: builder.mutation<BookingResponse, QrScanRequest>({
      query: (body) => ({ url: "/bookings/qr-code/scan", method: "POST", body }),
      invalidatesTags: [{ type: "Booking", id: "VENDOR-LIST" }, { type: "Booking", id: "VENDOR-SCHEDULE" }],
    }),
    getVendorBookingReceipt: builder.query<Blob, string>({
      query: (bookingId) => ({ url: `/bookings/${encodeURIComponent(bookingId)}/receipt`, responseHandler: (response) => response.blob() }),
    }),
    getVendorBookingInvoice: builder.query<Blob, string>({
      query: (bookingId) => ({ url: `/bookings/${encodeURIComponent(bookingId)}/invoice`, responseHandler: (response) => response.blob() }),
    }),

    // Wallet
    getVendorWallet: builder.query<WalletResponse, void>({
      query: () => "/wallets/me",
      providesTags: [{ type: "Wallet", id: "ME" }],
    }),
    getVendorWalletTransactions: builder.query<SpringPage<WalletTransactionResponse>, Paging | void>({
      query: (paging) => ({ url: "/wallets/me/transactions", params: pageableParams(paging ?? {}) }),
      providesTags: [{ type: "Wallet", id: "TRANSACTIONS" }],
    }),
    getVendorWalletTransaction: builder.query<WalletTransactionResponse, string>({
      query: (transactionId) => `/wallets/me/transactions/${encodeURIComponent(transactionId)}`,
    }),
    getVendorTopupRequests: builder.query<SpringPage<TopupRequestResponse>, Paging | void>({
      query: (paging) => ({ url: "/wallets/me/topup-requests", params: pageableParams(paging ?? {}) }),
      providesTags: [{ type: "Wallet", id: "TOPUPS" }],
    }),
    getVendorTopupRequest: builder.query<TopupRequestResponse, string>({
      query: (topupRequestId) => `/wallets/me/topup-requests/${encodeURIComponent(topupRequestId)}`,
    }),
    createVendorTopupRequest: builder.mutation<TopupRequestResponse, CreateTopupRequest>({
      query: (body) => ({ url: "/wallets/me/topup-requests", method: "POST", body }),
      invalidatesTags: [{ type: "Wallet", id: "ME" }, { type: "Wallet", id: "TRANSACTIONS" }, { type: "Wallet", id: "TOPUPS" }],
    }),

    // Notifications
    getVendorNotifications: builder.query<PageResponse<NotificationResponse>, { pageNumber?: number; pageSize?: number } | void>({
      query: (args) => {
        const { pageNumber = 0, pageSize = 50 } = args ?? {};
        return { url: "/notifications", params: { pageNumber, pageSize } };
      },
      providesTags: [{ type: "Notification", id: "LIST" }],
    }),
    getVendorNotification: builder.query<NotificationResponse, string>({
      query: (notificationId) => `/notifications/${encodeURIComponent(notificationId)}`,
      providesTags: (_result, _error, notificationId) => [{ type: "Notification", id: notificationId }],
    }),
    getVendorUnreadNotificationCount: builder.query<NotificationUnreadCountResponse, void>({
      query: () => "/notifications/unread-count",
      providesTags: [{ type: "Notification", id: "UNREAD" }],
    }),
    markVendorNotificationRead: builder.mutation<NotificationResponse, string>({
      query: (notificationId) => ({ url: `/notifications/${encodeURIComponent(notificationId)}/read`, method: "PATCH" }),
      invalidatesTags: [{ type: "Notification", id: "LIST" }, { type: "Notification", id: "UNREAD" }],
    }),
    markAllVendorNotificationsRead: builder.mutation<void, void>({
      query: () => ({ url: "/notifications/read-all", method: "PATCH" }),
      invalidatesTags: [{ type: "Notification", id: "LIST" }, { type: "Notification", id: "UNREAD" }],
    }),
    deleteVendorNotification: builder.mutation<void, string>({
      query: (notificationId) => ({ url: `/notifications/${encodeURIComponent(notificationId)}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Notification", id: "LIST" }, { type: "Notification", id: "UNREAD" }],
    }),

    // Reviews
    addVendorReviewReply: builder.mutation<ReviewResponse, { reviewId: string; reply: string }>({
      query: ({ reviewId, reply }) => ({ url: `/reviews/${encodeURIComponent(reviewId)}/reply`, method: "POST", body: { reply } }),
    }),
    editVendorReviewReply: builder.mutation<ReviewResponse, { reviewId: string; reply: string }>({
      query: ({ reviewId, reply }) => ({ url: `/reviews/${encodeURIComponent(reviewId)}/reply`, method: "PATCH", body: { reply } }),
    }),

    // Inspection / disputes / reports are shared booking operations that vendors can use.
    getVendorInspection: builder.query<InspectionResponse, string>({ query: (bookingId) => `/bookings/${encodeURIComponent(bookingId)}/inspections` }),
    createVendorInspection: builder.mutation<InspectionResponse, { bookingId: string; body: UpsertInspectionRequest }>({
      query: ({ bookingId, body }) => ({ url: `/bookings/${encodeURIComponent(bookingId)}/inspections`, method: "POST", body }),
    }),
    updateVendorInspection: builder.mutation<InspectionResponse, { bookingId: string; body: UpsertInspectionRequest }>({
      query: ({ bookingId, body }) => ({ url: `/bookings/${encodeURIComponent(bookingId)}/inspections`, method: "PATCH", body }),
    }),
    getVendorInspectionImages: builder.query<InspectionImageResponse[], string>({
      query: (bookingId) => `/bookings/${encodeURIComponent(bookingId)}/inspections/images`,
    }),
    addVendorInspectionImages: builder.mutation<InspectionImageResponse[], { bookingId: string; body: AddInspectionImagesRequest }>({
      query: ({ bookingId, body }) => ({ url: `/bookings/${encodeURIComponent(bookingId)}/inspections/images`, method: "POST", body }),
    }),
    deleteVendorInspectionImage: builder.mutation<void, { bookingId: string; imageId: string }>({
      query: ({ bookingId, imageId }) => ({ url: `/bookings/${encodeURIComponent(bookingId)}/inspections/images/${encodeURIComponent(imageId)}`, method: "DELETE" }),
    }),
    getVendorBookingDisputes: builder.query<DisputeResponse[], string>({ query: (bookingId) => `/bookings/${encodeURIComponent(bookingId)}/disputes` }),
    createVendorBookingDispute: builder.mutation<DisputeResponse, { bookingId: string; body: CreateDisputeRequest }>({
      query: ({ bookingId, body }) => ({ url: `/bookings/${encodeURIComponent(bookingId)}/disputes`, method: "POST", body }),
    }),
    getVendorDispute: builder.query<DisputeResponse, string>({ query: (disputeId) => `/disputes/${encodeURIComponent(disputeId)}` }),
    updateVendorDispute: builder.mutation<DisputeResponse, { disputeId: string; body: UpdateDisputeRequest }>({
      query: ({ disputeId, body }) => ({ url: `/disputes/${encodeURIComponent(disputeId)}`, method: "PATCH", body }),
    }),
    createVendorReport: builder.mutation<ReportResponse, CreateReportRequest>({
      query: (body) => ({ url: "/reports", method: "POST", body }),
    }),
  }),
});

export const {
  useGetMyVendorApplicationQuery,
  useSubmitVendorApplicationMutation,
  useGetVendorPerformanceQuery,
  useGetVendorEarningsQuery,
  useGetMyVendorItemsQuery,
  useGetMyVendorItemQuery,
  useCreateVendorItemMutation,
  useUpdateVendorItemMutation,
  useDeleteVendorItemMutation,
  useUpdateVendorItemStatusMutation,
  useUpdateVendorItemAvailabilityMutation,
  useGetVendorItemAvailabilityBlocksQuery,
  useCreateVendorItemAvailabilityBlockMutation,
  useDeleteVendorItemAvailabilityBlockMutation,
  useGetVendorItemImagesQuery,
  useUploadVendorItemImagesMutation,
  useUpdateVendorItemImageMutation,
  useDeleteVendorItemImageMutation,
  useGetOpenItemRequestsForVendorQuery,
  useGetMyVendorOffersQuery,
  useGetVendorOfferQuery,
  useGetVendorOfferStatusQuery,
  useCreateVendorOfferMutation,
  useUpdateVendorOfferMutation,
  useWithdrawVendorOfferMutation,
  useGetVendorBookingsQuery,
  useGetVendorScheduleQuery,
  useGetVendorBookingQuery,
  useUpdateVendorBookingStatusMutation,
  useGetVendorBookingStatusHistoryQuery,
  useGetVendorBookingQrCodeQuery,
  useScanVendorBookingQrCodeMutation,
  useGetVendorBookingReceiptQuery,
  useGetVendorBookingInvoiceQuery,
  useGetVendorWalletQuery,
  useGetVendorWalletTransactionsQuery,
  useGetVendorWalletTransactionQuery,
  useGetVendorTopupRequestsQuery,
  useGetVendorTopupRequestQuery,
  useCreateVendorTopupRequestMutation,
  useGetVendorNotificationsQuery,
  useGetVendorNotificationQuery,
  useGetVendorUnreadNotificationCountQuery,
  useMarkVendorNotificationReadMutation,
  useMarkAllVendorNotificationsReadMutation,
  useDeleteVendorNotificationMutation,
  useAddVendorReviewReplyMutation,
  useEditVendorReviewReplyMutation,
  useGetVendorInspectionQuery,
  useCreateVendorInspectionMutation,
  useUpdateVendorInspectionMutation,
  useGetVendorInspectionImagesQuery,
  useAddVendorInspectionImagesMutation,
  useDeleteVendorInspectionImageMutation,
  useGetVendorBookingDisputesQuery,
  useCreateVendorBookingDisputeMutation,
  useGetVendorDisputeQuery,
  useUpdateVendorDisputeMutation,
  useCreateVendorReportMutation,
} = vendorApi;
