import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React, {FC} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import {Colors} from '../../constants/Colors';
import {RFValue} from 'react-native-responsive-fontsize';
import CustomText from '../global/CustomText';
import {launchCamera} from 'react-native-image-picker';
import {createThumbnail} from 'react-native-create-thumbnail';
import {navigate} from '../../utils/NavigationUtil';
const PickerReelButton: FC = () => {
  const handleCamera = async () => {
    await launchCamera({
      saveToPhotos: false,
      formatAsMp4: true,
      mediaType: 'video',
      includeExtra: true,
    })
      .then(res => {
        console.log(res);

        createThumbnail({
          url: res.assets![0].uri || '',
          timeStamp: 100,
        })
          .then(response => {
            if (res.assets![0].uri) {
              navigate('UploadReelScreen', {
                thumb_uri: response.path,
                file_uri: res.assets![0].uri,
              });
            }
          })
          .catch(err => {
            console.log('Error', err);
          });
      })
      .catch(err => {
        console.log('Video Record', err);
      });
  };

  return (
    <View style={styles.flexRowBetween}>
      <TouchableOpacity style={styles.btn} onPress={() => handleCamera()}>
        <Icon name="camera-outline" color={Colors.white} size={RFValue(20)} />
        <CustomText variant="h8" style={styles.btnText}>
          Camera
        </CustomText>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btn}>
        <Icon2 name="my-library-add" color={Colors.white} size={RFValue(20)} />
        <CustomText variant="h8" style={styles.btnText}>
          Drafts
        </CustomText>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btn}>
        <Icon2 name="auto-fix-high" color={Colors.white} size={RFValue(20)} />
        <CustomText variant="h8" style={styles.btnText}>
          Templates
        </CustomText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  flexRowBetween: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  btn: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    width: '30%',
    height: 100,
    borderRadius: 10,
    backgroundColor: '#1c1b1b',
  },
  btnText: {
    marginTop: 5,
  },
});

export default PickerReelButton;
