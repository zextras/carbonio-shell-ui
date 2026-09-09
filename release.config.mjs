/*
 * SPDX-FileCopyrightText: 2026 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

/**
 * @type {import('semantic-release').GlobalConfig}
 */
export default {
	branches: ['main'],
	plugins: [
		[
			'@semantic-release/commit-analyzer',
			{
				preset: 'conventionalcommits',
				releaseRules: [
					// the breaking rule is required: as soon as a custom rule matches (e.g. refactor→patch) the default
					// rules are no longer evaluated, so without it a breaking refactor would only get a patch
					{ breaking: true, release: 'major' },
					// enable release also for refactor and build commits
					{ type: 'refactor', release: 'patch' },
					{ type: 'build', release: 'patch' },
					{ type: 'ci', release: 'patch' },
					{ type: 'perf', release: 'patch' },
					// dependency bumps change the published artifact, so they deserve a patch;
					// the scope is required: a bare `chore:` has scope null and never matches these rules
					{ type: 'chore', scope: 'deps', release: 'patch' },
					{ type: 'chore', scope: 'deps-dev', release: 'patch' }
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
						},
						// only the dependency scopes are listed, so every other chore (chore(release) included)
						// finds no entry and stays out of the changelog
						{
							type: 'chore',
							scope: 'deps',
							section: 'Other changes',
							hidden: false
						},
						{
							type: 'chore',
							scope: 'deps-dev',
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
