import type { WalletDirection } from "./vendor.types";

/** Body for POST /api/v1/admin/wallets/{walletId}/topup */
export interface AdminWalletTopupRequest {
  amount: number;
  currency: string;
  paymentMethod?: string;
  paymentReference?: string;
  note?: string;
}

/** Response of POST /api/v1/admin/wallets/{walletId}/topup */
export interface AdminWalletTopupResponse {
  walletId?: string;
  ownerId?: string;
  amount?: number;
  currency?: string;
  balanceBefore?: number;
  balanceAfter?: number;
  transactionId?: string;
  createdAt?: string;
}

/** Body for PATCH /api/v1/admin/wallets/{walletId}/adjust */
export interface AdminWalletAdjustRequest {
  amount: number;
  direction: WalletDirection;
  reason: string;
}
