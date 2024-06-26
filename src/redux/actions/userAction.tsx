import {token_storage} from '../storage';
import {appAxios} from '../apiConfig';
import {setUser} from '../reducers/userSlice';
import {persistor} from '../store';
import {resetAndNavigate} from '../../utils/NavigationUtil';
import {CHECK_USERNAME, REGISTER} from '../API';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import {addFollowing} from '../reducers/followingSlice';

interface registerData {
  id_token: string;
  provider: string;
  name: string;
  email: string;
  username: string;
  userImage: string;
  bio: string;
}

export const checkUsernameAvailability =
  (username: string) => async (dispatch: any) => {
    try {
      const res = await axios.post(CHECK_USERNAME, {
        username,
      });
      return res.data.available;
    } catch (error: any) {
      console.log('CHECK USERNAME ERROR ->', error);
      return null;
    }
  };

export const register = (data: registerData) => async (dispatch: any) => {
  try {
    const res = await axios.post(REGISTER, data);
    token_storage.set('access_token', res.data.tokens.access_token);
    token_storage.set('refresh_token', res.data.tokens.refresh_token);
    await dispatch(setUser(res.data.user));
    resetAndNavigate('BottomTab');
  } catch (error: any) {
    Toast.show({
      type: 'normalToast',
      props: {
        msg: 'There was an error, try again later',
      },
    });
    console.log('REGISTER ERROR ->', error);
  }
};

export const refetchUser = () => async (dispatch: any) => {
  try {
    const res = await appAxios.get('/user/profile');
    await dispatch(setUser(res.data.user));
  } catch (error: any) {
    console.log('PROFILE ->', error);
  }
};

export const fetchUserByUsername =
  (username: string) => async (dispatch: any) => {
    try {
      const res = await appAxios.get(`/user/profile/${username}`);
      return res.data.user;
    } catch (error: any) {
      console.log('FETCH BY USERNAME ->', error);
      return null;
    }
  };

export const toggleFollow = (userId: string) => async (dispatch: any) => {
  try {
    const res = await appAxios.put(`/user/follow/${userId}`);
    const data = {
      id: userId,
      isFollowing: res.data.msg == 'Unfollowed' ? false : true,
    };
    dispatch(addFollowing(data));
    dispatch(refetchUser());
  } catch (error: any) {
    console.log('TOGGLE FOLLOW ERRO ->', error);
  }
};

export const refetchUserLogin = () => async (dispatch: any) => {
  try {
    const res = await appAxios.get('/user/profile');
    await dispatch(setUser(res.data.user));
    resetAndNavigate('BottomTab');
  } catch (error: any) {
    console.log('PROFILE ->', error);
  }
};

export const Logout = () => async (dispatch: any) => {
  await token_storage.clearAll();
  await persistor.purge();
  resetAndNavigate('LoginScreen');
};

export const getSearchUsers = (text: string) => async (dispatch: any) => {
  try {
    const res = await appAxios.get(`/user/search?text=${text}`);
    return res.data.users;
  } catch (error: any) {
    console.log('SEARCH USER ->', error);
    return [];
  }
};

export const getFollowOrFollowingUsers =
  (data: any, search: string, offset: number) => async (dispatch: any) => {
    try {
      const res = await appAxios.get(
        `/user/${data?.type.toLowerCase()}/${
          data?.userId
        }?searchText=${search}&limit=5&offset=${offset}`,
      );

      return res.data;
    } catch (error: any) {
      console.log('Followers / Following USER ->', error);
      return [];
    }
  };