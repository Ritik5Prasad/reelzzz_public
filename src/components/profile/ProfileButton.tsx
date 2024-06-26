import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import CustomText from '../global/CustomText';
import {FONTS} from '../../constants/Fonts';

interface ButtonsProps {
  firstText: string;
  secondText: string;
  onPressFirst: () => void;
  onPressSecond: () => void;
}

const ProfileButton: React.FC<ButtonsProps> = ({
  onPressFirst,
  onPressSecond,
  firstText,
  secondText,
}) => (
  <View style={styles.container}>
    <TouchableOpacity style={styles.btn} onPress={onPressFirst}>
      <CustomText variant="h9" fontFamily={FONTS.Medium}>
        {firstText}
      </CustomText>
    </TouchableOpacity>
    <TouchableOpacity style={styles.btn} onPress={onPressSecond}>
      <CustomText variant="h9" fontFamily={FONTS.Medium}>
        {secondText}
      </CustomText>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
  },
  btn: {
    backgroundColor: '#1c1b1b',
    padding: 8,
    borderRadius: 10,
    width: '48%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProfileButton;
