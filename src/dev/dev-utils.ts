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

import { DevUtilsContext } from './dev-types';

let ctxtCache: DevUtilsContext;

interface IDevUtilsInstrumentedWindow extends Window {
	devUtils: devUtilsNamespace;
	cliSettings: cliSettingsNamespace;
}

function installOnWindow(wnd: Window, ctxt: DevUtilsContext): void {
	if (!ctxtCache && ctxt) ctxtCache = ctxt;
	// Expose the instruments
	// eslint-disable-next-line no-param-reassign
	(wnd as unknown as IDevUtilsInstrumentedWindow).devUtils = {
		installOnWindow: (w: Window, _c?: DevUtilsContext): void => installOnWindow(w, _c || ctxtCache),
		getMSWorker: (): any | undefined => ctxtCache.mswjs,
	};
	console.debug('Dev Utils installed.');
}

export default function (ctxt: DevUtilsContext): Promise<void> {
	return Promise.resolve()
		.then(() => installOnWindow(window, ctxt));
}

export function setCliSettings(cliSettings: cliSettingsNamespace): cliSettingsNamespace {
	(window as unknown as IDevUtilsInstrumentedWindow).cliSettings = cliSettings;
	return cliSettings;
}
