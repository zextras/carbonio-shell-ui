/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

/* eslint-disable import/no-extraneous-dependencies */

import React from 'react';
import { MemoryRouter } from 'react-router-dom';
// import { render as rtlRender } from '@testing-library/react';
import { ThemeProvider } from '@zextras/zapp-ui';

function render(ui, { initialRouterEntries = ['/'], ...options } = {}) {
	const Wrapper = ({ children }) => (
		<MemoryRouter initialEntries={initialRouterEntries}>
			<ThemeProvider>{children}</ThemeProvider>
		</MemoryRouter>
	);

	// return rtlRender(ui, {
	// 	wrapper: Wrapper,
	// 	...options
	// });
}

export const testUtils = {
	render
};
