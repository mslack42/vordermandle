"use client";
import { CountdownGame } from "@/game/common/CountdownGame";
import { useContext } from "react";
import {
  CampaignGameSaveDataContextProvider,
  PlayerGameSaveDataContext,
} from "@/components/PlayerGameSaveDataContext";
import { PlayingInterfaceContextProvider } from "@/components/PlayingInterfaceContext";

type Props = {
  game: CountdownGame;
  gameId: string;
} & React.PropsWithChildren;

export function CampaignSwishInterfaceProvider(props: Props) {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="w-full h-full grow">
        <CampaignGameSaveDataContextProvider gameId={props.gameId}>
          <Inner game={props.game} gameId={props.gameId}>
            {props.children}
          </Inner>
        </CampaignGameSaveDataContextProvider>
      </div>
    </div>
  );
}

type InnerProps = React.PropsWithChildren & {
  gameId: string;
  game: CountdownGame;
};
function Inner(props: InnerProps) {
  const { isComplete, setGameSolved } = useContext(PlayerGameSaveDataContext);

  return (
    <PlayingInterfaceContextProvider
      game={props.game}
      onGameComplete={() => setGameSolved()}
      gameComplete={isComplete}
      offerClues={false}
    >
      {props.children}
    </PlayingInterfaceContextProvider>
  );
}
