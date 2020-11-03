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

// jest.mock('@zextras/zapp-ui');
// jest.mock('../db/database');
//
// jest.mock('./shell-header');
// jest.mock('./shell-secondary-bar');
// jest.mock('./boards/boards-router-container');
// jest.mock('./boards/app-board-window');
// jest.mock('../bootstrap/bootstrapper-context-provider');

import React from 'react';
import { act, create } from 'react-test-renderer';

// import ShellView from './shell-view';
// import BootstrapperContextProvider from '../bootstrap/bootstrapper-context-provider';

describe.skip('Shell View', () => {
	beforeAll(() => {
		global.PACKAGE_NAME = 'com_zextras_zapp_shell';
		global.PACKAGE_VERSION = '0.0.0';
	});

	test('Basic structure', () => {
		let component;
		act(() => {
			component = create(<></>);
		});
		// act(() => {
		// 	component = create(
		// 		<BootstrapperContextProvider>
		// 			<ShellView/>
		// 		</BootstrapperContextProvider>
		// 	);
		// });
		expect(component.toJSON()).toMatchSnapshot();
	});
});
