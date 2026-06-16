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
  ActivityIndicator,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { API_BASE_URL } from '../config';
import { saveAuth } from '../auth';

export default function SignInScreen() {
      const navigation = useNavigation();
      const [identifier, setIdentifier] = useState('');
const [password, setPassword] = useState('');
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');


  const textOpacity = useRef(new Animated.Value(0)).current;
  const formOpacity = useRef(new Animated.Value(0)).current;
  const [showPassword, setShowPassword] = useState(false);



  useEffect(() => {
    Animated.parallel([
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(formOpacity, {
        toValue: 1,
        duration: 400,
        delay: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);




const signIn = async () => {
  if (!identifier || !password) {
    setError('Please fill in both fields.');
    return;
  }

  setError('');
  setLoading(true);
  try {
const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ usernameOrEmail: identifier, password }),
    });

    const text = await response.text();
    console.log('Response text:', text);

    // Now try to parse JSON only if response.ok
    if (response.ok) {
  const data = JSON.parse(text);
  await saveAuth(data.token, data.user.username);
navigation.reset({
  index: 0,
  routes: [{ name: 'Home', params: { username: data.user.username } }],
});

    } else {
      setError('Invalid username/email or password.');
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
<View style={{ width: '100%', position: 'relative' }}>
  <TextInput
    placeholder="Password"
    placeholderTextColor="#a5a19d"
    secureTextEntry={!showPassword}
    style={[styles.input, { paddingRight: 45 }]}
    value={password}
    onChangeText={setPassword}
  />
  <TouchableOpacity
    onPress={() => setShowPassword(prev => !prev)}
    style={{
      position: 'absolute',
      right: 10,
      top: 7,
      padding: 5,
    }}
  >
    <Image
      source={
        showPassword
          ? require('../assets/hide_password.png')
          : require('../assets/show_password.png')
      }
      style={{ width: 20, height: 20 }}
      resizeMode="contain"
    />
  </TouchableOpacity>
</View>




          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity
  style={styles.button}
  onPress={signIn}
  disabled={loading}
>
  {loading ? (
    <ActivityIndicator color="#fff" />
  ) : (
    <Text style={styles.buttonText}>Log in</Text>
  )}
</TouchableOpacity>


          <Text style={styles.linkText}>Reset password</Text>

          <View style={{ flexDirection: 'row', marginTop: 12 }}>
            <Text style={styles.linkText}>Don’t have an account? </Text>
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
  errorText: {
    color: '#b73430',
    fontFamily: 'Glacial-Regular',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 6,
    width: '100%',
  },
  linkText: {
    marginTop: 15,
    fontSize: 14,
    color: '#302f2e',
    fontFamily: 'Glacial-Regular',
  },
  form: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
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
