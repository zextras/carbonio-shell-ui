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

import React, { useMemo, useState, useLayoutEffect, useCallback } from 'react';
import { pickBy } from 'lodash';
import ShellContext from './shell-context';
import { useFiberChannelFactory } from '../bootstrap/bootstrapper-context';
import { useTranslation } from '../i18n/hooks';

export default function ShellContextProvider({ children }) {
	const { t } = useTranslation();
	const fiberChannelFactory = useFiberChannelFactory();
	const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerHeight > window.innerWidth : false);
	const [boards, setBoards] = useState({});
	const [currentBoard, setCurrentBoard] = useState(undefined);
	const [largeView, setLargeView] = useState(false);
	const [minimized, setMinimized] = useState(false);

	const handleResize = useCallback(({ target }) => {
			if (isMobile !== (target.innerHeight > target.innerWidth)) setIsMobile(target.innerHeight > target.innerWidth);
		},
		[isMobile, setIsMobile]
	);

	const addBoard = useCallback((boardUrl, boardTitle = t('New tab')) => {
		const key = String(Date.now() * (Math.floor(Math.random() * 1000) + 1));
		const newBoards = {...boards, [key]: { url: boardUrl, title: boardTitle }};
		setCurrentBoard(key);
		setBoards(newBoards);
		setMinimized(false);
	}, [boards, setBoards, setCurrentBoard, setMinimized]);

	const removeBoard = useCallback((idx) => {
		const boardKeys = Object.keys(boards);
		if (currentBoard === idx) {
			const removedBoardIndex = boardKeys.indexOf(idx);
			setCurrentBoard(boardKeys[removedBoardIndex > 0 ? removedBoardIndex - 1 : 1]);
		}
		if (boardKeys.length === 1) setLargeView(false);
		setBoards(pickBy(boards, (board, key) => key !== idx));
	}, [boards, setBoards, currentBoard, setCurrentBoard]);

	const removeAllBoards = useCallback(() => {
		setBoards({});
		setLargeView(false);
	}, [setBoards, setLargeView]);

	const updateBoard = useCallback((idx, boardUrl, boardTitle) => {
		const updatedBoards = {...boards};
		if (boardUrl) updatedBoards[idx].url = boardUrl;
		if (boardTitle) updatedBoards[idx].title = boardTitle;
		setBoards(updatedBoards);
	}, [boards, setBoards]);

	const toggleLargeView = useCallback(() => setLargeView((largeView) => !largeView), [setLargeView]);
	const toggleMinimized = useCallback(() => setMinimized((minimized) => !minimized), [setMinimized]);

	useLayoutEffect(() => {
		if (typeof window === 'undefined') return;
		window.addEventListener('resize', handleResize);
		return () => {
			window.removeEventListener('resize', handleResize);
		}
	}, [handleResize]);

	const value = useMemo(() => ({
		isMobile,
		boards,
		addBoard,
		removeBoard,
		removeAllBoards,
		updateBoard,
		currentBoard,
		setCurrentBoard,
		fiberChannelSink: fiberChannelFactory.getAppFiberChannelSink({ name: PACKAGE_NAME, version: PACKAGE_VERSION }),
		fiberChannel: fiberChannelFactory.getAppFiberChannel({ name: PACKAGE_NAME, version: PACKAGE_VERSION }),
		largeView,
		toggleLargeView,
		minimized,
		toggleMinimized
	}), [
		isMobile,
		boards,
		addBoard,
		removeBoard,
		removeAllBoards,
		updateBoard,
		currentBoard,
		setCurrentBoard,
		fiberChannelFactory,
		largeView,
		toggleLargeView,
		minimized,
		toggleMinimized
	]);

	return (
		<ShellContext.Provider
			value={value}
		>
			{ children }
		</ShellContext.Provider>
	);
}
