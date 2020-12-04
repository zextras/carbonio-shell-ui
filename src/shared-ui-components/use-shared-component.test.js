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
jest.mock('./shared-ui-components-context-provider');
jest.mock('../app/app-context-provider');
import React, { useContext } from 'react';
import { useSharedComponent } from './use-shared-component';
import SharedUIComponentsContextProvider from './shared-ui-components-context-provider';
import { SharedUIComponentsContext } from './shared-ui-components-context';
import { testUtils } from '../jest-mocks';
import AppContextProvider from '../app/app-context-provider';

describe('useSharedComponent hook', () => {
	test('get a shared component', () => {
		const ComponentClass11 = jest.fn().mockImplementation(() => 'Scope-1-Component-Package-1');
		const ComponentClass21 = jest.fn().mockImplementation(() => 'Scope-2-Component-Package-1');
		const ComponentClass22 = jest.fn().mockImplementation(() => 'Scope-2-Component-Package-2');
		const ComponentClass32 = jest.fn().mockImplementation(() => 'Scope-3-Component-Package-2');
		SharedUIComponentsContextProvider.mockImplementationOnce(({ children }) => (
			<SharedUIComponentsContext.Provider
				value={{
					'component-4': {
						pkg: 'com_example_package_2',
						versions: {
							'1': ComponentClass22,
							'2': ComponentClass22
						}
					},
					'component-3': {
						pkg: 'com_example_package_2',
						versions: {
							'1': ComponentClass32,
							'2': ComponentClass32
						}
					},
					'component-1': {
						pkg: 'com_example_package_1',
						versions: {
							'1': ComponentClass11,
							'2': ComponentClass11
						}
					},
					'component-2': {
						pkg: 'com_example_package_1',
						versions: {
							'1': ComponentClass21,
							'2': ComponentClass21
						}
					}
				}}
			>
				{children}
			</SharedUIComponentsContext.Provider>
		));
		AppContextProvider.mockImplementationOnce(({ children, ...props }) => (
			<>
				AppContextProvider props: {JSON.stringify(props)}
				{children}
			</>
		));
		const tester = jest.fn();

		function Tester() {
			const ctxt = useContext(SharedUIComponentsContext);
			const C = useSharedComponent('component-4', '1');
			console.log(C);
			tester(ctxt);
			return <C/>;
		}

		const { container } = testUtils.render(
			<SharedUIComponentsContextProvider>
				<Tester />
			</SharedUIComponentsContextProvider>
		);

		expect(container).toMatchSnapshot();
		expect(tester).toHaveBeenCalledTimes(1);
	});
});
