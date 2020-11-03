/*
 * *** BEGIN LICENSE BLOCK *****
 * Copyright (C) 2011-2020 Zextras
 *
 *  The contents of this file are subject to the Zextras EULA;
 * you may not use this file except in compliance with the EULA.
 * You may obtain a copy of the EULA at
 * http://www.zextras.com/zextras-eula.html
 * *** END LICENSE BLOCK *****
 */

import setLoginData from './set-login-data';
import { E2EContext } from './e2e-types';

let ctxtCache: E2EContext;
let e2eSetupCompleted = false;

interface IE2eInstrumentedWindow extends Window {
	e2e: e2eNamespace;
	cliSettings: cliSettingsNamespace;
}

function installOnWindow(wnd: Window, ctxt: E2EContext): void {
	if (!ctxtCache && ctxt) ctxtCache = ctxt;
	// Expose the instruments
	// eslint-disable-next-line no-param-reassign
	(wnd as unknown as IE2eInstrumentedWindow).e2e = {
		setLoginData: (): Promise<void> => setLoginData(ctxt),
		installOnWindow: (w: Window, _c?: E2EContext): void => installOnWindow(w, _c || ctxtCache),
		getMSWorker: (): any | undefined => ctxtCache.mswjs,
		setupCompleted: (): void => {
			e2eSetupCompleted = true;
		}
	};
	console.debug('e2e Utils installed.');
}

export default function (ctxt: E2EContext): Promise<void> {
	return Promise.resolve()
		.then(() => installOnWindow(window, ctxt));
}

export function setCliSettings(cliSettings: cliSettingsNamespace): cliSettingsNamespace {
	(window as unknown as IE2eInstrumentedWindow).cliSettings = cliSettings;
	return cliSettings;
}

export function waitForE2ESetupCompleted(): Promise<void> {
	return new Promise(((resolve, reject) => {
		let count = 0;
		const interval = setInterval(() => {
			if (e2eSetupCompleted) {
				clearInterval(interval);
				resolve();
			}
			else {
				// eslint-disable-next-line no-plusplus
				count++;
				if (count > 100) {
					reject(new Error('Timeout on waiting e2e setup'));
				}
			}
		}, 100) as unknown as number;
	}));
}
