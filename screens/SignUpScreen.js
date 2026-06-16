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
  ActivityIndicator,
} from 'react-native';
import { API_BASE_URL } from '../config';
import { saveAuth } from '../auth';

export default function SignUpScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoTranslateY = useRef(new Animated.Value(300)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const formOpacity = useRef(new Animated.Value(0)).current;
  const [showPasswords, setShowPasswords] = useState(false);


  const navigation = useNavigation();

  // Quick, staggered intro animation on mount (fonts are already loaded in App.js).
  useEffect(() => {
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(logoTranslateY, {
        toValue: 100,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 400,
        delay: 150,
        useNativeDriver: true,
      }),
      Animated.timing(formOpacity, {
        toValue: 1,
        duration: 450,
        delay: 250,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const signUp = async () => {
    if (!username || !email || !password || !repeatPassword) {
      setError('Please fill all fields.');
      return;
    }
    if (password !== repeatPassword) {
      setError('Passwords do not match.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, repeatPassword }),
      });

      const data = await response.json();

      if (response.status === 201) {
        await saveAuth(data.token, data.user?.username || username);
navigation.reset({
  index: 0,
  routes: [{ name: 'Home', params: { username } }],
});
      } else {
        setError(data.message || 'Signup failed. Please try again.');
      }
    } catch (error) {
      setError('Couldn’t reach the server. Check your connection and try again.');
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
          {/* Password Field */}
<TextInput
  placeholder="Password"
  placeholderTextColor="#a5a19d"
  secureTextEntry={!showPasswords}
  style={styles.input}
  value={password}
  onChangeText={setPassword}
/>

{/* Repeat Password Field */}
<TextInput
  placeholder="Repeat password"
  placeholderTextColor="#a5a19d"
  secureTextEntry={!showPasswords}
  style={styles.input}
  value={repeatPassword}
  onChangeText={setRepeatPassword}
/>

{/* Toggle Visibility Text */}
<TouchableOpacity onPress={() => setShowPasswords(prev => !prev)}>
  <Text style={{ color: '#b73430', fontFamily: 'Glacial-Regular', marginBottom: 10, marginTop: -5   }}>
    {showPasswords ? 'Hide passwords' : 'Show passwords'}
  </Text>
</TouchableOpacity>

          <TextInput
            placeholder="Email"
            placeholderTextColor="#a5a19d"
            keyboardType="email-address"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity style={styles.button} onPress={signUp} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Sign up</Text>
            )}
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
    maxWidth: 420,
    alignSelf: 'center',
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
  errorText: {
    color: '#b73430',
    fontFamily: 'Glacial-Regular',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 6,
    width: '100%',
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
