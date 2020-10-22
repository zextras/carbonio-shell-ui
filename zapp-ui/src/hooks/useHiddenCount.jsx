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

import { useCallback, useEffect, useState } from 'react';
import { filter, reduce } from 'lodash';

export function useHiddenCount(containerRef, listenForWindowResize) {
	const [hiddenTabsCount, setHiddenTabsCount] = useState();

	const calculateHiddenCounts = useCallback(() => {
		if (containerRef && containerRef.current) {
			containerRef.current.style.width = '';
			const allItems = Array.from(containerRef.current.querySelectorAll(':scope > *'));
			const hiddenItems = filter(allItems, (child) => child.offsetTop > 0).length;
			setHiddenTabsCount(hiddenItems);
			if (hiddenItems > 0) {
				containerRef.current.style.width = `${reduce(
					allItems.splice(0, allItems.length - hiddenItems),
					(width, item) => width + item.clientWidth,
					0
				)}px`;
			}
		}
	}, []);

	useEffect(() => {
		listenForWindowResize && window.addEventListener('resize', calculateHiddenCounts);
		return () => listenForWindowResize && window.removeEventListener('resize', calculateHiddenCounts);
	}, [listenForWindowResize, calculateHiddenCounts]);

	return [hiddenTabsCount, calculateHiddenCounts];
}
