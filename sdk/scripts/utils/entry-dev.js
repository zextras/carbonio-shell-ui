/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

function bootHandlers() {
	const handlersEntrypoint = require('app-handlers');

	const handlers = (handlersEntrypoint && handlersEntrypoint.default) || handlersEntrypoint;
	window.__ZAPP_HMR_HANDLERS__[PACKAGE_NAME](handlers);
}

if (HAS_HANDLERS) {
	bootHandlers();
}

if (module.hot) {
	if (HAS_HANDLERS) {
		module.hot.accept('app-handlers', bootHandlers);
	}
}

import './entry';
