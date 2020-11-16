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
jest.mock('./bootstrapper-lazy-loader');

import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BootstrapperRouterContent from './bootstrapper-router-content';

describe('Boostrapper Router Content', () => {
	test('Route to Shell with no Account', () => {
		const { container } = render(
			<MemoryRouter>
				<BootstrapperRouterContent accounts={[]} />
			</MemoryRouter>
		);
		expect(container).toMatchSnapshot();
	});

	test('Route to Shell with Account', () => {
		const { container } = render(
			<MemoryRouter>
				<BootstrapperRouterContent accounts={[{}]} />
			</MemoryRouter>
		);
		expect(container).toMatchSnapshot();
	});

	test('Route to Logout with Account', () => {
		const { container } = render(
			<MemoryRouter initialEntries={['/logout']}>
				<BootstrapperRouterContent accounts={[{}]} />
			</MemoryRouter>
		);
		expect(container).toMatchSnapshot();
	});
});
