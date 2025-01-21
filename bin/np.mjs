#!/usr/bin/env node

import path from 'path';
import semver from 'semver';
import chalk from 'chalk';
import simpleGit from 'simple-git';
import { confirm, select, input } from '@inquirer/prompts';
import fs from 'fs-extra';
import open from 'open';
import { htmlEscape } from 'escape-goat';

const cwd = process.cwd();

const packagePath = path.resolve(cwd, 'package.json');
const pkg = fs.readJsonSync(packagePath);

function getTag(version) {
  return `${pkg.name}@${version}`;
}

(async function () {
  // Check local git should not have uncommitted changes
  const git = simpleGit(cwd);
  const status = await git.status();

  // get git repo url
  const remote = await git.listRemote(['--get-url', 'origin']);
  const url = new URL(remote);
  const pathname = url.pathname.replace(/\.git$/, '');
  const repoUrl = `https://github.com${pathname}`;
  const releaseURLStr = `${repoUrl}/releases/new`;

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
  console.log('当前版本:', chalk.cyan(pkg.version));
  const nextPatchVersion = semver.inc(pkg.version, 'patch');
  const nextMinorVersion = semver.inc(pkg.version, 'minor');
  const nextMajorVersion = semver.inc(pkg.version, 'major');
  const nextPrereleaseVersion = semver.inc(pkg.version, 'prerelease');
  const nextAlphaVersion = semver.inc(pkg.version, 'prerelease', 'alpha');
  const nextBetaVersion = semver.inc(pkg.version, 'prerelease', 'beta');
  const nextRCVersion = semver.inc(pkg.version, 'prerelease', 'rc');

  // const currentTag = getTag(pkg.version);
  const currentTag = '@rc-component/np@1.0.0-1';

  const versions = Array.from(
    new Set([
      nextPatchVersion,
      nextMinorVersion,
      nextMajorVersion,
      nextPrereleaseVersion,
      nextAlphaVersion,
      nextBetaVersion,
      nextRCVersion,
      '不更改，直接发布',
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
  } else if (selectedVersion === '不更改，直接发布') {
    selectedVersion = pkg.version;
  }

  // Valid selected version
  if (!semver.valid(selectedVersion)) {
    console.log(chalk.red('无效的版本号:', selectedVersion));
    process.exit(1);
  }

  let nextTag = currentTag;
  if (selectedVersion !== pkg.version) {
    console.log('发布版本:', pkg.version, '->', chalk.cyan(selectedVersion));

    // Replace version
    const pkgText = await fs.readFile(packagePath, 'utf-8');
    const newPkgText = pkgText.replace(/"version":\s*"[^"]+"/, `"version": "${selectedVersion}"`);

    await fs.writeFile(packagePath, newPkgText, 'utf-8');

    // Commit and tag
    nextTag = getTag(selectedVersion);
    console.log(chalk.yellow('Commit and tag:'), nextTag);
    await git.add([packagePath]);
    await git.commit(`chore: bump version to ${selectedVersion}`);
    await git.addTag(nextTag);

    // Push tag
    console.log(chalk.yellow('Push origin...'));
    git.push(['origin']);
    git.push(['origin', '--tags']);
  }

  // Diff log from currentTag to nextTag
  const diff = await git.log({ from: currentTag, to: nextTag });
  const commits = diff.all;

  const commitLines = commits.map(
    ({ message, hash }) => `- ${htmlEscape(message)}  ${hash.slice(0, 7)}`,
  );
  const releaseNotes =
    commitLines.join('\n') + `\n\n---\n\n${repoUrl}/compare/${currentTag}...${nextTag}`;

  // Create github release
  const releaseURL = new URL(releaseURLStr);
  releaseURL.searchParams.set('tag', nextTag);
  releaseURL.searchParams.set('body', releaseNotes);

  if (semver.prerelease(selectedVersion)) {
    releaseURL.searchParams.set('prerelease', 'true');
  }

  await open(releaseURL.toString());
})();
