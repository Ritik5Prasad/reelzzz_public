import {navigate, resetAndNavigate} from '../../utils/NavigationUtil';
import {appAxios} from '../apiConfig';
import {refetchUser} from './userAction';

export const createReel = (data: any) => async (dispatch: any) => {
  try {
    const res = await appAxios.post('/reel', data);
    dispatch(refetchUser());
  } catch (error) {
    console.log('REEL CREATE ERROR', error);
  }
};

export const fetchFeedReel =
  (offset: number, limit: number) => async (dispatch: any) => {
    try {
      const res = await appAxios.get(
        `/feed/home?limit=${limit || 25}&offset=${offset}`,
      );
      return res.data.reels || [];
    } catch (error) {
      console.log('FETCH REEL ERROR', error);
      return [];
    }
  };

interface fetchUserReel {
  userId?: string;
  offset: number;
}

export const fetchReel =
  (data: fetchUserReel, type: string) => async (dispatch: any) => {
    try {
      const res = await appAxios.get(
        `/feed/${type}/${data?.userId}?limit=5&offset=${data?.offset}`,
      );
      return res.data.reelData || [];
    } catch (error) {
      console.log('FETCH REEL ERROR', error);
      return [];
    }
  };

export const getReelById =
  (id: string, deepLinkType: string) => async (dispatch: any) => {
    try {
      const res = await appAxios.get(`/reel/${id}`);
      console.log(deepLinkType, id);
      if (deepLinkType !== 'RESUME') {
        resetAndNavigate('BottomTab');
      }
      navigate('ReelScrollScreen', {
        data: [res.data],
        index: 0,
      });
    } catch (error) {
      console.log('FETCH REEL ERROR', error);
      return [];
    }
  };
