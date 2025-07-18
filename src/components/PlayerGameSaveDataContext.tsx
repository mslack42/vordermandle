import {
  useLocalStoreDispatch,
  useLocalStoreSelector,
} from "@/localstore/hooks";
import {
  updateCampaignGame,
  updateDailyGame,
} from "@/localstore/playerDataSlice";
import { createContext, useEffect, useState } from "react";

type PlayerGameSaveDataContextState = {
  isComplete: boolean;
  cluesGiven?: number;
  setGameSolved: () => void;
  setCluesGiven?: (n: number) => void;
};
export const PlayerGameSaveDataContext =
  createContext<PlayerGameSaveDataContextState>({
    isComplete: false,
    cluesGiven: 0,
    setGameSolved: () => {},
    setCluesGiven: () => {},
  });

type DailyGameSaveDataContextProviderProps = {
  gameId: string;
} & React.PropsWithChildren;
export const DailyGameSaveDataContextProvider = (
  props: DailyGameSaveDataContextProviderProps,
) => {
  const allDailyData = useLocalStoreSelector(
    (p) => p.playerData.dailyPuzzleData,
  );
  const dailyData =
    allDailyData && Object.keys(allDailyData).includes(props.gameId)
      ? allDailyData[props.gameId]
      : {
          cluesGiven: 0,
          solved: false,
        };
  const [solved, setSolved] = useState(false);
  const [cluesGiven, setClues] = useState(0);

  const localDispatch = useLocalStoreDispatch();
  useEffect(() => {
    localDispatch(
      updateDailyGame({
        gameId: props.gameId,
        cluesGiven,
        solved,
      }),
    );
  }, [cluesGiven, localDispatch, props.gameId, solved]);
  const setGameSolved = () => {
    setSolved(true);
  };
  const setCluesGiven = (n: number) => {
    setClues(n);
  };
  const state: PlayerGameSaveDataContextState = {
    isComplete: dailyData.solved,
    cluesGiven: dailyData.cluesGiven,
    setGameSolved,
    setCluesGiven,
  };

  return (
    <PlayerGameSaveDataContext.Provider value={state}>
      {props.children}
    </PlayerGameSaveDataContext.Provider>
  );
};

type CampaignGameSaveDataContextProviderProps = {
  gameId: string;
} & React.PropsWithChildren;
export const CampaignGameSaveDataContextProvider = (
  props: CampaignGameSaveDataContextProviderProps,
) => {
  const allCampaignData = useLocalStoreSelector(
    (p) => p.playerData.campaignPuzzleData,
  );
  const data =
    allCampaignData && Object.keys(allCampaignData).includes(props.gameId)
      ? allCampaignData[props.gameId]
      : {
          cluesGiven: 0,
          solved: false,
        };
  const [solved, setSolved] = useState(false);

  const localDispatch = useLocalStoreDispatch();
  useEffect(() => {
    localDispatch(
      updateCampaignGame({
        gameId: props.gameId,
        solved,
      }),
    );
  }, [localDispatch, props.gameId, solved]);
  const setGameSolved = () => {
    setSolved(true);
  };
  const state: PlayerGameSaveDataContextState = {
    isComplete: data.solved,
    setGameSolved,
  };

  return (
    <PlayerGameSaveDataContext.Provider value={state}>
      {props.children}
    </PlayerGameSaveDataContext.Provider>
  );
};
