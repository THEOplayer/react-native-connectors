// swift-tools-version: 6.1
import PackageDescription

// Copy this manifest beside the vendor-supplied XCFramework in the app.
let package = Package(
    name: "AdScriptSDK",
    platforms: [.iOS("16.0"), .tvOS("15.1")],
    products: [
        .library(name: "AdScriptApiClient", targets: ["AdScriptApiClient"]),
    ],
    targets: [
        .binaryTarget(
            name: "AdScriptApiClient",
            path: "AdScriptApiClient.xcframework"
        ),
    ]
)
