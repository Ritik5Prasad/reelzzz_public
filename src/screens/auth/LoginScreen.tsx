import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import React, { FC } from 'react';
import CustomSafeAreaView from '../../components/global/CustomSafeAreaView';
import Lottie from 'lottie-react-native';
import Animation from '../../assets/animations/login.json';
import {RFValue} from 'react-native-responsive-fontsize';
import LinearGradient from 'react-native-linear-gradient';
import {Colors} from '../../constants/Colors';
import CustomText from '../../components/global/CustomText';
import {FONTS} from '../../constants/Fonts';
import SocialButtonHorizontal from '../../components/global/SocialButtonHorizontal';
import Icon from 'react-native-vector-icons/Ionicons';
import GoogleIcon from '../../assets/icons/google.png';
import {useAppDispatch} from '../../redux/reduxHook';
import {signInWithFacebook, signInWithGoogle} from '../../redux/SocialLogin';
const LoginScreen:FC = () => {
  const dispatch = useAppDispatch();

  return (
    <CustomSafeAreaView style={styles.container}>
      <View style={styles.lottieContainer}>
        <Lottie source={Animation} autoPlay loop style={styles.lottie} />
      </View>

      <View style={styles.titleContainer}>
        <LinearGradient
          colors={[`rgba(0,0,0,0)`, Colors.text, `rgba(0,0,0,0)`]}
          style={styles.linearGradient}
          start={{x: 0, y: 0.5}}
          end={{x: 1, y: 0.5}}
        />
        <CustomText variant="h2" fontFamily={FONTS.Reelz}>
          Reelzzz
        </CustomText>
        <LinearGradient
          colors={[`rgba(0,0,0,0)`, Colors.text, `rgba(0,0,0,0)`]}
          style={styles.linearGradient}
          start={{x: 0, y: 0.5}}
          end={{x: 1, y: 0.5}}
        />
      </View>

      <CustomText variant="h6" fontFamily={FONTS.Medium} style={styles.tagline}>
        Rewarding Every Moment for Creators and Viewers.
      </CustomText>

      <SocialButtonHorizontal
        icon={<Icon name="logo-facebook" size={20} color={Colors.text} />}
        onPress={async () => await dispatch(signInWithFacebook())}
        text="Continue with Facebook"
        textColor="#fff"
        backgroundColor={Colors.fbColor}
      />

      <SocialButtonHorizontal
        icon={<Image source={GoogleIcon} style={styles.gimg} />}
        onPress={async () => await dispatch(signInWithGoogle())}
        text="Continue with Google"
        textColor="#000"
        backgroundColor={Colors.white}
      />

      <TouchableOpacity style={styles.footerText}>
        <CustomText variant="h8" fontFamily={FONTS.Medium}>
          Designed and developed by - Ritik Prasad
        </CustomText>
      </TouchableOpacity>
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: 40,
  },
  lottieContainer: {
    width: RFValue(220),
    height: RFValue(220),
  },
  lottie: {
    width: '100%',
    height: '100%',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  linearGradient: {
    flex: 1,
    height: 1,
  },
  tagline: {
    textAlign: 'center',
    marginVertical: 30,
  },
  gimg: {
    height: 20,
    width: 20,
  },
  footerText: {
    opacity: 0.6,
    position: 'absolute',
    bottom: 10,
  },
});
export default LoginScreen;
