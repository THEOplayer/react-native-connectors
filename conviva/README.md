# react-native-theoplayer-drm

The `react-native-theoplayer-drm` package provides a set of connectors for [react-native-theoplayer](https://github.com/THEOplayer/react-native-theoplayer),
allowing playback of DRM-protected content.

## Installation

```sh
npm i https://theoplayer-cdn.s3.eu-west-1.amazonaws.com/react-native-theoplayer/react-native-theoplayer-drm-0.1.0.tgz
```

## Usage

The connector needs to be registered to the `ContentProtectionRegistry`, providing both
`integrationId` and `keySystemId`:

```typescript
import { ContentProtectionRegistry } from 'react-native-theoplayer';
import { AnvatoDrmFairplayContentProtectionIntegrationFactory } from 'react-native-theoplayer-drm';

ContentProtectionRegistry.registerContentProtectionIntegration(
  'anvato',   // integrationId
  'fairplay', // keySystemId
  new AnvatoDrmFairplayContentProtectionIntegrationFactory()
);
```

The combination of both `integrationId` and `keySystemId` points the player towards the connector
for a specific source,
in this case the `anvato` connector for `fairplay`:

```typescript
const source = {
  "sources": {
    "src": "<source_url>",
    "contentProtection": {
      "integration": "anvato",
      "fairplay": {
        "certificate": "<base64encoded_certificate>",
        "licenseAcquisitionURL": "<license_url>"
      },
    }
  }
};
```
