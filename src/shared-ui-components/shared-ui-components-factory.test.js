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
jest.mock('../app/app-loader-context-provider');
jest.mock('./shared-ui-components-context-provider');
jest.mock('../bootstrap/bootstrapper-context-provider');

import React from 'react';
import { render } from '@testing-library/react';
import { BehaviorSubject } from 'rxjs';// eslint-disable-next-line
import SharedUiComponentsContextProvider from './shared-ui-components-context-provider';
import SharedUiComponentsFactory from './shared-ui-components-factory';
import SharedUiComponentsContext from './shared-ui-components-context';
import AppLoaderContextProvider from '../app/app-loader-context-provider';
import BootstrapperContextProvider from '../bootstrap/bootstrapper-context-provider';
import AppLoaderContext from '../app/app-loader-context';

describe.skip('Shared UI Components Factory', () => {
	test('Render a scope with NO Components registered', () => {
		SharedUiComponentsContextProvider.mockImplementationOnce(
			({ children }) => (
				<SharedUiComponentsContext.Provider
					value={{
						scopes: {}
					}}
				>
					{ children }
				</SharedUiComponentsContext.Provider>
			)
		);

		AppLoaderContextProvider.mockImplementationOnce(({ children }) => (
			<AppLoaderContext.Provider
				value={{
					appsCache: {},
					appsLoaded: true
				}}
			>
				{ children }
			</AppLoaderContext.Provider>
		));

		const { container } = render(
			<BootstrapperContextProvider>
				<AppLoaderContextProvider>
					<SharedUiComponentsContextProvider>
						<SharedUiComponentsFactory scope="scope-1" />
					</SharedUiComponentsContextProvider>
				</AppLoaderContextProvider>
			</BootstrapperContextProvider>
		);
		expect(container).toMatchSnapshot();
	});

	test('Render a scope with Components registered, without props', () => {
		const ComponentClass = jest.fn().mockImplementation(() => 'Scope-1-Component');

		SharedUiComponentsContextProvider.mockImplementationOnce(
			({ children }) => (
				<SharedUiComponentsContext.Provider
					value={{
						scopes: {
							'scope-1': [{
								pkg: { package: 'com_example_package' },
								componentClass: ComponentClass
							}]
						}
					}}
				>
					{ children }
				</SharedUiComponentsContext.Provider>
			)
		);

		AppLoaderContextProvider.mockImplementationOnce(({ children }) => (
			<AppLoaderContext.Provider
				value={{
					appsCache: {
						// eslint-disable-next-line @typescript-eslint/camelcase
						com_example_package: {
							appContext: new BehaviorSubject()
						}
					},
					appsLoaded: true
				}}
			>
				{ children }
			</AppLoaderContext.Provider>
		));

		const { container } = render(
			<BootstrapperContextProvider>
				<AppLoaderContextProvider>
					<SharedUiComponentsContextProvider>
						<SharedUiComponentsFactory scope="scope-1" />
					</SharedUiComponentsContextProvider>
				</AppLoaderContextProvider>
			</BootstrapperContextProvider>
		);
		expect(container).toMatchSnapshot();
	});

	test('Render a scope with Components registered, with props', () => {
		const ComponentClass = jest.fn().mockImplementation(() => 'Scope-1-Component');

		SharedUiComponentsContextProvider.mockImplementationOnce(
			({ children }) => (
				<SharedUiComponentsContext.Provider
					value={{
						scopes: {
							'scope-1': [{
								pkg: { package: 'com_example_package' },
								componentClass: ComponentClass
							}]
						}
					}}
				>
					{ children }
				</SharedUiComponentsContext.Provider>
			)
		);

		AppLoaderContextProvider.mockImplementationOnce(({ children }) => (
			<AppLoaderContext.Provider
				value={{
					appsCache: {
						// eslint-disable-next-line @typescript-eslint/camelcase
						com_example_package: {
							appContext: new BehaviorSubject()
						}
					},
					appsLoaded: true
				}}
			>
				{ children }
			</AppLoaderContext.Provider>
		));

		const { container } = render(
			<BootstrapperContextProvider>
				<AppLoaderContextProvider>
					<SharedUiComponentsContextProvider>
						<SharedUiComponentsFactory
							scope="scope-1"
							customProp1
							customProp2="string prop value"
						/>
					</SharedUiComponentsContextProvider>
				</AppLoaderContextProvider>
			</BootstrapperContextProvider>
		);
		expect(container).toMatchSnapshot();
		expect(ComponentClass).toHaveBeenCalledWith({
			customProp1: true,
			customProp2: 'string prop value'
		}, {}); // Second parameter exists if the component is a forwarded ref.
	});
});
