"use client";
import {
  useLocalStoreDispatch,
  useLocalStoreSelector,
} from "@/localstore/hooks";
import LocalStoreProvider from "@/localstore/LocalStoreProvider";
import { inc } from "@/localstore/playerDataSlice";

// Demo home page just to confirm local storage factor
export default function Home() {
  return (
    <LocalStoreProvider>
      <Inner />
    </LocalStoreProvider>
  );
}

const Inner = () => {
  const c = useLocalStoreSelector((s) => s.playerData.count);
  const dispatch = useLocalStoreDispatch();
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start"></main>
      <button onClick={() => dispatch(inc(1))}>{c}</button>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center"></footer>
    </div>
  );
};
