/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

const { readFileSync } = require('fs');
const path = require('path');

exports.pkg = JSON.parse(readFileSync(path.resolve(process.cwd(), 'package.json')));
