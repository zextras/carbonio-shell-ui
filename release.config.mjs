/*
 * SPDX-FileCopyrightText: 2026 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

/**
 * @type {import('semantic-release').GlobalConfig}
 */
export default {
	branches: ['devel'],
	plugins: [
		[
			'@semantic-release/commit-analyzer',
			{
				preset: 'conventionalcommits',
				releaseRules: [
					// breaking changes must be first, otherwise a type rule (e.g. refactor→patch) would match first and suppress the major bump
					{ breaking: true, release: 'major' },
					// enable release also for refactor and build commits
					{ type: 'refactor', release: 'patch' },
					{ type: 'build', release: 'patch' },
					{ type: 'ci', release: 'patch' },
					{ type: 'perf', release: 'patch' }
				]
			}
		],
		[
			'@semantic-release/release-notes-generator',
			{
				preset: 'conventionalcommits',
				presetConfig: {
					// see https://github.com/conventional-changelog/conventional-changelog-config-spec/blob/master/versions/2.2.0/README.md#types
					types: [
						{
							type: 'feat',
							section: 'Features',
							hidden: false
						},
						{
							type: 'fix',
							section: 'Bug Fixes',
							hidden: false
						},
						{
							type: 'refactor',
							section: 'Other changes',
							hidden: false
						},
						{
							type: 'perf',
							section: 'Other changes',
							hidden: false
						},
						{
							type: 'build',
							section: 'Other changes',
							hidden: false
						},
						{
							type: 'ci',
							section: 'Other changes',
							hidden: false
						}
					]
				}
			}
		],
		'@semantic-release/npm',
		['@semantic-release/changelog', { changelogFile: 'CHANGELOG.md' }],
		[
			'@semantic-release/git',
			{
				assets: ['package.json', 'CHANGELOG.md'],
				message: 'chore(release): ${nextRelease.version} [skip ci]'
			}
		],
		'@semantic-release/github'
	]
};
