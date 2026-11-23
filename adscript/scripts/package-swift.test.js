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
