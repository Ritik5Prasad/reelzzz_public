import {View, Text, StyleSheet, Animated, Alert} from 'react-native';
import React, {FC, useEffect, useState} from 'react';
import {Colors} from '../../constants/Colors';
import Logo from '../../assets/images/logo_t.png';
import CustomText from '../../components/global/CustomText';
import {FONTS} from '../../constants/Fonts';
import {token_storage} from '../../redux/storage';
import {jwtDecode} from 'jwt-decode';
import {resetAndNavigate} from '../../utils/NavigationUtil';
import {refresh_tokens} from '../../redux/apiConfig';
import {useAppDispatch} from '../../redux/reduxHook';
import {refetchUser} from '../../redux/actions/userAction';

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
        return;
      }

      if (decodedAccessToken?.exp < currentTime) {
        try {
          refresh_tokens();
          dispatch(refetchUser());
        } catch (error) {
          console.log(error);
          Alert.alert('There was an error');
          return;
        }
      }
      resetAndNavigate('BottomTab');
      return;
    }
    resetAndNavigate('LoginScreen');
  };

  useEffect(() => {
    async function deeplinks() {
      await tokenCheck();
    }
    deeplinks();
  },[]);

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
