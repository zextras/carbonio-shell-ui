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

jest.mock('@zextras/zapp-ui');
jest.mock('../../../src/db/database', () => ({
	Database: () => {}
}));

import AppLink from '../../../src/app/app-link';
import AppContextProvider from '../../../src/app/app-context-provider';
import AppLoaderContext from '../../../src/app/app-loader-context';
import { BehaviorSubject } from 'rxjs';

const mockedPkg = {
	package: 'com_zextras_zapp_test'
};

const MockedAppContextProvider = ({ children }) => (
	<AppLoaderContext.Provider
		value={{
			appsCache: {
				'com_zextras_zapp_test': {
					pkg: {},
					mainMenuItems: new BehaviorSubject([]),
					routes: new BehaviorSubject([]),
					createOptions: new BehaviorSubject([]),
					appContext: new BehaviorSubject({}),
				}
			},
			appsLoaded: true
		}}
	>
		<AppContextProvider pkg={mockedPkg}>
			{ children }
		</AppContextProvider>
	</AppLoaderContext.Provider>
);

describe('App Link', () => {

	test('Link without parameters', () => {
		const root = renderer.create(
			<MemoryRouter>
				<MockedAppContextProvider>
					<AppLink to="/destination">Link</AppLink>
				</MockedAppContextProvider>
			</MemoryRouter>
		).root;
		const el = root.findByType('a');
		expect(el.props.href).toBe('/com_zextras_zapp_test/destination');
	});

	test('Link with parameters', () => {
		const root = renderer.create(
			<MemoryRouter>
				<MockedAppContextProvider>
					<AppLink to="/destination?param=true">Link</AppLink>
				</MockedAppContextProvider>
			</MemoryRouter>
		).root;
		const el = root.findByType('a');
		expect(el.props.href).toBe('/com_zextras_zapp_test/destination?param=true');
	});

	test('Link without parameters, to as object', () => {
		const root = renderer.create(
			<MemoryRouter>
				<MockedAppContextProvider>
					<AppLink to={{pathname: '/destination'}}>Link</AppLink>
				</MockedAppContextProvider>
			</MemoryRouter>
		).root;
		const el = root.findByType('a');
		expect(el.props.href).toBe('/com_zextras_zapp_test/destination');
	});

});
