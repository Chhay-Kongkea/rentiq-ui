import type { Item, ItemsResponse } from "@/lib/types/item.types";
import { api } from "@/redux/api";

function extractItems(response: ItemsResponse | Item[]): Item[] {
  return Array.isArray(response) ? response : response.content ?? [];
}

export const itemApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getItems: builder.query<Item[], void>({
      query: () => "/items",
      transformResponse: extractItems,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Item" as const, id })),
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
  }),
}, { overrideExisting: true });

export const { useGetItemsQuery, useGetItemQuery } = itemApi;
