import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {FC} from 'react';
import HomeScreen from '../screens/dashboard/HomeScreen';
import ProfileScreen from '../screens/dashboard/ProfileScreen';
import {Image, Platform, TouchableOpacity} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {Colors} from '../constants/Colors';
import {HomeTabIcon, ProfileTabIcon} from './TabIcon';
import {bottomBarStyles} from '../styles/NavigationBarStyles';
import {navigate} from '../utils/NavigationUtil';
const Tab = createBottomTabNavigator();

const BottomTab: FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          paddingTop: Platform.OS === 'ios' ? RFValue(5) : 0,
          paddingBottom: Platform.OS === 'ios' ? 20 : 10,
          backgroundColor: 'transparent',
          height: Platform.OS === 'android' ? 70 : 80,
          borderTopWidth: 0,
          position: 'absolute',
        },
        tabBarActiveTintColor: Colors.theme,
        tabBarInactiveTintColor: '#447777',
        headerShadowVisible: false,
        tabBarShowLabel: false,
        tabBarIcon: ({focused}) => {
          if (route.name === 'Home') {
            return <HomeTabIcon focused={focused} />;
          }
          if (route.name === 'Profile') {
            return <ProfileTabIcon focused={focused} />;
          }
        },
      })}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen
        name="Post"
        component={HomeScreen}
        options={{
          tabBarIcon: () => {
            return (
              <TouchableOpacity
                onPress={() => navigate('PickReelScreen')}
                activeOpacity={0.5}
                style={bottomBarStyles.customMiddleButton}>
                <Image
                  style={bottomBarStyles.tabIcon}
                  source={require('../assets/icons/add.png')}
                />
              </TouchableOpacity>
            );
          },
          headerShown: false,
        }}
        listeners={{
          tabPress: e => {
            e.preventDefault();
          },
        }}
      />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};
export default BottomTab;
