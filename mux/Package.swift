// swift-tools-version: 6.1
import Foundation
import PackageDescription

// RN autolinking references a generated symlink; dependencies must use the real npm location.
let packageDirectory = URL(fileURLWithPath: Context.packageDirectory).resolvingSymlinksInPath()
let reactNativePath = packageDirectory.appendingPathComponent("../../../ios/build/xcframeworks").standardizedFileURL.path
let playerPath = packageDirectory.appendingPathComponent("../../react-native-theoplayer").standardizedFileURL.path

let package = Package(
    name: "ReactNativeTHEOplayerMux",
    platforms: [.iOS("16.0"), .tvOS("15.1")],
    products: [
        .library(
            name: "ReactNativeTHEOplayerMux",
            targets: ["ReactNativeTHEOplayerMux", "ReactNativeTHEOplayerMuxBridge"]
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
            url: "https://github.com/muxinc/mux-stats-sdk-theoplayer-ios",
            .upToNextMajor(from: "0.15.0")
        ),
        .package(
            url: "https://github.com/muxinc/stats-sdk-objc",
            .upToNextMajor(from: "5.4.0")
        ),
    ],
    targets: [
        .target(
            name: "ReactNativeTHEOplayerMuxBridge",
            dependencies: [
                .product(name: "ReactHeaders", package: "ReactNative"),
                .product(name: "ReactNativeHeaders", package: "ReactNative"),
                .product(name: "ReactNativeDependenciesHeaders", package: "ReactNative"),
            ],
            path: "ios",
            sources: ["THEOplayerMuxRCTBridge.m"],
            publicHeadersPath: "spm/include",
            cSettings: [.define("RCT_NEW_ARCH_ENABLED", to: "1")]
        ),
        .target(
            name: "ReactNativeTHEOplayerMux",
            dependencies: [
                .product(name: "react-native-theoplayer", package: "react-native-theoplayer"),
                .product(name: "THEOplayerSDK", package: "theoplayer-sdk-apple"),
                .product(name: "MuxStatsTHEOplayer", package: "mux-stats-sdk-theoplayer-ios"),
                .product(name: "MuxCore", package: "stats-sdk-objc"),
                .product(name: "ReactHeaders", package: "ReactNative"),
                .product(name: "ReactNativeHeaders", package: "ReactNative"),
                .product(name: "ReactNativeDependenciesHeaders", package: "ReactNative"),
            ],
            path: "ios",
            exclude: [
                "THEOplayerMuxRCTBridge.m",
                "TheoplayerMux-Bridging-Header.h",
                "spm",
            ],
            swiftSettings: [.swiftLanguageMode(.v5)]
        ),
    ]
)
