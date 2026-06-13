# Daak Chithi App

Almost a clone of **NGL** and **Chithi.me**.

Currently, it only runs on the **Expo Go app** :(.

---

### What you can do so far:

* Create an account :(
* Share your public link (currently only works locally) :(
* Check your inbox
* Share your address by copying the link
* Receive anonymous messages from others and read them
* Save messages as images (idky)
* Logout

---

### Known issues:

* Runs on a local server only (no production server yet)
* bad ui
* Settings screen is almost empty (only has logout)
* And many more bugs and quirks :DD

---

That’s the current state of things! More improvements coming soon 🚀

---

## Dev setup

### 1. Backend API URL (single source of truth)

The app's backend URL lives in **one place**: the `EXPO_PUBLIC_API_URL` environment
variable, read by [`config.js`](config.js). No screen hardcodes an IP — change this
one value and the whole app repoints.

1. Copy the example env file:

   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and set `EXPO_PUBLIC_API_URL` to your backend's base URL (no trailing
   slash):

   | Target                | Value                          |
   | --------------------- | ------------------------------ |
   | Physical device (LAN) | `http://<your-LAN-IP>:5000`    |
   | Android emulator      | `http://10.0.2.2:5000`         |
   | iOS simulator         | `http://localhost:5000`        |

   Find your LAN IP with `ipconfig` (Windows) or `ifconfig` (macOS/Linux).

> Env vars prefixed `EXPO_PUBLIC_` are inlined at build time, so **restart the Expo
> dev server** (`npm start`) after editing `.env` for changes to take effect.

### 2. Run

```bash
npm install
npm start        # then press a (Android) / i (iOS), or scan the QR code
```

The backend lives in [`backend/`](backend/) — see its own setup for `MONGO_URI` etc.
