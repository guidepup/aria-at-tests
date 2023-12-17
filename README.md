<h1 align="center">Guidepup ARIA-AT Tests</h1>
<p align="center">
  <i>Guidepup compatibility against <a href="https://github.com/w3c/aria-at">ARIA-AT test suite</a>.</i>
</p>
<p align="center">
  <a href="https://github.com/guidepup/aria-at-tests/blob/main/LICENSE"><img alt="@guidepup/aria-at-tests uses the MIT license" src="https://img.shields.io/github/license/guidepup/aria-at-tests" /></a>
</p>

## Getting Started

Setup your environment for screen-read automation with [`@guidepup/setup`](https://github.com/guidepup/setup):

```bash
npx @guidepup/setup
```

Then install the project dependencies and run the Playwright suite against the ARIA-AT tests:

```console
yarn install --frozen-lockfile
yarn test:install
yarn test:generate

# Run against MacOS VoiceOver Suite
yarn test ./src/macOsVoiceOver.spec.ts --config macos.config.ts

# Run against Windows NVDA Suite
yarn test ./src/windowsNvda.spec.ts --config windows.config.ts
```
