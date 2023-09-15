import { configureStore } from "@reduxjs/toolkit";
import { companyApi } from "../api/companyApi";

export const store = configureStore({
  reducer: {
    [companyApi.reducerPath]: companyApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(companyApi.middleware),
});
