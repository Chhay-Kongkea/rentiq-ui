export interface SpringPage<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  size: number;
  number: number;
  numberOfElements: number;
  empty: boolean;
}

export interface PublicAdvertisement {
  id?: string;
  itemId?: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  startAt?: string;
  endAt?: string;
}

export type AdvertisementPackage = "AD_3_DAYS" | "AD_7_DAYS" | "AD_14_DAYS";
export type AdvertisementStatus =
  | "PENDING"
  | "APPROVED"
  | "ACTIVE"
  | "REJECTED"
  | "EXPIRED"
  | "CANCELLED";

/** Full vendor/admin view of an advertisement (AdvertisementResponse). */
export interface Advertisement {
  id?: string;
  vendorId?: string;
  itemId?: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  packageType?: AdvertisementPackage;
  durationDays?: number;
  quotedPrice?: number;
  quotedCurrency?: string;
  quotedAt?: string;
  price?: number;
  currency?: string;
  status?: AdvertisementStatus;
  startAt?: string;
  endAt?: string;
  rejectionReason?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

/** Body for POST /api/v1/advertisements */
export interface CreateAdvertisementRequest {
  itemId: string;
  packageType: AdvertisementPackage;
  title: string;
  startAt: string;
  description?: string;
  imageUrl?: string;
}

/** Body for PATCH /api/v1/advertisements/{id} */
export interface UpdateAdvertisementRequest {
  packageType: AdvertisementPackage;
  title: string;
  startAt: string;
  description?: string;
  imageUrl?: string;
}

/** Body for PATCH /api/v1/admin/advertisements/{id}/reject */
export interface RejectAdvertisementRequest {
  reason: string;
}

/** Query params for the vendor "my advertisements" list. */
export interface AdvertisementListParams {
  status?: AdvertisementStatus;
  page?: number;
  size?: number;
  sort?: string | string[];
}

/** Query params for the admin advertisements list. */
export interface AdminAdvertisementListParams extends AdvertisementListParams {
  vendorId?: string;
  from?: string;
  to?: string;
}

export interface PackagePricing {
  packageType?: string;
  durationDays?: number;
  prices?: Record<string, number>;
}

export interface PlatformPricing {
  promotions?: PackagePricing[];
  advertisements?: PackagePricing[];
}

export interface Locale {
  code?: string;
  name?: string;
  nativeName?: string;
}

export interface SupportedLocales {
  locales?: Locale[];
}

export interface LocaleStrings {
  code?: string;
  strings?: Record<string, string>;
}

export type PromotionPackage = "BOOST_1_DAY" | "BOOST_3_DAYS" | "BOOST_7_DAYS";
export type PromotionStatus = "ACTIVE" | "EXPIRED" | "CANCELLED" | "SUSPENDED";

export interface Promotion {
  id?: string;
  vendorId?: string;
  itemId?: string;
  packageType?: PromotionPackage;
  durationDays?: number;
  price?: number;
  currency?: string;
  status?: PromotionStatus;
  startAt?: string;
  endAt?: string;
  impressionCount?: number;
  clickCount?: number;
  cancelledAt?: string;
  suspendedBy?: string;
  suspendedAt?: string;
  suspensionReason?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PromotionStats {
  promotionId?: string;
  itemId?: string;
  packageType?: PromotionPackage;
  status?: PromotionStatus;
  price?: number;
  currency?: string;
  startAt?: string;
  endAt?: string;
  impressions?: number;
  clicks?: number;
  ctr?: number;
}

/** Body for POST /api/v1/promotions */
export interface CreatePromotionRequest {
  itemId: string;
  packageType: PromotionPackage;
}

/** Body for PATCH /api/v1/admin/promotions/{id}/status */
export interface SuspendPromotionRequest {
  status: PromotionStatus;
  reason: string;
}

/** Query params for the vendor "my promotions" list. */
export interface PromotionListParams {
  status?: PromotionStatus;
  page?: number;
  size?: number;
  sort?: string | string[];
}

/** Query params for the admin promotions list. */
export interface AdminPromotionListParams extends PromotionListParams {
  vendorId?: string;
  itemId?: string;
  packageType?: PromotionPackage;
  createdFrom?: string;
  createdTo?: string;
}

export type PageableParams = {
  "pageable.page"?: number;
  "pageable.size"?: number;
  "pageable.sort"?: string | string[];
};
