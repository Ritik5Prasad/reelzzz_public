import {
  View,
  Text,
  Platform,
  Keyboard,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import {Colors} from '../constants/Colors';
import {screenHeight} from '../utils/Scaling';
import ActionSheet, {
  SheetManager,
  SheetProps,
} from 'react-native-actions-sheet';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import GIFLoader from '../assets/animations/giphy.gif';
import {GIPHY_API_KEY} from '../redux/API';
import {RFValue} from 'react-native-responsive-fontsize';
import {ActivityIndicator} from 'react-native';
import {FlatList} from 'react-native';
import FastImage from 'react-native-fast-image';

const TRENDING_URL = `https://api.giphy.com/v1/gifs/trending?api_key=${GIPHY_API_KEY}&limit=10`;
const SEARCH_URL = `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&limit=10&q=`;

const GifSheet = (props: SheetProps<'gif-sheet'>) => {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [gifs, setGifs] = useState([]);

  const fetchGifs = async (url: string) => {
    setLoading(true);

    try {
      const response = await fetch(url);
      const data = await response.json();
      setGifs(data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }

    setLoading(false);
  };

  const handleSearch = () => {
    fetchGifs(`${SEARCH_URL}${search}`);
  };

  useEffect(() => {
    fetchGifs(TRENDING_URL);
  }, []);

  useEffect(() => {
    if (search.length > 2) {
      handleSearch();
    }
  }, [search]);

  const handleGifClick = (url: string) => {
    SheetManager.hide(props.sheetId, {payload: url});
  };

  const renderGifItem = ({item}: {item: any}) => {
    return (
      <TouchableOpacity
        style={styles.imgContainer}
        onPress={() => {
          handleGifClick(item.images.fixed_width.url);
        }}>
        <FastImage
          source={{
            uri: item.images.fixed_width.url,
            priority: FastImage.priority.high,
          }}
          defaultSource={GIFLoader}
          style={styles.gifImage}
        />
      </TouchableOpacity>
    );
  };

  return (
    <ActionSheet
      id={props.sheetId}
      headerAlwaysVisible={true}
      isModal={true}
      onClose={() => SheetManager.hide(props.sheetId)}
      gestureEnabled={Platform.OS == 'ios'}
      keyboardHandlerEnabled={true}
      indicatorStyle={styles.indicator}
      enableGesturesInScrollView={Platform.OS === 'ios'}
      containerStyle={styles.container}
      springOffset={100}>
      <View style={styles.inputContainer}>
        <Icon name="magnify" size={RFValue(15)} color={Colors.border} />
        <TextInput
          style={styles.input}
          placeholder="Search GIF"
          placeholderTextColor={Colors.border}
          value={search}
          onChangeText={setSearch}
        />
        {search !== '' && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Icon
              name="close-circle"
              size={RFValue(14)}
              color={Colors.border}
            />
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <ActivityIndicator
          size="small"
          color={Colors.text}
          style={styles.loading}
        />
      ) : (
        <FlatList
          data={gifs}
          nestedScrollEnabled
          numColumns={2}
          columnWrapperStyle={styles.row}
          style={{height: '100%'}}
          keyExtractor={(item: any) => item.id}
          renderItem={renderGifItem}
          contentContainerStyle={styles.listContent}
        />
      )}
    </ActionSheet>
  );
};

const styles = StyleSheet.create({
  row: {
    justifyContent: 'space-between',
  },
  imgContainer: {
    width: '48%',
    height: 150,
    borderRadius: 10,
    marginVertical: 5,
  },
  gifImage: {
    width: '99%',
    height: '100%',
    borderRadius: 10,
  },
  listContent: {
    paddingHorizontal: 10,
    paddingBottom: 20,
    marginTop: 10,
  },
  indicator: {
    height: 4,
    width: 40,
    top: 4,
    backgroundColor: Colors.border,
  },
  divider: {
    height: 0.2,
    backgroundColor: Colors.border,
    width: '100%',
  },
  loading: {
    marginTop: 20,
  },
  inputContainer: {
    backgroundColor: '#1f1e1e',
    flexDirection: 'row',
    borderRadius: 10,
    paddingVertical: Platform.OS == 'ios' ? 10 : 0,
    paddingHorizontal: 8,
    marginVertical: 15,
    marginHorizontal: 10,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    paddingHorizontal: 2,
    marginHorizontal: 10,
    color: Colors.text,
  },

  container: {
    backgroundColor: '#121212',
    height: screenHeight * 0.8,
  },
  header: {
    alignSelf: 'center',
    marginVertical: 8,
  },
});

export default GifSheet;
