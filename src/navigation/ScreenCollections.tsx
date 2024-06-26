import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import SplashScreen from '../screens/auth/SplashScreen';
import FollowingScreen from '../screens/dashboard/FollowingScreen';
import ReedemScreen from '../screens/dashboard/ReedemScreen';
import UserProfileScreen from '../screens/dashboard/UserProfileScreen';
import FeedReelScrollScreen from '../screens/reel/FeedReelScrollScreen';
import PickReelScreen from '../screens/reel/PickReelScreen';
import ReelScrollScreen from '../screens/reel/ReelScrollScreen';
import UploadReelScreen from '../screens/reel/UploadReelScreen';
import BottomTab from './BottomTab';

export const authStack = [
  {
    name: 'LoginScreen',
    component: LoginScreen,
  },
  {
    name: 'RegisterScreen',
    component: RegisterScreen,
  },
  {
    name: 'SplashScreen',
    component: SplashScreen,
  },
];

export const dashboardStack = [
  {
    name: 'BottomTab',
    component: BottomTab,
  },
  {
    name: 'PickReelScreen',
    component: PickReelScreen,
  },
  {
    name: 'UploadReelScreen',
    component: UploadReelScreen,
  },
  {
    name: 'FeedReelScrollScreen',
    component: FeedReelScrollScreen,
  },
  {
    name: 'ReelScrollScreen',
    component: ReelScrollScreen,
  },
  {
    name: 'FollowingScreen',
    component: FollowingScreen,
  },
  {
    name: 'UserProfileScreen',
    component: UserProfileScreen,
  },
  {
    name: 'ReedemScreen',
    component: ReedemScreen,
  },
];

export const mergedStacks = [...dashboardStack, ...authStack];
