import {SheetDefinition, registerSheet} from 'react-native-actions-sheet';
import LikeSheet from './LikeSheet';
import CommentSheet from './CommentSheet';
import GifSheet from './GifSheet';

registerSheet('like-sheet', LikeSheet);
registerSheet('comment-sheet', CommentSheet);
registerSheet('gif-sheet', GifSheet);

declare module 'react-native-actions-sheet' {
  interface Sheets {
    'like-sheet': SheetDefinition<{
      payload: {
        type: 'reply' | 'comment' | 'reel';
        entityId: string;
      };
    }>;
  }
}

declare module 'react-native-actions-sheet' {
  interface Sheets {
    'comment-sheet': SheetDefinition<{
      payload: {
        id: string;
        user: User;
        commentsCount: number;
      };
    }>;
  }
}

declare module 'react-native-actions-sheet' {
  interface Sheets {
    'gif-sheet': SheetDefinition<{
      returnValue: string | null | undefined;
    }>;
  }
}

export {};
