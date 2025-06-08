"use client";
import { CountdownGame } from "@/game/common/CountdownGame";
import { useContext } from "react";
import {
  PlayerGameSaveDataContext,
  PlayerGameSaveDataContextProvider,
} from "../../../../../components/PlayerGameSaveDataContext";
import { PlayingInterfaceContextProvider } from "../../../../../components/PlayingInterfaceContext";

type Props = { game: CountdownGame; gameId: string } & React.PropsWithChildren;

export function DailySwishInterfaceProvider(props: Props) {
  return (
    <PlayerGameSaveDataContextProvider gameId={props.gameId}>
      <Inner {...props}>{props.children}</Inner>
    </PlayerGameSaveDataContextProvider>
  );
}

function Inner(props: Props) {
  const { isComplete, setGameSolved } = useContext(PlayerGameSaveDataContext);

  return (
    <PlayingInterfaceContextProvider
      game={props.game}
      onGameComplete={() => setGameSolved()}
      gameComplete={isComplete}
    >
      {props.children}
    </PlayingInterfaceContextProvider>
  );
}
