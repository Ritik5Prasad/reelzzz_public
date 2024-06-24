import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import CustomText from './CustomText';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {RFValue} from 'react-native-responsive-fontsize';
import {FONTS} from '../../constants/Fonts';
import {Colors} from '../../constants/Colors';

const GradientButton: React.FC<{
  text: string;
  iconName?: string;
  onPress?: () => void;
}> = ({text, iconName, onPress}) => {
  return (
    <TouchableOpacity
      style={styles.GradientButtonContainer}
      activeOpacity={0.4}
      onPress={onPress}>
      <LinearGradient
        colors={['#333', '#444', '#555', '#444', '#333']}
        //insta gradient
        // colors={['#f09433', '#e6683c', '#dc2743', '#cc2366', '#bc1888']}
        start={{x: 0, y: 0.5}}
        end={{x: 1, y: 0.5}}
        style={styles.GradientButton}>
        <View style={styles.innerButton}>
          <CustomText
            variant="h8"
            style={styles.text}
            fontFamily={FONTS.Medium}>
            {text}
          </CustomText>
          <Icon
            name={iconName ? iconName : 'wallet-giftcard'}
            size={RFValue(16)}
            style={styles.icon}
          />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  GradientButtonContainer: {
    width: '70%',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
    overflow: 'hidden',
  },
  GradientButton: {
    borderRadius: 20,
    padding: 8,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  text: {
    color: Colors.white,
    marginRight: 5,
  },
  icon: {
    color: Colors.white,
  },
  gradient: {
    width: '70%',
    height: '100%',
  },
});

export default GradientButton;
