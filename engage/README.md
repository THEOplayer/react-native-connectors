# THEOplayer React-Native Engage Connector

An Engage connector for `@theoplayer/react-native`. Currently only Android platforms are supported.

## Overview

TODO

### Clusters

These types of cluster data are supported:

- Continuation (or "Continue Watching")
- Featured
- Recommended

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

// ... or creating an instance
const connector = new EngageConnector(engageConfig);
```

### Providing cluster data

By giving a _cluster data provider_, the connector can update its cluster data, a list of either
"Continuation" (or "Continue Watching"), "Featured" or "Recommended" entities.

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

### Updating or "publishing" cluster data

The cluster data can be updated either manually:

```tsx
// Request an update of the Continuation data
connector.updateClusterEntities(ClusterType.Continuation);
```

or when requested by the connector itself, for example, on Android platforms when a broadcast message is sent to the app,
or when a scheduled update request is set.


