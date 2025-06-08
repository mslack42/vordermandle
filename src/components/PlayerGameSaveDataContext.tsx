import {
  useLocalStoreDispatch,
  useLocalStoreSelector,
} from "@/localstore/hooks";
import { updateDailyGame } from "@/localstore/playerDataSlice";
import { createContext, useEffect, useState } from "react";

type PlayerGameSaveDataContextState = {
  isComplete: boolean;
  cluesGiven: number;
  setGameSolved: () => void;
  incrementCluesGiven: () => void;
};
export const PlayerGameSaveDataContext =
  createContext<PlayerGameSaveDataContextState>({
    isComplete: false,
    cluesGiven: 0,
    setGameSolved: () => {},
    incrementCluesGiven: () => {},
  });

type PlayerGameSaveDataContextProviderProps = {
  gameId: string;
} & React.PropsWithChildren;
export const PlayerGameSaveDataContextProvider = (
  props: PlayerGameSaveDataContextProviderProps
) => {
  const allDailyData = useLocalStoreSelector(
    (p) => p.playerData.dailyPuzzleData
  );
  const dailyData = allDailyData && Object.keys(allDailyData).includes(props.gameId)
    ? allDailyData[props.gameId]
    : {
        cluesGiven: 0,
        solved: false,
      };
  const [solved, setSolved] = useState(false);
  const [cluesGiven] = useState(0);

  const localDispatch = useLocalStoreDispatch();
  useEffect(() => {
    localDispatch(
      updateDailyGame({
        gameId: props.gameId,
        cluesGiven,
        solved,
      })
    );
  }, [cluesGiven, localDispatch, props.gameId, solved]);
  const setGameSolved = () => {
    setSolved(true);
  };
  const state: PlayerGameSaveDataContextState = {
    isComplete: dailyData.solved,
    cluesGiven: dailyData.cluesGiven,
    setGameSolved,
    incrementCluesGiven: () => {
      localDispatch(
        updateDailyGame({
          gameId: props.gameId,
          cluesGiven: dailyData.cluesGiven + 1,
          solved: dailyData.solved,
        })
      );
    },
  };

  return (
    <PlayerGameSaveDataContext.Provider value={state}>
      {props.children}
    </PlayerGameSaveDataContext.Provider>
  );
};
