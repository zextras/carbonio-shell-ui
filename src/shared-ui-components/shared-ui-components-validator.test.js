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
import validateSharedUiComponent from './shared-ui-components-validator';

describe('Shared UI Components Validator', () => {
	test('Component is ok', () => {
		const TestComponent = () => 'TestComponent';
		TestComponent.propTypes = {};

		expect(() => {
			validateSharedUiComponent(TestComponent);
		}).not.toThrow();
	});

	test('Reject if missing \'propTypes\'', () => {
		const TestComponent = () => 'TestComponent';

		expect(() => {
			validateSharedUiComponent(TestComponent);
		}).toThrowError('Shared UI Components MUST declare \'propTypes\'.');
	});
});
