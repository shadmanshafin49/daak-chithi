import React, { useRef } from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Share,
  Alert,
} from 'react-native';
import { captureRef } from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import * as IntentLauncher from 'expo-intent-launcher';

export default function LetterViewScreen({ route }) {
  const message = route.params?.message ?? '';
  const viewRef = useRef();

  let fontSize = 14;
  if (message.length > 554) fontSize = 10;
  else if (message.length > 404) fontSize = 12;

  const saveImage = async () => {
    try {
      if (!viewRef.current) {
      Alert.alert('Error', 'Something went wrong capturing the letter.');
      return;
    }
      const uri = await captureRef(viewRef.current, {
  format: 'png',
  quality: 1,
});


      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        return Alert.alert('Permission denied', 'Storage permission is required.');
      }

      const asset = await MediaLibrary.createAssetAsync(uri);
      Alert.alert('Saved', 'Letter saved to your gallery!');
    } catch (error) {
      console.error('Save failed:', error);
      Alert.alert('Error', 'Failed to save the letter.');
    }
  };

  const shareToInstagramStory = async () => {
    try {
      if (!viewRef.current) {
      Alert.alert('Error', 'Something went wrong capturing the letter.');
      return;
    }
      const uri = await captureRef(viewRef.current, {
  format: 'png',
  quality: 1,
});


      if (Platform.OS === 'android') {
        IntentLauncher.startActivityAsync('android.intent.action.SEND', {
          type: 'image/png',
          extras: {
            'android.intent.extra.STREAM': uri,
            'android.intent.extra.TEXT': 'Check out my anonymous letter! 💌',
          },
        });
      } else {
        const canShare = await Sharing.isAvailableAsync();
        if (canShare) {
          await Sharing.shareAsync(uri);
        } else {
          Alert.alert('Error', 'Sharing not available on this device.');
        }
      }
    } catch (error) {
      console.error('Share failed:', error);
      Alert.alert('Error', 'Failed to share the letter.');
    }
  };

  return (
  <ScrollView contentContainerStyle={styles.container}>
    {/* ViewShot target */}
    <View ref={viewRef} collapsable={false} style={styles.letterWrapper}>

      <Image
        source={require('../assets/letter_page.png')}
        style={styles.letterImage}
      />
      <Text style={[styles.letterText, { fontSize }]}>{message}</Text>
    </View>

    {/* Action Buttons */}
    <View style={styles.buttonRow}>
      <TouchableOpacity style={styles.button} onPress={saveImage}>
        <Text style={styles.buttonText}>Save as Image</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={shareToInstagramStory}>
        <Text style={styles.buttonText}>Share to Story</Text>
      </TouchableOpacity>
    </View>
  </ScrollView>
);
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fdf8f3',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 20,
    paddingBottom: 40,
  },
  letterWrapper: {
    position: 'relative',
    width: '90%',
    maxWidth: 390,
    aspectRatio: 1294 / 2800,
  },
  letterImage: {
    width: '100%',
    height: undefined,
    aspectRatio: 1294 / 2800,
    resizeMode: 'contain',
  },
  letterText: {
    position: 'absolute',
    top: '27%',
    left: '10%',
    width: '80%',
    height: '60%',
    fontFamily: 'PlaypenSans_400Regular',
    lineHeight: 15,
    color: '#302f2e',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    width: '80%',
    gap: 15,
  },
  button: {
    flex: 1,
    backgroundColor: '#b73430',
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
  },
});