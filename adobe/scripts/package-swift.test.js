const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { test } = require('node:test');

test('device-info compatibility patch changes packaging only and preserves its privacy manifest', () => {
  const patch = fs.readFileSync(path.join(__dirname, '../patches/react-native-device-info+14.1.1.patch'), 'utf8');
  const files = [...patch.matchAll(/^diff --git .* b\/node_modules\/react-native-device-info\/(.+)$/gm)].map((match) => match[1]);
  assert.deepEqual(files.sort(), ['Package.swift', 'package.json', 'react-native-spm-prefix.h']);
  assert.match(patch, /resources: \[\.copy\("ios\/PrivacyInfo\.xcprivacy"\)\]/);
  assert.match(patch, /\.tvOS\("15\.1"\)/);
  const config = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8'));
  assert.ok(config.files.includes('patches'));
});

test('SPM resolves shared dependencies from the installed scoped package and RN alias', { skip: process.platform !== 'darwin' }, (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'adobe-spm-path-test-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const app = path.join(root, 'app');
  const installed = path.join(app, 'node_modules/@theoplayer/react-native-analytics-adobe');
  const player = path.join(app, 'node_modules/react-native-theoplayer');
  const react = path.join(app, 'ios/build/xcframeworks');
  const aliases = path.join(app, 'ios/build/generated/autolinking/libs');
  for (const directory of [installed, player, react, aliases]) {
    fs.mkdirSync(directory, { recursive: true });
  }
  fs.copyFileSync(path.join(__dirname, '../Package.swift'), path.join(installed, 'Package.swift'));
  const alias = path.join(aliases, 'ReactNativeTHEOplayerAdobe');
  fs.symlinkSync(path.relative(aliases, installed), alias, 'dir');

  for (const location of [installed, alias]) {
    const result = spawnSync('swift', ['package', '--package-path', location, 'dump-package'], { encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr);
    const manifest = JSON.parse(result.stdout);
    const dependencies = manifest.dependencies.flatMap((dependency) => dependency.fileSystem ?? []);
    assert.equal(
      fs.realpathSync(dependencies.find((dependency) => dependency.identity === 'react-native-theoplayer')?.path),
      fs.realpathSync(player),
    );
    assert.equal(fs.realpathSync(dependencies.find((dependency) => dependency.identity === 'xcframeworks')?.path), fs.realpathSync(react));
    const config = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8'));
    const product = manifest.products.find((product) => product.name === config.swiftpmConfig.name);
    assert.deepEqual(product.targets, ['ReactNativeTHEOplayerAdobe', 'ReactNativeTHEOplayerAdobeBridge']);
  }
});
