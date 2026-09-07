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

export type PageableParams = {
  "pageable.page"?: number;
  "pageable.size"?: number;
  "pageable.sort"?: string | string[];
};
