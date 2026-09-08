import type { Item, ItemCondition, ItemImage, ItemsResponse } from "@/lib/types/item.types";

export type VendorApplicationStatus = "PENDING" | "APPROVED" | "REJECTED";
export type VendorAccountStatus = "ACTIVE" | "SUSPENDED" | "BANNED";
export type BookingStatus =
  | "PENDING"
  | "APPROVED"
  | "RENTED"
  | "COMPLETED"
  | "REJECTED"
  | "CANCELLED"
  | "EXPIRED";
export type PaymentStatus = "UNPAID" | "HELD_IN_ESCROW" | "RELEASED_TO_VENDOR" | "REFUNDED";
export type OfferStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "WITHDRAWN";
export type ItemAvailability = "AVAILABLE" | "UNAVAILABLE" | "HIDDEN";
export type NotificationType = "BOOKING" | "PAYMENT" | "ITEM_REQUEST" | "OFFER" | "ITEM" | "MARKETING" | "SYSTEM";
export type ReferenceType = "BOOKING" | "PAYMENT" | "ITEM_REQUEST" | "OFFER" | "ITEM" | "USER";
export type WalletStatus = "ACTIVE" | "LOCKED";
export type WalletDirection = "IN" | "OUT";
export type WalletTransactionType =
  | "WELCOME_BONUS"
  | "COMMISSION"
  | "PENALTY"
  | "TOP_UP"
  | "REFUND"
  | "ADVERTISEMENT"
  | "PROMOTION"
  | "ADMIN_ADJUSTMENT";

export interface PageResponse<T> {
  content?: T[];
  pageNumber?: number;
  pageSize?: number;
  totalElements?: number;
  totalPages?: number;
  first?: boolean;
  last?: boolean;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

export interface SpringPage<T> {
  content?: T[];
  totalElements?: number;
  totalPages?: number;
  first?: boolean;
  last?: boolean;
  size?: number;
  number?: number;
  numberOfElements?: number;
  empty?: boolean;
}

export interface VendorApplicationRequest {
  message?: string;
}

export interface VendorApplicationResponse {
  id: string;
  status: VendorApplicationStatus;
  message?: string;
  rejectionReason?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface VendorPerformanceResponse {
  ownerId: string;
  accountStatus: VendorAccountStatus;
  totalBookings: number;
  completedBookings: number;
  acceptanceRate: number;
  cancellationRate: number;
  averageRating: number;
  reviewCount: number;
  medianResponseTimeMinutes: number;
  completedBookingValue: number;
  totalEarnings?: number;
}

export interface VendorBookingValuePeriodPoint {
  period?: string;
  completedBookingValue?: number;
  completedBookingCount?: number;
}

export interface VendorEarningsReportResponse {
  from: string;
  to?: string;
  groupBy: "DAY" | "MONTH";
  currencies?: Array<{
    currency?: string;
    completedBookingValue?: number;
    completedBookingCount?: number;
    averageBookingValue?: number;
  }>;
  trend?: Array<{
    currency?: string;
    points?: VendorBookingValuePeriodPoint[];
  }>;
}

export interface CreateItemRequest {
  categoryId: string;
  title: string;
  description?: string;
  condition: ItemCondition;
  specifications?: Record<string, unknown>;
  locationText: string;
  latitude: number;
  longitude: number;
  pricePerDay: number;
  depositAmount?: number;
}

export type UpdateItemRequest = Partial<CreateItemRequest>;

export interface UpdateItemStatusRequest {
  status: "ACTIVE" | "HIDDEN";
}

export interface UpdateItemAvailabilityRequest {
  availability: ItemAvailability;
}

export interface AvailabilityBlock {
  id: string;
  itemId: string;
  startDate: string;
  endDate: string;
  reason?: string;
  source?: string;
  createdAt?: string;
}

export interface CreateAvailabilityBlockRequest {
  startDate: string;
  endDate: string;
  reason?: string;
}

export interface UpdateItemImageRequest {
  sortOrder?: number;
  primary?: boolean;
}

export interface BookingResponse {
  id: string;
  bookingRef?: string;
  itemId: string;
  offerId?: string;
  customerId?: string;
  ownerId?: string;
  rentalStart: string;
  rentalEnd: string;
  rentalDays?: number;
  bookedPricePerDay?: number;
  subtotal?: number;
  securityDeposit?: number;
  commissionRate?: number;
  commissionAmount?: number;
  totalAmount?: number;
  currency?: string;
  status: BookingStatus;
  paymentStatus?: PaymentStatus;
  ownerConfirmedAt?: string;
  securityDepositReturnedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateBookingStatusRequest {
  status: BookingStatus;
  reason?: string;
}


export interface BookingStatusHistoryResponse {
  id: string;
  oldStatus?: BookingStatus;
  newStatus: BookingStatus;
  changedBy?: string;
  reason?: string;
  createdAt?: string;
}

export interface BookingQrCodeResponse {
  bookingId: string;
  qrToken: string;
  qrImageBase64?: string;
  expiresAt?: string;
}

export interface QrScanRequest {
  qrToken: string;
}

export interface InspectionImageResponse {
  id: string;
  imageName?: string;
  type?: string;
  createdAt?: string;
}

export interface InspectionImageInput {
  imageName: string;
  type: "CHECK_IN" | "CHECK_OUT";
}

export interface AddInspectionImagesRequest {
  images: InspectionImageInput[];
}

export interface ImageUploadResponse {
  id: string;
  imageUrl?: string;
  thumbnailUrl?: string;
  publicId?: string;
  assetId?: string;
  folder?: string;
  originalFilename?: string;
  contentType?: string;
  fileSize?: number;
  createdAt?: string;
}

export interface ItemRequestResponse {
  id: string;
  customerId?: string;
  categoryId?: string;
  title?: string;
  description?: string;
  budgetMin?: number;
  budgetMax?: number;
  neededFrom?: string;
  neededTo?: string;
  latitude?: number;
  longitude?: number;
  radiusKm?: number;
  status?: "OPEN" | "MATCHED" | "CANCELLED" | "EXPIRED";
  expiresAt?: string;
  offerCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ItemRequestFilter {
  keyword?: string;
  categoryId?: string;
  budgetMin?: number;
  budgetMax?: number;
  status?: "OPEN" | "MATCHED" | "CANCELLED" | "EXPIRED";
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
}

export interface OfferResponse {
  id: string;
  requestId: string;
  ownerId?: string;
  itemId?: string;
  itemTitle?: string;
  offeredPrice: number;
  currency?: string;
  message?: string;
  status: OfferStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface OfferStatusResponse {
  offerId: string;
  requestId: string;
  status: OfferStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateOfferRequest {
  itemId?: string;
  offeredPrice: number;
  currency?: string;
  message?: string;
}

export interface UpdateOfferRequest {
  itemId?: string;
  offeredPrice?: number;
  currency?: string;
  message?: string;
}

export interface WalletResponse {
  id: string;
  ownerId: string;
  balance: number;
  frozenBalance: number;
  currency: string;
  status: WalletStatus;
  updatedAt?: string;
}

export interface WalletTransactionResponse {
  id: string;
  walletId: string;
  transactionType: WalletTransactionType;
  amount: number;
  direction: WalletDirection;
  balanceAfter: number;
  description?: string;
  bookingId?: string;
  topupRequestId?: string;
  advertisementId?: string;
  promotionId?: string;
  createdAt?: string;
}

export type TopupRequestStatus = "PENDING" | "SUCCESS" | "EXPIRED";

/** Response of GET/POST /wallets/me/topup-requests */
export interface TopupRequestResponse {
  id: string;
  walletId: string;
  amount: number;
  paymentMethod?: string;
  status: TopupRequestStatus;
  bankReference?: string;
  createdAt?: string;
}

/** Body for POST /wallets/me/topup-requests */
export interface CreateTopupRequest {
  amount: number;
  paymentMethod?: string;
  bankReference?: string;
}

export interface NotificationResponse {
  id: string;
  notificationType: NotificationType;
  title: string;
  body: string;
  payload?: Record<string, unknown>;
  read: boolean;
  readAt?: string;
  referenceId?: string;
  referenceType?: ReferenceType;
  createdAt?: string;
}

export interface NotificationUnreadCountResponse {
  unreadCount: number;
}

export interface ReviewResponse {
  id: string;
  bookingId?: string;
  reviewerId?: string;
  itemId?: string;
  rating?: number;
  reviewText?: string;
  vendorReply?: string;
  vendorRepliedAt?: string;
  status?: string;
  createdAt?: string;
  images?: Array<{ id?: string; imageUrl?: string; createdAt?: string }>;
}

export interface UpsertInspectionRequest {
  checkInNotes?: string;
  checkOutNotes?: string;
}

export interface InspectionResponse {
  id: string;
  bookingId: string;
  checkInNotes?: string;
  checkOutNotes?: string;
  createdAt?: string;
  images?: InspectionImageResponse[];
}

export interface CreateDisputeRequest {
  disputeType: string;
  description: string;
}

export type UpdateDisputeRequest = Partial<CreateDisputeRequest>;

export interface DisputeResponse {
  id: string;
  bookingId: string;
  openedBy?: string;
  disputeType?: string;
  description?: string;
  status?: string;
  resolvedBy?: string;
  resolvedAt?: string;
  createdAt?: string;
}

export interface CreateReportRequest {
  reportType: "USER" | "ITEM" | "REVIEW";
  reportedUserId?: string;
  reportedItemId?: string;
  reportedReviewId?: string;
  description?: string;
}

export interface ReportResponse {
  id: string;
  reporterId?: string;
  reportedUserId?: string;
  reportedItemId?: string;
  reportedReviewId?: string;
  reportType: "USER" | "ITEM" | "REVIEW";
  description?: string;
  status?: "OPEN" | "UNDER_REVIEW" | "RESOLVED" | "DISMISSED";
  actionCount?: number;
  createdAt?: string;
}

export type VendorItem = Item;
export type VendorItemsResponse = ItemsResponse;
export type VendorItemImage = ItemImage;
