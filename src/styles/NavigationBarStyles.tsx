import {StyleSheet} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {Colors} from '../constants/Colors';
import {normalizeWidth, screenHeight} from '../utils/Scaling';

export const bottomBarStyles = StyleSheet.create({
  customMiddleButton: {
    backgroundColor: Colors.card,
    borderRadius: 60,
    padding: normalizeWidth(8),
    shadowColor: Colors.text,
    elevation: 5,
    shadowOpacity: 0.4,
    shadowOffset: {width: 1, height: 1},
    shadowRadius: 8,
    bottom: screenHeight * 0.004,
  },
  tabIcon: {
    width: RFValue(25),
    height: RFValue(25),
  },
});

export default {bottomBarStyles};
