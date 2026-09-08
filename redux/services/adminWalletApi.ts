import { api } from "@/redux/api";
import type {
  SpringPage,
  WalletResponse,
  WalletTransactionResponse,
} from "@/lib/types/vendor.types";
import type {
  AdminWalletAdjustRequest,
  AdminWalletTopupRequest,
  AdminWalletTopupResponse,
} from "@/lib/types/admin.types";

type Paging = { page?: number; size?: number; sort?: string | string[] };

// The backend binds Spring's `Pageable` from plain `page` / `size` / `sort`.
const pageableParams = ({ page = 0, size = 20, sort }: Paging = {}) => ({
  page,
  size,
  ...(sort ? { sort } : {}),
});

const walletTags = (walletId: string) => [
  { type: "Wallet" as const, id: walletId },
  { type: "Wallet" as const, id: "ADMIN-LIST" },
  { type: "Wallet" as const, id: `ADMIN-TX-${walletId}` },
  // An admin may be crediting their own wallet — refresh the "my wallet" views too.
  { type: "Wallet" as const, id: "ME" },
  { type: "Wallet" as const, id: "TRANSACTIONS" },
];

export const adminWalletApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // GET /api/v1/admin/wallets — every wallet on the platform.
    getAdminWallets: builder.query<SpringPage<WalletResponse>, Paging | void>({
      query: (paging) => ({ url: "/admin/wallets", params: pageableParams(paging ?? {}) }),
      providesTags: (result) => [
        { type: "Wallet", id: "ADMIN-LIST" },
        ...(result?.content ?? [])
          .filter((wallet): wallet is WalletResponse & { id: string } => Boolean(wallet.id))
          .map((wallet) => ({ type: "Wallet" as const, id: wallet.id })),
      ],
    }),

    // GET /api/v1/admin/wallets/{walletId}
    getAdminWallet: builder.query<WalletResponse, string>({
      query: (walletId) => `/admin/wallets/${encodeURIComponent(walletId)}`,
      providesTags: (_result, _error, walletId) => [{ type: "Wallet", id: walletId }],
    }),

    // GET /api/v1/admin/wallets/{walletId}/transactions
    getAdminWalletTransactions: builder.query<
      SpringPage<WalletTransactionResponse>,
      { walletId: string } & Paging
    >({
      query: ({ walletId, ...paging }) => ({
        url: `/admin/wallets/${encodeURIComponent(walletId)}/transactions`,
        params: pageableParams(paging),
      }),
      providesTags: (_result, _error, { walletId }) => [
        { type: "Wallet", id: `ADMIN-TX-${walletId}` },
      ],
    }),

    // POST /api/v1/admin/wallets/{walletId}/topup — credit a wallet.
    topupAdminWallet: builder.mutation<
      AdminWalletTopupResponse,
      { walletId: string; body: AdminWalletTopupRequest }
    >({
      query: ({ walletId, body }) => ({
        url: `/admin/wallets/${encodeURIComponent(walletId)}/topup`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { walletId }) => walletTags(walletId),
    }),

    // PATCH /api/v1/admin/wallets/{walletId}/adjust — manual credit / debit.
    adjustAdminWallet: builder.mutation<
      WalletResponse,
      { walletId: string; body: AdminWalletAdjustRequest }
    >({
      query: ({ walletId, body }) => ({
        url: `/admin/wallets/${encodeURIComponent(walletId)}/adjust`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { walletId }) => walletTags(walletId),
    }),
  }),
});

export const {
  useGetAdminWalletsQuery,
  useLazyGetAdminWalletsQuery,
  useGetAdminWalletQuery,
  useGetAdminWalletTransactionsQuery,
  useTopupAdminWalletMutation,
  useAdjustAdminWalletMutation,
} = adminWalletApi;
