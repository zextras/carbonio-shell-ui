/*
 * *** BEGIN LICENSE BLOCK *****
 * Copyright (C) 2011-2021 Zextras
 *
 *  The contents of this file are subject to the Zextras EULA;
 * you may not use this file except in compliance with the EULA.
 * You may obtain a copy of the EULA at
 * http://www.zextras.com/zextras-eula.html
 * *** END LICENSE BLOCK *****
 */

import React from 'react';
import { screen } from '@testing-library/dom';
import { testUtils } from '../jest-mocks';
import AppLink from './app-link';

describe.skip('App Link', () => {
	test('Link without parameters', () => {
		testUtils.render(<AppLink to="/destination">Link</AppLink>, {
			packageName: 'com_example_app',
			packageVersion: '1.0.0'
		});
		expect(screen.getByText('Link')).toBeInTheDocument();
		expect(screen.getByText('Link').href).toBe('http://localhost/com_example_app/destination');
	});

	test('Link with parameters', () => {
		testUtils.render(<AppLink to="/destination?param=true">Link</AppLink>, {
			packageName: 'com_example_app',
			packageVersion: '1.0.0'
		});
		expect(screen.getByText('Link')).toBeInTheDocument();
		expect(screen.getByText('Link').href).toBe(
			'http://localhost/com_example_app/destination?param=true'
		);
	});

	test('Link without parameters, to as object', () => {
		testUtils.render(<AppLink to={{ pathname: '/destination' }}>Link</AppLink>, {
			packageName: 'com_example_app',
			packageVersion: '1.0.0'
		});
		expect(screen.getByText('Link')).toBeInTheDocument();
		expect(screen.getByText('Link').href).toBe('http://localhost/com_example_app/destination');
	});
});
