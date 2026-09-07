"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Provider } from "react-redux";
import { setupListeners } from "@reduxjs/toolkit/query";
import { makeStore } from "@/redux/store";

export default function StoreProvider({ children }: { children: ReactNode }) {
  const [store] = useState(makeStore);

  useEffect(() => {
    const unsubscribe = setupListeners(store.dispatch);
    return unsubscribe;
  }, [store]);

  return <Provider store={store}>{children}</Provider>;
}
