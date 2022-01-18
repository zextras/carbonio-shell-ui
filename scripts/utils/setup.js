/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

/* eslint-disable import/extensions */
const { execSync } = require('child_process');
const { pkg } = require('./pkg');

const prefix = '/static/iris/';
const commitHash = execSync('git rev-parse HEAD').toString().trim();
const basePath = `${prefix}${pkg.zapp.name}/${commitHash}/`;
const shellHash = execSync('cat node_modules/@zextras/carbonio-shell-ui/dist/commit').toString().trim();

exports.buildSetup = {
	commitHash,
	prefix,
	basePath,
	shellHash
};
