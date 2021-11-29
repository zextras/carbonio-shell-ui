/*
 * SPDX-FileCopyrightText: 2021 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { createContext } from 'react';

const BoardValueContext = createContext({
	boards: {},
	currentBoard: 0,
	largeView: false,
	minimized: false
});
const BoardSetterContext = createContext({
	addBoard: (url, title, context) => undefined,
	removeBoard: (key) => undefined,
	removeCurrentBoard: () => undefined,
	removeAllBoards: () => undefined,
	updateBoard: (key, url, title) => undefined,
	setCurrentBoard: (key) => undefined,
	updateCurrentBoard: (url, title) => undefined,
	toggleLargeView: () => undefined,
	toggleMinimized: () => undefined
});

export { BoardValueContext, BoardSetterContext };
