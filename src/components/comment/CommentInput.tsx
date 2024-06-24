import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {emojiListData} from '../../utils/staticData';
import {Colors} from '../../constants/Colors';
import GIFIcon from '../../assets/icons/gif.png';
import CustomText from '../global/CustomText';
import {SheetManager} from 'react-native-actions-sheet';
import {RFValue} from 'react-native-responsive-fontsize';
import {FONTS} from '../../constants/Fonts';
import {useAppSelector} from '../../redux/reduxHook';
import {selectUser} from '../../redux/reducers/userSlice';

interface commentInputProps {
  replyTo: Comment | SubReply | null;
  clearReplyTo: () => void;
  onPostComment: (data: any) => void;
  confirmMention: any | null;
  setMentionSearchWord: (word: string | null) => void;
}

const CommentInput: React.FC<commentInputProps> = ({
  replyTo,
  clearReplyTo,
  setMentionSearchWord,
  onPostComment,
  confirmMention,
}) => {
  const [comment, setComment] = useState('');
  const user = useAppSelector(selectUser);
  const [mention, setMention] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const textInputRef = useRef<TextInput>(null);
  useEffect(() => {
    if (replyTo) {
      const mentionText = `@${replyTo.user.username} `;
      setMention(mentionText);
      setComment(mentionText);
      textInputRef.current?.focus();
    } else {
      setMention('');
      setComment('');
    }
  }, [replyTo]);

  const handleEmojiClick = (emoji: string) => {
    setComment(prevComment => prevComment + emoji);
  };

  const handleSend = (res: string | null) => {
    if (res) {
      clearReplyTo();
      setMention('');
      setComment('');
      onPostComment({
        hasGif: true,
        gifUrl: res,
      });
      return;
    }
    onPostComment({
      comment,
      hasGif: false,
    });
    clearReplyTo();
    setMention('');
    setComment('');
  };

  const handleInputChange = (text: string) => {
    setComment(text);
  };

  const handleSelectionChange = (event: any) => {
    const cursorPos = event.nativeEvent.selection.start;
    setTimeout(() => {
      setCursorPosition(cursorPos);
    }, 100);
  };

  const replaceMentionAtCursor = (
    text: string,
    replaceWord: string,
    newWord: string,
    cursorPos: number,
  ) => {
    const index = text.lastIndexOf(`@${replaceWord}`, cursorPos);
    if (index !== -1 && index < cursorPos) {
      return (
        text.slice(0, index) +
        `@${newWord} ` +
        text.slice(index + replaceWord.length + 1)
      );
    }
    return text;
  };

  useEffect(() => {
    if (confirmMention != null) {
      setComment(
        replaceMentionAtCursor(
          comment,
          confirmMention.replaceWord,
          confirmMention.user?.username,
          cursorPosition,
        ),
      );
    }
  }, [confirmMention]);

  useEffect(() => {
    const textBeforeCursor = comment.slice(0, cursorPosition);
    const match = textBeforeCursor.match(/(^|\s)@([a-zA-Z]*)$/);
    if (match) {
      const lastWord = match[2];
      setMentionSearchWord(lastWord);
    } else {
      setMentionSearchWord(null);
    }
  }, [cursorPosition]);

  return (
    <View style={styles.container}>
      <ScrollView
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="interactive"
        horizontal
        showsHorizontalScrollIndicator={false}>
        {emojiListData.map((i: string, index: number) => (
          <TouchableOpacity
            key={index}
            style={styles.emojiBtn}
            onPress={() => {
              handleEmojiClick(i);
            }}>
            <CustomText variant="h5">{i}</CustomText>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={styles.subContainer}>
        <Image source={{uri: user?.userImage}} style={styles.userImage} />
        <View
          style={[
            styles.inputContainer,
            {
              borderRadius: comment?.length < 35 && !replyTo ? 100 : 20,
            },
          ]}>
          {replyTo && (
            <View style={styles.flexRowBetween}>
              <CustomText
                variant="h9"
                style={{color: Colors.lightText}}
                fontFamily={FONTS.Regular}>
                Replying to {mention}
              </CustomText>
              <Icon
                name="close"
                color={Colors.lightText}
                size={RFValue(12)}
                onPress={() => clearReplyTo()}
              />
            </View>
          )}
          <View style={styles.flexRow}>
            <TextInput
              ref={textInputRef}
              style={styles.input}
              placeholderTextColor={Colors.border}
              placeholder="Add a comment..."
              multiline={true}
              value={comment}
              keyboardAppearance="dark"
              keyboardType="email-address"
              verticalAlign="middle"
              onChangeText={handleInputChange}
              onSelectionChange={handleSelectionChange}
            />
            {comment ? (
              <TouchableOpacity onPress={() => handleSend(null)}>
                <Icon
                  name={comment ? 'send' : 'emoji-emotions'}
                  size={24}
                  color={Colors.text}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={async () => {
                  const res = await SheetManager.show('gif-sheet');
                  if (res) {
                    handleSend(res);
                  }
                }}>
                <Image
                  source={GIFIcon}
                  tintColor={Colors.text}
                  style={styles.gifIcon}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  flexRowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#080707',
    padding: 10,
    borderBottomWidth: 0.5,
    borderColor: Colors.lightText,
    justifyContent: 'space-between',
  },
  container: {
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderTopWidth: 0.5,
    borderTopColor: Colors.lightText,
  },
  subContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userImage: {
    width: 35,
    height: 35,
    borderRadius: 20,
    marginRight: 10,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.lightText,
    marginRight: 10,
  },
  inputContainer: {
    borderColor: Colors.lightText,
    borderWidth: Platform.OS === 'ios' ? 0.5 : 0.8,
    width: '88%',
    paddingHorizontal: 2,
    overflow: 'hidden',
    alignItems: 'center',
  },
  flexRow: {
    flexDirection: 'row',
    padding: Platform.OS == 'ios' ? 10 : 0,
    alignItems: 'center',
  },
  emojiBtn: {
    marginTop: 4,
    marginHorizontal: 10,
    marginBottom: 10,
  },
  input: {
    width: '86%',
    paddingHorizontal: 2,
    maxHeight: 100,
    marginRight: 10,
    bottom: Platform.OS === 'ios' ? 2 : 0,
    color: Colors.text,
  },
  gifIcon: {
    width: 23,
    height: 23,
  },
});

export default CommentInput;
