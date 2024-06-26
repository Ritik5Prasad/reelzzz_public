import {
  View,
  Text,
  Platform,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import React, {FC, useEffect, useState} from 'react';
import {useRoute} from '@react-navigation/native';
import CustomSafeAreaView from '../../components/global/CustomSafeAreaView';
import CustomHeader from '../../components/global/CustomHeader';
import {useAppDispatch} from '../../redux/reduxHook';
import {Colors} from '../../constants/Colors';
import {screenHeight} from '../../utils/Scaling';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {RFValue} from 'react-native-responsive-fontsize';
import UserItem from '../../components/global/UserItem';
import {getFollowOrFollowingUsers} from '../../redux/actions/userAction';
import CustomText from '../../components/global/CustomText';

interface paramData {
  id: string;
  type: 'Following' | 'Followers';
}
const FollowingScreen: FC = () => {
  const route = useRoute();
  const paramData = route?.params as paramData;

  const dispatch = useAppDispatch();
  const [search, setSearch] = useState('');
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);

  const removeDuplicates = (data: any) => {
    const uniqueDataMap = new Map();
    data.forEach((item: any) => {
      if (!uniqueDataMap.has(item._id)) {
        uniqueDataMap.set(item._id, item);
      }
    });
    return Array.from(uniqueDataMap.values());
  };

  const fetchUsers = async (scrollOffset: number) => {
    if (loading) return;
    setLoading(true);
    const newData = await dispatch(
      getFollowOrFollowingUsers(paramData, search, scrollOffset),
    );
    if (newData.length < 5) {
      setHasMore(false);
    }
    setUsers(removeDuplicates([...users, ...newData]));
    setLoading(false);
  };

  useEffect(() => {
    setOffset(0);
    setUsers([]);
    setHasMore(true);
    fetchUsers(0);
  }, [paramData, search]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      const newOffset = offset + 5;
      fetchUsers(newOffset);
      setOffset(newOffset);
    }
  };

  return (
    <CustomSafeAreaView>
      <CustomHeader title={paramData.type} onInfoPress={() => {}} />
      <View style={styles.inputContainer}>
        <Icon name={'magnify'} size={RFValue(14)} color={Colors.border} />
        <TextInput
          style={styles.input}
          placeholder="Search users"
          placeholderTextColor={Colors.border}
          value={search}
          onChangeText={text => setSearch(text)}
        />
        {search !== '' && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Icon
              name={'close-circle'}
              size={RFValue(14)}
              color={Colors.border}
            />
          </TouchableOpacity>
        )}
      </View>
      {loading && offset === 0 ? (
        <ActivityIndicator
          size="small"
          color={Colors.text}
          style={styles.loading}
        />
      ) : (
        <FlatList
          onEndReachedThreshold={0.5}
          onEndReached={handleLoadMore}
          ListEmptyComponent={() => {
            return (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <CustomText>No Users found!</CustomText>
              </View>
            );
          }}
          data={users}
          style={{height: '100%'}}
          keyExtractor={(item: User) => item._id?.toString()}
          renderItem={({item}) => <UserItem user={item} />}
          ListFooterComponent={
            loading && offset > 0 ? (
              <ActivityIndicator size="small" color={Colors.text} />
            ) : null
          }
        />
      )}
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#121212',
    height: screenHeight * 0.8,
  },
  header: {
    alignSelf: 'center',
    marginVertical: 8,
  },
  indicator: {
    height: 4,
    width: 40,
    top: 4,
    backgroundColor: Colors.border,
  },
  inputContainer: {
    backgroundColor: '#1f1e1e',
    flexDirection: 'row',
    borderRadius: 10,
    paddingVertical: Platform.OS === 'ios' ? 10 : 0,
    paddingHorizontal: 8,
    marginVertical: 20,
    marginHorizontal: 10,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    paddingHorizontal: 2,
    marginHorizontal: 10,
    color: Colors.text,
  },
  loading: {
    marginTop: 20,
  },
});

export default FollowingScreen;