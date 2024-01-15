import React, {useEffect, useState} from 'react';
import {
  Alert,
  Button,
  Dimensions,
  FlatList,
  Image,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableHighlight,
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
  const [modalVisible, setModalVisible] = useState(false);
  const [modalImagePath, setModalImagePath] = useState<string | null>(null);


  useEffect(() => {
    requestStoragePermission();
    recursiveFolders();
  }, []);

  const getAllFiles = async (dir: string, fileList: string[] = []) => {
    try {
      const files = await RNFS.readDir(dir);

      for (const file of files) {
        if (file.isDirectory()) {
          await getAllFiles(file.path, fileList);
        } else {
          fileList.push(file.path);
        }
      }

      return fileList;
    } catch (error) {
      //console.error('Error reading directory:', error);
    }
  };

  function recursiveFolders() {
    getAllFiles(directoryPath)
      .then(allFiles => {
        const x = allFiles?.map((fileName, index) => ({
          id: index.toString(),
          value: fileName,
        }));
        setData(x ?? []);
      })
      .catch(error => {
        console.error('Error scanning files:', error);
      });
  }

  const createAlert = (title: string, message: string) =>
    Alert.alert(title, message, [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => console.log('OK Pressed')},
    ]);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <Text
        style={{
          padding: 10,
          fontSize: 18,
          color: '#000000',
        }}>
        Gallery App
      </Text>
      <FlatList
        data={data}
        renderItem={({item}) => (
          <View style={styles.itemContainer}>
            <TouchableHighlight
              style={styles.item}
              onPress={() => createAlert("Info", item.value)}>
              <Image
                style={styles.item}
                source={{
                  uri: `file:///${item.value}`,
                }}
              />
            </TouchableHighlight>
          </View>
        )}
        keyExtractor={item => item.id}
        numColumns={numColumns}
      />
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
