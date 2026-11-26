// swift-tools-version: 6.1
import Foundation
import PackageDescription

// RN autolinking references a generated symlink; dependencies must use the real npm location.
let packageDirectory = URL(fileURLWithPath: Context.packageDirectory).resolvingSymlinksInPath()
let reactNativePath = packageDirectory.appendingPathComponent("../../../ios/build/xcframeworks").standardizedFileURL.path
let playerPath = packageDirectory.appendingPathComponent("../../react-native-theoplayer").standardizedFileURL.path

let package = Package(
    name: "ReactNativeTHEOplayerGemius",
    platforms: [.iOS("16.0"), .tvOS("15.1")],
    products: [
        .library(
            name: "ReactNativeTHEOplayerGemius",
            targets: ["ReactNativeTHEOplayerGemius", "ReactNativeTHEOplayerGemiusBridge"]
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
            url: "https://github.com/gemius/gemiussdk-spm-ios",
            .upToNextMajor(from: "2.5.0")
        ),
        .package(
            url: "https://github.com/gemius/gemiussdk-spm-tvos",
            .upToNextMajor(from: "2.5.0")
        ),
    ],
    targets: [
        .target(
            name: "ReactNativeTHEOplayerGemiusBridge",
            dependencies: [
                .product(name: "ReactHeaders", package: "ReactNative"),
                .product(name: "ReactNativeHeaders", package: "ReactNative"),
                .product(name: "ReactNativeDependenciesHeaders", package: "ReactNative"),
            ],
            path: "ios",
            sources: ["THEOplayerGemiusRCTBridge.m"],
            publicHeadersPath: "spm/include",
            cSettings: [.define("RCT_NEW_ARCH_ENABLED", to: "1")]
        ),
        .target(
            name: "ReactNativeTHEOplayerGemius",
            dependencies: [
                .product(name: "react-native-theoplayer", package: "react-native-theoplayer"),
                .product(name: "THEOplayerSDK", package: "theoplayer-sdk-apple"),
                .product(name: "GemiusSDK", package: "gemiussdk-spm-ios", condition: .when(platforms: [.iOS])),
                .product(name: "GemiusSDKtvOS", package: "gemiussdk-spm-tvos", condition: .when(platforms: [.tvOS])),
                .product(name: "ReactHeaders", package: "ReactNative"),
                .product(name: "ReactNativeHeaders", package: "ReactNative"),
                .product(name: "ReactNativeDependenciesHeaders", package: "ReactNative"),
            ],
            path: "ios",
            exclude: [
                "THEOplayerGemiusRCTBridge.m",
                "TheoplayerGemius-Bridging-Header.h",
                "TheoplayerGemius.xcodeproj",
                "spm",
            ],
            swiftSettings: [.swiftLanguageMode(.v5)]
        ),
    ]
)
