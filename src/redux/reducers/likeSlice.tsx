import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import type {RootState} from '../store';

interface LikedReel {
  id: string;
  isLiked: boolean;
  likesCount: number;
}
interface LikedComment {
  id: string;
  isLiked: boolean;
  likesCount: number;
}
interface LikedReply {
  id: string;
  isLiked: boolean;
  likesCount: number;
}
interface LikeState {
  LikedReel: LikedReel[];
  LikedComment: LikedComment[];
  LikedReply: LikedReply[];
}
const initialState: LikeState = {
  LikedReel: [],
  LikedComment: [],
  LikedReply: [],
};

export const Likeslice = createSlice({
  name: 'like',
  initialState,
  reducers: {
    addLikedReel: (state, action: PayloadAction<LikedReel>) => {
      const index = state.LikedReel.findIndex(
        user => user.id === action.payload.id,
      );
      if (index !== -1) {
        state.LikedReel[index] = action.payload;
      } else {
        state.LikedReel.push(action.payload);
      }
    },
    addLikedComment: (state, action: PayloadAction<LikedComment>) => {
      const index = state.LikedComment.findIndex(
        user => user.id === action.payload.id,
      );
      if (index !== -1) {
        state.LikedComment[index] = action.payload;
      } else {
        state.LikedComment.push(action.payload);
      }
    },
    addLikedReply: (state, action: PayloadAction<LikedReply>) => {
      const index = state.LikedReply.findIndex(
        user => user.id === action.payload.id,
      );
      if (index !== -1) {
        state.LikedReply[index] = action.payload;
      } else {
        state.LikedReply.push(action.payload);
      }
    },
  },
});

export const {addLikedComment, addLikedReel, addLikedReply} = Likeslice.actions;

export const selectLikedReel = (state: RootState) => state.like.LikedReel;
export const selectLikedComment = (state: RootState) => state.like.LikedComment;
export const selectLikedReply = (state: RootState) => state.like.LikedReply;

export default Likeslice.reducer;
