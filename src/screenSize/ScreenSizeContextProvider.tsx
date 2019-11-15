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

import React, { FC, useEffect, useRef, useState } from 'react';
import { Subscription } from 'rxjs';

import ScreenSizeContext from './ScreenSizeContext';
import ScreenSizeService from './ScreenSizeService';

interface IScreenSizesContextProviderProps {
	screenSizeService: ScreenSizeService;
}

const ScreenSizesContextProvider: FC<IScreenSizesContextProviderProps> = ({ screenSizeService, children }) => {
	const [sizes, setScreenSizes] = useState(ScreenSizeService.CalculateScreenSizes());
	const sizesSubRef = useRef<Subscription>();

	useEffect(() => {
		sizesSubRef.current = screenSizeService.sizes.subscribe(setScreenSizes);

		return (): void => {
			if (sizesSubRef.current) {
				sizesSubRef.current.unsubscribe();
				sizesSubRef.current = undefined;
			}
		};
	}, [screenSizeService.sizes]);

	return (
		<ScreenSizeContext.Provider
			value={sizes}
		>
			{children}
		</ScreenSizeContext.Provider>
	);
};
export default ScreenSizesContextProvider;
