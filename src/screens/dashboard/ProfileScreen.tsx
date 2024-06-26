import React, {useRef, useState} from 'react';
import CustomGradient from '../../components/global/CustomGradient';
import CustomSafeAreaView from '../../components/global/CustomSafeAreaView';
import {
  CollapsibleRef,
  MaterialTabBar,
  Tabs,
} from 'react-native-collapsible-tab-view';
import ProfileDetails from '../../components/profile/ProfileDetails';
import ReelListTab from '../../components/profile/ReelListTab';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {Colors} from '../../constants/Colors';
import Icon from 'react-native-vector-icons/Ionicons';
import {RFValue} from 'react-native-responsive-fontsize';
import {useAppSelector} from '../../redux/reduxHook';
import {selectUser} from '../../redux/reducers/userSlice';

const ProfileScreen = () => {
  const containerRef = useRef<CollapsibleRef>(null);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const user = useAppSelector(selectUser) as User;
  const handleSetIndex = (newIndex: number) => {
    setFocusedIndex(newIndex);
    containerRef.current?.setIndex(newIndex);
  };

  const MyTabs = [
    {
      name: 'Reel',
      component: <ReelListTab user={user} type="post" />,
      icon: 'apps-sharp',
    },
    {
      name: 'Liked',
      component: <ReelListTab user={user} type="liked" />,
      icon: 'heart',
    },
    {
      name: 'History',
      component: <ReelListTab user={user} type="watched" />,
      icon: 'logo-tableau',
    },
  ];

  return (
    <CustomSafeAreaView style={styles.container}>
      <Tabs.Container
        lazy
        cancelLazyFadeIn
        ref={containerRef}
        revealHeaderOnScroll={true}
        renderHeader={() => <ProfileDetails user={user} />}
        headerContainerStyle={styles.noOpacity}
        pagerProps={{
          onPageSelected: event => {
            setFocusedIndex(event.nativeEvent.position);
          },
          removeClippedSubviews: true,
        }}
        renderTabBar={props => (
          <MaterialTabBar
            {...props}
            activeColor={Colors.white}
            inactiveColor={Colors.disabled}
            tabStyle={{
              backgroundColor: Colors.background,
            }}
            style={{
              backgroundColor: Colors.background,
              borderTopWidth: 1,
              borderColor: Colors.background,
            }}
            indicatorStyle={styles.indicatorStyle}
            TabItemComponent={({index, name, ...rest}) => (
              <TouchableOpacity
                key={index}
                style={styles.tabBar}
                onPress={() => handleSetIndex(index)}>
                <Icon
                  name={MyTabs[index].icon}
                  size={RFValue(20)}
                  color={
                    focusedIndex === index ? Colors.text : Colors.inactive_tint
                  }
                />
              </TouchableOpacity>
            )}
          />
        )}
        containerStyle={{
          backgroundColor: Colors.background,
          paddingVertical: 0,
          elevation: 0,
          shadowOffset: {height: 0, width: 0},
          shadowColor: 'transparent',
          shadowOpacity: 0,
        }}>
        {MyTabs.map((item, index) => (
          <Tabs.Tab key={index} name={item.name}>
            {item.component}
          </Tabs.Tab>
        ))}
      </Tabs.Container>
      <CustomGradient position="bottom" />
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
    overflow: 'hidden',
    paddingTop: 10,
    paddingVertical: 0,
    backgroundColor: Colors.background,
  },
  indicatorStyle: {
    backgroundColor: 'white',
    height: 0.8,
  },
  noOpacity: {
    shadowOpacity: 0,
    elevation: 0,

    borderWidth: 0,
  },
  tabBar: {
    width: '33%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
});

export default ProfileScreen;