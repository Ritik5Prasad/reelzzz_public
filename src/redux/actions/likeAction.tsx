import {appAxios} from '../apiConfig';
import {
  addLikedComment,
  addLikedReel,
  addLikedReply,
} from '../reducers/likeSlice';

export const toggleLikeReel =
  (id: string, likesCount: number) => async (dispatch: any) => {
    try {
      const res = await appAxios.post(`/like/reel/${id}`);
      const data = {
        id: id,
        isLiked: res.data.msg == 'Unliked' ? false : true,
        likesCount: res.data.msg == 'Unliked' ? likesCount - 1 : likesCount + 1,
      };
      dispatch(addLikedReel(data));
    } catch (error: any) {
      console.log('LIKE REEL ->', error);
    }
  };

export const toggleLikeComment =
  (id: string, likesCount: number) => async (dispatch: any) => {
    try {
      const res = await appAxios.post(`/like/comment/${id}`);
      const data = {
        id: id,
        isLiked: res.data.msg == 'Unliked' ? false : true,
        likesCount: res.data.msg == 'Unliked' ? likesCount - 1 : likesCount + 1,
      };
      dispatch(addLikedComment(data));
    } catch (error: any) {
      console.log('LIKE COMMENT ->', error);
    }
  };

export const toggleLikeReply =
  (id: string, likesCount: number) => async (dispatch: any) => {
    try {
      const res = await appAxios.post(`/like/reply/${id}`);
      const data = {
        id: id,
        isLiked: res.data.msg == 'Unliked' ? false : true,
        likesCount: res.data.msg == 'Unliked' ? likesCount - 1 : likesCount + 1,
      };
      dispatch(addLikedReply(data));
    } catch (error: any) {
      console.log('LIKE REEL ->', error);
    }
  };

export const getListLikes =
  (data: any, searchQuery: string) => async (dispatch: any) => {
    try {
      const res = await appAxios.get(
        `/like?entityId=${data.entityId}&type=${data.type}&searchQuery=${searchQuery}`,
      );
      console.log(res.data)
      return res.data;
    } catch (error: any) {
      console.log('LIST LIKES ->', error);
      return [];
    }
  };
