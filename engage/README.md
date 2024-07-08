# THEOplayer React-Native Engage Connector

An Engage connector for `@theoplayer/react-native`. Currently only Android platforms are supported.

## Overview

The Engage connector aims to **re-engage users** with your app by offering interesting content, promotions and deals.
Users can be driven directly to a relevant page within your app using **deep links**.

Typical use-cases are
the **"Continue Watching"** feature, which allows users to continue media play-back from where they
left off bookmarks, **(personalized) recommendations** promoting content that might be of interest to the user,
or a **sign-in** option that navigates users to the sign-in page of your app.

Currently, the engage connector only supports the [Android Engage SDK](https://developer.android.com/guide/playcore/engage).

### Terminology

In this document, we will refer to the following concepts:

- **Entity**: A content asset, which can be a "_movie_", "_tvShow_", "_tvSeason_", "_tvEpisode_", "_liveStream_", "_videoClip_" or "_signIn_".
- **Cluster**: A collection of entities grouped together in single UI view. Available types are:
  - "_Continuation_" or "_Continue Watching_": Contains unfinished videos and relevant newly released episodes.
  - "_Featured_": Showcases a selection of entities.
  - "_Recommendation_": Shows personalized content suggestions.

## Installation

```sh
npm install @theoplayer/react-native-engage
```

## Usage

### Creating a connector instance

Create an instance of the engage connector, using either the convenient `useEngage` hook or
by creating a direct instance of the connector:

```tsx
const engageConfig = {
  debug: true,
  recommendationTitle: "Because you enjoyed",
};

// Using either a hook
const engage = useEngage(engageConfig);

// ... or, alternatively, by directly creating an instance
const connector = new EngageConnector(engageConfig);
```

### Creating clusters

Using the Engage connector API, a _cluster_ can be created, a grouped set of data which can be of type
"Continuation" (or "Continue Watching"), "Featured" or "Recommendation".

```tsx
import { ClusterType } from "@theoplayer/react-native-engage/src";

const accountProfile: AccountProfile = {
  accountId: 'accountId',
  profileId: 'profileId'
};
const syncAcrossDevices: boolean = true;

// Create a "Continuation" cluster.
const continuation = connector.createContinuationCluster(accountProfile, syncAcrossDevices);
```

### Updating or "publishing" cluster data

The cluster data can be updated either **manually**:

```tsx
// Add or remove continuation entities.
continuation.addEntity({
  id: "id0",
  name: "The Dark Knight",
  posters: [/**/],
  // ...
});
```

or when requested **by the connector**. For example, on Android platforms when a broadcast message is sent to the app,
or when a scheduled update request is set (e.g., each 12 hours).

### Personalized experience

**TODO**: provide a "_signIn_" entity that can be displayed on the engage surface, and which directs users
to a sign-in page of the app.

**TODO** there is also a "_subscription_" entity that contains one or more entitlements. It is yet unclear how this
is used.

## Example application

**TODO**

The example app showcases the integration of the Engage connector in a React Native application.

