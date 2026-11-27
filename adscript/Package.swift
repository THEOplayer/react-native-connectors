// swift-tools-version: 6.1
import Foundation
import PackageDescription

// RN autolinking references a generated symlink; dependencies must use the real npm location.
let packageDirectory = URL(fileURLWithPath: Context.packageDirectory).resolvingSymlinksInPath()
let reactNativePath = packageDirectory.appendingPathComponent("../../../ios/build/xcframeworks").standardizedFileURL.path
let playerPath = packageDirectory.appendingPathComponent("../../react-native-theoplayer").standardizedFileURL.path
let adScriptSDKPath = packageDirectory.appendingPathComponent("../../../ios/Frameworks/AdScriptSDK").standardizedFileURL.path

let package = Package(
    name: "ReactNativeTHEOplayerAdScript",
    platforms: [.iOS("16.0"), .tvOS("15.1")],
    products: [
        .library(
            name: "ReactNativeTHEOplayerAdScript",
            targets: ["ReactNativeTHEOplayerAdScript", "ReactNativeTHEOplayerAdScriptBridge"]
        ),
    ],
    dependencies: [
        .package(name: "ReactNative", path: reactNativePath),
        .package(path: playerPath),
        .package(name: "AdScriptSDK", path: adScriptSDKPath),
        .package(
            url: "https://github.com/THEOplayer/theoplayer-sdk-apple",
            .upToNextMajor(from: "11.14.0")
        ),
        .package(
            url: "https://github.com/apple/swift-collections",
            .upToNextMajor(from: "1.1.0")
        ),
    ],
    targets: [
        .target(
            name: "ReactNativeTHEOplayerAdScriptBridge",
            dependencies: [
                .product(name: "ReactHeaders", package: "ReactNative"),
                .product(name: "ReactNativeHeaders", package: "ReactNative"),
                .product(name: "ReactNativeDependenciesHeaders", package: "ReactNative"),
            ],
            path: "ios",
            sources: ["THEOplayerAdScriptRCTBridge.m"],
            publicHeadersPath: "spm/include",
            cSettings: [.define("RCT_NEW_ARCH_ENABLED", to: "1")]
        ),
        .target(
            name: "ReactNativeTHEOplayerAdScript",
            dependencies: [
                .product(name: "react-native-theoplayer", package: "react-native-theoplayer"),
                .product(name: "THEOplayerSDK", package: "theoplayer-sdk-apple"),
                .product(name: "AdScriptApiClient", package: "AdScriptSDK"),
                .product(name: "Collections", package: "swift-collections"),
                .product(name: "ReactHeaders", package: "ReactNative"),
                .product(name: "ReactNativeHeaders", package: "ReactNative"),
                .product(name: "ReactNativeDependenciesHeaders", package: "ReactNative"),
            ],
            path: "ios",
            exclude: [
                "THEOplayerAdScriptRCTBridge.m",
                "TheoplayerAdScript-Bridging-Header.h",
                "TheoplayerAdScript.xcodeproj",
                "spm",
            ],
            swiftSettings: [.swiftLanguageMode(.v5)]
        ),
    ]
)
