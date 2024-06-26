import {
  View,
  Text,
  TextStyle,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React, {FC} from 'react';
import {FONTS} from '../../constants/Fonts';
import {RFValue} from 'react-native-responsive-fontsize';
import {Colors} from '../../constants/Colors';
import {SheetManager} from 'react-native-actions-sheet';
import {navigate} from '../../utils/NavigationUtil';

interface Props {
  variant?:
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'h7'
    | 'h8'
    | 'h9'
    | 'body';
  fontFamily?: FONTS;
  fontSize?: number;
  style?: TextStyle | TextStyle[];
  children?: React.ReactNode;
  numberOfLines?: number;
  onLayout?: (event: object) => void;
  onMentionPress?: (mention: string) => void;
}

const CustomText: FC<Props> = ({
  variant = 'body',
  fontFamily = FONTS.Regular,
  fontSize,
  style,
  onLayout,
  children,
  numberOfLines,
  onMentionPress,
}) => {
  let computedFontSize: number;
  switch (variant) {
    case 'h1':
      computedFontSize = RFValue(fontSize || 22);
      break;
    case 'h2':
      computedFontSize = RFValue(fontSize || 20);
      break;
    case 'h3':
      computedFontSize = RFValue(fontSize || 18);
      break;
    case 'h4':
      computedFontSize = RFValue(fontSize || 16);
      break;
    case 'h5':
      computedFontSize = RFValue(fontSize || 14);
      break;
    case 'h6':
      computedFontSize = RFValue(fontSize || 12);
      break;
    case 'h7':
      computedFontSize = RFValue(fontSize || 12);
      break;
    case 'h8':
      computedFontSize = RFValue(fontSize || 10);
      break;
    case 'h9':
      computedFontSize = RFValue(fontSize || 9);
      break;
    default:
      computedFontSize = RFValue(fontSize || 12);
  }

  const handleUserPress = async (mention: string) => {
    if (SheetManager.get('comment-sheet')?.current?.isOpen()) {
      await SheetManager.hide('comment-sheet');
    }
    navigate('UserProfileScreen', {
      username: mention,
    });
  };

  const renderTextWithMentions = (text: string): JSX.Element[] => {
    const mentionRegex = /@(\w+)/g;
    let lastIndex = 0;
    const elements: JSX.Element[] = [];
    let match;
    while ((match = mentionRegex.exec(text)) !== null) {
      const mention = match[1];
      const plainTextBeforeMention = text.substring(lastIndex, match.index);
      if (plainTextBeforeMention) {
        elements.push(
          <Text
            onLayout={onLayout}
            numberOfLines={
              numberOfLines !== undefined ? numberOfLines : undefined
            }
            key={lastIndex}
            style={[
              styles.text,
              {
                color: Colors.text,
                fontSize: computedFontSize,
                fontFamily: fontFamily,
              },
              style,
            ]}>
            {plainTextBeforeMention}
          </Text>,
        );
      }
      elements.push(
        <TouchableOpacity
          key={match.index}
          onPress={() => {
            onMentionPress ? onMentionPress(mention) : handleUserPress(mention);
          }}>
          <Text
            style={[
              styles.text,
              {
                color: Colors.text,
                fontSize: computedFontSize,
                fontFamily: fontFamily,
              },
              style,
            ]}>
            {`@${mention}`}
          </Text>
        </TouchableOpacity>,
      );

      lastIndex = mentionRegex.lastIndex;
    }

    const plainTextAfterLastMention = text.substring(lastIndex);
    if (plainTextAfterLastMention) {
      elements.push(
        <Text
          onLayout={onLayout}
          numberOfLines={
            numberOfLines !== undefined ? numberOfLines : undefined
          }
          key={lastIndex}
          style={[
            styles.text,
            {
              color: Colors.text,
              fontSize: computedFontSize,
              fontFamily: fontFamily,
            },
            style,
          ]}>
          {plainTextAfterLastMention}
        </Text>,
      );
    }

    return elements;
  };

  return (
    <View style={[styles.container, style]}>
      {typeof children === 'string' ? (
        renderTextWithMentions(children)
      ) : (
        <Text
          onLayout={onLayout}
          numberOfLines={
            numberOfLines !== undefined ? numberOfLines : undefined
          }
          style={[
            styles.text,
            {
              color: Colors.text,
              fontSize: computedFontSize,
              fontFamily: fontFamily,
            },
            style,
          ]}>
          {children}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  text: {
    textAlign: 'left',
  },
  mention: {
    textAlign: 'left',
  },
});

export default CustomText;
