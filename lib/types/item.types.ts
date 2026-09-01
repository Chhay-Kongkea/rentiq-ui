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
