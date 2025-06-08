"use client";
import { CardPlayArea } from "./CardPlayArea";
import { TargetBox } from "./TargetBox";
import { GameHistory } from "./GameHistory";

export function SwishInterface() {
  return (
    <>
        <div className="h-full w-full flex flex-col p-1">
          <div className="w-full flex-none">
            <TargetBox />
          </div>
          <div className="w-full grow overflow-y-auto p-1 h-60">
            <GameHistory />
          </div>
          <div className="w-full flex-none">
            <CardPlayArea />
          </div>
        </div>
    </>
  );
}


