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
        type: 'video/mp4',
      });
      formData.append('mediaType', mediaType);
      const res = await axios.post(UPLOAD, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        transformRequest: (data, headers) => {
          // !!! override data to return formData
          // since axios converts that to string
          return formData;
        },
        onUploadProgress: progressEvent => {
          // use upload data, since it's an upload progress
          console.log(progressEvent);
          // iOS: {"isTrusted": false, "lengthComputable": true, "loaded": 123, "total": 98902}
        },
      });

      return res.data.mediaUrl;
    } catch (error) {
      console.log(JSON.stringify(error));
      Alert.alert('Upload error');
      return null;
    }
  };
