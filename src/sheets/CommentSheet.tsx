import React, {useEffect, useRef, useState} from 'react';
import {FlatList, Keyboard, StyleSheet, View} from 'react-native';
import ActionSheet, {
  SheetManager,
  SheetProps,
} from 'react-native-actions-sheet';
import {Colors} from '../constants/Colors';
import {screenHeight} from '../utils/Scaling';
import CustomText from '../components/global/CustomText';
import {FONTS} from '../constants/Fonts';
import CommentItem from '../components/comment/CommentItem';
import CommentInput from '../components/comment/CommentInput';
import UserItem from '../components/global/UserItem';
import {ActivityIndicator} from 'react-native';
import {Platform} from 'react-native';
import {useAppDispatch, useAppSelector} from '../redux/reduxHook';
import {getSearchUsers} from '../redux/actions/userAction';
import {
  getComments,
  postComment,
  postReply,
} from '../redux/actions/commentAction';
import {selectUser} from '../redux/reducers/userSlice';
import {emitEvent} from '../components/comment/eventHandler';

const CommentSheet = (props: SheetProps<'comment-sheet'>) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const [replyTo, setReplyTo] = useState<Comment | SubReply | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [offset, setOffset] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [searchUserLoading, setSearchUserLoading] = useState<boolean>(false);
  const [filterData, setFilterData] = useState<User[]>([]);
  const [replyCommentId, setReplyCommentId] = useState<string | number | null>(
    null,
  );
  const [commentData, setCommentData] = useState<any[]>([]);
  const [mentionSearchWord, setMentionSearchWord] = useState<string | null>(
    null,
  );
  const [confirmMention, setConfirmMention] = useState<any | null>(null);

  const flatListRef = useRef<FlatList>(null);

  const scrollToComment = (index: number, childIndex: number = 0) => {
    const sum = index + childIndex;
    if (flatListRef.current && sum < commentData.length) {
      flatListRef.current.scrollToIndex({
        index: sum,
        animated: true,
        viewOffset: 0,
      });
    }
  };

  const scrollToTop = () => {
    flatListRef.current?.scrollToOffset({offset: 0, animated: true});
  };

  const handleReply = (
    comment: Comment | SubReply,
    replyCommentId: string | number,
  ) => {
    setReplyTo(comment);
    setReplyCommentId(replyCommentId);
  };

  const fetchSearchUserData = async () => {
    setSearchUserLoading(true);
    const searchUserData = await dispatch(
      getSearchUsers(mentionSearchWord || ''),
    );
    setSearchUserLoading(false);
    setFilterData(searchUserData);
  };

  const removeDuplicates = (data: any) => {
    const uniqueDataMap = new Map();
    data.forEach((item: any) => {
      if (!uniqueDataMap.has(item._id)) {
        uniqueDataMap.set(item._id, item);
      }
    });
    return Array.from(uniqueDataMap.values());
  };

  const fetchComments = async (scrollOffset: number) => {
    setLoading(true);
    const newData = await dispatch(
      getComments(props?.payload?.id || '', scrollOffset),
    );
    setOffset(scrollOffset + 5);
    if (newData.length < 5) {
      setHasMore(false);
    }

    setCommentData(removeDuplicates([...commentData, ...newData]));
    setLoading(false);
  };

  useEffect(() => {
    fetchSearchUserData();
  }, [mentionSearchWord]);

  useEffect(() => {
    fetchComments(0);
  }, [props.payload?.id]);

  const emitReplyPostedEvent = (data: any) => {
    emitEvent('replyPosted', data);
  };

  const handleReplyComment = async (data: any) => {
    const commentPostData = {
      reelId: props.payload?.id,
      commentId: replyCommentId,
      ...(data?.hasGif ? {gifUrl: data?.gifUrl} : {reply: data?.comment}),
    };
    const res = await dispatch(
      postReply(commentPostData, props.payload?.commentsCount || 0),
    );

    if (res) {
      const tempCommentIndex = commentData.findIndex(
        comment => comment._id === replyCommentId,
      );

      // Replace the temporary comment with the actual comment
      if (tempCommentIndex !== -1) {
        commentData[tempCommentIndex].repliesCount =
          commentData[tempCommentIndex].repliesCount + 1;
        setCommentData([...commentData]);
      }

      emitReplyPostedEvent(res);
    }
    setReplyTo(null);
    setReplyCommentId(null);
  };

  const handlePostComment = async (data: any) => {
    const newCommentId = commentData.length + 1;
    const timestamp = new Date().toISOString();

    const newComment = {
      _id: newCommentId,
      user: user,
      comment: data.comment || '',
      likes: 0,
      timestamp: timestamp,
      hasGif: data.hasGif || false,
      isPosting: true,
      gifUrl: data.hasGif ? data.gifUrl : undefined,
      replies: [],
      repliesCount: 0,
    };

    commentData.unshift(newComment);
    scrollToTop();

    setCommentData([...commentData]);
    setReplyTo(null);
    setReplyCommentId(null);

    const commentPostData = {
      reelId: props.payload?.id,
      ...(data?.hasGif ? {gifUrl: data?.gifUrl} : {comment: data?.comment}),
    };
    const commentReponse = await dispatch(
      postComment(commentPostData, props.payload?.commentsCount || 0),
    );

    const tempCommentIndex = commentData.findIndex(
      comment => comment._id === newCommentId,
    );

    // Replace the temporary comment with the actual comment
    if (tempCommentIndex !== -1) {
      commentData[tempCommentIndex] = commentReponse;
      commentData[tempCommentIndex].user = user;
      setCommentData([...commentData]);
    }
  };

  return (
    <ActionSheet
      id={props.sheetId}
      headerAlwaysVisible={false}
      isModal={true}
      onSnapIndexChange={() => {
        Keyboard.dismiss();
      }}
      onClose={() => {
        SheetManager.hide(props.sheetId);
      }}
      drawUnderStatusBar={false}
      containerStyle={styles.container}
      gestureEnabled={Platform.OS === 'ios' ? true : false}
      enableGesturesInScrollView={Platform.OS === 'ios' ? true : false}
      keyboardHandlerEnabled={true}
      indicatorStyle={styles.indicator}
      animated>
      <CustomText
        variant="h7"
        fontFamily={FONTS.SemiBold}
        style={styles.header}>
        Comments
      </CustomText>

      <View style={styles.divider} />
      {mentionSearchWord != null ? (
        <FlatList
          data={filterData || []}
          keyboardShouldPersistTaps="always"
          keyboardDismissMode="interactive"
          keyExtractor={(item: User) => item._id?.toString()}
          renderItem={({item}) => {
            return (
              <UserItem
                onPress={() => {
                  const dataMention = {
                    user: item,
                    replaceWord: mentionSearchWord,
                  };
                  setConfirmMention(dataMention);
                }}
                user={item}
              />
            );
          }}
          style={{height: '100%', marginTop: 20}}
          ListFooterComponent={() => (
            <>
              {searchUserLoading && (
                <View
                  style={{
                    flexDirection: 'row',
                    margin: 20,
                    alignItems: 'center',
                    gap: 4,
                  }}>
                  <CustomText variant="h9" style={{color: Colors.lightText}}>
                    {mentionSearchWord != '' &&
                      `Searching for ${mentionSearchWord}`}
                  </CustomText>
                  <ActivityIndicator color={Colors.border} size="small" />
                </View>
              )}
            </>
          )}
        />
      ) : (
        <FlatList
          nestedScrollEnabled
          ref={flatListRef}
          style={{height: '100%'}}
          keyboardShouldPersistTaps="always"
          keyboardDismissMode="interactive"
          data={commentData}
          onScrollToIndexFailed={() => {}}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          removeClippedSubviews={true}
          onEndReachedThreshold={0.08}
          ListFooterComponent={() => {
            if (!loading) {
              return null;
            }
            return (
              <View style={{marginTop: 20}}>
                <ActivityIndicator color={Colors.white} size="small" />
              </View>
            );
          }}
          onEndReached={() => {
            if (hasMore) {
              fetchComments(offset);
            }
          }}
          ListEmptyComponent={() => {
            if (loading) {
              return null;
            }
            return (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingTop: 40,
                }}>
                <CustomText>No Comments yet!</CustomText>
              </View>
            );
          }}
          keyExtractor={item => item._id.toString()}
          renderItem={({item, index}) => {
            return (
              <CommentItem
                user={props?.payload?.user}
                scrollToParentComment={() => scrollToComment(index)}
                comment={item}
                scrollToChildComment={childIndex =>
                  scrollToComment(index, childIndex)
                }
                onReply={(comment, replyCommentId) =>
                  handleReply(comment, replyCommentId)
                }
              />
            );
          }}
        />
      )}

      <CommentInput
        setMentionSearchWord={value => setMentionSearchWord(value)}
        confirmMention={confirmMention}
        replyTo={replyTo}
        onPostComment={(data: any) => {
          if (replyCommentId) handleReplyComment(data);
          else handlePostComment(data);
        }}
        clearReplyTo={() => {
          setReplyTo(null);
          setReplyCommentId(null);
        }}
      />
    </ActionSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#121212',
    height: screenHeight * 0.8,
  },
  indicator: {
    height: 4,
    width: 40,
    top: 4,
    backgroundColor: Colors.border,
  },
  divider: {
    height: 0.2,
    backgroundColor: Colors.border,
    width: '100%',
  },
  header: {
    alignSelf: 'center',
    marginVertical: 8,
  },
});

export default CommentSheet;
