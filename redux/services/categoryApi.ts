import type { Category } from "@/lib/types/category.types";
import { api } from "@/redux/api";

export const categoryApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<Category[], void>({
      query: () => "/categories",
    }),
  }),
});

export const { useGetCategoriesQuery } = categoryApi;
