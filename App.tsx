import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import RNFS from 'react-native-fs';

const requestStoragePermission = async () => {
  try {
    const isAndroid = Platform.OS === 'android';
    const isAndroid13 = Platform.Version > '32';

    if (!isAndroid) {
      return;
    }

    const granted = await PermissionsAndroid.request(
      isAndroid13
        ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
        : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    );

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use the storage');
    } else {
      console.log('storage permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
};

type DataProp = {
  id: string;
  value: string;
};

const numColumns = 3;
const size = Dimensions.get('window').width / numColumns;

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const directoryPath = RNFS.ExternalStorageDirectoryPath;

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const [data, setData] = useState<DataProp[]>([]);

  useEffect(() => {
    console.log(`absolute path: ${directoryPath}`);
    RNFS.readDir(`${directoryPath}/Pictures/Screenshots`)
      .then(files => {
        const x = files
          .filter(item => item.isFile())
          .map((item, index) => {
            return {
              id: index.toString(),
              value: item.name,
            };
          });
        setData(x);
      })
      .catch(error => {
        console.log('Error reading directory:', error);
      });
  }, []);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <FlatList
          data={data}
          renderItem={({item}) => (
            <View style={styles.itemContainer}>
              <Image
                style={styles.item}
                source={{
                  uri: `file:///${directoryPath}/Pictures/Screenshots/${item.value}`,
                }}
              />
            </View>
          )}
          keyExtractor={item => item.id}
          numColumns={numColumns}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    width: size,
    height: size,
  },
  item: {
    flex: 1,
    margin: 1,
  },
});

export default App;
