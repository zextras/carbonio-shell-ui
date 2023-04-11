/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

module.exports = {
	process(sourceText, sourcePath) {
		return {
			code: `module.exports = ${JSON.stringify(path.basename(sourcePath))};`
		};
	}
};
