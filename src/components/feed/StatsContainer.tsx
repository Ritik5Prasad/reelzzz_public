import {View, Text, StyleSheet} from 'react-native';
import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from '../../redux/reduxHook';
import {selectUser} from '../../redux/reducers/userSlice';
import {refetchUser} from '../../redux/actions/userAction';
import {RFValue} from 'react-native-responsive-fontsize';
import {Colors} from '../../constants/Colors';
import CustomText from '../global/CustomText';

interface StatsDisplayProps {
  title: string;
  value: string;
}
const StatsDisplay: React.FC<StatsDisplayProps> = ({title, value}) => {
  return (
    <View style={styles.statsContainer}>
      <CustomText style={styles.title}>{title}</CustomText>
      <CustomText style={styles.value}>{value}</CustomText>
    </View>
  );
};

const StatsContainer = () => {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const fetchUser = async () => {
    await dispatch(refetchUser());
  };
  useEffect(() => {
    fetchUser();
  },[]);
  return (
    <View style={styles.container}>
      <StatsDisplay title="Followers" value={user?.followersCount} />
      <View style={styles.divider} />
      <StatsDisplay title="Reels" value={user?.reelsCount} />
      <View style={styles.divider} />
      <StatsDisplay title="Following" value={user?.followingCount} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    top: -350,
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: RFValue(30),
  },
  value: {
    fontSize: RFValue(60),
  },
  divider: {
    height: '100%',
    backgroundColor: Colors.disabled,
    width: 3,
    marginHorizontal: 80,
  },
});

export default StatsContainer;
