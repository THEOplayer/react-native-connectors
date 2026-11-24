const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { test } = require('node:test');

test('Apple quality listeners are track-specific, removable, and do not retain the adapter', { skip: process.platform !== 'darwin' }, (t) => {
  // Compile the production subscription helpers against a small track dispatcher fixture.
  const source = fs.readFileSync(path.join(__dirname, '../ios/Source/GemiusAdapter.swift'), 'utf8');
  const start = source.indexOf('  private func addVideoQualityListener(');
  const end = source.indexOf('  private func reportVideoQualityChange(', start);
  assert.ok(start >= 0 && end > start);
  const methods = source.slice(start, end).replaceAll('private func', 'func');
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'gemius-track-listener-test-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const fixture = path.join(root, 'main.swift');
  fs.writeFileSync(
    fixture,
    `import Foundation
enum MediaTrackEventTypes { static let ACTIVE_QUALITY_CHANGED = "quality" }
final class EventListener {
    let invoke: () -> Void
    init(_ invoke: @escaping () -> Void) { self.invoke = invoke }
}
final class Track {
    let uid: Int
    init(uid: Int) { self.uid = uid }
    var listeners: [ObjectIdentifier: EventListener] = [:]
    func addEventListener(type: String, listener: @escaping (Int) -> Void) -> EventListener {
        let token = EventListener { listener(0) }
        listeners[ObjectIdentifier(token)] = token
        return token
    }
    func removeEventListener(type: String, listener: EventListener) {
        listeners.removeValue(forKey: ObjectIdentifier(listener))
    }
    func emit() { Array(listeners.values).forEach { $0.invoke() } }
}
final class Adapter {
    private var videoQualityChangedEventListeners: [Int: (track: Track, listener: EventListener)] = [:]
    var reports = 0
    func reportVideoQualityChange() { reports += 1 }
    ${methods}
}
let first = Track(uid: 1)
let second = Track(uid: 2)
let adapter = Adapter()
adapter.addVideoQualityListener(first)
adapter.addVideoQualityListener(first)
adapter.addVideoQualityListener(second)
precondition(first.listeners.count == 1 && second.listeners.count == 1)
first.emit()
second.emit()
precondition(adapter.reports == 2)
adapter.removeVideoQualityListener(Track(uid: first.uid))
first.emit()
second.emit()
precondition(first.listeners.isEmpty && second.listeners.count == 1 && adapter.reports == 3)
adapter.removeVideoQualityListeners()
adapter.removeVideoQualityListeners()
second.emit()
precondition(second.listeners.isEmpty && adapter.reports == 3)

let retainedTrack = Track(uid: 3)
var transient: Adapter? = Adapter()
weak var releasedAdapter = transient
transient?.addVideoQualityListener(retainedTrack)
transient = nil
precondition(releasedAdapter == nil)
retainedTrack.emit()
`,
  );
  const result = spawnSync('swift', [fixture], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
});

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
