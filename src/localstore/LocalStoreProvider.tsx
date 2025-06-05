"use client";
import { useRef } from "react";
import { Provider } from "react-redux";
import { makeStore, LocalStore } from "./store";
import { Persistor } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";

export default function LocalStoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<LocalStore | null>(null);
  const persistorRef = useRef<Persistor | null>(null);
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    const { persistor, store } = makeStore();
    storeRef.current = store;
    persistorRef.current = persistor;
  }

  return (
    <Provider store={storeRef.current}>
      {persistorRef.current && (
        <PersistGate persistor={persistorRef.current}>{children}</PersistGate>
      )}
    </Provider>
  );
}
