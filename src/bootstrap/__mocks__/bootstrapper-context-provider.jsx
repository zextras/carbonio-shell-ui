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

jest.mock('../../store/create-shell-store');

import ShellNetworkService from '../../network/shell-network-service';

jest.mock('../../i18n/i18n-factory');
// eslint-disable-next-line
import React, { useMemo } from 'react';// eslint-disable-next-line
import BootstrapperContext from '../bootstrapper-context';// eslint-disable-next-line
import FiberChannelFactory from '../../fiberchannel/fiber-channel';// eslint-disable-next-line
import I18nFactory from '../../i18n/i18n-factory';
import StoreFactory from '../../store/store-factory';
import createShellStore from '../../store/create-shell-store';

const BootstrapperContextProvider = jest.fn().mockImplementation(({ children }) => {
	const ctxt = useMemo(() => {
		const { shellStore } = createShellStore(false);
		const fiberChannelFactory = new FiberChannelFactory();
		const i18nFactory = new I18nFactory();
		const shellNetworkService = new ShellNetworkService(
			shellStore,
			fiberChannelFactory
		);
		const storeFactory = new StoreFactory();
		return {
			fiberChannelFactory,
			i18nFactory,
			shellNetworkService,
			storeFactory,
		};
	}, []);

	return (
		<BootstrapperContext.Provider
			value={ctxt}
		>
			{ children }
		</BootstrapperContext.Provider>
	);
});
export default BootstrapperContextProvider;
