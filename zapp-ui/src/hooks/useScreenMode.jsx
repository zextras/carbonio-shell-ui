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

import React, { useLayoutEffect, useState, useContext } from 'react';
import {ThemeContext} from "../index";

export const useScreenMode = () => {
	const theme = useContext(ThemeContext);
	const check = (width, height) => ((width < theme.breakpoints.width) || ((width / height) < theme.breakpoints.aspectRatio)) ? 'mobile' : 'desktop';
	const [ screenMode, setScreenMode ] = useState(check(window.innerWidth, window.innerHeight));
	useLayoutEffect(() => {
		const handleResize = () => {
			setScreenMode(check(window.innerWidth, window.innerHeight));
		};
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, [setScreenMode]);
	return screenMode;
};

