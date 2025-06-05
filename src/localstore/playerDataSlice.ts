import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type PlayerDataState = {
    count: number
}

const initialState: PlayerDataState = {
  count: 0
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