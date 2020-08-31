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

declare const PACKAGE_VERSION: string;
declare const PACKAGE_NAME: string;
declare const FLAVOR: 'APP'|'E2E'|'NPM';

type e2eNamespace = {
	setLoginData(): Promise<void>;
	installOnWindow(wnd: Window, ctxt?: any /* E2EContext */): void;
	loadMockedApi(path: string): Promise<void>;
	setupCompleted(): void;
};

type cliSettingsNamespace = {
	isE2E?: boolean;
	server?: string;
	app_package?: {
		package: string;
		name: string;
		label: string;
		version: string;
		description: string;
		type: string;
	};
};

/**
 * Installed only on 'e2e' and 'npm' package.
 */
declare const e2e: e2eNamespace;
declare const cliSettings: cliSettingsNamespace;
