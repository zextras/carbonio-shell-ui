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

import { createContext, useContext } from 'react';

const ShellContext = createContext({ isMobile: true });

/**
 * use the fiberchannel in a Shell context.
 * @returns {{fiberChannelSink, fiberChannel}}
 */
export function useFiberChannel() {
	const { fiberChannelSink, fiberChannel } = useContext(ShellContext);
	return { fiberChannelSink, fiberChannel };
}

export default ShellContext;
