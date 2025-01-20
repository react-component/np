#!/usr/bin/env node

const path = require('path');
const semver = require('semver');
const chalk = require('chalk');
const simpleGit = require('simple-git');
const { confirm, select, input } = require('@inquirer/prompts');

const cwd = process.cwd();

const packagePath = path.resolve(cwd, 'package.json');

(async function () {
  // Check local git should not have uncommitted changes
  const git = simpleGit(cwd);
  const status = await git.status();

  if (status.files.length) {
    const confirmContinue = await confirm({
      default: false,
      message: '尚有未提交的变更，仍然继续？',
    });

    if (!confirmContinue) {
      process.exit(1);
    } else {
      console.log(chalk.yellow('继续操作，注意这可能是一种错误...'));
    }
  }

  // Read current version
  const pkg = require(packagePath);
  console.log('当前版本:', chalk.cyan(pkg.version));
  const nextPatchVersion = semver.inc(pkg.version, 'patch');
  const nextMinorVersion = semver.inc(pkg.version, 'minor');
  const nextMajorVersion = semver.inc(pkg.version, 'major');
  const nextAlphaVersion = semver.inc(pkg.version, 'prerelease', 'alpha');
  const nextBetaVersion = semver.inc(pkg.version, 'prerelease', 'beta');
  const nextRCVersion = semver.inc(pkg.version, 'prerelease', 'rc');

  const versions = Array.from(
    new Set([
      nextPatchVersion,
      nextMinorVersion,
      nextMajorVersion,
      nextAlphaVersion,
      nextBetaVersion,
      nextRCVersion,
      '自定义',
    ]),
  );

  let selectedVersion = await select({
    message: '选择发布版本:',
    choices: versions.map((version) => {
      return {
        value: version,
        name: version,
      };
    }),
  });

  if (selectedVersion === '自定义') {
    const customVersion = await input({
      message: '输入自定义版本号:',
    });
    selectedVersion = customVersion.trim();
  }

  // Valid selected version
  if (!semver.valid(selectedVersion)) {
    console.log(chalk.red('无效的版本号:', selectedVersion));
    process.exit(1);
  }

  console.log('发布版本:', chalk.cyan(selectedVersion));
})();

// const fs = require("fs-extra");

// const VER_FATHER = "father";
// const VER_PLUGIN = "@rc-component/father-plugin";
// const VER_ENZYME_ADAPTER = "enzyme-adapter-react-16";
// const RM_DEPS = ["jest", "father-build", "react-test-renderer"];

// const cwd = process.cwd();

// const pkg = require(path.resolve(cwd, "package.json"));

// // ==================================================================
// // Upgrade father version if exist
// const fatherVer = pkg.devDependencies[VER_FATHER];
// if (fatherVer) {
//   const fatherMajor = semver.major(semver.minVersion(fatherVer));

//   if (fatherMajor < 4) {
//     console.log("升级 father 至 v4...");
//     pkg.devDependencies[VER_FATHER] = "^4.0.0";
//     pkg.devDependencies[VER_PLUGIN] = "^1.0.0";

//     console.log("覆盖 .fatherrc...");
//     fs.writeFileSync(
//       path.resolve(cwd, ".fatherrc.js"),
//       `
// import { defineConfig } from 'father';

// export default defineConfig({
//   plugins: ['@rc-component/father-plugin'],
// });
// `.trim(),
//       "utf-8"
//     );

//     // Clean up father v2 hooks
//     console.log("清理遗留 pre-commit...");
//     fs.removeSync(path.resolve(cwd, ".git/hooks/pre-commit"));
//   }
// }

// // Check if exist enzyme
// const existEnzyme = pkg.devDependencies["enzyme"];
// if (existEnzyme) {
//   console.log("添加 enzyme adapter 依赖...");
//   pkg.devDependencies[VER_ENZYME_ADAPTER] = "^1.15.6";
// }

// // ==================================================================
// // tsconfig.json
// const tsConfigPath = path.resolve(cwd, "tsconfig.json");
// if (fs.existsSync(tsConfigPath)) {
//   console.log("更新 tsconfig jsx 配置为 'react'...");
//   const tsConfig = require(path.resolve(cwd, "tsconfig.json"));

//   tsConfig.compilerOptions.jsx = "react";

//   fs.writeFileSync(tsConfigPath, JSON.stringify(tsConfig, null, 2));
// }

// // ==================================================================
// // Update script
// pkg.scripts.test = "rc-test";

// // Remove origin test content
// RM_DEPS.forEach((dep) => {
//   delete pkg.devDependencies[dep];
// });

// fs.writeFileSync(
//   path.resolve(cwd, "package.json"),
//   JSON.stringify(pkg, null, 2),
//   "utf-8"
// );

// // ==================================================================
// // Print Tips
// console.log("");
// console.log("更新完成，请检查以下内容：");
// console.log(" - 更新 .github/workflows 中 CI node 版本至 16");
// console.log(
//   " - 移除 jest.config.js 中关于 @testing-library/jsdom 的 setupFilesAfterEnv 配置"
// );
// console.log(" - 重新安装依赖 node_modules");

// if (pkg.devDependencies["enzyme"]) {
//   console.log(" - （可选）移除 enzyme 测试，替换为 @testing-library/react");
// }
