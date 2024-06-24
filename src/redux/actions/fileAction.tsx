import axios from 'axios';
import {Alert} from 'react-native';
import {UPLOAD} from '../API';

export const uploadFile =
  (local_uri: string, mediaType: string) => async (dispatch: any) => {
    try {
      const formData = new FormData();
      formData.append('image', {
        uri: local_uri,
        name: 'file',
      });
      formData.append('mediaType', mediaType);
      const res = await axios.post(UPLOAD, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return res.data.mediaUrl;
    } catch (error) {
      Alert.alert('Upload error');
      return null;
    }
  };
