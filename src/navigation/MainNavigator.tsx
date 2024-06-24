import React, {FC} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {mergedStacks} from './ScreenCollections';
import {UploadProvider} from '../components/uploadservice/UploadContext';
import {SheetProvider} from 'react-native-actions-sheet';

const Stack = createNativeStackNavigator();
const MainNavigator: FC = () => {
  return (
    <SheetProvider>
      <UploadProvider>
        <Stack.Navigator
          initialRouteName="SplashScreen"
          screenOptions={() => ({
            headerShown: false,
          })}>
          {mergedStacks.map((item, index) => {
            return (
              <Stack.Screen
                key={index}
                name={item.name}
                component={item.component}
              />
            );
          })}
        </Stack.Navigator>
      </UploadProvider>
    </SheetProvider>
  );
};

export default MainNavigator;
