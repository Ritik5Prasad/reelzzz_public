import {View, StyleSheet, TouchableOpacity} from 'react-native';
import React, {FC, useMemo} from 'react';
import CustomText from './CustomText';
import {useAppDispatch, useAppSelector} from '../../redux/reduxHook';
import {selectFollowings} from '../../redux/reducers/followingSlice';
import {selectUser} from '../../redux/reducers/userSlice';
import {toggleFollow} from '../../redux/actions/userAction';
import FastImage from 'react-native-fast-image';
import {RFValue} from 'react-native-responsive-fontsize';
import {Colors} from '../../constants/Colors';
import {FONTS} from '../../constants/Fonts';
import { SheetManager } from 'react-native-actions-sheet';
import { push } from '../../utils/NavigationUtil';

const UserItem: FC<{
  user: User;
  onPress?: () => void;
}> = ({user, onPress}) => {
  const followingUsers = useAppSelector(selectFollowings);
  const me = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const isFollowing = useMemo(() => {
    return (
      followingUsers?.find((item: any) => item.id === user._id)?.isFollowing ??
      user.isFollowing
    );
  }, [followingUsers, user._id, user.isFollowing]);

  const handleFollow = async () => {
    await dispatch(toggleFollow(user._id));
  };

  return (
    <TouchableOpacity
      style={styles.userContainer}
      onPress={() => {
        if (onPress) {
          onPress();
          return;
        }
        push('UserProfileScreen', {
          username: user.username,
        });
        SheetManager.hide('like-sheet');
      }}>
      <FastImage
        source={{uri: user.userImage, priority: FastImage.priority.high}}
        style={styles.avatar}
      />
      <View style={styles.userInfo}>
        <CustomText variant="h8" fontFamily={FONTS.Medium}>
          {user?.name}
        </CustomText>
        <CustomText
          variant="h8"
          fontFamily={FONTS.Medium}
          style={{color: Colors.lightText}}>
          @{user?.username}
        </CustomText>
      </View>
      {user._id != me?.id && (
        <TouchableOpacity
          onPress={handleFollow}
          style={[
            styles.followButton,
            {
              backgroundColor: isFollowing ? 'transparent' : 'white',
              borderWidth: isFollowing ? 1 : 0,
              borderColor: Colors.text,
            },
          ]}>
          <CustomText
            variant="h9"
            fontFamily={FONTS.SemiBold}
            style={[
              styles.followButtonText,
              {
                color: isFollowing ? Colors.text : Colors.border,
              },
            ]}>
            {isFollowing ? 'Unfollow' : 'Follow'}
          </CustomText>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  avatar: {
    width: RFValue(30),
    height: RFValue(30),
    borderRadius: 25,
  },
  userInfo: {
    flex: 1,
    marginLeft: 10,
  },
  handler: {
    fontSize: RFValue(14),
    color: Colors.text,
  },
  followButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: Colors.white,
    borderRadius: 20,
  },
  followButtonText: {
    color: Colors.border,
  },
});

export default UserItem;
