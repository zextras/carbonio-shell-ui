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

import React, { lazy } from 'react';
import BootstrapperRouter from './bootstrapper-router';
import BootstrapperContextProvider from './bootstrapper-context-provider';
// TODO: Can be loaded asynchronously
import ShellDb from '../db/shell-db';
import ShellNetworkService from '../network/shell-network-service';
import FiberChannelFactory from '../fiberchannel/fiber-channel';
import I18nProvider from '../i18n/i18n-provider';
import I18nFactory from '../i18n/i18n-factory';

export default function bootstrapper(onBeforeBoot) {
	const shellDb = new ShellDb();

	return shellDb.open()
		.then((db) => {
			const fiberChannelFactory = new FiberChannelFactory();
			const shellNetworkService = new ShellNetworkService(
				shellDb,
				fiberChannelFactory
			);
			const i18nFactory = new I18nFactory(fiberChannelFactory);
			return {
				db,
				shellNetworkService,
				fiberChannelFactory,
				i18nFactory
			};
		})
		.then((container) => {
			if (onBeforeBoot) {
				return onBeforeBoot(container)
					.then(() => container)
					.catch((err) => {
						throw err;
					});
			}
			return container;
		})
		.then(({
			db,
			shellNetworkService,
			fiberChannelFactory,
			i18nFactory
		}) => ({
			default: () => (
				<BootstrapperContextProvider
					shellDb={db}
					shellNetworkService={shellNetworkService}
					fiberChannelFactory={fiberChannelFactory}
					i18nFactory={i18nFactory}
				>
					<I18nProvider i18n={i18nFactory.getShellI18n()}>
						<BootstrapperRouter />
					</I18nProvider>
				</BootstrapperContextProvider>
			)
		}));
}
