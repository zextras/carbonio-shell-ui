/*
 * *** BEGIN LICENSE BLOCK *****
 * Copyright (C) 2011-2019 ZeXtras
 *
 * The contents of this file are subject to the ZeXtras EULA;
 * you may not use this file except in compliance with the EULA.
 * You may obtain a copy of the EULA at
 * http://www.zextras.com/zextras-eula.html
 * *** END LICENSE BLOCK *****
 */

import React, { FC } from 'react';

import FiberChannelContext from './FiberChannelContext';
import FiberChannelService from './FiberChannelService';

interface IFCContextProviderProps {
	fiberChannelService: FiberChannelService;
}

const FiberChannelContextProvider: FC<IFCContextProviderProps> = ({ fiberChannelService, children }) => {

	return (
		<FiberChannelContext.Provider
			value={{
				internalFC: fiberChannelService.getInternalFC(),
				internalFCSink: fiberChannelService.getInternalFCSink(),
				getFiberChannelForExtension: (name: string) => fiberChannelService.getFiberChannelForExtension(name),
				getFiberChannelSinkForExtension: (name: string, version: string) => fiberChannelService.getFiberChannelSinkForExtension(name, version),
			}}
		>
			{children}
		</FiberChannelContext.Provider>
	);
};
export default FiberChannelContextProvider;
