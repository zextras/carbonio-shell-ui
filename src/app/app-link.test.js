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
jest.mock('@zextras/zapp-ui');
jest.mock('../store/store-factory');
jest.mock('../fiberchannel/fiber-channel');
jest.mock('../bootstrap/bootstrapper-context-provider');
jest.mock('./app-loader-context-provider');

import React from 'react';
import { act, render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { BehaviorSubject } from 'rxjs';
import AppLink from './app-link';
import AppContextProvider from './app-context-provider';
import AppLoaderContext from './app-loader-context';
import BootstrapperContextProvider from '../bootstrap/bootstrapper-context-provider';
import AppLoaderContextProvider from './app-loader-context-provider';

describe.skip('App Link', () => {
	beforeEach(() => {
		AppLoaderContextProvider.mockImplementationOnce(({ children }) => (
			<AppLoaderContext.Provider
				value={{
					appsCache: {
						// eslint-disable-next-line @typescript-eslint/camelcase
						com_example_package: {
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
				{ children }
			</AppLoaderContext.Provider>
		));
	});

	test('Link without parameters', () => {
		const { container } = render(
			<MemoryRouter>
				<BootstrapperContextProvider>
					<AppLoaderContextProvider>
						<AppContextProvider pkg={{ package: 'com_example_package' }}>
							<AppLink to="/destination">Link</AppLink>
						</AppContextProvider>
					</AppLoaderContextProvider>
				</BootstrapperContextProvider>
			</MemoryRouter>
		);
		const el = container.findByType('a');
		expect(el.props.href).toBe('/com_example_package/destination');
	});

	test('Link with parameters', () => {
		let component;
		act(() => {
			component = render(
				<MemoryRouter>
					<BootstrapperContextProvider>
						<AppLoaderContextProvider>
							<AppContextProvider pkg={{ package: 'com_example_package' }}>
								<AppLink to="/destination?param=true">Link</AppLink>
							</AppContextProvider>
						</AppLoaderContextProvider>
					</BootstrapperContextProvider>
				</MemoryRouter>
			);
		});
		const el = component.root.findByType('a');
		expect(el.props.href).toBe('/com_example_package/destination?param=true');
	});

	test('Link without parameters, to as object', () => {
		let component;
		act(() => {
			component = render(
				<MemoryRouter>
					<BootstrapperContextProvider>
						<AppLoaderContextProvider>
							<AppContextProvider pkg={{ package: 'com_example_package' }}>
								<AppLink to={{ pathname: '/destination' }}>Link</AppLink>
							</AppContextProvider>
						</AppLoaderContextProvider>
					</BootstrapperContextProvider>
				</MemoryRouter>
			);
		});
		const el = component.root.findByType('a');
		expect(el.props.href).toBe('/com_example_package/destination');
	});
});
