"use client";
import { CardPlayArea } from "./CardPlayArea";
import { TargetBox } from "./TargetBox";
import { GameHistory } from "./GameHistory";
import { GameHelperButtons } from "./GameHelperButtons";

export function SwishInterface() {
  return (
    <>
      <div className="h-full w-full flex flex-col">
        <div className="w-full flex-none">
          <TargetBox />
        </div>
        <div
          className="w-full grow overflow-y-auto p-1 h-52         [&::-webkit-scrollbar]:w-2
        [&::-webkit-scrollbar-track]:rounded-full
      [&::-webkit-scrollbar-track]:bg-gray-100
        [&::-webkit-scrollbar-thumb]:rounded-full
      [&::-webkit-scrollbar-thumb]:bg-gray-300
      dark:[&::-webkit-scrollbar-track]:bg-neutral-700
      dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 "
        >
          <GameHelperButtons />
          <GameHistory />
        </div>
        <div className="w-full flex-none">
          <CardPlayArea />
        </div>
      </div>
    </>
  );
}
