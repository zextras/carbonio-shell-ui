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
import React from 'react';
import renderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../../src/bootstrap/bootstrapper-lazy-loader');

import BootstrapperRouterContent from '../../../src/bootstrap/bootstrapper-router-content';

describe('Shell Router', () => {

	test('Route to Shell with no Account', () => {
		const router = renderer.create(
			<MemoryRouter>
				<BootstrapperRouterContent accounts={[]} />
			</MemoryRouter>
		);
		expect(router.toJSON()).toMatchSnapshot();
	});

	test('Route to Shell with Account', () => {
		const router = renderer.create(
			<MemoryRouter>
				<BootstrapperRouterContent accounts={[{}]} />
			</MemoryRouter>
		);
		expect(router.toJSON()).toMatchSnapshot();
	});

	test('Route to Logout with Account', () => {
		const router = renderer.create(
			<MemoryRouter initialEntries={['/logout']}>
				<BootstrapperRouterContent accounts={[{}]} />
			</MemoryRouter>
		);
		expect(router.toJSON()).toMatchSnapshot();
	});

});
