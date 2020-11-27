/*
 * *** BEGIN LICENSE BLOCK *****
 * Copyright (C) 2011-2020 Zextras
 *
 *  The contents of this file are subject to the Zextras EULA;
 * you may not use this file except in compliance with the EULA.
 * You may obtain a copy of the EULA at
 * http://www.zextras.com/zextras-eula.html
 * *** END LICENSE BLOCK *****
 */

import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render as rtlRender } from '@testing-library/react';
import { extendTheme, ThemeProvider } from '@zextras/zapp-ui';


function render(
	ui,
	{
		ctxt = {},
		initialRouterEntries = ['/'],
		...options
	} = {}
) {
	const Wrapper = ({ children }) => (
		<MemoryRouter initialEntries={initialRouterEntries}>
			<ThemeProvider
				theme={extendTheme({})}
			>
				{ children }
			</ThemeProvider>
		</MemoryRouter>
	);

	return rtlRender(
		ui,
		{
			wrapper: Wrapper,
			...options,
		}
	);
}

export const testUtils = {
	render
};
