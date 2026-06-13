// Central API configuration for the whole app.
//
// The backend base URL lives in ONE place: the EXPO_PUBLIC_API_URL environment
// variable (see .env / .env.example and the README). Changing that single value
// repoints the entire app — never hardcode IPs in individual screens.

const API_URL = process.env.EXPO_PUBLIC_API_URL;

if (!API_URL) {
  console.warn(
    '[config] EXPO_PUBLIC_API_URL is not set. Copy .env.example to .env and set ' +
      'your backend URL (e.g. your machine\'s LAN IP for device testing).'
  );
}

// Trim any trailing slash so callers can safely build `${API_BASE_URL}/api/...`.
export const API_BASE_URL = (API_URL || '').replace(/\/+$/, '');

export default API_BASE_URL;
