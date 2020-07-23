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

import { createContext, useContext } from 'react';

const ShellContext = createContext({
	isMobile: true,
	boards: [],
	currentBoard: 0,
	largeView: false,
	minimized: false,
	addBoard: (board) => undefined,
	removeBoard: (idx) => undefined,
	removeAllBoards: () => undefined,
	updateBoard: (idx, url) => undefined,
	setCurrentBoard: (idx) => undefined,
	toggleLargeView: () => undefined,
	toggleMinimized: () => undefined
});

export function useIsMobile() {
	const { isMobile } = useContext(ShellContext);
	return isMobile;
}

/**
 * use the fiberchannel in a Shell context.
 * @returns {{fiberChannelSink, fiberChannel}}
 */
export function useFiberChannel() {
	const { fiberChannelSink, fiberChannel } = useContext(ShellContext);
	return { fiberChannelSink, fiberChannel };
}

export default ShellContext;
