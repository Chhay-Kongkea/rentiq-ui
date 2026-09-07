export type ItemCondition = "NEW" | "LIKE_NEW" | "GOOD" | "FAIR" | "POOR";
export type ItemApprovalStatus = "PENDING" | "APPROVED" | "REJECTED" | "REMOVED";
export type ItemStatus = "ACTIVE" | "HIDDEN";

export interface ItemImage {
  id?: string;
  url?: string;
  imageUrl?: string;
  primary?: boolean;
  displayOrder?: number;
  thumbnailUrl?: string;
  sortOrder?: number;
  createdAt?: string;
}

export interface Item {
  id: string;
  ownerId?: string;
  categoryId?: string;
  title?: string;
  description?: string;
  condition?: ItemCondition;
  specifications?: Record<string, unknown>;
  images?: ItemImage[];
  primaryImageUrl?: string;
  locationText?: string;
  latitude?: number;
  longitude?: number;
  pricePerDay?: number;
  depositAmount?: number;
  available?: boolean;
  approvalStatus?: ItemApprovalStatus;
  status?: ItemStatus;
  featured?: boolean;
  featuredUntil?: string;
  averageRating?: number;
  totalReviews?: number;
  totalBookings?: number;
  viewCount?: number;
  favoriteCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ItemsResponse {
  content: Item[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface PublicItemQuery {
  keyword?: string;
  minPrice?: number;
  maxPrice?: number;
  categoryId?: string;
  condition?: ItemCondition;
  available?: boolean;
  featured?: boolean;
  location?: string;
  minimumRating?: number;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
}

export interface FavoriteItem {
  itemId: string;
  title?: string;
  thumbnailUrl?: string;
  pricePerDay?: number;
  averageRating?: number;
  totalReviews?: number;
  locationText?: string;
  favoritedAt?: string;
}

export interface AvailabilityBlock {
  id: string;
  itemId?: string;
  startDate: string;
  endDate: string;
  reason?: string;
  source?: string;
  createdAt?: string;
}

export interface ItemReviewImage {
  id?: string;
  imageUrl?: string;
  thumbnailUrl?: string;
  sortOrder?: number;
}

export interface ReviewImageInput {
  imageUrl: string;
  thumbnailUrl?: string;
}

export interface ItemReview {
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
  images?: ItemReviewImage[];
}

export interface ItemReviewsResponse {
  content: ItemReview[];
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  size: number;
  number: number;
  numberOfElements: number;
  empty: boolean;
}
