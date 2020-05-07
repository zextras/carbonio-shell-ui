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
import { BehaviorSubject } from 'rxjs';

jest.mock('@zextras/zapp-ui');
jest.mock('../db/database');
jest.mock('../fiberchannel/fiber-channel');

import AppLink from '../app/app-link';
import AppContextProvider from './app-context-provider';
import BootsrapperContext from '../bootstrap/bootstrapper-context';
import AppLoaderContext from './app-loader-context';
import FiberChannelFactory from '../fiberchannel/fiber-channel';

const mockedPkg = {
	package: 'com_zextras_zapp_test'
};

const MockedAppContextProvider = ({ children }) => (
	<BootsrapperContext.Provider
		value={{
			fiberChannelFactory: new FiberChannelFactory(),
			accountLoaded: true,
			accounts: []
		}}
	>
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
	</BootsrapperContext.Provider>
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
