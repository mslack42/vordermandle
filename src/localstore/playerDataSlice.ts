import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type PuzzleData = {
  year: number,
  month: number,
  day: number,
  solved: boolean,
  cluesGiven: number
}

type PuzzleDataMap = {
  [key:string]: PuzzleData
}

type PlayerDataState = {
  // TODO Delete count once placeholder usage is removed
    count: number
    puzzleData: PuzzleDataMap
}

const initialState: PlayerDataState = {
  count: 0,
  puzzleData:{}
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