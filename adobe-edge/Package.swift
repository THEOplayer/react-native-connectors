// swift-tools-version: 6.1
import Foundation
import PackageDescription

// RN autolinking references a generated symlink; dependencies must use the real npm location.
let packageDirectory = URL(fileURLWithPath: Context.packageDirectory).resolvingSymlinksInPath()
let reactNativePath = packageDirectory.appendingPathComponent("../../../ios/build/xcframeworks").standardizedFileURL.path
let playerPath = packageDirectory.appendingPathComponent("../../react-native-theoplayer").standardizedFileURL.path

let package = Package(
    name: "ReactNativeTHEOplayerAdobeEdge",
    platforms: [.iOS("16.0"), .tvOS("15.1")],
    products: [
        .library(
            name: "ReactNativeTHEOplayerAdobeEdge",
            targets: ["ReactNativeTHEOplayerAdobeEdge", "ReactNativeTHEOplayerAdobeEdgeBridge"]
        ),
    ],
    dependencies: [
        .package(name: "ReactNative", path: reactNativePath),
        .package(path: playerPath),
        .package(
            url: "https://github.com/THEOplayer/theoplayer-sdk-apple",
            .upToNextMajor(from: "11.14.0")
        ),
        .package(url: "https://github.com/adobe/aepsdk-core-ios.git", .upToNextMajor(from: "5.0.0")),
        .package(url: "https://github.com/adobe/aepsdk-edge-ios.git", .upToNextMajor(from: "5.0.0")),
        .package(url: "https://github.com/adobe/aepsdk-edgeidentity-ios.git", .upToNextMajor(from: "5.0.0")),
        .package(url: "https://github.com/adobe/aepsdk-edgemedia-ios.git", .upToNextMajor(from: "5.0.0")),
    ],
    targets: [
        .target(
            name: "ReactNativeTHEOplayerAdobeEdgeBridge",
            dependencies: [
                .product(name: "ReactHeaders", package: "ReactNative"),
                .product(name: "ReactNativeHeaders", package: "ReactNative"),
                .product(name: "ReactNativeDependenciesHeaders", package: "ReactNative"),
            ],
            path: "ios",
            sources: ["TheoplayerAdobeEdgeRCTBridge.m"],
            publicHeadersPath: "spm/include",
            cSettings: [.define("RCT_NEW_ARCH_ENABLED", to: "1")]
        ),
        .target(
            name: "ReactNativeTHEOplayerAdobeEdge",
            dependencies: [
                .product(name: "react-native-theoplayer", package: "react-native-theoplayer"),
                .product(name: "THEOplayerSDK", package: "theoplayer-sdk-apple"),
                .product(name: "AEPCore", package: "aepsdk-core-ios"),
                .product(name: "AEPServices", package: "aepsdk-core-ios"),
                .product(name: "AEPEdge", package: "aepsdk-edge-ios"),
                .product(name: "AEPEdgeIdentity", package: "aepsdk-edgeidentity-ios"),
                .product(name: "AEPEdgeMedia", package: "aepsdk-edgemedia-ios"),
                .product(name: "ReactHeaders", package: "ReactNative"),
                .product(name: "ReactNativeHeaders", package: "ReactNative"),
                .product(name: "ReactNativeDependenciesHeaders", package: "ReactNative"),
            ],
            path: "ios",
            exclude: [
                "TheoplayerAdobeEdgeRCTBridge.m",
                "TheoplayerAdobeEdge-Bridging-Header.h",
                "spm",
            ],
            swiftSettings: [.swiftLanguageMode(.v5)]
        ),
    ]
)
