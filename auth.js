import AsyncStorage from '@react-native-async-storage/async-storage';

// Centralised auth/session storage. The JWT and username are persisted so the
// app can auto-login on launch (see App.js) and attach the token to protected
// requests (see authHeaders).

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_username';

export async function saveAuth(token, username) {
  await AsyncStorage.multiSet([
    [TOKEN_KEY, token ?? ''],
    [USER_KEY, username ?? ''],
  ]);
}

export async function getToken() {
  return AsyncStorage.getItem(TOKEN_KEY);
}

export async function getUsername() {
  return AsyncStorage.getItem(USER_KEY);
}

export async function clearAuth() {
  await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
}

// Authorization header for protected fetches; empty object if not logged in.
export async function authHeaders() {
  const token = await getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}
