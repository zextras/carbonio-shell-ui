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

jest.mock('@zextras/zapp-ui');
jest.mock('../db/database');

jest.mock('./shell-header');
jest.mock('./main-menu');
jest.mock('./shell-secondary-bar');
jest.mock('./panels/panels-router-container');
jest.mock('./panels/app-panel-window');

import ShellView from './shell-view';

describe('Shell View', () => {
	test('Basic structure', () => {
		const shell = renderer.create(
			<ShellView />
		);
		expect(shell.toJSON()).toMatchSnapshot();
	});
});
