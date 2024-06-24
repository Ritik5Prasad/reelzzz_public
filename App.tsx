import 'react-native-gesture-handler';
import './src/sheets/sheet';
import React from 'react';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import Navigation from './src/navigation/Navigation';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Platform, StatusBar} from 'react-native';
import {Provider} from 'react-redux';
import {persistor, store} from './src/redux/store';
import {PersistGate} from 'redux-persist/integration/react';

GoogleSignin.configure({
  webClientId:
    'YOUR_GOOGLE_WEB_CLIENT_ID',
  forceCodeForRefreshToken: true,
  offlineAccess: false,
  iosClientId:
    'YOUR_GOOGLE_IOS_CLIENT_ID',
});

const App = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <StatusBar
        translucent={Platform.OS === 'ios'}
        backgroundColor="transparent"
      />
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Navigation />
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
};

export default App;
