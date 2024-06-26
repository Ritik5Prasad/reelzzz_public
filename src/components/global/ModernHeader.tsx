import {View, Text, StyleSheet, ViewStyle} from 'react-native';
import React, {FC} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import CustomText from './CustomText';
import {Colors} from '../../constants/Colors';

interface ModernHeaderProps {
  title: string;
  style?: ViewStyle;
}
const ModernHeader: FC<ModernHeaderProps> = ({title, style}) => {
  return (
    <View style={styles.titleContainer}>
      <LinearGradient
        colors={['rgba(0, 0, 0, 0)', Colors.text, 'rgba(0, 0, 0, 0)']}
        style={styles.linearGradient}
        start={{x: 0, y: 0.5}}
        end={{x: 1, y: 0.5}}
      />
      <CustomText variant="h6">Choose your reward type</CustomText>
      <LinearGradient
        colors={['rgba(0, 0, 0, 0)', Colors.text, 'rgba(0, 0, 0, 0)']}
        style={styles.linearGradient}
        start={{x: 0, y: 0.5}}
        end={{x: 1, y: 0.5}}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  linearGradient: {
    flex: 1,
    height: 1,
  },
});
export default ModernHeader;