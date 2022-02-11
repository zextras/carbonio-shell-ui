/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React from 'react';
// import { screen } from '@testing-library/dom';
import { testUtils } from '../../jest-mocks';
import AppLink from './app-link';

describe.skip('App Link', () => {
	test('Link without parameters', () => {
		testUtils.render(<AppLink to="/destination">Link</AppLink>, {
			packageName: 'com_example_app',
			packageVersion: '1.0.0'
		});
		// expect(screen.getByText('Link')).toBeInTheDocument();
		// expect(screen.getByText('Link').href).toBe('http://localhost/com_example_app/destination');
	});

	test('Link with parameters', () => {
		testUtils.render(<AppLink to="/destination?param=true">Link</AppLink>, {
			packageName: 'com_example_app',
			packageVersion: '1.0.0'
		});
		// expect(screen.getByText('Link')).toBeInTheDocument();
		// expect(screen.getByText('Link').href).toBe(
		// 	'http://localhost/com_example_app/destination?param=true'
		// );
	});

	test('Link without parameters, to as object', () => {
		testUtils.render(<AppLink to={{ pathname: '/destination' }}>Link</AppLink>, {
			packageName: 'com_example_app',
			packageVersion: '1.0.0'
		});
		// expect(screen.getByText('Link')).toBeInTheDocument();
		// expect(screen.getByText('Link').href).toBe('http://localhost/com_example_app/destination');
	});
});
