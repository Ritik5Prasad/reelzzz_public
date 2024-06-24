import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import type {RootState} from '../store';

interface UserState {
  user: null | Record<string, any>;
}

const initialState: UserState = {
  user: {},
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<object>) => {
      state.user = action.payload;
    },
  },
});

export const {setUser} = userSlice.actions;

export const selectUser = (state: RootState) => state.user.user;

export default userSlice.reducer;
