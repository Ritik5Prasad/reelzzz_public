import {
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {RFValue} from 'react-native-responsive-fontsize';
import {Colors} from '../../constants/Colors';
import CustomText from '../global/CustomText';
import {FONTS} from '../../constants/Fonts';

interface InteractionButtonProps {
  likes: number;
  comments: number;
  onLike: () => void;
  onComment: () => void;
  onShare: () => void;
  onLongPressLike: () => void;
  isLiked: boolean;
}

const InteractionButtons: React.FC<InteractionButtonProps> = ({
  isLiked,
  onComment,
  onLike,
  onLongPressLike,
  onShare,
  comments,
  likes,
}) => {
  return (
    <View>
      <TouchableOpacity
        style={styles.button}
        onPress={onLike}
        onLongPress={onLongPressLike}>
        <Icon
          name={isLiked ? 'heart' : 'heart-outline'}
          size={RFValue(22)}
          color={isLiked ? Colors.like : Colors.white}
        />
        <CustomText variant="h9" fontFamily={FONTS.Medium}>
          {likes}
        </CustomText>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={onComment}>
        <Icon name={'comment-text'} size={RFValue(22)} color={Colors.white} />
        <CustomText variant="h9" fontFamily={FONTS.Medium}>
          {comments}
        </CustomText>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={onShare}>
        <Icon name={'share'} size={RFValue(22)} color={Colors.white} />
        <CustomText variant="h9" fontFamily={FONTS.Medium}>
          Share
        </CustomText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    marginVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default InteractionButtons;
