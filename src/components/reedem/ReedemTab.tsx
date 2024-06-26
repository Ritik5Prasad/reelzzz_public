import {Platform, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {FC} from 'react';
import {RFValue} from 'react-native-responsive-fontsize';
import {FONTS} from '../../constants/Fonts';
import CustomText from '../../components/global/CustomText';
import LinearGradient from 'react-native-linear-gradient';
import {Colors} from '../../constants/Colors';

interface ReedemTabProps {
  icon: string;
  totalText: string;
  pointIcon: string;
  value: string;
  type: 'Viewer' | 'Creator';
  isFocused: boolean;
  onPress: () => void;
}

const ReedemTab: FC<ReedemTabProps> = ({
  icon,
  totalText,
  type,
  pointIcon,
  value,
  isFocused,
  onPress,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.rewardBtn, isFocused ? styles.shadow : null]}>
      <LinearGradient
        colors={['#333', '#444', '#555', '#444', '#333']}
        start={{x: 0, y: 0.5}}
        end={{x: 1, y: 0.5}}
        style={styles.redeemButton}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <CustomText variant="h1" style={{fontSize: RFValue(30)}}>
            {icon}
          </CustomText>
          <View style={{alignItems: 'flex-end'}}>
            <CustomText variant="h9" fontFamily={FONTS.Medium}>
              {totalText}
            </CustomText>
            <CustomText variant="h5" fontFamily={FONTS.SemiBold}>
              <CustomText variant="h8">{pointIcon} </CustomText>
              {value}
            </CustomText>
          </View>
        </View>
        <CustomText
          style={{
            alignSelf: 'flex-end',
            marginTop: Platform.OS == 'ios' ? RFValue(5) : RFValue(0),
          }}
          variant="h8">
          {type}
        </CustomText>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  shadow: {
    shadowColor: Colors.white,
    shadowOpacity: 0.9,
    shadowRadius: 15,
    elevation:30,
    borderWidth: 1,
    borderColor: Colors.white,
    shadowOffset: {width: 1, height: 1},
  },
  rewardBtn: {
    width: '45%',
    height: 102,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  redeemButton: {
    borderRadius: 10,
    padding: 8,
    height: 100,
    width: '100%',
  },
});
export default ReedemTab;