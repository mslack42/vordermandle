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
type DailyPuzzleDataMap = {
  [key: string]: DailyPuzzleData;
};

type PlayerDataState = {
  dailyPuzzleData: DailyPuzzleDataMap;
  campaignPuzzleData: CampaignPuzzleDataMap;
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
    updateCampaignGame: (
      state,
      action: PayloadAction<{
        gameId: string;
        solved: boolean;
      }>,
    ) => {
      let gameData = state.campaignPuzzleData[action.payload.gameId];
      if (gameData == null) {
        gameData = {
          solved: false,
        };
      }
      gameData = {
        ...gameData,
        solved: action.payload.solved,
      };
      const newCampaignData = {
        ...state.campaignPuzzleData,
        [action.payload.gameId]: gameData,
      };
      state.campaignPuzzleData = newCampaignData;
    },
  },
});

export const { updateDailyGame, updateCampaignGame } = playerDataSlice.actions;

export default playerDataSlice.reducer;
