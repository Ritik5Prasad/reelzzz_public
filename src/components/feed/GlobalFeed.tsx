import {View, ImageBackground, StyleSheet, FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';
import GlobalBg from '../../assets/images/globebg.jpg';
import {screenHeight, screenWidth} from '../../utils/Scaling';
import {fetchFeedReel} from '../../redux/actions/reelAction';
import {useAppDispatch, useAppSelector} from '../../redux/reduxHook';
import ReelItemCard from './ReelItemCard';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import StatsContainer from './StatsContainer';
import {navigate} from '../../utils/NavigationUtil';

function clamp(val: any, min: any, max: any) {
  return Math.min(Math.max(val, min), max);
}

const GlobalFeed = () => {
  const dispatch = useAppDispatch();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const prevTranslationX = useSharedValue(0);
  const prevTranslationY = useSharedValue(0);
  const zoomScale = useSharedValue(1);
  const zoomStartScale = useSharedValue(0);

  const fetchFeed = async () => {
    setLoading(true);
    const data = await dispatch(fetchFeedReel(0, 16));
    setData(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  const pinch = Gesture.Pinch()
    .onStart(() => {
      zoomStartScale.value = zoomScale.value;
    })
    .onUpdate(event => {
      zoomScale.value = clamp(
        zoomStartScale.value * event.scale,
        0.3,
        Math.min(screenWidth / 100, screenHeight / 100),
      );
    })
    .runOnJS(true);

  const pan = Gesture.Pan()
    .minDistance(1)
    .onStart(() => {
      prevTranslationX.value = translateX.value;
      prevTranslationY.value = translateY.value;
    })
    .onUpdate(event => {
      const maxTranslateX = screenWidth - 10;
      const maxTranslateY = screenHeight / 2 - 50;

      translateX.value = clamp(
        prevTranslationX.value + event.translationX,
        -maxTranslateX,
        maxTranslateX,
      );
      translateY.value = clamp(
        prevTranslationY.value + event.translationY,
        -maxTranslateY,
        maxTranslateY,
      );
    })
    .runOnJS(true);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {scale: zoomScale.value},
        {
          translateX: translateX.value,
        },
        {translateY: translateY.value},
      ],
    };
  });

  async function moveToFirst(arr: any[], index: number) {
    await arr.unshift(arr.splice(index, 1)[0]);
    return arr;
  }

  const renderItem = ({item, index}: {item: any; index: number}) => {
    const verticalShift = index % 2 === 0 ? -20 : 20;
    return (
      <Animated.View style={{transform: [{translateY: verticalShift}]}}>
        <ReelItemCard
          item={item}
          loading={loading}
          onPressReel={async () => {
            const copyarray = Array.from(data);
            const result = await moveToFirst(copyarray, index);
            navigate('FeedReelScrollScreen', {
              data: result,
            });
          }}
        />
      </Animated.View>
    );
  };

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <GestureDetector gesture={Gesture.Simultaneous(pan, pinch)}>
        <ImageBackground
          source={GlobalBg}
          style={{flex: 1, zIndex: -1}}
          imageStyle={{resizeMode: 'cover'}}>
          <Animated.View style={[styles.container, animatedStyle]}>
            <StatsContainer />
            <View style={styles.gridContainer}>
              {loading ? (
                <FlatList
                  data={Array.from({length: 16})}
                  renderItem={renderItem}
                  keyExtractor={(item, index) => index.toString()}
                  numColumns={4}
                  pinchGestureEnabled
                  scrollEnabled={false}
                  contentContainerStyle={styles.flatlistContainer}
                />
              ) : (
                <FlatList
                  data={data}
                  renderItem={renderItem}
                  keyExtractor={(item, index) => index.toString()}
                  numColumns={4}
                  pinchGestureEnabled
                  scrollEnabled={false}
                  contentContainerStyle={styles.flatlistContainer}
                />
              )}
            </View>
          </Animated.View>
        </ImageBackground>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  gridContainer: {
    width: screenWidth * 5,
    height: screenHeight * 2.9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatlistContainer: {
    paddingVertical: 20,
    alignSelf: 'center',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
});

export default GlobalFeed;
