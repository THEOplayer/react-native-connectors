# THEOplayer React-Native Engage Connector

An Engage connector for `@theoplayer/react-native`. Currently only Android platforms are supported.

## Overview

TODO

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

### Providing cluster data

By giving a _cluster data provider_, the connector can update its cluster data, a list of either
"Continuation" (or "Continue Watching"), "Featured" or "Recommendation" entities.

```tsx
import { ClusterType } from "@theoplayer/react-native-engage/src";

connector.setClusterDataProvider(ClusterType.Continuation, () => {
  // Return an updated list of continuation entities.
  return [{
    id: "id0",
    name: "The Dark Knight",
    posters: [/**/],
    // ...
  }];
});
```

Alternatively, a hook can be used to conveniently provide and manage the cluster data:

```tsx
const [continuation, addToContinuation, removeFromContinuation] = useContinuation(engage);
```

Note that cluster operations are _upsert_: they replace existing content for that cluster. There is no need to first remove
entities before inserting new ones.

### Updating or "publishing" cluster data

The cluster data can be updated either **manually**:

```tsx
// Request an update of the Continuation data
connector.updateClusterEntities(ClusterType.Continuation);
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

