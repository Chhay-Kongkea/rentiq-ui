import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    credentials: "same-origin",
  }),
  tagTypes: ["Auth", "Item", "User", "Kyc", "Renter", "Vendor", "Booking", "Offer", "Wallet", "Notification", "Advertisement", "Promotion", "Localization", "Pricing"],
  endpoints: () => ({}),
});