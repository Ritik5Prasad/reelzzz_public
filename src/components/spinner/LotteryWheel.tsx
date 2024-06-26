import React, {useState, useRef, FC} from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Text,
} from 'react-native';
import CustomText from '../global/CustomText';
import {FONTS} from '../../constants/Fonts';
import {ActivityIndicator} from 'react-native';
import {Colors} from '../../constants/Colors';

interface LotteryWheelProps {
  data: {url: string; name: string; id: number}[];
  prizeIndex: number;
  deductAmount: () => void;
  tokens: number;
}

const LotteryWheel: FC<LotteryWheelProps> = ({
  data,
  prizeIndex,
  deductAmount,
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const animations = useRef(data.map(() => new Animated.Value(1))).current;

  const resetAnimations = () => {
    animations.forEach((animation: Animated.Value) => {
      animation.setValue(1);
    });
  };

  const spinWheel = () => {
    if (isSpinning) return;
    deductAmount();
    setIsSpinning(true);
    resetAnimations();

    const animationSequence = data.map((_, index) => {
      return Animated.sequence([
        Animated.timing(animations[index], {
          toValue: 1.3,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(animations[index], {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]);
    });

    const loopedSequence = Animated.loop(Animated.sequence(animationSequence), {
      iterations: -1,
    });

    loopedSequence.start();

    const timeoutDuration = 8000;

    setTimeout(() => {
      loopedSequence.stop();

      let currentIndex = 0;
      const interval = setInterval(() => {
        if (currentIndex === prizeIndex) {
          clearInterval(interval);
          const finalAnimation = Animated.sequence([
            Animated.timing(animations[prizeIndex], {
              toValue: 1.5,
              duration: 100,
              useNativeDriver: true,
            }),
            Animated.timing(animations[prizeIndex], {
              toValue: 1,
              duration: 100,
              useNativeDriver: true,
            }),
          ]);

          finalAnimation.start(() => {
            setIsSpinning(false);
          });
        } else {
          currentIndex = (currentIndex + 1) % data.length;
        }
      }, 100);
    }, timeoutDuration);
  };

  return (
    <View style={styles.container}>
      <View style={styles.circle}>
        {data.map((item, index) => {
          const angle = (index / data.length) * 2 * Math.PI;
          const x = 140 * Math.cos(angle);
          const y = 140 * Math.sin(angle);
          return (
            <Animated.View
              key={item.id}
              style={[
                styles.item,
                {
                  transform: [
                    {translateX: x},
                    {translateY: y},
                    {scale: animations[index]},
                  ],
                },
              ]}>
              <Image source={{uri: item.url}} style={styles.image} />
            </Animated.View>
          );
        })}
      </View>

      <TouchableOpacity
        disabled={isSpinning}
        style={styles.spinButton}
        onPress={spinWheel}>
        {!isSpinning ? (
          <>
            <CustomText
              fontFamily={FONTS.Medium}
              style={styles.spinText}
              variant="h8">
              {isSpinning ? 'Spinning...' : 'Spin'}
            </CustomText>
            <CustomText
              fontFamily={FONTS.SemiBold}
              variant="h9"
              style={styles.spinText}>
              10 Tokens
            </CustomText>
          </>
        ) : (
          <ActivityIndicator size="small" color={Colors.white} />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: 250,
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  item: {
    position: 'absolute',
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 80,
    height: 80,
    resizeMode: 'cover',
    borderRadius: 40,
  },
  spinButton: {
    marginTop: 20,
    paddingVertical: 10,
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'rgba(92, 67, 80, 0.51)',
    borderRadius: 100,
    position: 'absolute',
  },
  spinText: {
    color: '#fff',
  },
});

export default LotteryWheel;