import { api } from "@/redux/api";
import type {
  AdminAdvertisementListParams,
  Advertisement,
  AdvertisementListParams,
  CreateAdvertisementRequest,
  RejectAdvertisementRequest,
  SpringPage,
  UpdateAdvertisementRequest,
} from "@/lib/types/public.types";

const MY_LIST = { type: "Advertisement" as const, id: "MY-LIST" };
const ADMIN_LIST = { type: "Advertisement" as const, id: "ADMIN-LIST" };
// publicApi's getActiveAdvertisements provides the bare "Advertisement" tag; touch
// it so the public banner refreshes after any change.
const PUBLIC_LIST = { type: "Advertisement" as const, id: "PUBLIC-LIST" } as const;

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

export const advertisementApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // POST /api/v1/advertisements — vendor submits an ad for review.
    createAdvertisement: builder.mutation<Advertisement, CreateAdvertisementRequest>({
      query: (body) => ({ url: "/advertisements", method: "POST", body }),
      invalidatesTags: ["Advertisement"],
    }),

    // GET /api/v1/vendors/me/advertisements — the signed-in vendor's ads.
    getMyAdvertisements: builder.query<SpringPage<Advertisement>, AdvertisementListParams | void>({
      query: ({ status, ...paging } = {}) => ({
        url: "/vendors/me/advertisements",
        params: omitEmpty({ status, ...pageableParams(paging) }),
      }),
      providesTags: (result) => [
        MY_LIST,
        ...(result?.content ?? [])
          .filter((ad): ad is Advertisement & { id: string } => Boolean(ad.id))
          .map((ad) => ({ type: "Advertisement" as const, id: ad.id })),
      ],
    }),

    // PATCH /api/v1/advertisements/{id} — edit a still-pending ad.
    updateAdvertisement: builder.mutation<
      Advertisement,
      { id: string; body: UpdateAdvertisementRequest }
    >({
      query: ({ id, body }) => ({
        url: `/advertisements/${encodeURIComponent(id)}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [MY_LIST, ADMIN_LIST, { type: "Advertisement", id }],
    }),

    // DELETE /api/v1/advertisements/{id} — vendor cancels their own ad.
    cancelAdvertisement: builder.mutation<void, string>({
      query: (id) => ({ url: `/advertisements/${encodeURIComponent(id)}`, method: "DELETE" }),
      invalidatesTags: (_result, _error, id) => [
        MY_LIST,
        ADMIN_LIST,
        PUBLIC_LIST,
        { type: "Advertisement", id },
      ],
    }),

    // GET /api/v1/admin/advertisements — moderation list across every vendor.
    getAdminAdvertisements: builder.query<
      SpringPage<Advertisement>,
      AdminAdvertisementListParams | void
    >({
      query: ({ status, vendorId, from, to, ...paging } = {}) => ({
        url: "/admin/advertisements",
        params: omitEmpty({ status, vendorId, from, to, ...pageableParams(paging) }),
      }),
      providesTags: (result) => [
        ADMIN_LIST,
        ...(result?.content ?? [])
          .filter((ad): ad is Advertisement & { id: string } => Boolean(ad.id))
          .map((ad) => ({ type: "Advertisement" as const, id: ad.id })),
      ],
    }),

    // PATCH /api/v1/admin/advertisements/{id}/approve
    approveAdvertisement: builder.mutation<Advertisement, string>({
      query: (id) => ({ url: `/admin/advertisements/${encodeURIComponent(id)}/approve`, method: "PATCH" }),
      invalidatesTags: ["Advertisement"],
    }),

    // PATCH /api/v1/admin/advertisements/{id}/reject
    rejectAdvertisement: builder.mutation<
      Advertisement,
      { id: string; body: RejectAdvertisementRequest }
    >({
      query: ({ id, body }) => ({
        url: `/admin/advertisements/${encodeURIComponent(id)}/reject`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Advertisement"],
    }),

    // PATCH /api/v1/admin/advertisements/{id}/expire
    expireAdvertisement: builder.mutation<Advertisement, string>({
      query: (id) => ({ url: `/admin/advertisements/${encodeURIComponent(id)}/expire`, method: "PATCH" }),
      invalidatesTags: ["Advertisement"],
    }),
  }),
});

export const {
  useCreateAdvertisementMutation,
  useGetMyAdvertisementsQuery,
  useUpdateAdvertisementMutation,
  useCancelAdvertisementMutation,
  useGetAdminAdvertisementsQuery,
  useApproveAdvertisementMutation,
  useRejectAdvertisementMutation,
  useExpireAdvertisementMutation,
} = advertisementApi;

// The public list + single-ad reads already live on `publicApi`; re-exported so
// callers only need to import from `advertisementApi`.
export {
  useGetActiveAdvertisementsQuery,
  useGetActiveAdvertisementQuery,
} from "@/redux/services/publicApi";
