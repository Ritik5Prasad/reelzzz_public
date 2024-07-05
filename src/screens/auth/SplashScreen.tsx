import {View, Text, StyleSheet, Animated, Alert, Linking} from 'react-native';
import React, {FC, useEffect, useState} from 'react';
import {Colors} from '../../constants/Colors';
import Logo from '../../assets/images/logo_t.png';
import CustomText from '../../components/global/CustomText';
import {FONTS} from '../../constants/Fonts';
import {token_storage} from '../../redux/storage';
import {jwtDecode} from 'jwt-decode';
import {navigate, resetAndNavigate} from '../../utils/NavigationUtil';
import {refresh_tokens} from '../../redux/apiConfig';
import {useAppDispatch} from '../../redux/reduxHook';
import {refetchUser} from '../../redux/actions/userAction';
import {extractTypeAndId} from '../../utils/dateUtils';
import {getReelById} from '../../redux/actions/reelAction';

interface DecodedToken {
  exp: number;
}

const SplashScreen: FC = () => {
  const [isStop, setIsStop] = useState(false);
  const scale = new Animated.Value(1);
  const dispatch = useAppDispatch();
  const tokenCheck = async () => {
    const access_token = token_storage.getString('access_token') as string;
    const refresh_token = token_storage.getString('refresh_token') as string;

    if (access_token) {
      const decodedAccessToken = jwtDecode<DecodedToken>(access_token);
      const decodedRefreshToken = jwtDecode<DecodedToken>(refresh_token);

      const currentTime = Date.now() / 1000;

      if (decodedRefreshToken?.exp < currentTime) {
        resetAndNavigate('LoginScreen');
        Alert.alert('Session Expired, please login again');
        return false;
      }

      if (decodedAccessToken?.exp < currentTime) {
        try {
          refresh_tokens();
          dispatch(refetchUser());
        } catch (error) {
          console.log(error);
          Alert.alert('There was an error');
          return false;
        }
      }
      resetAndNavigate('BottomTab');
      return true;
    }
    resetAndNavigate('LoginScreen');
    return false;
  };

  const handleDeepLink = async (event: any, deepLinkType: string) => {
    const tokenValid = await tokenCheck();
    if (!tokenValid) return;

    const {url} = event;
    if (!url) {
      handleNoUrlCase(deepLinkType);
      return;
    }
    const {type, id} = extractTypeAndId(url);
    switch (type) {
      case 'reel':
        await dispatch(getReelById(id, deepLinkType));
        break;
      case 'user':
        handleUserCase(deepLinkType, id);
        break;
      default:
        handleDefaultCase(deepLinkType);
        break;
    }
  };

  const handleNoUrlCase = (deepLinkType: string) => {
    if (deepLinkType !== 'RESUME') {
      resetAndNavigate('BottomTab');
    }
  };

  const handleUserCase = (deepLinkType: string, id: string) => {
    if (deepLinkType !== 'RESUME') {
      resetAndNavigate('BottomTab');
    }
    navigate('UserProfileScreen', {username: id});
  };

  const handleDefaultCase = (deepLinkType: string) => {
    if (deepLinkType !== 'RESUME') {
      resetAndNavigate('BottomTab');
    }
  };

  useEffect(() => {
    Linking.getInitialURL().then(url => {
      handleDeepLink({url}, 'CLOSE');
    });

    Linking.addEventListener('url', event => handleDeepLink(event, 'RESUME'));
  }, []);

  useEffect(() => {
    const breathingAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.1, //Scale up
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1, //Scale down
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    );

    if (!isStop) {
      breathingAnimation.start();
    }

    return () => {
      breathingAnimation.stop();
    };
  }, [isStop]);

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Animated.Image
          source={Logo}
          style={{
            width: '60%',
            height: '25%',
            resizeMode: 'contain',
            transform: [{scale}],
          }}
        />
        <CustomText variant="h3" fontFamily={FONTS.Reelz}>
          Reelzzz
        </CustomText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SplashScreen;
