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

import React, { useMemo } from 'react';
import FiberChannelContext from './FiberChannelContext';

const FiberChannelContextProvider = ({ fiberChannelService, children }) => {

	const internalFC = useMemo(() => fiberChannelService.getInternalFC(), [fiberChannelService]);
	const internalFCSink = useMemo(() => fiberChannelService.getInternalFCSink(), [fiberChannelService]);
	const getFiberChannelForExtension = useMemo(() => (name) => fiberChannelService.getFiberChannelForExtension(name), [fiberChannelService]);
	const getFiberChannelSinkForExtension = useMemo(() => (name, version) => fiberChannelService.getFiberChannelSinkForExtension(name, version), [fiberChannelService]);

	return (
		<FiberChannelContext.Provider
			value={{
				internalFC,
				internalFCSink,
				getFiberChannelForExtension,
				getFiberChannelSinkForExtension
			}}
		>
			{ children }
		</FiberChannelContext.Provider>
	);
};
export default FiberChannelContextProvider;
