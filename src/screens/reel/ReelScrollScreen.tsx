import React, {FC, useCallback, useMemo, useRef, useState} from 'react';
import {
  FlatList,
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  ViewToken,
} from 'react-native';
import VideoItem from '../../components/reel/VideoItem';
import CustomView from '../../components/global/CustomView';
import {goBack} from '../../utils/NavigationUtil';
import {RFValue} from 'react-native-responsive-fontsize';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useRoute} from '@react-navigation/native';
import {screenHeight} from '../../utils/Scaling';
import {View} from 'react-native';
import {debounce} from 'lodash';
import Loader from '../../assets/images/loader.jpg';

interface RouteProp {
  data: any[];
  index: number;
}

const ReelScrollScreen: FC = () => {
  const route = useRoute();
  const routeParams = route?.params as RouteProp;

  const [currentVisibleIndex, setCurrentVisibleIndex] = useState<number>(
    routeParams.index || 0,
  );

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 80,
  }).current;

  const onViewableItemsChanged = useRef(
    debounce(({viewableItems}: {viewableItems: Array<ViewToken>}) => {
      if (viewableItems.length > 0) {
        setCurrentVisibleIndex(viewableItems[0].index || 0);
      }
    }, 200),
  ).current;

  const renderVideoList = useCallback(
    ({item, index}: {item: any; index: number}) => {
      return (
        <VideoItem
          item={item}
          isVisible={index === currentVisibleIndex}
          preload={Math.abs(currentVisibleIndex + 5) >= index}
        />
      );
    },
    [currentVisibleIndex],
  );

  const getItemLayout = useCallback(
    (data: any, index: number) => ({
      length: screenHeight,
      offset: screenHeight * index,
      index,
    }),
    [],
  );

  const keyExtractor = useCallback((item: any) => item._id.toString(), []);
  const memoizedValue = useMemo(
    () => renderVideoList,
    [currentVisibleIndex, routeParams?.data],
  );

  return (
    <CustomView>
      <View style={styles.backButton}>
        <TouchableOpacity onPress={() => goBack()}>
          <Icon name="arrow-back" color="white" size={RFValue(20)} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={routeParams?.data || []}
        renderItem={memoizedValue}
        keyExtractor={keyExtractor}
        pagingEnabled
        windowSize={2}
        disableIntervalMomentum={true}
        initialScrollIndex={routeParams.index}
        showsVerticalScrollIndicator={false}
        initialNumToRender={1}
        scrollEventThrottle={16}
        decelerationRate={'normal'}
        maxToRenderPerBatch={2}
        removeClippedSubviews={true}
        getItemLayout={getItemLayout}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />
      <Image source={Loader} style={styles.thumbnail} />
    </CustomView>
  );
};

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 20,
    left: 10,
    zIndex: 99,
    flex: 1,
  },
  thumbnail: {
    position: 'absolute',
    zIndex: -2,
    aspectRatio: 9 / 16,
    height: screenHeight,
    width: '100%',
    alignSelf: 'center',
    right: 0,
    left: 0,
    resizeMode: 'stretch',
    top: 0,
    bottom: 0,
  },
});

export default ReelScrollScreen;