import {Dimensions, PixelRatio} from 'react-native';
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export const normalizeModerately = (size: number, factor = 0.5): number => {
  return PixelRatio.roundToNearestPixel(moderateScale(size, factor));
};

export const normalizeWidth = (size: number): number => {
  return PixelRatio.roundToNearestPixel(scale(size));
};

export const normalizeHeight = (size: number): number => {
  return PixelRatio.roundToNearestPixel(verticalScale(size));
};

export const widthPercentage = (size: string): number => {
  return wp(size);
};
export const heightPercentage = (size: string): number => {
  return hp(size);
};

export const screenWidth: number = Dimensions.get('window').width;
export const screenHeight: number = Dimensions.get('window').height;
