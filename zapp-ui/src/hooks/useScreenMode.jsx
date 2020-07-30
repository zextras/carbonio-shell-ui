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

import { useLayoutEffect, useState, useContext, useCallback } from 'react';
import { ThemeContext } from "../index";

export function useScreenMode(target = window) {
	const theme = useContext(ThemeContext);
	const check = useCallback(
		(width, height) => ((width < theme.breakpoints.width) || ((width / height) < theme.breakpoints.aspectRatio)) ? 'mobile' : 'desktop',
		[theme]
	);
	const [ screenMode, setScreenMode ] = useState(check(target.innerWidth, target.innerHeight));
	useLayoutEffect(() => {
		const handleResize = () => {
			setScreenMode(check(target.innerWidth, target.innerHeight));
		};
		target.addEventListener('resize', handleResize);
		return () => target.removeEventListener('resize', handleResize);
	}, [setScreenMode, target]);
	return screenMode;
}
