## React Native THEOplayer Connector Template

### Overview

This template serves as a starting point for building a connector 
using [react-native-theoplayer](https://github.com/THEOplayer/react-native-theoplayer).

Included is a basic connector API that interfaces with native components on
iOS, Android and web, designed for easy expansion.

Moreover, the template generates a sample application that offers a practical demonstration of how to effectively utilize the connector.
To enable compatibility with tvOS, the example employs react-native-tvos. The resulting application can be deployed across multiple platforms:

- Android, AndroidTV & FireTV
- iOS & tvOS
- Web-based platforms

### Usage

To begin, initiate a new connector project using this template. Let's name it, for instance, `THEODemoConnector`:

```
$ npx react-native init THEODemoConnector --template @theoplayer/react-native-connector-template
```

This command will also handle the installation of the required dependencies.

### Running the Example App

To test the connector, an illustrative project is provided within the template.

Navigate to the example directory:

```bash
$ cd THEODemoConnector/example
```

Install the necessary dependencies:

```bash
$ npm i
```

And run on either Web, Android or iOS:

```bash
$ npm run web
$ npm run android
$ (cd ios && pod install) && npm run ios
```

### Connector Bridge

The connector template includes a simple API with `initialize` and `destroy` methods that bridge to 
native iOS and Android.

```typescript
export class ReactNativeTHEOplayerConnectorAdapter {
    constructor (private player: THEOplayer, config: ReactNativeTHEOplayerConnectorConfiguration) {
        NativeModules.ReactNativeTHEOplayerConnectorModule.initialize(this.player.nativeHandle, config);
    }

    destroy(): void {
        NativeModules.ReactNativeTHEOplayerConnectorModule.destroy(this.player.nativeHandle || -1);
    }
}
```

The `nativeHandle` is used to uniquely identify the player instance, as each player can have its own
connector instance.
On the native iOS and Android side, the handle resolves to the corresponding player instance.

#### On Android

```kotlin
@ReactMethod
fun initialize(tag: Int, connectorConfig: ReadableMap) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
        view?.player?.let { player ->
            val config = ReactNativeTHEOplayerConnectorConfiguration(
                connectorConfig.getBoolean(PROP_DEBUG),
            )
            connectors[tag] =
                ReactNativeTHEOplayerConnector(reactApplicationContext, player, config)
        }
    }
}

@ReactMethod
fun destroy(tag: Int) {
    connectors[tag]?.destroy()
    connectors.remove(tag)
}
```

#### On iOS

```swift
@objc(initialize:config:)
func initialize(_ node: NSNumber, config: NSDictionary) -> Void {
    log("initialize triggered.")

    DispatchQueue.main.async {
        log(config.debugDescription)
        if let view = self.view(for: node), let player = view.player, let sendError = view.mainEventHandler.onNativeError {
            let connector = ReactNativeTHEOplayerConnector()
            self.connectors[node] = connector
        } else {
            log("Cannot find THEOPlayer for node \(node)")
        }
    }
}

@objc(destroy:)
func destroy(_ node: NSNumber) -> Void {
    log("destroy triggered.")
    DispatchQueue.main.async {
        self.connectors.removeValue(forKey: node)
    }
}
```

The API can be extended with additional bridge methods.

### React Hook

For user convenience, a React hook is provided. This hook manages the destruction of the connector when either 
the player is being destroyed or the connector itself is unmounted.

```jsx
import { useTHEODemoConnector } from 'THEODemoConnector';

const config: THEODemoConnectorConfiguration = {
  debug: true,
};

const App = () => {
  const [connector, initConnector] = useTHEODemoConnector(config);

  const onPlayerReady = (player: THEOplayer) => {
    // Initialize connector
    initConnector(player);
  }

  return (<THEOplayerView config={playerConfig} onPlayerReady={onPlayerReady}/>);
}
```
