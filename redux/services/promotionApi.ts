import { api } from "@/redux/api";
import type {
  AdminPromotionListParams,
  CreatePromotionRequest,
  Promotion,
  PromotionListParams,
  PromotionStats,
  SpringPage,
  SuspendPromotionRequest,
} from "@/lib/types/public.types";

const MY_LIST = { type: "Promotion" as const, id: "MY-LIST" };
const ADMIN_LIST = { type: "Promotion" as const, id: "ADMIN-LIST" };

// The backend binds Spring's `Pageable` from plain `page` / `size` / `sort`
// query params (the `pageable.` prefix used elsewhere in this repo is ignored).
function pageableParams({
  page = 0,
  size = 10,
  sort,
}: {
  page?: number;
  size?: number;
  sort?: string | string[];
}) {
  return { page, size, ...(sort ? { sort } : {}) };
}

function omitEmpty(record: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(record).filter(([, value]) => value !== undefined && value !== "" && value !== null),
  );
}

export const promotionApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // POST /api/v1/promotions — vendor buys a boost package for one of their items.
    createPromotion: builder.mutation<Promotion, CreatePromotionRequest>({
      query: (body) => ({ url: "/promotions", method: "POST", body }),
      invalidatesTags: [MY_LIST, ADMIN_LIST],
    }),

    // GET /api/v1/vendors/me/promotions — the signed-in vendor's promotions.
    getMyPromotions: builder.query<SpringPage<Promotion>, PromotionListParams | void>({
      query: ({ status, ...paging } = {}) => ({
        url: "/vendors/me/promotions",
        params: omitEmpty({ status, ...pageableParams(paging) }),
      }),
      providesTags: (result) => [
        MY_LIST,
        ...(result?.content ?? [])
          .filter((promotion): promotion is Promotion & { id: string } => Boolean(promotion.id))
          .map((promotion) => ({ type: "Promotion" as const, id: promotion.id })),
      ],
    }),

    // GET /api/v1/promotions/{id} — single promotion detail.
    getPromotionById: builder.query<Promotion, string>({
      query: (id) => `/promotions/${encodeURIComponent(id)}`,
      providesTags: (_result, _error, id) => [{ type: "Promotion", id }],
    }),

    // GET /api/v1/promotions/{id}/stats — impressions / clicks / CTR.
    getPromotionStatsById: builder.query<PromotionStats, string>({
      query: (id) => `/promotions/${encodeURIComponent(id)}/stats`,
      providesTags: (_result, _error, id) => [{ type: "Promotion", id: `STATS-${id}` }],
    }),

    // PATCH /api/v1/promotions/{id}/cancel — vendor cancels their own promotion.
    cancelPromotion: builder.mutation<Promotion, string>({
      query: (id) => ({ url: `/promotions/${encodeURIComponent(id)}/cancel`, method: "PATCH" }),
      invalidatesTags: (_result, _error, id) => [
        MY_LIST,
        ADMIN_LIST,
        { type: "Promotion", id },
        { type: "Promotion", id: `STATS-${id}` },
      ],
    }),

    // NOTE: POST /api/v1/promotions/{id}/impression and .../click are already
    // exposed by `publicApi` (useRecordPromotionImpressionMutation /
    // useRecordPromotionClickMutation) and are re-exported below for convenience.

    // GET /api/v1/admin/promotions — moderation list across every vendor.
    getAdminPromotions: builder.query<SpringPage<Promotion>, AdminPromotionListParams | void>({
      query: ({ status, vendorId, itemId, packageType, createdFrom, createdTo, ...paging } = {}) => ({
        url: "/admin/promotions",
        params: omitEmpty({
          status,
          vendorId,
          itemId,
          packageType,
          createdFrom,
          createdTo,
          ...pageableParams(paging),
        }),
      }),
      providesTags: (result) => [
        ADMIN_LIST,
        ...(result?.content ?? [])
          .filter((promotion): promotion is Promotion & { id: string } => Boolean(promotion.id))
          .map((promotion) => ({ type: "Promotion" as const, id: promotion.id })),
      ],
    }),

    // PATCH /api/v1/admin/promotions/{id}/status — admin suspends / reinstates.
    suspendPromotion: builder.mutation<Promotion, { id: string; body: SuspendPromotionRequest }>({
      query: ({ id, body }) => ({
        url: `/admin/promotions/${encodeURIComponent(id)}/status`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        MY_LIST,
        ADMIN_LIST,
        { type: "Promotion", id },
        { type: "Promotion", id: `STATS-${id}` },
      ],
    }),
  }),
});

export const {
  useCreatePromotionMutation,
  useGetMyPromotionsQuery,
  useGetPromotionByIdQuery,
  useGetPromotionStatsByIdQuery,
  useLazyGetPromotionStatsByIdQuery,
  useCancelPromotionMutation,
  useGetAdminPromotionsQuery,
  useSuspendPromotionMutation,
} = promotionApi;

// Impression / click tracking lives on `publicApi`; re-exported so callers only
// need to import from `promotionApi`.
export {
  useRecordPromotionImpressionMutation,
  useRecordPromotionClickMutation,
} from "@/redux/services/publicApi";
