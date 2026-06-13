# Issues — Daak Chithi

A running log of problems faced while building, split into **resolved** and **open**.
Open items reference the module in the build plan (`prompt_to_go.md`) where they'll be
fixed.

---

## ✅ Faced & resolved

- **Hardcoded backend IP everywhere.** `http://192.168.0.106:5000` was duplicated across
  `SignInScreen`, `SignUpScreen`, `InboxScreen`, and `HomeScreen`. Centralised into
  `config.js` reading `EXPO_PUBLIC_API_URL` from `.env`. *(Module 1)*
- **`HomeScreen` top bar overflow.** `paddingHorizontal: 340` pushed the settings icon
  off-screen on normal phones. Replaced with `paddingHorizontal: 20` +
  `justifyContent: 'flex-end'`. *(Module 2)*
- **No safe-area handling.** Screens drew under the status bar / notch (HomeScreen faked
  it with a hardcoded `paddingTop: 50`). Added `SafeAreaProvider` and `useSafeAreaInsets`
  on Home, Inbox, and LetterView. *(Module 2)*
- **Layout didn't adapt to tablets.** Forms/buttons stretched edge-to-edge. Added
  `maxWidth` caps (420 on auth forms, 480 on home buttons). *(Module 2)*
- **README merge conflict on push.** GitHub had a separately-pushed README that collided
  with the new dev-setup one during rebase; merged both versions by hand.
- **MongoDB credentials leaked to GitHub.** The original `backend/.env` (with a live
  `MONGO_URI` incl. DB password) was committed in the initial commit and remained in
  history. Fixed in full: (1) untracked the file and added `.env` rules to `.gitignore`,
  (2) **rotated the Atlas DB password**, (3) scrubbed `backend/.env` from *all* history
  with `git filter-repo` and force-pushed. Verified the old password string no longer
  appears in any commit. A local pre-scrub backup bundle exists outside the repo.

---

## ❗ Open / unsolved

### Security / privacy
- **Inbox is world-readable.** `GET /api/messages/:username` lets anyone fetch anyone's
  letters by guessing a username — no auth. *(Module 6)*
- **No server-side abuse protection.** Public send route has no rate limiting, no real
  input sanitisation, no profanity filter. *(Module 8)*

### Auth / session
- **Login doesn't persist.** No token is stored; reopening the app logs you out. Logout in
  Settings clears a `loggedInUser` key that login never wrote. *(Module 5)*
- **"Reset password" link is dead.** It renders but does nothing. *(Module 9)*

### UX / navigation
- **No way back from Settings.** Headers are disabled globally (`headerShown: false`) and
  Settings only has a Log Out button — no back affordance to return Home. *(Module 3)*
- **No loading / empty / error states.** Inbox shows nothing while fetching or when empty;
  network failures fail silently (`console.error` only). *(Module 3)*
- **Settings screen is nearly empty** — only logout. *(later modules)*

### Product gaps (from spec, not yet built)
- Sender can't choose a letter-page design. *(Module 7)*
- No report/block flow. *(Module 9)*
- Backend runs on LAN only — share links don't work off-network. *(Module 10)*
- No push notifications. *(Module 11)*

### Needs on-device verification (not code-confirmable headlessly)
- Keyboard behaviour on a real device for SignIn/SignUp (`KeyboardAvoidingView`).
- No clipping/overflow on small phones and tablet widths after the Module 2 changes.
