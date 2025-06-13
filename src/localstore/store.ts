"use client";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import playerDataSlice from "./playerDataSlice";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import persistStore from "redux-persist/es/persistStore";

const reducer = {
  playerData: playerDataSlice,
};
const persistConfig = {
  key: "vordermandle2.0",
  storage,
};
const persistedReducer = persistReducer(
  persistConfig,
  combineReducers(reducer),
);

export const makeStore = () => {
  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
        },
      }),
  });
  const persistor = persistStore(store);
  return { store, persistor };
};

// Infer the type of makeStore
export type LocalStore = ReturnType<typeof makeStore>["store"];
// Infer the `RootState` and `AppDispatch` types from the store itself
export type LocalStoreState = ReturnType<LocalStore["getState"]>;
export type LocalStoreDispatch = LocalStore["dispatch"];
