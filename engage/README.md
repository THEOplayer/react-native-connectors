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
npm install @theoplayer/react-native-engage @react-native-async-storage/async-storage
```

## Usage

### Creating a connector instance

Create an instance of an Engage client, using either the convenient `useEngage` hook or
by creating a direct instance of the connector:

```tsx
const engageConfig = {
  debug: true,
  recommendationTitle: "Because you enjoyed",
};

// Creating a client instance using the connector
const client = await EngageConnector.createClient(engageConfig);

// ... or, alternatively, by using a hook
const engage = useEngage(engageConfig);
```

### Creating clusters

Using the Engage connector API, a _cluster_ can be created, or requested if it already exists on the device.
A cluster is a grouped set of data which can be of type "Continuation" (or "Continue Watching"), "Featured" or "Recommendation".

```tsx
import { ClusterType, ContinuationClusterConfig } from "@theoplayer/react-native-engage";

const continuationConfig: ContinuationClusterConfig = {
  accountProfile: {
    accountId: 'accountId',
    profileId: 'profileId'
  },
  syncAcrossDevices: false
}

// Create or get the "Continuation" cluster.
const continuation = client.getCluster(ClusterType.Continuation);
continuation.config = continuationConfig;
```

Alternatively, the `useCluster` hook can be used:

```tsx
const continuation = useCluster(engage, ClusterType.Continuation, continuationConfig);
```

### Updating or "publishing" cluster data

The cluster data can be updated either **manually** by manipulating its entities:

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

### Persisting cluster data

The cluster data is persistently stored on the device each time it is changed. When
the app reopens and creates a new Engage client, the stored that will be loaded first.

### Personalized experience

**TODO**: provide a "_signIn_" entity that can be displayed on the engage surface, and which directs users
to a sign-in page of the app.

**TODO** there is also a "_subscription_" entity that contains one or more entitlements. It is yet unclear how this
is used.

## Validating the published items

On Android, the [Verification App ](https://developer.android.com/guide/playcore/engage/workflow#shared-files) can
be used to check the state and contents of all published clusters. Warnings are shown in case
the published data does not satisfy the requirements.

| ![](./docs/verification_app_1.png) | ![](./docs/verification_app_2.png)          |
|------------------------------------|---------------------------------------------|
| **Published Continuation cluster** | **Published Feature cluster with warnings** |

## Example application

The example app showcases the integration of the Engage connector in a React Native application.

### Manipulating clusters

Tapping items (or entities) will add them to the "Continuation" cluster, while tapping items
in the Continuation cluster will remove them again. On each update the cluster is persistently
stored and published to the platform.

### Unpublished clusters

Tapping the bin icon results in removing and unpublishing (deleting) the cluster from the
platform.

| ![](./docs/example_app_1.png)          |       |
|----------------------------------------|-------|
| **Continuation and Featured clusters** |       |
