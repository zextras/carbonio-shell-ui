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
import { act, Simulate } from 'react-dom/test-utils';
import { Router } from 'react-router-dom';
import renderer from 'react-test-renderer';
import { useAddPanel } from './hooks';
import { createMemoryHistory } from 'history';

jest.mock('@zextras/zapp-ui');

function PanelAdder() {
	const addPanel = useAddPanel('/panel');

	return <button onClick={addPanel}>
		Add a panel
	</button>
}

describe('Hook useAddPanel', () => {

	test('Add a panel', () => {
		const history = createMemoryHistory();
		const root = renderer.create(
			<Router history={history}>
				<PanelAdder />
			</Router>
		).root;
		const button = root.findByType('button');
		Simulate.click(button);
		expect(history.location.search).toBe("activePanel=\"%2Fpanel\"&panels=%5B\"%2Fpanel\"%5D");
	});

});
