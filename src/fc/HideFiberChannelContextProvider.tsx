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

const FiberChannelContextProvider: FC<{}> = ({ children }) => {

	return (
		<FiberChannelContext.Provider
			value={{
				internalFC: undefined!,
				internalFCSink: undefined!,
				getFiberChannelForExtension: undefined!,
				getFiberChannelSinkForExtension: undefined!,
			}}
		>
			{children}
		</FiberChannelContext.Provider>
	);
};
export default FiberChannelContextProvider;
