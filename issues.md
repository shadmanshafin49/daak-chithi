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
- **Expo Go incompatibility (SDK mismatch).** Phone's Expo Go was SDK 54 but project was
  SDK 53. Upgraded project to **Expo SDK 54** (RN 0.81, React 19.1) via `expo install`;
  bundle verified compiling.
- **App felt slow.** Every screen reloaded the Glacial font on mount and blocked render
  (`if (!fontLoaded) return null`), and SignUp ran a ~3.2s animation chain. Fonts now load
  **once** in `App.js`; intro animations run in parallel and are ~0.4s.
- **Read status reverted.** The inbox grid tap never called the mark-read API — only local
  state. Now PATCHes the server (optimistic local update) so it persists across re-entry.
- **New letters needed re-login to appear.** Inbox fetched once on mount. Now refetches on
  screen focus and polls every 12s while focused.
- **LetterView didn't fit the screen.** Letter was sized by width (taller than viewport).
  Now sized by height via `useWindowDimensions`, width from aspect ratio.
- **White strip at bottom of Home.** Pointless `KeyboardAvoidingView` (no inputs) left a
  gap under SDK 54 edge-to-edge. Replaced with a plain cream container + bottom inset.
- **No loading / empty / error states.** Inbox now shows spinner → error(+retry) → empty
  ("No letters yet") → grid; auth screens show inline errors + button spinners. *(Module 3)*
- **No way back from Settings.** Enabled a brand-styled native header (cream, back arrow)
  for the Settings screen only; removed the now-duplicate in-screen title.
- **SignUp flow verified end-to-end.** Live-tested the signup API: new account → 201,
  duplicate → 400, password mismatch → 400, then login → 200. Frontend lands on Home.
  *(Module 4)*
- **No persisted login session.** Added JWT issuance on signup/login (`jsonwebtoken`,
  30-day token), persisted token + username in AsyncStorage (`auth.js`), and auto-login on
  launch in `App.js`. Logout now clears the real token (was clearing an unused
  `loggedInUser` key) and resets to SignIn. *(Module 5)*
- **Inbox was world-readable.** Added an auth middleware; `GET /api/messages` and
  `PATCH /api/messages/:id/read` now derive the user from the JWT (not a URL username) and
  enforce ownership. Removed the old `GET /:username` route. Public send stays accountless.
  Live-verified: user B cannot read or modify user A's messages (0 messages / 404). *(Module 6)*

---

## ❗ Open / unsolved

### Security / privacy
- **No server-side abuse protection.** Public send route has no rate limiting, no real
  input sanitisation, no profanity filter. *(Module 8)*

### Auth / session
- **"Reset password" link is dead.** It renders but does nothing. *(Module 9)*

### UX / navigation
- **Settings screen is nearly empty** — only logout. *(later modules)*
- **Whole UI needs a visual polish pass** (typography scale, spacing, letter-card look,
  send page). Requested by user; pending a design proposal.

### Product gaps (from spec, not yet built)
- Sender can't choose a letter-page design. *(Module 7)*
- No report/block flow. *(Module 9)*
- Backend runs on LAN only — share links don't work off-network. *(Module 10)*
- No push notifications. *(Module 11)*

### Needs on-device verification (not code-confirmable headlessly)
- Keyboard behaviour on a real device for SignIn/SignUp (`KeyboardAvoidingView`).
- No clipping/overflow on small phones and tablet widths after the Module 2 changes.
