import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {useAppDispatch} from '../../redux/reduxHook';
import {Colors} from '../../constants/Colors';
import {RFValue} from 'react-native-responsive-fontsize';
import FastImage from 'react-native-fast-image';
import CustomText from '../global/CustomText';
import {FONTS} from '../../constants/Fonts';
import {navigate, push} from '../../utils/NavigationUtil';
import GradientButton from '../global/GradientButton';
import {Logout} from '../../redux/actions/userAction';
import ProfileButton from './ProfileButton';

const AvatarComponent: React.FC<{uri: string}> = ({uri}) => {
  return (
    <FastImage
      source={{uri: uri, priority: FastImage.priority.high}}
      style={styles.avatar}
    />
  );
};

const StatsComponent: React.FC<{
  count: string | number;
  label: string;
  onPress?: () => void;
}> = ({count, label, onPress}) => {
  return (
    <TouchableOpacity style={styles.statsItem} onPress={onPress}>
      <CustomText variant="h8" fontFamily={FONTS.Medium}>
        {count}
      </CustomText>
      <CustomText variant="h8">{label}</CustomText>
    </TouchableOpacity>
  );
};

const ProfileDetails: React.FC<{user: User}> = ({user}) => {
  const dispatch = useAppDispatch();

  const handleEditProfile = () => {
    //handle edit profile continue
  };

  const handleLogout = () => {
    dispatch(Logout());
  };

  return (
    <View style={{backgroundColor: Colors.background}}>
      <View style={styles.flexRowBetween}>
        <AvatarComponent uri={user?.userImage} />
        <View style={styles.statsContainer}>
          <View style={styles.statsBtn}>
            <StatsComponent
              count={user?.followersCount}
              onPress={() => {
                push('FollowingScreen', {
                  userId: user?.id,
                  type: 'Followers',
                });
              }}
              label="Followers"
            />
            <StatsComponent count={user?.reelsCount} label="Reels" />
            <StatsComponent
              count={user?.followingCount}
              onPress={() => {
                push('FollowingScreen', {
                  userId: user?.id,
                  type: 'Following',
                });
              }}
              label="Following"
            />
          </View>

          <GradientButton
            text="Reedem"
            onPress={() =>
              navigate('ReedemScreen', {
                user: user,
              })
            }
          />
        </View>
      </View>
      <View style={styles.bioContainer}>
        <CustomText variant="h8" fontFamily={FONTS.Medium}>
          {user.name}
        </CustomText>
        <CustomText
          variant="h8"
          style={styles.bio}
          fontFamily={FONTS.Medium}
          numberOfLines={5}>
          {user?.bio}
        </CustomText>
      </View>

      <ProfileButton
        firstText="Edit Profile"
        secondText="Logout"
        onPressFirst={handleEditProfile}
        onPressSecond={handleLogout}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  flexRowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatar: {
    width: RFValue(80),
    height: RFValue(80),
    borderRadius: 105,
  },
  statsContainer: {
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    top: 6,
  },
  statsBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  statsItem: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 15,
  },
  bioContainer: {
    margin: 10,
    width: '70%',
  },
  bio: {
    color: Colors.lightText,
    marginTop: 5,
    lineHeight: 18,
  },
});
export default ProfileDetails;
