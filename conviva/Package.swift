// swift-tools-version: 6.1
import Foundation
import PackageDescription

// RN autolinking references a generated symlink; dependencies must use the real npm location.
let packageDirectory = URL(fileURLWithPath: Context.packageDirectory).resolvingSymlinksInPath()
let reactNativePath = packageDirectory.appendingPathComponent("../../../ios/build/xcframeworks").standardizedFileURL.path
let playerPath = packageDirectory.appendingPathComponent("../../react-native-theoplayer").standardizedFileURL.path

let package = Package(
    name: "ReactNativeTHEOplayerConviva",
    platforms: [.iOS("16.0"), .tvOS("15.1")],
    products: [
        .library(
            name: "ReactNativeTHEOplayerConviva",
            targets: ["ReactNativeTHEOplayerConviva", "ReactNativeTHEOplayerConvivaBridge"]
        ),
    ],
    dependencies: [
        .package(name: "ReactNative", path: reactNativePath),
        .package(path: playerPath),
        .package(
            url: "https://github.com/THEOplayer/theoplayer-sdk-apple",
            .upToNextMajor(from: "11.14.0")
        ),
        .package(
            url: "https://github.com/THEOplayer/iOS-Connector",
            .upToNextMajor(from: "11.0.2")
        ),
        .package(
            url: "https://github.com/Conviva/conviva-ios-sdk-spm",
            .upToNextMinor(from: "4.3.1")
        ),
    ],
    targets: [
        .target(
            name: "ReactNativeTHEOplayerConvivaBridge",
            dependencies: [
                .product(name: "ReactHeaders", package: "ReactNative"),
                .product(name: "ReactNativeHeaders", package: "ReactNative"),
                .product(name: "ReactNativeDependenciesHeaders", package: "ReactNative"),
            ],
            path: "ios",
            sources: ["THEOplayerConvivaRCTBridge.m"],
            publicHeadersPath: "spm/include",
            cSettings: [.define("RCT_NEW_ARCH_ENABLED", to: "1")]
        ),
        .target(
            name: "ReactNativeTHEOplayerConviva",
            dependencies: [
                .product(name: "react-native-theoplayer", package: "react-native-theoplayer"),
                .product(name: "THEOplayerSDK", package: "theoplayer-sdk-apple"),
                .product(name: "THEOplayerConnectorConviva", package: "ios-connector"),
                .product(name: "ConvivaSDK", package: "conviva-ios-sdk-spm"),
                .product(name: "ReactHeaders", package: "ReactNative"),
                .product(name: "ReactNativeHeaders", package: "ReactNative"),
                .product(name: "ReactNativeDependenciesHeaders", package: "ReactNative"),
            ],
            path: "ios",
            exclude: [
                "THEOplayerConvivaRCTBridge.m",
                "TheoplayerConviva-Bridging-Header.h",
                "TheoplayerConviva.xcodeproj",
                "spm",
            ],
            swiftSettings: [.swiftLanguageMode(.v5)]
        ),
    ]
)
