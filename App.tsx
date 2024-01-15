/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {Platform} from 'react-native';
import type {PropsWithChildren} from 'react';
import {
  Button,
  PermissionsAndroid,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import RNFS from 'react-native-fs';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

const requestCameraPermission = async () => {
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

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const [directories, setDirectories] = useState<string[]>([]);

  useEffect(() => {
    // requestCameraPermission()
    const directoryPath = RNFS.ExternalStorageDirectoryPath;
    console.log(`absolute path: ${directoryPath}`);
    RNFS.readdir(`${directoryPath}/Pictures/Screenshots`)
      .then(files => {
        setDirectories(files);
        console.log(`Debug: ${files}`);
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
        {directories.map((dir, index) => (
          <Text key={index}>{dir}</Text>
        ))}
        <Button onPress={requestCameraPermission} title="Test" />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
