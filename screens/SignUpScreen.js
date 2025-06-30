import React, { useEffect, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  Animated,
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as Font from 'expo-font';

export default function SignUpScreen() {
  const [fontLoaded, setFontLoaded] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoTranslateY = useRef(new Animated.Value(300)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const formOpacity = useRef(new Animated.Value(0)).current;

  const navigation = useNavigation();

  // Load font
  useEffect(() => {
    const loadFont = async () => {
      await Font.loadAsync({
        'Glacial-Regular': require('../assets/fonts/GlacialIndifference-Regular.ttf'),
      });
      setFontLoaded(true);
    };
    loadFont();
  }, []);

  // Run animations once font is loaded
  useEffect(() => {
    if (fontLoaded) {
      Animated.sequence([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 1400,
          useNativeDriver: true,
        }),
        Animated.timing(logoTranslateY, {
          toValue: 100,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(formOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [fontLoaded]);

  // Early return (after all hooks)
  if (!fontLoaded) return null;

  const signUp = async () => {
    if (!username || !email || !password || !repeatPassword) {
      alert('Please fill all fields.');
      return;
    }
    if (password !== repeatPassword) {
      alert('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://192.168.0.106:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, repeatPassword }),
      });

      const data = await response.json();

      if (response.status === 201) {
        //alert(`Signup successful! Welcome, ${data.user.username}`);
navigation.reset({
  index: 0,
  routes: [{ name: 'Home', params: { username } }],
});
      } else {
        alert('Signup failed: ' + data.message);
      }
    } catch (error) {
      alert('Error connecting to server.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 20}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Animated.Image
          source={require('../assets/logo.png')}
          style={[
            styles.logo,
            {
              opacity: logoOpacity,
              transform: [{ translateY: logoTranslateY }],
            },
          ]}
          resizeMode="contain"
        />
        <Animated.Text style={[styles.title, { opacity: textOpacity }]}>
          Welcome to Daak Chithi!
        </Animated.Text>

        <Animated.View style={[styles.form, { opacity: formOpacity }]}>
          <TextInput
            placeholder="Username"
            placeholderTextColor="#a5a19d"
            style={styles.input}
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            placeholder="Password"
            placeholderTextColor="#a5a19d"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />
          <TextInput
            placeholder="Repeat password"
            placeholderTextColor="#a5a19d"
            secureTextEntry
            style={styles.input}
            value={repeatPassword}
            onChangeText={setRepeatPassword}
          />
          <TextInput
            placeholder="Email"
            placeholderTextColor="#a5a19d"
            keyboardType="email-address"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />

          <TouchableOpacity style={styles.button} onPress={signUp} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? 'Signing up...' : 'Sign up'}</Text>
          </TouchableOpacity>

          <View style={{ flexDirection: 'row', marginTop: 15 }}>
            <Text style={styles.signInText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
              <Text style={[styles.signInText, { color: '#b73430' }]}>Sign in</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
    // backgroundColor: '#e9dec8',
  },
  container: {
    flex: 1,
    //backgroundColor: '#e9dec8',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 110,
    borderRadius: 0,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Glacial-Regular',
    color: '#302f2e',
    marginBottom: 30,
  },
  form: {
    width: '100%',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    backgroundColor: '#f6f4f1',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Glacial-Regular',
    color: '#302f2e',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#b73430',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 25,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'Glacial-Regular',
    fontSize: 15,
  },
  signInText: {
    marginTop: 15,
    fontSize: 14,
    color: '#302f2e',
    fontFamily: 'Glacial-Regular',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
});
