import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import type {RootState} from '../store';

interface LikedComment {
  reelId: string;
  commentsCount: number;
}

interface CommentState {
  Comment: LikedComment[];
}

const initialState: CommentState = {
  Comment: [],
};

export const commentSlice = createSlice({
  name: 'Comment',
  initialState,
  reducers: {
    addComment: (state, action: PayloadAction<LikedComment>) => {
      const index = state.Comment.findIndex(
        item => item.reelId === action.payload.reelId,
      );
      if (index !== -1) {
        state.Comment[index] = action.payload;
      } else {
        state.Comment.push(action.payload);
      }
    },
  },
});

export const {addComment} = commentSlice.actions;

export const selectComments = (state: RootState) => state.comment.Comment;

export default commentSlice.reducer;
