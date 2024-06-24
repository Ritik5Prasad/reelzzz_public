import axios from 'axios';
import {appAxios} from '../apiConfig';
import {setUser} from '../reducers/userSlice';
import {CHECK_USERNAME, REGISTER} from '../API';
import {token_storage} from '../storage';
import {resetAndNavigate} from '../../utils/NavigationUtil';
import {Alert} from 'react-native';
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

export const refetchUser = () => async (dispatch: any) => {
  try {
    const res = await appAxios.get('/user/profile');
    await dispatch(setUser(res.data.user));
  } catch (error) {
    console.log('REFETCH USER--> ', error);
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
    Alert.alert('Error, try again');
    console.log('REGISTER ERROR ->', error);
  }
};

export const checkUsernameAvailability =
  (username: string) => async (dispatch: any) => {
    try {
      const res = await axios.post(CHECK_USERNAME, {
        username,
      });
      return res.data.available;
    } catch (error: any) {
      console.log(error);
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

    await dispatch(addFollowing(data));
    await dispatch(refetchUser());
  } catch (error) {
    console.log('TOGGLE FOLLOW ERROR', error);
  }
};

export const getSearchUsers = (text: string) => async (dispatch: any) => {
  try {
    const res = await appAxios.get(`/user/search?text=${text}`);
    return res.data.users;
  } catch (error) {
    console.log('TOGGLE FOLLOW ERROR', error);
    return [];
  }
};
