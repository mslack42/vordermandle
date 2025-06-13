import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type DailyPuzzleData = {
  solved: boolean;
  cluesGiven: number;
};
type CampaignPuzzleData = {
  solved: boolean;
};
type CampaignPuzzleDataMap = {
  [key: string]: CampaignPuzzleData;
};
type CampaignPuzzleGroup = {
  unlocked: boolean;
  puzzles: CampaignPuzzleDataMap;
};
type CampaignPuzzleGroupMap = {
  [key: string]: CampaignPuzzleGroup;
};
type DailyPuzzleDataMap = {
  [key: string]: DailyPuzzleData;
};

type PlayerDataState = {
  dailyPuzzleData: DailyPuzzleDataMap;
  campaignPuzzleData: CampaignPuzzleGroupMap;
};

const initialState: PlayerDataState = {
  dailyPuzzleData: {},
  campaignPuzzleData: {},
};

const playerDataSlice = createSlice({
  name: "playerData",
  initialState,
  reducers: {
    updateDailyGame: (
      state,
      action: PayloadAction<{
        gameId: string;
        solved: boolean;
        cluesGiven: number;
      }>,
    ) => {
      let gameData = state.dailyPuzzleData[action.payload.gameId];
      if (gameData == null) {
        gameData = {
          cluesGiven: 0,
          solved: false,
        };
      }
      gameData = {
        ...gameData,
        solved: action.payload.solved,
        cluesGiven: action.payload.cluesGiven,
      };
      const newDailyData = {
        ...state.dailyPuzzleData,
        [action.payload.gameId]: gameData,
      };
      state.dailyPuzzleData = newDailyData;
    },
  },
});

export const { updateDailyGame } = playerDataSlice.actions;

export default playerDataSlice.reducer;
