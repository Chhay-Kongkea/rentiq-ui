import type { Category } from "@/lib/types/category.types";
import { api } from "@/redux/api";

export const categoryApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<Category[], void>({
      query: () => "/categories",
    }),
    getCategory: builder.query<Category, string>({
      query: (categoryId) => `/categories/${encodeURIComponent(categoryId)}`,
    }),
  }),
});

export const { useGetCategoriesQuery, useGetCategoryQuery } = categoryApi;
