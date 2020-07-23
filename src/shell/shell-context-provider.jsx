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
import ShellContext from './shell-context';
import { useFiberChannelFactory } from '../bootstrap/bootstrapper-context';

export default function ShellContextProvider({ children }) {
	const fiberChannelFactory = useFiberChannelFactory();
	const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerHeight > window.innerWidth : false);
	const [boards, setBoards] = useState([]);
	const [currentBoard, setCurrentBoard] = useState(0);
	const [largeView, setLargeView] = useState(false);
	const [minimized, setMinimized] = useState(false);

	const handleResize = useCallback(({ target }) => {
			if (isMobile !== (target.innerHeight > target.innerWidth)) setIsMobile(target.innerHeight > target.innerWidth);
		},
		[isMobile, setIsMobile]
	);

	const addBoard = useCallback((board) => {
		const newBoards = [...boards, board];
		setBoards(newBoards);
		setCurrentBoard(newBoards.length - 1);
		setMinimized(false);
	}, [boards, setBoards, setCurrentBoard, setMinimized]);

	const removeBoard = useCallback((idx) => {
		if (currentBoard > 0 && currentBoard >= idx) setCurrentBoard(currentBoard - 1);
		if (boards.length === 1) setLargeView(false);
		const updatedBoards = [...boards];
		updatedBoards.splice(idx, 1);
		setBoards(updatedBoards);
	}, [boards, setBoards, currentBoard, setCurrentBoard]);

	const removeAllBoards = useCallback(() => {
		setBoards([]);
		setLargeView(false);
	}, [setBoards, setLargeView]);

	const updateBoard = useCallback((idx, url) => {
		const updatedBoards = [...boards];
		updatedBoards.splice(idx, 1, url);
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
