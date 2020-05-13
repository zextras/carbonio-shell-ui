/*
 * *** BEGIN LICENSE BLOCK *****
 * Copyright (C) 2011-2020 ZeXtras
 *
 * The contents of this file are subject to the ZeXtras EULA;
 * you may not use this file except in compliance with the EULA.
 * You may obtain a copy of the EULA at
 * http://www.zextras.com/zextras-eula.html
 * *** END LICENSE BLOCK *****
 */

import setLoginData from './set-login-data';
import {
	addMockedResponse,
	install as installMockableFetch,
	throwErrorIfRequestNotMocked
} from './mockable-fetch';

interface e2eInstrumentedWindow extends Window {
	e2e: e2eNamespace;
	devtools: devtoolsNamespace;
}

function installOnWindow(wnd: Window): void {
	// Inject the instruments for the e2e tests
	installMockableFetch(wnd);
	// Expose the instruments
	(wnd as unknown as e2eInstrumentedWindow)['devtools'] = {};
	(wnd as unknown as e2eInstrumentedWindow)['e2e'] = {
		setLoginData,
		addMockedResponse,
		throwErrorIfRequestNotMocked,
		installOnWindow
	};
	console.warn('e2e Utils installed.');
}

export default function() {
	return Promise.resolve()
		.then(() => {
			installOnWindow(window)
		});
}

export function waitForAppPackage(): Promise<void> {
	return new Promise((resolve, reject) => {
		const startTime = Date.now();
		let intervalId: number;
		function checkAndReturn() {
			if ((Date.now()) - (startTime + 30000) > 0 || (typeof devtools !== 'undefined' && typeof devtools.app_package !== 'undefined')) {
				clearInterval(intervalId);
				if (typeof devtools.app_package !== 'undefined') {
					resolve();
				}
				else {
					reject(new Error('Development App package was not set in 30s.'));
				}
			}
		}

		intervalId = setInterval(() => checkAndReturn(), 100) as unknown as number;
	});
}
