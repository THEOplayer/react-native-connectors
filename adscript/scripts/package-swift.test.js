const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { test } = require('node:test');

function dumpPackage(location) {
  const result = spawnSync('swift', ['package', '--package-path', location, 'dump-package'], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  return JSON.parse(result.stdout);
}

test('Apple ad classification handles live, unknown, and out-of-range durations', { skip: process.platform !== 'darwin' }, (t) => {
  // Exercise the shipped Swift method without requiring the private vendor SDK.
  const source = fs.readFileSync(path.join(__dirname, '../ios/Source/integration/AdScriptAdapter.swift'), 'utf8');
  const start = source.indexOf('    private func getAdType(');
  const end = source.indexOf('    private func buildAdMetadata(', start);
  assert.ok(start >= 0 && end > start);
  const method = source.slice(start, end).replace('private func', 'func');
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'adscript-ad-type-test-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const fixture = path.join(root, 'main.swift');
  fs.writeFileSync(
    fixture,
    `import Foundation
enum AdScriptDataValueType { case preroll, midroll, postroll }
struct Player { let duration: Double? }
struct Adapter {
    let player: Player
    ${method}
}
let cases: [(Int, Double?, AdScriptDataValueType)] = [
    (0, .infinity, .preroll),
    (-1, .infinity, .postroll),
    (120, .infinity, .midroll),
    (120, -.infinity, .midroll),
    (120, .nan, .midroll),
    (120, .greatestFiniteMagnitude, .midroll),
    (120, nil, .midroll),
    (119, 120.9, .midroll),
    (120, 120.9, .postroll),
    (121, 120.9, .postroll)
]
for (offset, duration, expected) in cases {
    precondition(Adapter(player: Player(duration: duration)).getAdType(offset: offset) == expected)
}
`,
  );
  const result = spawnSync('swift', [fixture], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
});

test('content metadata has matching dictionary types in the exported bridge and Swift implementation', () => {
  const bridge = fs.readFileSync(path.join(__dirname, '../ios/THEOplayerAdScriptRCTBridge.m'), 'utf8');
  const swift = fs.readFileSync(path.join(__dirname, '../ios/THEOplayerAdScriptRCTAdScriptAPI.swift'), 'utf8');
  const exportedType = bridge.match(/contentMetadata:\(nonnull (\w+) \*\)/)?.[1];
  const implementationType = swift.match(/contentMetadata: (\w+)/)?.[1];
  assert.ok(exportedType);
  assert.equal(exportedType, implementationType);
});

test('SPM shares the player, React, and app-owned AdScript SDK from the npm location and RN alias', { skip: process.platform !== 'darwin' }, (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'adscript-spm-path-test-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const app = path.join(root, 'app');
  const installed = path.join(app, 'node_modules/@theoplayer/react-native-analytics-adscript');
  const player = path.join(app, 'node_modules/react-native-theoplayer');
  const react = path.join(app, 'ios/build/xcframeworks');
  const sdk = path.join(app, 'ios/Frameworks/AdScriptSDK');
  const aliases = path.join(app, 'ios/build/generated/autolinking/libs');
  for (const directory of [installed, player, react, sdk, aliases]) {
    fs.mkdirSync(directory, { recursive: true });
  }
  fs.copyFileSync(path.join(__dirname, '../Package.swift'), path.join(installed, 'Package.swift'));
  const alias = path.join(aliases, 'ReactNativeTHEOplayerAdScript');
  fs.symlinkSync(path.relative(aliases, installed), alias, 'dir');

  for (const location of [installed, alias]) {
    const manifest = dumpPackage(location);
    const dependencies = manifest.dependencies.flatMap((dependency) => dependency.fileSystem ?? []);
    for (const [identity, directory] of [
      ['react-native-theoplayer', player],
      ['xcframeworks', react],
      ['adscriptsdk', sdk],
    ]) {
      assert.equal(fs.realpathSync(dependencies.find((dependency) => dependency.identity === identity)?.path), fs.realpathSync(directory));
    }
    const config = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8'));
    const product = manifest.products.find((product) => product.name === config.swiftpmConfig.name);
    assert.deepEqual(product.targets, ['ReactNativeTHEOplayerAdScript', 'ReactNativeTHEOplayerAdScriptBridge']);
    const target = manifest.targets.find((target) => target.name === config.swiftpmConfig.name);
    assert.ok(target.dependencies.some((dependency) => dependency.product?.[0] === 'AdScriptApiClient' && dependency.product?.[1] === 'AdScriptSDK'));
    assert.ok(target.dependencies.some((dependency) => dependency.product?.[0] === 'Collections'));
  }
});

test('the app-owned SDK template exposes the vendor binary without bundling or downloading it', { skip: process.platform !== 'darwin' }, (t) => {
  const sdk = fs.mkdtempSync(path.join(os.tmpdir(), 'adscript-spm-template-test-'));
  t.after(() => fs.rmSync(sdk, { recursive: true, force: true }));
  fs.copyFileSync(path.join(__dirname, '../spm/AdScriptSDK/Package.swift'), path.join(sdk, 'Package.swift'));
  const manifest = dumpPackage(sdk);
  const product = manifest.products.find((product) => product.name === 'AdScriptApiClient');
  assert.deepEqual(product.targets, ['AdScriptApiClient']);
  const binary = manifest.targets.find((target) => target.name === 'AdScriptApiClient');
  assert.equal(binary.type, 'binary');
  assert.equal(binary.path, 'AdScriptApiClient.xcframework');
  assert.equal(binary.url, undefined);
  assert.deepEqual(manifest.dependencies, []);
});
