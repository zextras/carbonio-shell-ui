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

import React, { useContext } from 'react';
import { BehaviorSubject } from 'rxjs';
import { act, create } from 'react-test-renderer';
import AppLoaderContextProvider from '../app/app-loader-context-provider';
import AppLoaderContext from '../app/app-loader-context';
import SharedUiComponentsContextProvider from './shared-ui-components-context-provider';
import SharedUiComponentsContext from './shared-ui-components-context';

describe('Shared UI Components Context Provider', () => {
	test('Merge all App Scopes', () => {
		const ComponentClass11 = jest.fn().mockImplementation(() => 'Scope-1-Component-Package-1');
		const ComponentClass21 = jest.fn().mockImplementation(() => 'Scope-2-Component-Package-1');
		const ComponentClass22 = jest.fn().mockImplementation(() => 'Scope-2-Component-Package-2');
		const ComponentClass32 = jest.fn().mockImplementation(() => 'Scope-3-Component-Package-2');
		AppLoaderContextProvider.mockImplementationOnce(({ children }) => (
			<AppLoaderContext.Provider
				value={{
					appsCache: {
						// eslint-disable-next-line @typescript-eslint/camelcase
						com_example_package_1: {
							sharedUiComponents: new BehaviorSubject({
								'scope-1': [{
									pkg: {
										package: 'com_example_package_1',
									},
									componentClass: ComponentClass11
								}],
								'scope-2': [{
									pkg: {
										package: 'com_example_package_1',
									},
									componentClass: ComponentClass21
								}]
							})
						},
						// eslint-disable-next-line @typescript-eslint/camelcase
						com_example_package_2: {
							sharedUiComponents: new BehaviorSubject({
								'scope-2': [{
									pkg: {
										package: 'com_example_package_2',
									},
									componentClass: ComponentClass22
								}],
								'scope-3': [{
									pkg: {
										package: 'com_example_package_2',
									},
									componentClass: ComponentClass32
								}]
							})
						}
					},
					appsLoaded: true
				}}
			>
				{children}
			</AppLoaderContext.Provider>
		));

		const tester = jest.fn();

		function Tester() {
			const { scopes } = useContext(SharedUiComponentsContext);
			tester(scopes);
			return `Tester scopes: ${Object.keys(scopes).reduce((p, c, i) => `${p}${i > 0 ? ' ' : ''}${c}`, [], '')}`;
		}

		let component;
		act(() => {
			component = create(
				<AppLoaderContextProvider>
					<SharedUiComponentsContextProvider>
						<Tester />
					</SharedUiComponentsContextProvider>
				</AppLoaderContextProvider>
			);
		});

		expect(component.toJSON()).toMatchSnapshot();
		expect(tester).toHaveBeenCalledTimes(2);
		expect(tester).toHaveBeenLastCalledWith({
			'scope-1': [{
				pkg: {
					package: 'com_example_package_1',
				},
				componentClass: ComponentClass11
			}],
			'scope-2': [{
				pkg: {
					package: 'com_example_package_1',
				},
				componentClass: ComponentClass21
			}, {
				pkg: {
					package: 'com_example_package_2',
				},
				componentClass: ComponentClass22
			}],
			'scope-3': [{
				pkg: {
					package: 'com_example_package_2',
				},
				componentClass: ComponentClass32
			}],
		});
	});
});
