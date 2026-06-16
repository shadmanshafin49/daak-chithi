import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';


import SignUpScreen from './screens/SignUpScreen';
import SignInScreen from './screens/SignInScreen';
import HomeScreen from './screens/HomeScreen';
import InboxScreen from './screens/InboxScreen';
import LetterViewScreen from './screens/LetterViewScreen';
import SettingsScreen from './screens/Settings';


import { useFonts } from 'expo-font';
import { PlaypenSans_400Regular } from '@expo-google-fonts/playpen-sans';
import { getToken, getUsername } from './auth';

const Stack = createNativeStackNavigator();

export default function App() {
  // Load every font ONCE at startup so screens render instantly on navigation
  // (previously each screen reloaded Glacial and blocked render until done).
  const [fontsLoaded] = useFonts({
    PlaypenSans_400Regular,
    'Glacial-Regular': require('./assets/fonts/GlacialIndifference-Regular.ttf'),
  });

  // Auto-login: check for a persisted token on launch.
  const [authChecked, setAuthChecked] = useState(false);
  const [initialUser, setInitialUser] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const [token, username] = await Promise.all([getToken(), getUsername()]);
        if (token) setInitialUser(username || 'User');
      } catch (e) {
        // ignore — fall through to the auth screens
      } finally {
        setAuthChecked(true);
      }
    })();
  }, []);

  if (!fontsLoaded || !authChecked) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#e9dec8' }}>
      <ActivityIndicator size="large" color="#b73430" />
    </View>
  );
}


  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={initialUser ? 'Home' : 'SignUp'}
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="SignIn" component={SignInScreen} />
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            initialParams={{ username: initialUser }}
          />
          <Stack.Screen name="Inbox" component={InboxScreen} />

          <Stack.Screen
            name="LetterView"
            component={LetterViewScreen}
            options={{ title: 'Your Letter' }}
          />
          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{
              headerShown: true,
              title: 'Settings',
              headerStyle: { backgroundColor: '#e9dec8' },
              headerTintColor: '#302f2e',
              headerShadowVisible: false,
              headerTitleStyle: { fontFamily: 'Glacial-Regular' },
            }}
          />

        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
