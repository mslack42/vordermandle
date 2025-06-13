import { useDispatch, useSelector, useStore } from "react-redux";
import type { LocalStoreDispatch, LocalStore, LocalStoreState } from "./store";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useLocalStoreDispatch =
  useDispatch.withTypes<LocalStoreDispatch>();
export const useLocalStoreSelector = useSelector.withTypes<LocalStoreState>();
export const useLocalStore = useStore.withTypes<LocalStore>();
