import React, {FC, useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Alert,
  Keyboard,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import CustomSafeAreaView from '../../components/global/CustomSafeAreaView';
import ReedemeHeader from '../../components/global/CustomHeader';
import ModernHeader from '../../components/global/ModernHeader';
import ReedemTab from '../../components/reedem/ReedemTab';
import LotteryWheel from '../../components/spinner/LotteryWheel';
import {LotteryData} from '../../utils/staticData';
import {Colors} from '../../constants/Colors';
import CustomText from '../../components/global/CustomText';
import {FONTS} from '../../constants/Fonts';
import LinearGradient from 'react-native-linear-gradient';
import {useAppDispatch} from '../../redux/reduxHook';
import {getRewardDetails, reedemReward} from '../../redux/actions/rewardAction';

const ReedemScreen: FC = () => {
  const dispatch = useAppDispatch();
  const [currentTab, setCurrentTab] = useState(0);
  const [tokens, setTokens] = useState(0);
  const [creatorMoney, setCreatorMoney] = useState(0);
  const [upiId, setUpiId] = useState('');
  const [transferAmount, setTransferAmount] = useState('');

  const handleSpin = async () => {
    if (tokens >= 10) {
      await dispatch(reedemReward('redeem', tokens));
      fetchRewardDetails();
    } else {
      Alert.alert(
        'Insufficient Tokens',
        'You need at least 10 tokens to spin.',
      );
    }
  };

  const handleTransfer = async () => {
    const amount = parseFloat(transferAmount);
    if (creatorMoney >= 500 && amount >= 500) {
      if (amount <= creatorMoney) {
        await dispatch(reedemReward('withdraw', amount));
        setUpiId('');
        setTransferAmount('');
        fetchRewardDetails();
        Keyboard.dismiss();
        Alert.alert(
          'Transfer Successful',
          `₹${amount} has been transferred to ${upiId}.`,
        );
      } else {
        Alert.alert(
          'Insufficient Funds',
          'You do not have enough money to transfer.',
        );
      }
    } else {
      Alert.alert(
        'Minimum Transfer Amount',
        'The minimum amount to transfer is ₹500.',
      );
    }
  };

  const fetchRewardDetails = async () => {
    const data = await dispatch(getRewardDetails());
    if (data) {
      setCreatorMoney(data?.rupees?.toFixed(2));
      setTokens(data?.tokens?.toFixed(2));
    }
  };
  useEffect(() => {
    fetchRewardDetails();
  }, []);

  return (
    <CustomSafeAreaView>
      <ReedemeHeader title="" onInfoPress={() => {}} />
      <ModernHeader title="Choose your reward type" />

      <View style={styles.flexRowBetween}>
        <ReedemTab
          onPress={() => setCurrentTab(0)}
          icon="🎞️"
          isFocused={currentTab == 0}
          totalText="Total Tokens"
          type="Viewer"
          value={tokens.toString()}
          pointIcon="🎫"
        />

        <ReedemTab
          onPress={() => setCurrentTab(1)}
          icon="🎬"
          isFocused={currentTab == 1}
          totalText="Total Revenue"
          type="Creator"
          value={creatorMoney.toString()}
          pointIcon="₹"
        />
      </View>
      <ScrollView contentContainerStyle={{flex: 1}}>
        {currentTab == 0 && (
          <View style={styles.centeredView}>
            <LotteryWheel
              tokens={tokens}
              data={LotteryData}
              prizeIndex={5}
              deductAmount={() => handleSpin()}
            />
          </View>
        )}
        {currentTab == 1 && (
          <View style={styles.creator}>
            <CustomText>Enter your UPI ID</CustomText>
            <TextInput
              style={styles.input}
              value={upiId}
              placeholderTextColor={Colors.border}
              onChangeText={setUpiId}
              placeholder="VPA / UPI ID"
            />
            <CustomText>Enter amount to transfer</CustomText>
            <TextInput
              style={styles.input}
              value={transferAmount}
              placeholderTextColor={Colors.border}
              onChangeText={setTransferAmount}
              placeholder="Enter Amount"
              keyboardType="numeric"
            />

            <TouchableOpacity onPress={handleTransfer} style={styles.btn}>
              <LinearGradient
                colors={['#f09433', '#e6683c', '#dc2743', '#cc2366', '#bc1888']}
                start={{x: 0, y: 0.5}}
                end={{x: 1, y: 0.5}}
                style={styles.redeemButton}>
                <CustomText variant="h5" fontFamily={FONTS.Medium}>
                  Reedem
                </CustomText>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({
  flexRowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    justifyContent: 'space-between',
  },
  redeemButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    width: '100%',
    backgroundColor: 'red',
    borderRadius: 100,
  },
  btn: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    alignSelf: 'center',
    marginTop: 20,
    backgroundColor: 'red',
    borderRadius: 100,
  },
  centeredView: {
    alignItems: 'center',
    marginTop: 140,
  },
  creator: {
    marginTop: 50,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    color: Colors.text,
    borderRadius: 5,
    fontFamily: FONTS.Medium,
    padding: 10,
    marginVertical: 10,
    width: '100%',
  },
});
export default ReedemScreen;
