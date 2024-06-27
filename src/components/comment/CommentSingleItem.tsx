import React, {useEffect, useMemo, useRef} from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import CustomText from '../global/CustomText';
import {RFValue} from 'react-native-responsive-fontsize';
import {FONTS} from '../../constants/Fonts';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FastImage from 'react-native-fast-image';
import {getRelativeTime} from '../../utils/dateUtils';
import {Colors} from '../../constants/Colors';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {SheetManager} from 'react-native-actions-sheet';
import GIFLoader from '../../assets/animations/giphy.gif';
import {navigate} from '../../utils/NavigationUtil';
import {useAppDispatch, useAppSelector} from '../../redux/reduxHook';
import {
  selectLikedComment,
  selectLikedReply,
} from '../../redux/reducers/likeSlice';
import {
  toggleLikeComment,
  toggleLikeReply,
} from '../../redux/actions/likeAction';

interface CommentSingleItemProps {
  comment: Comment | SubReply;
  isReply?: boolean;
  onReply: (comment: Comment | SubReply) => void;
  scrollToComment: () => void;
  user: User | undefined;
}

const CommentSingleItem: React.FC<CommentSingleItemProps> = ({
  comment,
  onReply,
  user,
  isReply,
  scrollToComment,
}) => {
  const dispatch = useAppDispatch();

  const likedComment = useAppSelector(selectLikedComment);
  const LikedReply = useAppSelector(selectLikedReply);
  const commentMeta = useMemo(() => {
    return {
      isLiked:
        likedComment?.find((ritem: any) => ritem.id === comment._id)?.isLiked ??
        comment?.isLiked,
      likesCount:
        likedComment?.find((ritem: any) => ritem.id === comment._id)
          ?.likesCount ?? comment.likesCount,
    };
  }, [likedComment, comment._id]);

  const replyMeta = useMemo(() => {
    return {
      isLiked:
        LikedReply?.find((ritem: any) => ritem.id === comment._id)?.isLiked ??
        comment.isLiked,
      likesCount:
        LikedReply?.find((ritem: any) => ritem.id === comment._id)
          ?.likesCount ?? comment.likesCount,
    };
  }, [LikedReply, comment._id]);

  const backgroundColor = useRef(new Animated.Value(0)).current;
  const startAnimation = () => {
    Animated.sequence([
      Animated.timing(backgroundColor, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(backgroundColor, {
        toValue: 0,
        duration: 4000,
        useNativeDriver: false,
      }),
    ]).start();
  };
  const handleReply = () => {
    scrollToComment();
    startAnimation();
    onReply(comment);
  };

  const backgroundColorInterpolate = backgroundColor.interpolate({
    inputRange: [0, 1],
    outputRange: ['transparent', Colors.black],
  });

  const likeComment = async () => {
    'worklet';
    if (!isReply) {
      await dispatch(
        toggleLikeComment(
          comment._id,
          commentMeta?.likesCount,
          commentMeta?.isLiked ?? false,
        ),
      );
      return;
    }
    await dispatch(
      toggleLikeReply(
        comment._id,
        replyMeta?.likesCount,
        replyMeta?.isLiked ?? false,
      ),
    );
  };

  useEffect(() => {
    if (comment?.isPosting) {
      scrollToComment();
      startAnimation();
    }
  }, [comment?.isPosting]);

  const doubleTap = Gesture.Tap()
    .maxDuration(250)
    .numberOfTaps(2)
    .onStart(() => {
      likeComment();
    })
    .runOnJS(true);

  const multiAction = async () => {
    'worklet';
  };

  const longPress = Gesture.LongPress()
    .minDuration(750)
    .onStart(() => {
      multiAction();
    })
    .runOnJS(true);

  return (
    <GestureDetector gesture={Gesture.Exclusive(doubleTap, longPress)}>
      <Animated.View
        style={[
          styles.commentContainer,
          {backgroundColor: backgroundColorInterpolate},
        ]}>
        <TouchableOpacity
          onPress={() => {
            SheetManager.hide('comment-sheet');
            navigate('UserProfileScreen', {
              username: comment?.user?.username,
            });
          }}>
          <Image
            source={{uri: comment?.user?.userImage}}
            style={styles.userImage}
          />
        </TouchableOpacity>
        <View style={styles.textContainer}>
          <View style={styles.flexRow}>
            <CustomText
              fontFamily={FONTS.SemiBold}
              variant="h9"
              style={styles.username}>
              {comment?.user?.username}
            </CustomText>
            <CustomText
              variant="h9"
              fontFamily={FONTS.Medium}
              style={styles.timestamp}>
              {getRelativeTime(comment.timestamp)}
            </CustomText>
            {comment?.isPinned && (
              <Icon
                name="pin"
                size={RFValue(10)}
                color="#888"
                style={{transform: [{rotate: '45deg'}]}}
              />
            )}
            {comment?.user?._id == user?._id && (
              <CustomText
                variant="h9"
                style={styles.timestamp}
                fontFamily={FONTS.Medium}>
                • Author{' '}
              </CustomText>
            )}
            {comment?.isLikedByAuthor && (
              <>
                <CustomText
                  variant="h9"
                  style={styles.timestamp}
                  fontFamily={FONTS.Medium}>
                  •
                </CustomText>
                <Icon name="heart" size={RFValue(10)} color="red" />
                <CustomText
                  variant="h9"
                  style={styles.timestamp}
                  fontFamily={FONTS.Medium}>
                  by author{' '}
                </CustomText>
              </>
            )}
          </View>
          <CustomText style={styles.commentText} variant="h9">
            {isReply ? comment?.reply : comment?.comment}
          </CustomText>
          {comment?.hasGif && (
            <FastImage
              source={{
                uri: comment?.gifUrl,
                priority: FastImage.priority.high,
              }}
              defaultSource={GIFLoader}
              style={styles.gifImage}
              resizeMode="cover"
            />
          )}
          {!comment?.isPosting ? (
            <TouchableOpacity
              onPress={handleReply}
              style={{alignSelf: 'flex-start'}}>
              <CustomText
                variant="h9"
                style={styles.timestamp}
                fontFamily={FONTS.Medium}>
                Reply
              </CustomText>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              disabled={true}
              onPress={handleReply}
              style={{alignSelf: 'flex-start'}}>
              <CustomText
                variant="h9"
                style={styles.timestamp}
                fontFamily={FONTS.Medium}>
                Posting....
              </CustomText>
            </TouchableOpacity>
          )}
        </View>
        {!comment?.isPosting && (
          <TouchableOpacity
            style={styles.button}
            onLongPress={() => {
              SheetManager.show('like-sheet', {
                payload: {
                  entityId: comment?._id,
                  type: isReply ? 'reply' : 'comment',
                },
              });
            }}
            onPress={() => {
              likeComment();
            }}>
            <Icon
              name={
                (isReply && replyMeta?.isLiked) ||
                (!isReply && commentMeta?.isLiked)
                  ? 'heart'
                  : 'heart-outline'
              }
              size={RFValue(12)}
              color={
                (isReply && replyMeta.isLiked) ||
                (!isReply && commentMeta.isLiked)
                  ? Colors.like
                  : Colors.lightText
              }
            />
            <CustomText
              variant="h9"
              style={{color: Colors.lightText}}
              fontFamily={FONTS.Medium}>
              {isReply
                ? replyMeta.likesCount || ''
                : commentMeta.likesCount || ''}
            </CustomText>
          </TouchableOpacity>
        )}
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  commentContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderRadius: 10,
    paddingHorizontal: 6,
  },
  button: {
    position: 'absolute',
    right: 15,
    alignItems: 'center',
    justifyContent: 'center',
    top: 12,
  },

  userImage: {
    width: 30,
    height: 30,
    borderRadius: 20,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  flexRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 5,
  },
  username: {},
  commentText: {
    marginVertical: 3,
  },
  timestamp: {
    color: Colors.lightText,
  },
  gifImage: {
    width: RFValue(170),
    height: RFValue(100),
    marginBottom: 5,
    aspectRatio: 4 / 3,
    borderRadius: 10,
  },
});

export default CommentSingleItem;
