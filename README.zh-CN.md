<div align="center">
  <h1>@rc-component/np</h1>
  <p><sub><a href="https://ant.design"><img alt="Ant Design" height="14" src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg" style="vertical-align: -0.125em;" /></a> Ant Design 生态的一部分。</sub></p>
  <p>🚀 rc-component 包使用的发布辅助工具。</p>

  <p>
    <a href="https://npmjs.org/package/@rc-component/np"><img alt="NPM version" src="https://img.shields.io/npm/v/@rc-component/np.svg?style=flat-square"></a>
    <a href="https://npmjs.org/package/@rc-component/np"><img alt="npm downloads" src="https://img.shields.io/npm/dm/@rc-component/np.svg?style=flat-square"></a>
    <a href="https://bundlephobia.com/package/@rc-component/np"><img alt="bundle size" src="https://img.shields.io/bundlephobia/minzip/%40rc-component%2Fnp?style=flat-square"></a>
    <a href="https://github.com/react-component/np/actions/workflows/test.yml"><img alt="build status" src="https://github.com/react-component/np/actions/workflows/test.yml/badge.svg"></a>
    <a href="https://app.codecov.io/gh/react-component/np"><img alt="Codecov" src="https://img.shields.io/codecov/c/github/react-component/np/master.svg?style=flat-square"></a>
  </p>
</div>

<p align="center">简体中文 | <a href="./README.md">English</a></p>

## 亮点

| 方向 | 支持                                |
| ---- | ----------------------------------- |
| 定位 | rc-component 包使用的发布辅助工具。 |
| 包名 | `@rc-component/np`                  |
| 发布 | `@rc-component/np` / `rc-np`        |

## 安装

```bash
npm install @rc-component/np --save-dev
```

## 用法

```bash
npx rc-np
```

## API

| 名称    | 说明                         |
| ------- | ---------------------------- |
| `rc-np` | 运行 rc-component 发布流程。 |

## 本地开发

```bash
ut install
npm run compile
npm run test:only
```

## 发布

维护者发布此包前可以运行发布校验：

```bash
npm run prepublishOnly
```

这个包本身就是发布辅助工具，所以发布校验只检查构建产物。

## 许可证

@rc-component/np 基于 [MIT](./LICENSE) 协议发布。
