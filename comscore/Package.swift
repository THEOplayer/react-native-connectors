// swift-tools-version: 6.1
import Foundation
import PackageDescription

// RN autolinking references a generated symlink; dependencies must use the real npm location.
let packageDirectory = URL(fileURLWithPath: Context.packageDirectory).resolvingSymlinksInPath()
let reactNativePath = packageDirectory.appendingPathComponent("../../../ios/build/xcframeworks").standardizedFileURL.path
let playerPath = packageDirectory.appendingPathComponent("../../react-native-theoplayer").standardizedFileURL.path

let package = Package(
    name: "ReactNativeTHEOplayerComscore",
    platforms: [.iOS("16.0"), .tvOS("15.1")],
    products: [
        .library(
            name: "ReactNativeTHEOplayerComscore",
            targets: ["ReactNativeTHEOplayerComscore", "ReactNativeTHEOplayerComscoreBridge"]
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
    ],
    targets: [
        .target(
            name: "ReactNativeTHEOplayerComscoreBridge",
            dependencies: [
                .product(name: "ReactHeaders", package: "ReactNative"),
                .product(name: "ReactNativeHeaders", package: "ReactNative"),
                .product(name: "ReactNativeDependenciesHeaders", package: "ReactNative"),
            ],
            path: "ios",
            sources: ["THEOplayerComscoreRCTBridge.m"],
            publicHeadersPath: "spm/include",
            cSettings: [.define("RCT_NEW_ARCH_ENABLED", to: "1")]
        ),
        .target(
            name: "ReactNativeTHEOplayerComscore",
            dependencies: [
                .product(name: "react-native-theoplayer", package: "react-native-theoplayer"),
                .product(name: "THEOplayerSDK", package: "theoplayer-sdk-apple"),
                .product(name: "THEOplayerConnectorComscore", package: "ios-connector"),
                .product(name: "ReactHeaders", package: "ReactNative"),
                .product(name: "ReactNativeHeaders", package: "ReactNative"),
                .product(name: "ReactNativeDependenciesHeaders", package: "ReactNative"),
            ],
            path: "ios",
            exclude: [
                "THEOplayerComscoreRCTBridge.m",
                "TheoplayerComscore-Bridging-Header.h",
                "TheoplayerComscore.xcodeproj",
                "spm",
            ],
            swiftSettings: [.swiftLanguageMode(.v5)]
        ),
    ]
)
