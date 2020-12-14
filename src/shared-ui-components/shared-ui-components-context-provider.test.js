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
import AppLoaderContextProvider from '../app/app-loader-context-provider';
import AppLoaderContext from '../app/app-loader-context';
import SharedUIComponentsContextProvider from './shared-ui-components-context-provider';
import { SharedUIComponentsContext } from './shared-ui-components-context';
import { testUtils } from '../jest-shell-mocks';

describe('Shared UI Components Context Provider', () => {
	test('Merge all App Registered UI Components', () => {
		const ComponentClass11 = jest.fn().mockImplementation(() => 'Scope-1-Component-Package-1');
		const ComponentClass21 = jest.fn().mockImplementation(() => 'Scope-2-Component-Package-1');
		const ComponentClass22 = jest.fn().mockImplementation(() => 'Scope-2-Component-Package-2');
		const ComponentClass32 = jest.fn().mockImplementation(() => 'Scope-3-Component-Package-2');
		AppLoaderContextProvider.mockImplementationOnce(({ children }) => (
			<AppLoaderContext.Provider
				value={{
					appsCache: {
						com_example_package_1: {
							sharedUiComponents: new BehaviorSubject({
								'component-1': {
									pkg: { package: 'com_example_package_1' },
									versions: {
										'1': ComponentClass11,
										'2': ComponentClass11
									}
								},
								'component-2': {
									pkg: { package: 'com_example_package_1' },
									versions: {
										'1': ComponentClass21,
										'2': ComponentClass21
									}
								}
							})
						},
						com_example_package_2: {
							sharedUiComponents: new BehaviorSubject({
								'component-4': {
									pkg: { package: 'com_example_package_2' },
									versions: {
										'1': ComponentClass22,
										'2': ComponentClass22
									}
								},
								'component-3': {
									pkg: { package: 'com_example_package_2' },
									versions: {
										'1': ComponentClass32,
										'2': ComponentClass32
									}
								}
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
			const ctxt = useContext(SharedUIComponentsContext);
			tester(ctxt);
			return `Tester scopes: ${Object.keys(ctxt).reduce((p, c, i) => `${p}${i > 0 ? ' ' : ''}${c}`, [], '')}`;
		}

		const { container } = testUtils.render(
			<AppLoaderContextProvider>
				<SharedUIComponentsContextProvider>
					<Tester />
				</SharedUIComponentsContextProvider>
			</AppLoaderContextProvider>
		);

		expect(container).toMatchSnapshot();
		expect(tester).toHaveBeenCalledTimes(1);
		expect(tester).toHaveBeenLastCalledWith({
			'component-4': {
				pkg: { package: 'com_example_package_2' },
				versions: {
					'1': ComponentClass22,
					'2': ComponentClass22
				}
			},
			'component-3': {
				pkg: { package: 'com_example_package_2' },
				versions: {
					'1': ComponentClass32,
					'2': ComponentClass32
				}
			},
			'component-1': {
				pkg: { package: 'com_example_package_1' },
				versions: {
					'1': ComponentClass11,
					'2': ComponentClass11
				}
			},
			'component-2': {
				pkg: { package: 'com_example_package_1' },
				versions: {
					'1': ComponentClass21,
					'2': ComponentClass21
				}
			}
		});
	});
});
