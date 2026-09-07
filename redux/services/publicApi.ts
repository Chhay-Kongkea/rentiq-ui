import { api } from "@/redux/api";
import type {
  LocaleStrings,
  PageableParams,
  PlatformPricing,
  Promotion,
  PromotionStats,
  PublicAdvertisement,
  SpringPage,
  SupportedLocales,
} from "@/lib/types/public.types";

export const publicApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getActiveAdvertisements: builder.query<SpringPage<PublicAdvertisement>, (PageableParams & { itemId?: string }) | void>({
      query: (params) => ({
        url: "/advertisements",
        params: params ?? { "pageable.page": 0, "pageable.size": 20, "pageable.sort": "startAt,desc" },
      }),
      providesTags: ["Advertisement"],
    }),
    getActiveAdvertisement: builder.query<PublicAdvertisement, string>({
      query: (id) => `/advertisements/${encodeURIComponent(id)}`,
      providesTags: (_result, _error, id) => [{ type: "Advertisement", id }],
    }),
    getPlatformPricing: builder.query<PlatformPricing, void>({
      query: () => "/platform/pricing",
      providesTags: ["Pricing"],
    }),
    getSupportedLocales: builder.query<SupportedLocales, void>({
      query: () => "/locales",
      providesTags: ["Localization"],
    }),
    getLocaleStrings: builder.query<LocaleStrings, string>({
      query: (code) => `/locales/${encodeURIComponent(code)}/strings`,
      providesTags: (_result, _error, code) => [{ type: "Localization", id: code }],
    }),
    getPromotion: builder.query<Promotion, string>({
      query: (id) => `/promotions/${encodeURIComponent(id)}`,
      providesTags: (_result, _error, id) => [{ type: "Promotion", id }],
    }),
    getPromotionStats: builder.query<PromotionStats, string>({
      query: (id) => `/promotions/${encodeURIComponent(id)}/stats`,
      providesTags: (_result, _error, id) => [{ type: "Promotion", id: `STATS-${id}` }],
    }),
    recordPromotionImpression: builder.mutation<void, string>({
      query: (id) => ({ url: `/promotions/${encodeURIComponent(id)}/impression`, method: "POST" }),
    }),
    recordPromotionClick: builder.mutation<void, string>({
      query: (id) => ({ url: `/promotions/${encodeURIComponent(id)}/click`, method: "POST" }),
      invalidatesTags: (_result, _error, id) => [{ type: "Promotion", id: `STATS-${id}` }],
    }),
  }),
});

export const {
  useGetActiveAdvertisementsQuery,
  useGetActiveAdvertisementQuery,
  useGetPlatformPricingQuery,
  useGetSupportedLocalesQuery,
  useGetLocaleStringsQuery,
  useGetPromotionQuery,
  useGetPromotionStatsQuery,
  useRecordPromotionImpressionMutation,
  useRecordPromotionClickMutation,
} = publicApi;
