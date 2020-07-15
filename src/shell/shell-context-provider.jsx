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
	const [ isMobile, setIsMobile ] = useState(typeof window !== 'undefined' ? window.innerHeight > window.innerWidth : false);
	const [ panels, setPanels ] = useState([]);
	const [ currentPanel, setCurrentPanel ] = useState(0);
	const [ largeView, setLargeView ] = useState(false);
	const [ minimized, setMinimized ] = useState(false);

	const handleResize = useCallback(({ target }) => {
			if (isMobile !== (target.innerHeight > target.innerWidth)) setIsMobile(target.innerHeight > target.innerWidth);
		},
		[isMobile, setIsMobile]
	);

	const addPanel = useCallback((panel) => {
		const newPanels = [...panels, panel];
		setPanels(newPanels);
		setCurrentPanel(newPanels.length - 1);
		setMinimized(false);
	}, [panels, setPanels, setCurrentPanel, setMinimized]);

	const removePanel = useCallback((idx) => {
		if (currentPanel > 0 && currentPanel >= idx) setCurrentPanel(currentPanel - 1);
		if (panels.length === 1) setLargeView(false);
		const updatedPanels = [...panels];
		updatedPanels.splice(idx, 1);
		setPanels(updatedPanels);
	}, [panels, setPanels, currentPanel, setCurrentPanel]);

	const removeAllPanel = useCallback(() => {
		setPanels([]);
		setLargeView(false);
	}, [setPanels, setLargeView]);

	const updatePanel = useCallback((idx, url) => {
		const updatedPanels = [...panels];
		updatedPanels.splice(idx, 1, url);
		setPanels(updatedPanels);
	}, [panels, setPanels]);

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
		panels,
		addPanel,
		removePanel,
		removeAllPanel,
		updatePanel,
		currentPanel,
		setCurrentPanel,
		fiberChannelSink: fiberChannelFactory.getAppFiberChannelSink({ name: PACKAGE_NAME, version: PACKAGE_VERSION }),
		fiberChannel: fiberChannelFactory.getAppFiberChannel({ name: PACKAGE_NAME, version: PACKAGE_VERSION }),
		largeView,
		toggleLargeView,
		minimized,
		toggleMinimized
	}), [
		isMobile,
		panels,
		addPanel,
		removePanel,
		removeAllPanel,
		updatePanel,
		currentPanel,
		setCurrentPanel,
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
