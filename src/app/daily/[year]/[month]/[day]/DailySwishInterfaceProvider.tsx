"use client";
import { CountdownGame } from "@/game/common/CountdownGame";
import { useContext, useState } from "react";
import {
  PlayerGameSaveDataContext,
  PlayerGameSaveDataContextProvider,
} from "../../../../../components/PlayerGameSaveDataContext";
import { PlayingInterfaceContextProvider } from "../../../../../components/PlayingInterfaceContext";
import { GameSet } from "@/sheetsDB/getGamesList";
import { useLocalStoreSelector } from "@/localstore/hooks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

type Props = {
  gameDate: Date;
  gameSet: GameSet;
} & React.PropsWithChildren;

export function DailySwishInterfaceProvider(props: Props) {
  const [difficulty, setDifficulty] = useState(1);
  const dailyData = useLocalStoreSelector((p) => p.playerData.dailyPuzzleData);

  function getGameId(diff: number) {
    return `${props.gameDate.getUTCFullYear()}/${props.gameDate.getUTCMonth()}/${props.gameDate.getUTCDate()}/${diff}`;
  }
  function getGame(diff: number) {
    let game: CountdownGame;
    switch (diff) {
      case 1: {
        game = props.gameSet[1];
        break;
      }
      case 2: {
        game = props.gameSet[2];
        break;
      }
      default: {
        game = props.gameSet[3];
        break;
      }
    }
    return game;
  }

  const chooseDifficulty = (diff: number) => {
    console.log(diff);
    setDifficulty(diff);
  };

  const gameDataArr = [
    dailyData[getGameId(1)],
    dailyData[getGameId(2)],
    dailyData[getGameId(3)],
  ];
  const stars = [
    gameDataArr[0] == null ? 0 : Math.max(0, 2 - gameDataArr[0].cluesGiven),
    gameDataArr[1] == null ? 0 : Math.max(0, 3 - 2 * gameDataArr[1].cluesGiven),
    gameDataArr[2] == null ? 0 : Math.max(0, 5 - 2 * gameDataArr[2].cluesGiven),
  ];
  const starsAwarded = gameDataArr.map((d) => d != null && d.solved);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="w-full flex-none h-min">
        <div className="w-full flex flex-row justify-center pt-2">
          <div>
            <ol className="flex flex-row gap-2 border-2 border-foreground">
              {["Easy", "Medium", "Hard"].map((s, i) => (
                <li key={s} className="flex-1/3">
                  <button
                    className={
                      "w-full px-2 text-center " +
                      (difficulty == i + 1 ? "bg-theme-blue" : "")
                    }
                    onClick={() => chooseDifficulty(i + 1)}
                  >
                    <p className="px-4">{s}</p>
                    <div className="text-xs h-5">
                      {Array(stars[i])
                        .fill(0)
                        .map((_, j) => (
                          <FontAwesomeIcon
                            key={j}
                            icon={faStar}
                            className={
                              starsAwarded[i] ? "text-theme-yellow" : ""
                            }
                          />
                        ))}
                    </div>
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
      <div className="w-full h-full grow">
        <VisibleIf condition={difficulty == 1}>
          <PlayerGameSaveDataContextProvider gameId={getGameId(1)}>
            <Inner game={getGame(1)} gameId={getGameId(1)}>
              {props.children}
            </Inner>
          </PlayerGameSaveDataContextProvider>
        </VisibleIf>
        <VisibleIf condition={difficulty == 2}>
          <PlayerGameSaveDataContextProvider gameId={getGameId(2)}>
            <Inner game={getGame(2)} gameId={getGameId(2)}>
              {props.children}
            </Inner>
          </PlayerGameSaveDataContextProvider>
        </VisibleIf>
        <VisibleIf condition={difficulty == 3}>
          <PlayerGameSaveDataContextProvider gameId={getGameId(3)}>
            <Inner game={getGame(3)} gameId={getGameId(3)}>
              {props.children}
            </Inner>
          </PlayerGameSaveDataContextProvider>
        </VisibleIf>
      </div>
    </div>
  );
}

function VisibleIf(props: React.PropsWithChildren & { condition: boolean }) {
  return (
    <div className={props.condition ? "" : "hidden"}>{props.children}</div>
  );
}

type InnerProps = React.PropsWithChildren & {
  gameId: string;
  game: CountdownGame;
};
function Inner(props: InnerProps) {
  const { isComplete, setGameSolved, cluesGiven, setCluesGiven } = useContext(
    PlayerGameSaveDataContext,
  );

  const handleClueRequested = (n: number) => {
    setCluesGiven(n);
  };

  return (
    <PlayingInterfaceContextProvider
      game={props.game}
      onGameComplete={() => setGameSolved()}
      gameComplete={isComplete}
      offerClues
      cluesGiven={cluesGiven}
      onClueRequested={handleClueRequested}
    >
      {props.children}
    </PlayingInterfaceContextProvider>
  );
}
