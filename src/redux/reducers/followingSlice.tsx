import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import type {RootState} from '../store';

interface FollowingUser {
  id: string;
  isFollowing: boolean;
}

interface FollowingState {
  following: FollowingUser[];
}

const initialState: FollowingState = {
  following: [],
};

export const FollowingSlice = createSlice({
  name: 'Following',
  initialState,
  reducers: {
    addFollowing: (state, action: PayloadAction<FollowingUser>) => {
      const index = state.following.findIndex(
        user => user.id === action.payload.id,
      );
      if (index !== -1) {
        state.following[index] = action.payload;
      } else {
        state.following.push(action.payload);
      }
    },
  },
});

export const {addFollowing} = FollowingSlice.actions;

export const selectFollowings = (state: RootState) => state.following.following;

export default FollowingSlice.reducer;
