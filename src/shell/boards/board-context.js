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

import { createContext } from 'react';

const BoardValueContext = createContext({
	boards: {},
	currentBoard: 0,
	largeView: false,
	minimized: false
});
const BoardSetterContext = createContext({
	addBoard: (url, title) => undefined,
	removeBoard: (key) => undefined,
	removeCurrentBoard: () => undefined,
	removeAllBoards: () => undefined,
	updateBoard: (key, url, title) => undefined,
	setCurrentBoard: (key) => undefined,
	toggleLargeView: () => undefined,
	toggleMinimized: () => undefined
});

export { BoardValueContext, BoardSetterContext };
