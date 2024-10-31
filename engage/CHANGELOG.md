# @theoplayer/react-native-engage

## 0.2.0

### ✨ Features

- Added support for React Native v0.75.

## 0.1.2

### 🐛 Issues

- Fixed an issue where bundling the connector for Web would result in a recursive import error.

## 0.1.1

### ✨ Features

- Downgraded to default Kotlin dependency to version 1.8.22.
- Upgraded to version 1.5.4 of the Android Engage SDK.
- Made the engage SDK a peer dependency by using `compileOnly` in Gradle.
- Added the `Subscription` and `SignIn` entities with an API to set the current user subscription and signIn card.

### 📦 Dependency Updates

- Replaced async-storage with react-native-mmkv for persistent key-value storage.

## 0.1.0

### ✨ Features

- Initial release
