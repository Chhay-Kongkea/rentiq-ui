export interface UserProfile {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  locale: string;
  accountStatus: string;
  memberSince: string;
}

export interface PublicUserProfile {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  memberSince: string;
}

export interface UserAddress {
  id: string;
  addressLine: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  isDefault: boolean;
  createdAt: string;
}

export interface AddressRequest {
  addressLine: string;
  city: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  isDefault?: boolean;
}

export interface NotificationPreferences {
  bookingNotifications: boolean;
  paymentNotifications: boolean;
  marketingNotifications: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
}

export type UpdateProfileRequest = { locale?: string };
export type NotificationPreferencesRequest = Partial<NotificationPreferences>;

export interface UserReview {
  id: string;
  bookingId?: string;
  reviewerId?: string;
  itemId?: string;
  rating?: number;
  reviewText?: string;
  vendorReply?: string;
  status?: string;
  createdAt?: string;
}

export interface UserItemRequest {
  id: string;
  categoryId?: number;
  title?: string;
  description?: string;
  status?: string;
  budgetMin?: number;
  budgetMax?: number;
  neededFrom?: string;
  neededTo?: string;
  location?: string;
    latitude?: number;
  longitude?: number;offerCount?: number;
  createdAt?: string;
}

export interface PageResponse<T> {
  content?: T[];
  totalElements?: number;
  totalPages?: number;
  pageNumber?: number;
  pageSize?: number;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}