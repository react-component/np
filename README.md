<div align="center">
  <h1>@rc-component/np</h1>
  <p><sub><a href="https://ant.design"><img alt="Ant Design" height="14" src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg" style="vertical-align: -0.125em;" /></a> Part of the Ant Design ecosystem.</sub></p>
  <p>🚀 Release helper for rc-component packages.</p>

  <p>
    <a href="https://npmjs.org/package/@rc-component/np"><img alt="NPM version" src="https://img.shields.io/npm/v/@rc-component/np.svg?style=flat-square"></a>
    <a href="https://npmjs.org/package/@rc-component/np"><img alt="npm downloads" src="https://img.shields.io/npm/dm/@rc-component/np.svg?style=flat-square"></a>
    <a href="https://bundlephobia.com/package/@rc-component/np"><img alt="bundle size" src="https://img.shields.io/bundlephobia/minzip/%40rc-component%2Fnp?style=flat-square"></a>
    <a href="https://github.com/react-component/np/actions/workflows/test.yml"><img alt="build status" src="https://github.com/react-component/np/actions/workflows/test.yml/badge.svg"></a>
    <a href="https://app.codecov.io/gh/react-component/np"><img alt="Codecov" src="https://img.shields.io/codecov/c/github/react-component/np/master.svg?style=flat-square"></a>
  </p>
</div>

<p align="center">English | <a href="./README.zh-CN.md">简体中文</a></p>

## Highlights

| Area    | Support                                   |
| ------- | ----------------------------------------- |
| Purpose | Release helper for rc-component packages. |
| Package | `@rc-component/np`                        |
| Release | `@rc-component/np` / `rc-np`              |

## Install

```bash
npm install @rc-component/np --save-dev
```

## Usage

```bash
npx rc-np
```

## API

| Command | Description                        |
| ------- | ---------------------------------- |
| `rc-np` | Run the rc-component release flow. |

## Development

```bash
npm install
npm run compile
npm run test:only
```

## Release

Maintainers can run the publish guard before releasing this package:

```bash
npm run prepublishOnly
```

This package is the release helper itself, so the guard only verifies the build before publishing.

## License

@rc-component/np is released under the [MIT](./LICENSE) license.
