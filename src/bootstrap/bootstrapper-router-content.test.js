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
import { act, create } from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';
import BootstrapperRouterContent from './bootstrapper-router-content';

describe('Boostrapper Router Content', () => {
	test('Route to Shell with no Account', () => {
		let component;
		act(() => {
			component = create(
				<MemoryRouter>
					<BootstrapperRouterContent accounts={[]} />
				</MemoryRouter>
			);
		});
		expect(component.toJSON()).toMatchSnapshot();
	});

	test('Route to Shell with Account', () => {
		let component;
		act(() => {
			component = create(
				<MemoryRouter>
					<BootstrapperRouterContent accounts={[{}]} />
				</MemoryRouter>
			);
		});
		expect(component.toJSON()).toMatchSnapshot();
	});

	test('Route to Logout with Account', () => {
		let component;
		act(() => {
			component = create(
				<MemoryRouter initialEntries={['/logout']}>
					<BootstrapperRouterContent accounts={[{}]} />
				</MemoryRouter>
			);
		});
		expect(component.toJSON()).toMatchSnapshot();
	});
});
