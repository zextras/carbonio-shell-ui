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
jest.mock('@zextras/zapp-ui');
jest.mock('../db/database');
jest.mock('../fiberchannel/fiber-channel');
jest.mock('../bootstrap/bootstrapper-context-provider');
jest.mock('./app-loader-context-provider');
// eslint-disable-next-line
import React from 'react';// eslint-disable-next-line
import { act, create } from 'react-test-renderer';// eslint-disable-next-line
import { MemoryRouter } from 'react-router-dom';// eslint-disable-next-line
import { BehaviorSubject } from 'rxjs';// eslint-disable-next-line
import AppLink from './app-link';// eslint-disable-next-line
import AppContextProvider from './app-context-provider';// eslint-disable-next-line
import AppLoaderContext from './app-loader-context';// eslint-disable-next-line
import BootstrapperContextProvider from '../bootstrap/bootstrapper-context-provider';// eslint-disable-next-line
import AppLoaderContextProvider from './app-loader-context-provider';

describe('App Link', () => {
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
		let component;
		act(() => {
			component = create(
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
		});
		const el = component.root.findByType('a');
		expect(el.props.href).toBe('/com_example_package/destination');
	});

	test('Link with parameters', () => {
		let component;
		act(() => {
			component = create(
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
			component = create(
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
