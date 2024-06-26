import {appAxios} from '../apiConfig';

export const getRewardDetails = () => async (dispatch: any) => {
  try {
    const res = await appAxios.get(`/reward`);
    return res.data;
  } catch (error: any) {
    console.log('REWARD DETAILS ->', error);
    return null;
  }
};

export const reedemReward =
  (type: string, amount: number) => async (dispatch: any) => {
    try {
      const res = await appAxios.post(`/reward/${type}/`, {
        amount: amount,
      });
      return res.data;
    } catch (error: any) {
      console.log('TOGGLE FOLLOW ERRO ->', error);
      return null;
    }
  };