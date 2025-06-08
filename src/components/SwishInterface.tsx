"use client";
import { CountdownGame } from "@/game/common/CountdownGame";
import { CardPlayArea } from "./CardPlayArea";
import { PlayingInterfaceContextProvider } from "./PlayingInterfaceContext";
import { TargetBox } from "./TargetBox";
import { GameHistory } from "./GameHistory";

type Props = {
  game: CountdownGame;
};
export function SwishInterface(props: Props) {
  const { game } = props;

  return (
    <>
      <PlayingInterfaceContextProvider game={game}>
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
      </PlayingInterfaceContextProvider>
    </>
  );
}
