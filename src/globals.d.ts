/*
 * *** BEGIN LICENSE BLOCK *****
 * Copyright (C) 2011-2021 Zextras
 *
 *  The contents of this file are subject to the Zextras EULA;
 * you may not use this file except in compliance with the EULA.
 * You may obtain a copy of the EULA at
 * http://www.zextras.com/zextras-eula.html
 * *** END LICENSE BLOCK *****
 */

declare const PACKAGE_VERSION: string;
declare const PACKAGE_NAME: string;
declare const FLAVOR: 'APP' | 'NPM';
declare const BASE_PATH: string;
declare const WATCH_SERVER: { host: string; user: string; pw: string; s };

type devUtilsNamespace = {
	installOnWindow(wnd: Window, ctxt?: any /* DevUtilsContext */): void;
	// getMSWorker<T /* SetupWorkerApi */>(): T | undefined;
};

type cliSettingsNamespace = {
	server?: string;
	enableErrorReporter?: boolean;
	hasHandlers?: boolean;
	isWatch: boolean;
	isStandalone: boolean;
	// eslint-disable-next-line camelcase
	app_package: {
		package: string;
		name: string;
		label: string;
		version: string;
		description: string;
		type: 'theme' | 'app';
	};
};

/**
 * Installed only on 'npm' package.
 */
declare const devUtils: devUtilsNamespace | undefined;
declare const cliSettings: cliSettingsNamespace | undefined;
declare module '@zextras/zapp-ui';
