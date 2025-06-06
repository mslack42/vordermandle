import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type DailyPuzzleData = {
  year: number,
  month: number,
  day: number,
  solved: boolean,
  cluesGiven: number
}
type CampaignPuzzleData = {
  solved: boolean
}
type CampaignPuzzleDataMap = {
  [key:string]: CampaignPuzzleData
}
type CampaignPuzzleGroup = {
  unlocked: boolean,
  puzzles: CampaignPuzzleDataMap
}
type CampaignPuzzleGroupMap = {
  [key:string]: CampaignPuzzleGroup
}
type DailyPuzzleDataMap = {
  [key:string]: DailyPuzzleData
}

type PlayerDataState = {
  // TODO Delete count once placeholder usage is removed
    count: number
    dailyPuzzleData: DailyPuzzleDataMap
    campaignPuzzleData: CampaignPuzzleGroupMap
}

const initialState: PlayerDataState = {
  count: 0,
  dailyPuzzleData:{},
  campaignPuzzleData: {}
};

const playerDataSlice = createSlice({
  name: "playerData",
  initialState,
  reducers: {
    inc: (state, action: PayloadAction<number>) => {
      state.count = state.count + action.payload
    },
  },
});

export const { inc } = playerDataSlice.actions;

export default playerDataSlice.reducer;