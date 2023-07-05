# React Native THEOplayer Analytics

## License

This projects falls under the license as defined in https://github.com/THEOplayer/license-and-disclaimer.

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [How to use these guides](#how-to-use-these-guides)
4. [Getting Started](#getting-started)

## Overview

The `@theoplayer/react-native-analytics` package provides a collection of analytics connectors
for `react-native-theoplayer`, the official THEOplayer React Native video player.

This document covers how to add an analytics connector to your `THEOplayer` instance. For information on
how to include `react-native-theoplayer` in your React Native app, we refer to the
[documentation](https://github.com/THEOplayer/react-native-theoplayer) on the main GitHub page.

Currently, the following analytics connectors are available:

| Package name                                                                                                     | Purpose                                                          | Registry                                                                                                                                                      |
|------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [`@theoplayer/react-native-analytics-adobe`](https://github.com/THEOplayer/react-native-theoplayer-analytics)    | Adobe analytics connector implementing the Media Collections API | [![npm](https://img.shields.io/npm/v/@theoplayer/react-native-analytics-adobe)](https://www.npmjs.com/package/@theoplayer/react-native-analytics-adobe)       |
| [`@theoplayer/react-native-analytics-comscore`](https://github.com/THEOplayer/react-native-theoplayer-analytics) | Comscore analytics connector                                     | [![npm](https://img.shields.io/npm/v/@theoplayer/react-native-analytics-comscore)](https://www.npmjs.com/package/@theoplayer/react-native-analytics-comscore) |
| [`@theoplayer/react-native-analytics-conviva`](https://github.com/THEOplayer/react-native-theoplayer-analytics)  | Conviva analytics connector                                      | [![npm](https://img.shields.io/npm/v/@theoplayer/react-native-analytics-conviva)](https://www.npmjs.com/package/@theoplayer/react-native-analytics-conviva)   |
| [`@theoplayer/react-native-analytics-nielsen`](https://github.com/THEOplayer/react-native-theoplayer-analytics)  | Nielsen analytics connector                                      | [![npm](https://img.shields.io/npm/v/@theoplayer/react-native-analytics-nielsen)](https://www.npmjs.com/package/@theoplayer/react-native-analytics-nielsen)   |

## Prerequisites

If you have no previous experience in React Native, we encourage you to first explore the
[React Native Documentation](https://reactnative.dev/docs/getting-started),
as it gives you a good start on one of the most popular app development frameworks.

## How to use these guides

These are guides on how to use the THEOplayer React Native UI in your React Native project(s) and can be used
linearly or by searching the specific section. It is recommended that you have a basic understanding of how
React Native works to speed up the way of working with THEOplayer React Native SDK.

## Getting Started

In this section you will find step-by-step instructions on setting up an analytics connector.

- [Adobe](./adobe/README.md)
- [Comscore](./comscore/README.md)
- [Conviva](./conviva/README.md)
- [Nielsen](./nielsen/README.md)
