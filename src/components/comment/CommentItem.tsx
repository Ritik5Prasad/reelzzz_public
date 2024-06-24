import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import CustomText from '../global/CustomText';
import {Colors} from '../../constants/Colors';
import LinearGradient from 'react-native-linear-gradient';
import CommentSingleItem from './CommentSingleItem';
import {useAppDispatch} from '../../redux/reduxHook';
import {getReplies} from '../../redux/actions/commentAction';
import {subscribeToEvent, unsubscribeFromEvent} from './eventHandler';

interface CommentItemProps {
  comment: Comment;
  user: User | undefined;
  onReply: (comment: Comment | SubReply, commentId: string | number) => void;
  scrollToParentComment: () => void;
  scrollToChildComment: (index: number) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  user,
  onReply,
  scrollToParentComment,
  scrollToChildComment,
}) => {
  const dispatch = useAppDispatch();

  const [replies, setReplies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [offset, setOffset] = useState(0);
  const removeDuplicates = (data: any) => {
    const uniqueDataMap = new Map();
    data.forEach((item: any) => {
      if (!uniqueDataMap.has(item._id)) {
        uniqueDataMap.set(item._id, item);
      }
    });
    return Array.from(uniqueDataMap.values());
  };
  const fetchReplies = async (scrollOffset: number, commentId: string) => {
    setLoading(true);
    const newData = await dispatch(getReplies(commentId, scrollOffset));
    const combinedData = [...replies, ...newData];
    setReplies(removeDuplicates(combinedData));
    setLoading(false);
  };

  useEffect(() => {
    const handleReplyPosted = async (data: any) => {
      // Handle reply posted event

      if (data?.comment == comment?._id) {
        let reply_offset = 0;
        if (offset != 0) {
          reply_offset + 2;
        }
        setOffset(offset + 2);
        await fetchReplies(reply_offset, data?.comment);
      }
    };
    subscribeToEvent('replyPosted', handleReplyPosted);
    return () => {
      unsubscribeFromEvent('replyPosted', handleReplyPosted);
    };
  }, []);

  const handleReply = (msg: any) => {
    onReply(msg, comment._id);
  };

  return (
    <View style={styles.commentContainer}>
      <View style={styles.textContainer}>
        <CommentSingleItem
          scrollToComment={() => scrollToParentComment()}
          comment={comment}
          user={user}
          onReply={comment => handleReply(comment)}
        />
        {comment?.repliesCount > 0 && (
          <View style={{marginLeft: 40}}>
            {replies?.map((reply, index) => {
              return (
                <CommentSingleItem
                  isReply
                  key={reply._id}
                  user={user}
                  comment={reply}
                  onReply={comment => handleReply(comment)}
                  scrollToComment={() => scrollToChildComment(index)}
                />
              );
            })}

            {comment?.repliesCount - replies?.length > 0 ? (
              <TouchableOpacity
                style={styles.flexRow}
                onPress={async () => {
                  setOffset(offset + 2);
                  await fetchReplies(offset, comment._id);
                }}>
                <LinearGradient
                  colors={[
                    'rgba(0, 0, 0, 0)',
                    Colors.disabled,
                    'rgba(0, 0, 0, 0)',
                  ]}
                  style={styles.linearGradient}
                  start={{x: 0, y: 0.5}}
                  end={{x: 1, y: 0.5}}
                />
                <CustomText variant="h9" style={styles.viewRepliesText}>
                  Show {comment?.repliesCount - replies.length}{' '}
                  {comment?.repliesCount - replies.length > 1
                    ? 'replies'
                    : 'reply'}
                </CustomText>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.flexRow}
                onPress={async () => {
                  setOffset(0);
                  setReplies([]);
                }}>
                <LinearGradient
                  colors={[
                    'rgba(0, 0, 0, 0)',
                    Colors.disabled,
                    'rgba(0, 0, 0, 0)',
                  ]}
                  style={styles.linearGradient}
                  start={{x: 0, y: 0.5}}
                  end={{x: 1, y: 0.5}}
                />
                <CustomText variant="h9" style={styles.viewRepliesText}>
                  Hide Replies
                </CustomText>
              </TouchableOpacity>
            )}

            {loading && (
              <ActivityIndicator
                style={{alignSelf: 'flex-start'}}
                color={Colors.disabled}
                size="small"
              />
            )}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  commentContainer: {
    flexDirection: 'row',
    padding: 2,
  },
  textContainer: {
    flex: 1,
  },
  flexRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 5,
  },
  linearGradient: {
    width: 50,
    height: 1,
    top: 2,
  },
  viewRepliesText: {
    color: Colors.lightText,
    marginTop: 5,
  },
});

export default CommentItem;
