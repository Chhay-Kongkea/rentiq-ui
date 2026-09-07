import type { Item, ItemsResponse, PublicItemQuery } from "@/lib/types/item.types";
import { api } from "@/redux/api";

const EMPTY_PAGE: ItemsResponse = {
  content: [], pageNumber: 0, pageSize: 0, totalElements: 0, totalPages: 0,
  first: true, last: true, hasNext: false, hasPrevious: false,
};

function normalizePage(response: ItemsResponse | Item[]): ItemsResponse {
  if (!Array.isArray(response)) return { ...EMPTY_PAGE, ...response, content: response.content ?? [] };
  return { ...EMPTY_PAGE, content: response, pageSize: response.length, totalElements: response.length };
}

export const itemApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getItems: builder.query<ItemsResponse, PublicItemQuery | void>({
      query: (params) => ({ url: "/items", params: params ?? { pageNumber: 0, pageSize: 12 } }),
      transformResponse: normalizePage,
      providesTags: (result) =>
        result
          ? [
              ...result.content.map(({ id }) => ({ type: "Item" as const, id })),
              { type: "Item" as const, id: "LIST" },
            ]
          : [{ type: "Item" as const, id: "LIST" }],
    }),
    getItem: builder.query<Item, string>({
      query: (itemId) => `/items/${encodeURIComponent(itemId)}`,
      providesTags: (_result, _error, itemId) => [
        { type: "Item", id: itemId },
      ],
    }),
    searchItems: builder.query<ItemsResponse, PublicItemQuery>({
      query: (params) => ({ url: "/search/items", params }),
      transformResponse: normalizePage,
      providesTags: [{ type: "Item", id: "SEARCH" }],
    }),
    getFeaturedItems: builder.query<ItemsResponse, { pageNumber?: number; pageSize?: number } | void>({
      query: (params) => ({ url: "/items/featured", params: params ?? { pageNumber: 0, pageSize: 4 } }),
      transformResponse: normalizePage,
      providesTags: [{ type: "Item", id: "FEATURED" }],
    }),
    getOwnerItems: builder.query<ItemsResponse, { ownerId: string; pageNumber?: number; pageSize?: number; sortBy?: string; sortDirection?: "asc" | "desc" }>({
      query: ({ ownerId, ...params }) => ({
        url: `/vendors/${encodeURIComponent(ownerId)}/items`,
        params,
      }),
      transformResponse: normalizePage,
      providesTags: (_result, _error, { ownerId }) => [{ type: "Item", id: `OWNER-${ownerId}` }],
    }),
  }),
});

export const { useGetItemsQuery, useGetItemQuery, useSearchItemsQuery, useGetFeaturedItemsQuery, useGetOwnerItemsQuery } = itemApi;
