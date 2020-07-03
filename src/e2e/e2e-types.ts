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

import ShellDb from '../db/shell-db';
import ShellNetworkService from '../network/shell-network-service';
import { IFiberChannelFactory } from '../fiberchannel/fiber-channel-types';
import I18nFactory from '../i18n/i18n-factory';

export type E2EContext = {
	db: ShellDb;
	shellNetworkService: ShellNetworkService;
	fiberChannelFactory: IFiberChannelFactory;
	i18nFactory: I18nFactory;
};
