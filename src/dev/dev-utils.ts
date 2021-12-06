/*
 * SPDX-FileCopyrightText: 2021 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

// import { DevUtilsContext } from '../../types';

let ctxtCache: unknown; // DevUtilsContext;

interface IDevUtilsInstrumentedWindow extends Window {
	devUtils: devUtilsNamespace;
	cliSettings: cliSettingsNamespace;
}

function installOnWindow(wnd: Window, ctxt: unknown /* DevUtilsContext */): void {
	if (!ctxtCache && ctxt) ctxtCache = ctxt;
	// Expose the instruments
	// eslint-disable-next-line no-param-reassign
	(wnd as unknown as IDevUtilsInstrumentedWindow).devUtils = {
		installOnWindow: (w: Window, _c?: unknown /* DevUtilsContext */): void =>
			installOnWindow(w, _c || ctxtCache)
		// getMSWorker: (): any | undefined => ctxtCache.mswjs
	};
	console.debug('Dev Utils installed.');
}

export default function (ctxt: unknown /* DevUtilsContext */): Promise<void> {
	return Promise.resolve().then(() => installOnWindow(window, ctxt));
}

export function setCliSettings(cliSettings: cliSettingsNamespace): cliSettingsNamespace {
	(window as unknown as IDevUtilsInstrumentedWindow).cliSettings = cliSettings;
	return cliSettings;
}
