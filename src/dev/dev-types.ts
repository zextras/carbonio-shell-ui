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

import { SetupWorkerApi } from 'msw/lib/types/setupWorker/setupWorker';
import ShellNetworkService from '../network/shell-network-service';
import I18nFactory from '../i18n/i18n-factory';

export type DevUtilsContext = {
	shellNetworkService: ShellNetworkService;
	i18nFactory: I18nFactory;
	mswjs?: SetupWorkerApi;
};
