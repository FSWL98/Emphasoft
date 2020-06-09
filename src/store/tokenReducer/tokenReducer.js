import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type SetActionType = {
    token: string
};

const tokenSlice = createSlice({
    name: 'token',
    initialState: {
        token: null
    },
    reducers: {
        setToken (state, action: PayloadAction<SetActionType>) {
            state.token = action.payload.token;
        }
    }
});

export const { setToken } = tokenSlice.actions;
export default tokenSlice.reducer;