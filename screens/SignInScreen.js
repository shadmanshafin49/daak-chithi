import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as Font from 'expo-font';

import { useNavigation } from '@react-navigation/native';

export default function SignInScreen() {
      const navigation = useNavigation();
  const [fontLoaded, setFontLoaded] = useState(false);
      const [identifier, setIdentifier] = useState('');
const [password, setPassword] = useState('');
const [loading, setLoading] = useState(false);


  const textOpacity = useRef(new Animated.Value(0)).current;
  const formOpacity = useRef(new Animated.Value(0)).current;


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
      Animated.sequence([
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

  if (!fontLoaded) return null;




const signIn = async () => {
  if (!identifier || !password) {
    alert('Please fill in both fields.');
    return;
  }

  setLoading(true);
  try {
const response = await fetch('http://192.168.0.106:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ usernameOrEmail: identifier, password }),
    });

    const text = await response.text();
    console.log('Response text:', text);

    // Now try to parse JSON only if response.ok
    if (response.ok) {
  const data = JSON.parse(text);
  //alert(`Welcome back, ${data.user.username}`);
navigation.reset({
  index: 0,
  routes: [{ name: 'Home', params: { username: data.user.username } }],
});

    } else {
      alert('Invalid credentials');
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
        <Image
          source={require('../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Animated.Text style={[styles.title, { opacity: textOpacity }]}>
          Log in to your account
        </Animated.Text>

        <Animated.View style={[styles.form, { opacity: formOpacity }]}>
          <TextInput
  placeholder="Username or email"
  placeholderTextColor="#a5a19d"
  style={styles.input}
  value={identifier}
  onChangeText={setIdentifier}
/>
<TextInput
  placeholder="Password"
  placeholderTextColor="#a5a19d"
  secureTextEntry
  style={styles.input}
  value={password}
  onChangeText={setPassword}
/>


          <TouchableOpacity
  style={styles.button}
  onPress={signIn}
  disabled={loading}
>
  <Text style={styles.buttonText}>{loading ? 'Logging in...' : 'Log in'}</Text>
</TouchableOpacity>


          <Text style={styles.linkText}>Reset password</Text>

          <View style={{ flexDirection: 'row', marginTop: 12 }}>
            <Text style={styles.linkText}>Don’t have an Account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text style={[styles.linkText, { color: '#b73430' }]}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 100,
    height: 100,
    marginBottom: 30,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Glacial-Regular',
    color: '#302f2e',
    marginBottom: 30,
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
  linkText: {
    marginTop: 15,
    fontSize: 14,
    color: '#302f2e',
    fontFamily: 'Glacial-Regular',
  },
  form: {
    width: '100%',
    alignItems: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    //backgroundColor: '#e9dec8',
  },
  keyboardView: {
    flex: 1,
    //backgroundColor: '#e9dec8',
  },
});
