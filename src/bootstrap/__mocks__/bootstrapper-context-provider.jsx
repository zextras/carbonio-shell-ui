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

import React from 'react';
import BootstrapperContext from '../bootstrapper-context';
import FiberChannelFactory from '../../fiberchannel/fiber-channel';

const BootstrapperContextProvider = jest.fn().mockImplementation(({ children }) => {
	return (
		<BootstrapperContext.Provider
			value={{
				fiberChannelFactory: new FiberChannelFactory(),
				accountLoaded: false,
				accounts: []
			}}
		>
			{ children }
		</BootstrapperContext.Provider>
	);
});
export default BootstrapperContextProvider;
