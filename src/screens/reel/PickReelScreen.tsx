import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Alert,
  PermissionsAndroid,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import React, {FC, useEffect, useState} from 'react';
import CustomView from '../../components/global/CustomView';
import CustomHeader from '../../components/global/CustomHeader';
import PickerReelButton from '../../components/reel/PickerReelButton';
import CustomText from '../../components/global/CustomText';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {RFValue} from 'react-native-responsive-fontsize';
import {Colors} from '../../constants/Colors';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import {Platform} from 'react-native';
import {FONTS} from '../../constants/Fonts';
import {Image} from 'react-native';
import {screenHeight} from '../../utils/Scaling';
import {convertDurationToMMSS} from '../../utils/dateUtils';
import {createThumbnail} from 'react-native-create-thumbnail';
import {navigate} from '../../utils/NavigationUtil';

interface VideoProp {
  uri: string;
  playableDuration: number;
}

const useGallery = ({pageSize = 10}) => {
  const [videos, setVideos] = useState<VideoProp[]>([]);
  const [nextCursor, setNextCursor] = useState<string | undefined>(undefined);
  const [permissionNotGranted, setPermissionGranted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingNextPage, setIsLoadingNextPage] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);

  const loadNextPagePictures = async () => {
    if (!hasNextPage) return;

    try {
      setIsLoadingNextPage(true);
      const videoData = await CameraRoll.getPhotos({
        first: pageSize,
        after: nextCursor,
        assetType: 'Videos',
        include: [
          'playableDuration',
          'fileSize',
          'filename',
          'fileExtension',
          'imageSize',
        ],
      });

      const videoExtracted = videoData?.edges?.map(edge => ({
        uri: edge.node.image.uri,
        playableDuration: edge.node.image.playableDuration,
        filePath: edge.node.image.filepath,
        filename: edge.node.image.filename,
        extension: edge.node.image.extension,
      }));

      setVideos(prev => [...prev, ...videoExtracted]);
      setNextCursor(videoData.page_info.end_cursor);
      setHasNextPage(videoData.page_info.has_next_page);
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'An error occured while fetching videos');
    } finally {
      setIsLoadingNextPage(false);
    }
  };

  const hasAndroidPermission = async () => {
    if ((Platform.Version as number) >= 33) {
      const statuses = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
      ]);
      return (
        statuses[PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        statuses[PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO] ===
          PermissionsAndroid.RESULTS.GRANTED
      );
    } else {
      const status = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      );
      return status === PermissionsAndroid.RESULTS.GRANTED;
    }
  };

  const fetchInitial = async () => {
    const hasPermission = await hasAndroidPermission();
    if (!hasPermission) {
      setPermissionGranted(true);
    } else {
      setIsLoading(true);
      await loadNextPagePictures();
      setIsLoading(false);
    }
  };

  const fetchVideos = async () => {
    setIsLoading(true);
    await loadNextPagePictures();
    setIsLoading(false);
  };

  useEffect(() => {
    if (Platform.OS == 'ios') {
      fetchVideos();
    } else {
      fetchInitial();
    }
  }, []);

  return {
    videos,
    loadNextPagePictures,
    isLoading,
    permissionNotGranted,
    isLoadingNextPage,
    hasNextPage,
  };
};

const PickReelScreen: FC = () => {
  const {
    videos,
    loadNextPagePictures,
    isLoading,
    hasNextPage,
    isLoadingNextPage,
    permissionNotGranted,
  } = useGallery({pageSize: 10});

  const handleOpenSettings = () => {
    Linking.openSettings();
  };

  const handleVideoSelect = async (data: any) => {
    const {uri} = data;
    if (Platform.OS === 'android') {
      createThumbnail({
        url: uri || '',
        timeStamp: 100,
      }).then(response => {
        console.log(response);
        navigate('UploadReelScreen', {
          thumb_uri: response.path,
          file_uri: uri,
        }).catch(err => {
          console.log('Thumbnail Generation error', err);
        });
      });

      return;
    }

    const fileData = await CameraRoll.iosGetImageDataById(uri);
    createThumbnail({
      url: fileData?.node?.image?.filepath || '',
      timeStamp: 100,
    })
      .then(response => {
        console.log(response);
        navigate('UploadReelScreen', {
          thumb_uri: response.path,
          file_uri: uri,
        });
      })
      .catch(err => {
        console.log('Thumbnail Generation error', err);
      });
  };

  const renderItem = ({item}: {item: VideoProp}) => {
    return (
      <TouchableOpacity
        style={styles.videoItem}
        onPress={() => handleVideoSelect(item)}>
        <Image source={{uri: item.uri}} style={styles.thumbnail} />
        <CustomText
          variant="h8"
          fontFamily={FONTS.SemiBold}
          style={styles.time}>
          {convertDurationToMMSS(item?.playableDuration)}
        </CustomText>
      </TouchableOpacity>
    );
  };

  const renderFooter = () => {
    if (!isLoadingNextPage) return null;
    return <ActivityIndicator size="small" color={Colors.theme} />;
  };
  return (
    <CustomView>
      <SafeAreaView style={styles.margin}>
        <CustomHeader title="New Reel" />
      </SafeAreaView>

      <View>
        <PickerReelButton />
        <View style={styles.flexRow}>
          <CustomText>Recent</CustomText>
          <Icon name="chevron-down" size={RFValue(20)} color={Colors.white} />
        </View>
      </View>

      {permissionNotGranted ? (
        <View style={styles.permissionDeniedContainer}>
          <CustomText
            variant="h6"
            fontFamily={FONTS.Medium}
            style={{textAlign: 'center'}}>
            We need permission to access your gallery. Grant and reopen app
          </CustomText>
          <TouchableOpacity onPress={handleOpenSettings}>
            <CustomText
              variant="h6"
              fontFamily={FONTS.Medium}
              style={styles.permissionButton}>
              Open Settings
            </CustomText>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {isLoading ? (
            <ActivityIndicator size="small" color={Colors.white} />
          ) : (
            <FlatList
              data={videos}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
              numColumns={3}
              onEndReached={loadNextPagePictures}
              onEndReachedThreshold={0.5}
              ListFooterComponent={renderFooter}
            />
          )}
        </>
      )}
    </CustomView>
  );
};

const styles = StyleSheet.create({
  time: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.02)',
    bottom: 3,
    right: 3,
  },
  margin: {
    margin: 10,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  videoItem: {
    width: '33%',
    height: screenHeight * 0.28,
    overflow: 'hidden',
    margin: 2,
  },
  flexRow: {
    gap: 6,
    margin: 8,
    marginTop: 20,
    alignItems: 'center',
    flexDirection: 'row',
  },
  permissionButton: {
    marginTop: 16,
    color: Colors.theme,
  },
  permissionDeniedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    padding: 16,
  },
});

export default PickReelScreen;
