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

import React from 'react';
import { collectAllTo } from './shell-secondary-bar';

describe.skip('Shell Link', () => {
	test('Collect all to', () => {
		const collected = collectAllTo('package', {
			to: '/0',
			children: [{
				to: '/1',
				children: [{
					to: '/1.1'
				}]
			}, {
				to: '/2'
			}]
		});
		expect(collected).toStrictEqual(['/package/0', '/package/1', '/package/1.1', '/package/2']);
	});
});
