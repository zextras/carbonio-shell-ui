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

import {useEffect, useRef, useState} from "react";
import {drop, head, last, slice} from "lodash";

const useSplitVisibility = (items) => {
	const [visibleItems, setVisibleItems] = useState(items);
	const [hiddenItems, setHiddenItems] = useState([]);

	const [width, setWidth] = useState(window.innerWidth);
	const [lastHiddenWidth, setLastHiddenWidth] = useState(0);
	useEffect(() => {
		function handleResize() {
			setWidth(window.innerWidth);
		}
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, [width]);

	const containerRef = useRef();
	useEffect(()=> {
		if (containerRef.current
			&& containerRef.current.offsetWidth >= lastHiddenWidth
			&& hiddenItems.length > 0
		) {
			setVisibleItems([last(hiddenItems), ...visibleItems]);
			setHiddenItems(slice(hiddenItems, 0, hiddenItems.length - 1));
		}
		if (
			containerRef.current
			&& containerRef.current.scrollWidth > containerRef.current.offsetWidth
			&& visibleItems.length > 0
		) {
			setHiddenItems([...hiddenItems, head(visibleItems)]);
			setVisibleItems(drop(visibleItems));
			setLastHiddenWidth(containerRef.current.scrollWidth)
		}
	}, [width]);
	return [ visibleItems, hiddenItems, containerRef];
};

export default useSplitVisibility;
