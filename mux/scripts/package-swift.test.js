const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { test } = require('node:test');

test('SPM shares local dependencies and includes Mux products from the npm location and RN alias', { skip: process.platform !== 'darwin' }, (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'mux-spm-path-test-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const app = path.join(root, 'app');
  const installed = path.join(app, 'node_modules/@theoplayer/react-native-analytics-mux');
  const player = path.join(app, 'node_modules/react-native-theoplayer');
  const react = path.join(app, 'ios/build/xcframeworks');
  const aliases = path.join(app, 'ios/build/generated/autolinking/libs');
  for (const directory of [installed, player, react, aliases]) {
    fs.mkdirSync(directory, { recursive: true });
  }
  fs.copyFileSync(path.join(__dirname, '../Package.swift'), path.join(installed, 'Package.swift'));
  const alias = path.join(aliases, 'ReactNativeTHEOplayerMux');
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
    assert.deepEqual(product.targets, ['ReactNativeTHEOplayerMux', 'ReactNativeTHEOplayerMuxBridge']);
    const target = manifest.targets.find((target) => target.name === config.swiftpmConfig.name);
    for (const name of ['MuxStatsTHEOplayer', 'MuxCore']) {
      assert.ok(target.dependencies.some((dependency) => dependency.product?.[0] === name));
    }
    assert.deepEqual(manifest.platforms.map((platform) => platform.platformName).sort(), ['ios', 'tvos']);
  }
});
