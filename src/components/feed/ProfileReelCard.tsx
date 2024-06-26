import React, {FC} from 'react';
import {View, StyleSheet, ViewStyle, TouchableOpacity} from 'react-native';
import {screenHeight, screenWidth} from '../../utils/Scaling';
import ReelCardLoader from '../loader/ReelCardLoader';
import FastImage from 'react-native-fast-image';
import CustomText from '../global/CustomText';
import {FONTS} from '../../constants/Fonts';
import Icon from 'react-native-vector-icons/Ionicons';
import {RFValue} from 'react-native-responsive-fontsize';
import {Colors} from '../../constants/Colors';

interface ProfileReelCardProps {
  style?: ViewStyle;
  loading: boolean;
  item: any;
  onPressReel: () => void;
}

const ProfileReelCard: FC<ProfileReelCardProps> = ({
  style,
  onPressReel,
  item,
  loading,
}) => {
  return (
    <View style={[styles.card, style]}>
      {loading ? (
        <ReelCardLoader style={styles.skeletonLoader} />
      ) : (
        <TouchableOpacity style={styles.cardContent} onPress={onPressReel}>
          <FastImage
            source={{
              uri: item?.thumbUri,
              priority: FastImage.priority.high,
            }}
            style={styles.img}
            resizeMode={FastImage.resizeMode.cover}
          />
          <View style={styles.views}>
            <Icon name="play" size={RFValue(10)} color={Colors.white} />
            <CustomText variant="h8" fontFamily={FONTS.SemiBold}>
              {item?.viewCount}
            </CustomText>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  img: {
    width: screenWidth * 0.28,
    height: screenHeight * 0.25,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  views: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.02)',
    bottom: 3,
    right: 3,
    gap: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  card: {
    width: screenWidth * 0.28,
    height: screenHeight * 0.25,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  cardContent: {},
  skeletonLoader: {
    width: '100%',
    height: '100%',
  },
});

export default ProfileReelCard;