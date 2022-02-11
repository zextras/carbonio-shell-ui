/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

declare const PACKAGE_VERSION: string;
declare const PACKAGE_NAME: string;
declare const FLAVOR: 'APP' | 'NPM';
declare const BASE_PATH: string;
declare const WATCH_SERVER: { host: string; user: string; pw: string; s };
declare const __SHELL_ENV__: 'carbonio' | 'carbonioAdmin' | 'carbonioStandalone';
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
declare module '@zextras/carbonio-design-system';
declare module 'tinymce';
declare module '*.svg';
