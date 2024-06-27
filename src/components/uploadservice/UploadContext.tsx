import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Image,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import {Colors} from '../../constants/Colors';
import {navigate} from '../../utils/NavigationUtil';
import {uploadFile} from '../../redux/actions/fileAction';
import {useAppDispatch} from '../../redux/reduxHook';
import {createReel} from '../../redux/actions/reelAction';

interface UploadContextType {
  isUpload: boolean;
  loadingMessage: string | null;
  uploading: boolean;
  uploadProgress: number;
  startUpload: (thumb_uri: string, file_uri: string, caption: string) => void;
  uploadAnimation: Animated.Value;
  showUpload: (value: boolean) => void;
  thumbnailUri: string;
}

const defaultContext: UploadContextType = {
  isUpload: false,
  loadingMessage: null,
  uploadProgress: 0,
  startUpload: () => {},
  uploading: false,
  showUpload: () => {},
  uploadAnimation: new Animated.Value(0),
  thumbnailUri: '',
};

const UploadContext = createContext<UploadContextType>(defaultContext);

export const UploadProvider: React.FC<{children: ReactNode}> = ({children}) => {
  const [isUpload, showUpload] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);
  const [uploadAnimation] = useState<Animated.Value>(new Animated.Value(0));
  const [thumbnailUri, setThumbnailUri] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const startUpload = async (
    thumb_uri: string,
    file_uri: string,
    caption: string,
  ) => {
    try {
      Animated.timing(uploadAnimation, {
        toValue: 1,
        duration: 500,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }).start();
      setUploadProgress(0);
      setThumbnailUri(thumb_uri);
      setUploading(true);
      setLoadingMessage('Uploading Thumbnail...🚀');
      showUpload(true);

      const thumbnailResponse = await dispatch(
        uploadFile(thumb_uri, 'reel_thumbnail'),
      );
      if (!thumbnailResponse) {
        throw new Error('There was an upload error');
      }
      setUploadProgress(30);
      setLoadingMessage('Uploading Video...🎞️');
      const videoResponse = await dispatch(uploadFile(file_uri, 'reel_video'));
      if (!videoResponse) {
        throw new Error('There was an upload error');
      }
      setUploadProgress(70);
      setLoadingMessage('Finishing Upload...✨');
      const data = {
        videoUri: videoResponse,
        thumbUri: thumbnailResponse,
        caption: caption,
      };
      await dispatch(createReel(data));
      setUploading(false);
      setUploadProgress(100);
      await setTimeout(() => {
        Animated.timing(uploadAnimation, {
          toValue: 0,
          duration: 500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }).start(() => showUpload(false));
      }, 5000);
    } catch (error) {
      console.log(error)
      showUpload(false);
    }
  };

  return (
    <UploadContext.Provider
      value={{
        isUpload,
        loadingMessage,
        startUpload,
        uploadAnimation,
        thumbnailUri,
        uploadProgress,
        uploading,
        showUpload(value) {
          showUpload(value);
        },
      }}>
      {children}
      <UploadProgress />
    </UploadContext.Provider>
  );
};

export const useUpload = () => useContext(UploadContext);

const UploadProgress: React.FC = () => {
  const {
    isUpload,
    uploading,
    loadingMessage,
    uploadAnimation,
    uploadProgress,
    showUpload,
    thumbnailUri,
  } = useUpload();

  useEffect(() => {
    if (!isUpload) {
      Animated.timing(uploadAnimation, {
        toValue: 0,
        duration: 500,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }).start();
    }
  }, [isUpload]);

  if (!isUpload) {
    return null;
  }

  const translateY = uploadAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 0],
  });

  return (
    <Animated.View style={[styles.toast, {transform: [{translateY}]}]}>
      <TouchableOpacity
        style={styles.content}
        disabled={uploading}
        onPress={() => {
          uploading ? Alert.alert('Chill Bro!, Uploading') : null;
        }}>
        <Image source={{uri: thumbnailUri}} style={styles.thumbnail} />
        <View style={styles.textContainer}>
          <Text style={styles.toastText}>
            {uploading ? `${loadingMessage}` : 'Upload Completed'}
          </Text>
          {!uploading && (
            <TouchableOpacity
              onPress={() => {
                navigate('Profile');
                showUpload(false);
              }}>
              <Text style={styles.viewText}>View</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
      {uploading && (
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, {width: `${uploadProgress}%`}]} />
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 20 : 10,
    left: 0,
    right: 0,
    marginHorizontal: 10,
    backgroundColor: '#0f141c',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 0.6,
    borderColor: Colors.border,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  thumbnail: {
    width: 40,
    height: 40,
    borderRadius: 4,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  toastText: {
    color: 'white',
    fontSize: 16,
  },
  viewText: {
    color: 'white',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  progressBarContainer: {
    height: 4,
    width: '100%',
    backgroundColor: '#555',
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: 10,
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.theme,
  },
});
