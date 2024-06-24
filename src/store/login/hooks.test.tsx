/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React from 'react';

import { screen } from '@testing-library/react';

import { useIsCarbonioCE } from './hooks';
import { type LoginConfigStore, useLoginConfigStore } from './store';
import { setup } from '../../tests/utils';

const ISCeComponent = (): React.JSX.Element => {
	const isCarbonioCE = useIsCarbonioCE();
	return <div>{`isCarbonioCE: ${isCarbonioCE}`}</div>;
};

describe('useIsCarbonioCE hook', () => {
	it('should return undefined when store value is not set', () => {
		setup(<ISCeComponent />);
		expect(screen.getByText('isCarbonioCE: undefined')).toBeVisible();
	});

	it('should return true when store value is true', () => {
		useLoginConfigStore.setState((state: LoginConfigStore) => ({
			...state,
			isCarbonioCE: true
		}));
		setup(<ISCeComponent />);
		expect(screen.getByText('isCarbonioCE: true')).toBeVisible();
	});

	it('should return false when store value is false', () => {
		useLoginConfigStore.setState((state: LoginConfigStore) => ({
			...state,
			isCarbonioCE: false
		}));
		setup(<ISCeComponent />);
		expect(screen.getByText('isCarbonioCE: false')).toBeVisible();
	});
});
