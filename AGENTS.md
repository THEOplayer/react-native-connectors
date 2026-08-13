# AGENTS.md

Guidance for coding agents working in this repository. Keep it short and factual; if something here
turns out to be wrong, fix this file in the same PR.

## What this repo is

An npm-workspaces monorepo of connectors for
[`react-native-theoplayer`](https://github.com/THEOplayer/react-native-theoplayer): analytics
integrations (`adobe`, `adobe-edge`, `adscript`, `agama`, `bitmovin`, `comscore`, `conviva`,
`gemius`, `mux`, `nielsen`, `npaw`, `youbora`), plus `drm`, `engage` and `yospace`. Each top-level
directory is a published package; `apps/e2e` is the React Native test app and `apps/engage-example`
a sample app.

Each connector typically has:

- `src/api` — public API re-exported from `src/index.ts` (this is what typedoc documents).
- `src/internal` — implementation, split per platform: a shared `*Adapter.ts` interface with
  `*AdapterNative.ts` (Android/iOS bridge) and `*AdapterWeb.ts` (browser SDK) implementations, the
  latter usually under `src/internal/web`.
- `android/` (Kotlin/Java), `ios/` + `*.podspec` (Swift/Obj-C) for native connectors.
- Build via `react-native-builder-bob` (`npm run build` → `lib/`); `npm run prepare` also
  regenerates `src/manifest.json`.

Node 22 is used in CI.

## Commands

Run from the repo root unless stated otherwise.

| Task | Command | Notes |
| --- | --- | --- |
| Install | `npm ci --workspaces --include-workspace-root` | |
| Build all packages | `npm run build` | bob build per workspace |
| Docs check ("root tests") | `npm test` | alias for `npm run test:docs` → typedoc with `--treatWarningsAsErrors`; **not** a unit-test run |
| Lint | `npm run lint` / `npm run lint:fix` | eslint over `*/{src,test}` |
| Format | `npm run prettier` / `npm run prettier:fix` | prettier `--check`; single quotes, trailing commas, print width 150 |
| Unit tests (per package) | `cd adobe-edge && npm test` | jest + ts-jest; see below |
| Typecheck (per package) | `cd adobe-edge && npm run typescript` | `tsc --noEmit` |
| E2E app | `cd apps/e2e && npm run test:e2e:android` / `test:e2e:ios` / `test:e2e:tvos` | CavyNext, needs an emulator/simulator |
| E2E app (web) | `cd apps/e2e && npm run test:e2e:web` | webpack dev server + CavyNext; opens your default browser. Set `E2E_HEADLESS=true` for headless Chrome (what CI does) |

Gotchas worth knowing before you claim "tests pass":

- **The root `npm test` is a documentation check, not a test suite.** It fails on typedoc warnings
  (e.g. an exported symbol that is not documented or not reachable from `src/index.ts`).
- **Unit tests exist in only some packages.** At the time of writing, `adobe-edge` is the only
  workspace with a `test` script (`jest.config.js` + `src/**/__tests__`). Adding tests to other
  connectors is welcome; copy the `adobe-edge` setup.
- **`npm run prettier` at the root is currently red on pre-existing files** under `comscore/`,
  `drm/` and `engage/`. Do not reformat those as a side effect of an unrelated change; only ensure
  the files you touched are formatted (the commit hook does this for staged files via
  husky + lint-staged).
- `npm run lint` currently reports warnings (e.g. `@typescript-eslint/no-explicit-any`,
  unused vars). Errors must be zero; do not mass-fix unrelated warnings in a feature PR.

## What CI actually verifies

- `pr_web.yml`: install, `npm run build`, `npm test` (docs check), plus the CavyNext e2e suite in
  headless Chrome (`E2E_HEADLESS=true npm run test:e2e:web`). No jest, no tsc per package, no lint,
  no prettier.
- `pr_android.yml` / `pr_ios.yml`: install, build, docs check, then build the `apps/e2e` app against
  `react-native-theoplayer@latest` and run the CavyNext e2e suite on an emulator/simulator
  (Android API 36; iOS + tvOS on Xcode 26.2). These are skipped for draft PRs.
- `release.yml` (on `main`): changesets action opens/updates a "Release" PR or publishes to npm.

Consequence for agents: green CI does **not** mean the package's unit tests or typecheck passed. Run
`npm test` and `npm run typescript` inside the package you changed, locally, and say so in the PR.

## Conventions

- **Changesets are required** for any user-facing change: add a markdown file under `.changeset/`
  naming the affected package(s) and a semver bump, e.g.

  ```md
  ---
  '@theoplayer/react-native-analytics-adobe-edge': patch
  ---

  Fixed <what the user observes>, which happened because <cause>.
  ```

  No changeset means the fix ships without a version bump or changelog entry. Internal-only changes
  (tests, CI, docs) don't need one.
- **Player/SDK version support** is expressed through peerDependencies, typically
  `react-native-theoplayer: ^10 || ^11` and `theoplayer: ^10 || ^11` (THEOplayer 10/11 are branded
  OptiView). Don't tighten or widen these ranges casually — it is a breaking change for consumers.
- **Public API changes must stay documented**: everything exported from `src/index.ts` is fed to
  typedoc with warnings-as-errors, so add TSDoc for new public symbols or the docs check fails.
- Keep platform-specific code behind the adapter split rather than branching on `Platform.OS` in
  shared code.
- Commit hooks (`.husky/pre-commit` → `lint-staged`) run prettier on staged files. Don't bypass them
  with `--no-verify`.

## E2E app on web

`apps/e2e` runs on react-native-web through webpack (`web/webpack.config.js`). Things that are easy
to get wrong:

- CavyNext only accepts entry files ending in `.js`, and swaps `index.web.js` for
  `index.test.web.js` while running (restoring it on exit). Keep both as thin wrappers around
  `web/app.web.tsx` / `web/test.web.tsx`; if a run is interrupted you may find a leftover
  `index.notest.js` that has to be renamed back.
- THEOplayer worker/iframe assets are copied to `libraryLocation` from the `theoplayer` package
  resolved **from `apps/e2e`**, not from the workspace root: the app can hoist a different version,
  and mismatched workers fail at runtime with "THEOplayer workers could not be loaded".
- The web player needs `mutedAutoplay` and a `libraryLocation` to autoplay in a headless browser;
  see `src/TestableApp.tsx`.
- Headless runs use a dedicated Chrome profile so they don't join an already running browser —
  a second window in an existing instance shows up as "an extra app connection" and the run hangs.

## Unit tests (adobe-edge, as the reference setup)

`adobe-edge/src/internal/web/__tests__` shows the intended pattern for web-connector tests:

- `mocks/alloy.ts` mocks `@adobe/alloy`'s `createInstance`/media tracker; `mocks/player.ts` provides
  a minimal event-emitting player stub, so tests drive behaviour by emitting player events
  (`loadedmetadata`, `sourcechange`, …).
- Async edge SDK behaviour is driven with explicit deferreds plus a `flushMicrotasks()` helper
  (a `MessageChannel` round-trip) and `jest.useFakeTimers()` /
  `jest.advanceTimersByTimeAsync()` for retry/backoff logic.
- Mock implementations returning heterogeneous promises usually need an explicit `: any` return
  annotation to satisfy `tsc --noEmit`.

Third-party SDK behaviour is best verified against the pinned dependency in `node_modules` (e.g.
`node_modules/@adobe/alloy/dist/alloy.js`) rather than from memory — vendor docs and the shipped
implementation do diverge.

## PRs

- Reference the customer-visible symptom, not just the code change, and include the changeset.
- State which package-level checks you ran (`npm test`, `npm run typescript`) since CI won't.
- Don't include unrelated formatting churn.
