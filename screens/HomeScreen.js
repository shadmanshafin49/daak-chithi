import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as Font from 'expo-font';
import * as Clipboard from 'expo-clipboard';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';




export default function HomeScreen({ route }) {
  const { username } = route.params || { username: 'User' };

  const navigation = useNavigation();

  const [fontLoaded, setFontLoaded] = useState(false);
  const textOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loadFont = async () => {
      await Font.loadAsync({
        'Glacial-Regular': require('../assets/fonts/GlacialIndifference-Regular.ttf'),
      });
      setFontLoaded(true);
    };
    loadFont();
  }, []);

  useEffect(() => {
    if (fontLoaded) {
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    }
  }, [fontLoaded]);

  if (!fontLoaded) return null;


const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

const handleShareAddress = () => {
  const publicLink = `http://192.168.0.106:5000/${username}`;
  Clipboard.setStringAsync(publicLink);
  //Alert.alert('Copied!', 'Your public link has been copied to clipboard.');
};


  return (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 20}
    >

      {/* TOP BAR with Settings Button */}
  <View style={styles.topBar}>
    <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
      <Image
        source={require('../assets/settings.png')}
        style={styles.settingsIcon}
      />
    </TouchableOpacity>
  </View>


      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
<Animated.Text style={[styles.welcomeText, { opacity: textOpacity }]}>
  {getGreeting()}, {username}!
</Animated.Text>


        {/* Inbox Button */}
        <TouchableOpacity
  style={styles.button}
  onPress={() => navigation.navigate('Inbox', { username })}
>
  <Image source={require('../assets/inbox.png')} style={styles.icon} resizeMode="contain" />
  <Text style={styles.buttonText}>Inbox</Text>
</TouchableOpacity>



        {/* Share Button */}
        <TouchableOpacity style={styles.button} onPress={handleShareAddress}>
  <Image
    source={require('../assets/share.png')}
    style={styles.icon}
    resizeMode="contain"
  />
  <Text style={styles.buttonText}>Share address</Text>
</TouchableOpacity>

        {/* Centered Text */}
        <Text style={styles.learnText}>
          Learn how to share on Instagram
        </Text>

        {/* Footer */}
        <Text style={styles.footerText}>About us</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
    backgroundColor: '#e9dec8',
  },
  container: {
    flexGrow: 1,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e9dec8',
  },
  welcomeText: {
    fontSize: 20,
    fontFamily: 'Glacial-Regular',
    color: '#302f2e',
    marginBottom: 40,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f6f4f1',
    borderRadius: 12,
    padding: 15,
    width: '100%',
    marginBottom: 20,
  },
  icon: {
    width: 100,
    height: 100,
    marginRight: 15,
  },
  buttonText: {
    fontSize: 18,
    color: '#302f2e',
    fontFamily: 'Glacial-Regular',
  },
  learnText: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'Glacial-Regular',
    color: '#302f2e',
  },
  footerText: {
    marginTop: 40,
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'Glacial-Regular',
    color: '#302f2e',
  },

  topBar: {
  width: '100%',
  paddingHorizontal: 340,
  paddingTop: 50,
  flexDirection: 'row',
  justifyContent: 'flex-start',
},

settingsIcon: {
  width: 30,
  height: 30,
  resizeMode: 'contain',
},

});
