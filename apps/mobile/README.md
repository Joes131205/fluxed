# Expo Router and Uniwind 

Use [Expo Router](https://docs.expo.dev/router/introduction/) with [Uniwind](https://docs.uniwind.dev/) styling.

## Launch your own

[![Launch with Expo](https://github.com/expo/examples/blob/master/.gh-assets/launch.svg?raw=true)](https://launch.expo.dev/?github=https://github.com/expo/examples/tree/master/with-router-uniwind)

## 🚀 How to use

```sh
npx create-expo-app -e with-router-uniwind
```

## Local backend

Create an `apps/mobile/.env.local` file and set `EXPO_PUBLIC_API_URL` to your backend URL. The app reads that value at runtime, so you do not need to commit URL changes.

Examples:

- Android emulator: `http://10.0.2.2:3000`
- iOS simulator: `http://localhost:3000`
- Physical device: your machine's LAN IP or a tunnel URL such as `https://...`

If you do not set `EXPO_PUBLIC_API_URL` in development, the app falls back to a local simulator/emulator URL.

## Deploy

Deploy on all platforms with Expo Application Services (EAS).

- Deploy the website: `npx eas-cli deploy` — [Learn more](https://docs.expo.dev/eas/hosting/get-started/)
- Deploy on iOS and Android using: `npx eas-cli build` — [Learn more](https://expo.dev/eas)
