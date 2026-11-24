const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { test } = require('node:test');

test(
  'SPM shares local dependencies and selects platform-specific Gemius products from npm and RN alias paths',
  { skip: process.platform !== 'darwin' },
  (t) => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'gemius-spm-path-test-'));
    t.after(() => fs.rmSync(root, { recursive: true, force: true }));
    const app = path.join(root, 'app');
    const installed = path.join(app, 'node_modules/@theoplayer/react-native-analytics-gemius');
    const player = path.join(app, 'node_modules/react-native-theoplayer');
    const react = path.join(app, 'ios/build/xcframeworks');
    const aliases = path.join(app, 'ios/build/generated/autolinking/libs');
    for (const directory of [installed, player, react, aliases]) {
      fs.mkdirSync(directory, { recursive: true });
    }
    fs.copyFileSync(path.join(__dirname, '../Package.swift'), path.join(installed, 'Package.swift'));
    const alias = path.join(aliases, 'ReactNativeTHEOplayerGemius');
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
      assert.deepEqual(product.targets, ['ReactNativeTHEOplayerGemius', 'ReactNativeTHEOplayerGemiusBridge']);
      const target = manifest.targets.find((target) => target.name === config.swiftpmConfig.name);
      for (const [name, packageName, platform] of [
        ['GemiusSDK', 'gemiussdk-spm-ios', 'ios'],
        ['GemiusSDKtvOS', 'gemiussdk-spm-tvos', 'tvos'],
      ]) {
        const dependency = target.dependencies.find((item) => item.product?.[0] === name)?.product;
        assert.ok(dependency, name);
        assert.equal(dependency[1], packageName);
        assert.deepEqual(dependency[3].platformNames, [platform]);
      }
    }
  },
);
