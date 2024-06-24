import {View, StyleSheet, ViewStyle, Easing} from 'react-native';
import React, {FC, useEffect, useRef} from 'react';
import {Animated} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {screenWidth} from '../../utils/Scaling';
interface ReelCardLoaderProps {
  style?: ViewStyle;
}
const ReelCardLoader: FC<ReelCardLoaderProps> = ({style}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  }, []);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-screenWidth * 0.35, screenWidth * 0.35],
  });

  return (
    <View style={[styles.ReelCardContainer, style]}>
      <Animated.View
        style={[styles.skeletonLoader, {transform: [{translateX}]}]}>
        <LinearGradient
          colors={['#333', '#444', '#555', '#444', '#333']}
          start={{x: 0, y: 0.5}}
          end={{x: 1, y: 0.5}}
          style={styles.gradient}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  ReelCardContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#222',
  },
  skeletonLoader: {
    ...StyleSheet.absoluteFillObject,
  },
  gradient: {
    width: '100%',
    height: '100%',
  },
});

export default ReelCardLoader;
