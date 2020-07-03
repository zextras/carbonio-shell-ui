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
import { E2EContext } from './e2e-types';

let ctxtCache: E2EContext;

interface IE2eInstrumentedWindow extends Window {
	e2e: e2eNamespace;
	cliSettings: cliSettingsNamespace;
}

function installOnWindow(wnd: Window, ctxt: E2EContext): void {
	if (!ctxtCache && ctxt) ctxtCache = ctxt;
	// Inject the instruments for the e2e tests
	installMockableFetch(wnd);
	// Expose the instruments
	(wnd as unknown as IE2eInstrumentedWindow)['e2e'] = {
		setLoginData: () => setLoginData(ctxt),
		addMockedResponse,
		throwErrorIfRequestNotMocked,
		installOnWindow: (w: Window, ctxt?: E2EContext) => installOnWindow(w, ctxt || ctxtCache),
	};
	console.debug('e2e Utils installed.');
}

export default function(ctxt: E2EContext) {
	return Promise.resolve()
		.then(() => installOnWindow(window, ctxt));
}

export function setCliSettings(cliSettings: cliSettingsNamespace): cliSettingsNamespace {
	(window as unknown as IE2eInstrumentedWindow).cliSettings = cliSettings;
	return cliSettings;
}
