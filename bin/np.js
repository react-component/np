#!/usr/bin/env node

const path = require('path');
const semver = require('semver');
const chalk = require('chalk');
const simpleGit = require('simple-git');
const { confirm, select, input } = require('@inquirer/prompts');
const fs = require('fs-extra');

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
      console.log(chalk.yellow('继续操作，注意这可能是一种错误...'), '\n');
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

  console.log('发布版本:', pkg.version, '->', chalk.cyan(selectedVersion));

  // Replace version
  const pkgText = await fs.readFile(packagePath, 'utf-8');
  const newPkgText = pkgText.replace(/"version":\s*"[^"]+"/, `"version": "${selectedVersion}"`);

  await fs.writeFile(packagePath, newPkgText, 'utf-8');

  // Commit and tag
  const nextTag = `${pkg.name}@${selectedVersion}`;
  await git.add([packagePath]);
  await git.commit(`chore: bump version to ${selectedVersion}`);
  await git.addTag(nextTag);

  // Push tag
  git.push(['origin']);
  git.push(['origin', nextTag]);
})();
