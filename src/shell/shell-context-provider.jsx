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

import React, { useMemo, useState, useLayoutEffect, useContext, useCallback } from 'react';
import ShellContext from './shell-context';

export function useIsMobile() {
	const { isMobile } = useContext(ShellContext);
	return isMobile;
}

export default function ShellContextProvider({ children }) {
	const [ isMobile, setIsMobile ] = useState(typeof window !== 'undefined' ? window.innerHeight > window.innerWidth : false);
	const [ panels, setPanels ] = useState([]);
	const [ currentPanel, setCurrentPanel ] = useState(0);

	const handleResize = useCallback(({ target }) => {
			if (isMobile !== (target.innerHeight > target.innerWidth)) setIsMobile(target.innerHeight > target.innerWidth);
		},
		[isMobile, setIsMobile]
	);

	const addPanel = useCallback((panel) => {
		const newPanels = [...panels, panel];
		setPanels(newPanels);
		setCurrentPanel(newPanels.length - 1);
	}, [panels, setPanels, setCurrentPanel]);

	const removePanel = useCallback((idx) => {
		if (currentPanel > 0 && currentPanel >= idx) setCurrentPanel(currentPanel - 1);
		const updatedPanels = [...panels];
		updatedPanels.splice(idx, 1);
		setPanels(updatedPanels);
	}, [panels, setPanels, currentPanel, setCurrentPanel]);

	const updatePanel = useCallback((idx, url) => {
		const updatedPanels = [...panels];
		updatedPanels.splice(idx, 1, url);
		setPanels(updatedPanels);
	}, [panels, setPanels]);

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
		updatePanel,
		currentPanel,
		setCurrentPanel
	}), [
		isMobile,
		panels,
		addPanel,
		removePanel,
		updatePanel,
		currentPanel,
		setCurrentPanel
	]);

	return (
		<ShellContext.Provider
			value={value}
		>
			{ children }
		</ShellContext.Provider>
	);
}
