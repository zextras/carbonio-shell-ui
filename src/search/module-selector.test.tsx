/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React from 'react';

import { screen } from '@testing-library/react';

import { ModuleSelector } from './module-selector';
import { useAppStore } from '../store/app';
import { TESTID_SELECTORS } from '../test/constants';
import { setup } from '../test/utils';

describe('Search module selector', () => {
	it('should hide the component if there are no modules in the store', () => {
		useAppStore.setState((state) => ({
			views: { ...state.views, search: [] }
		}));
		setup(<ModuleSelector />);
		expect(screen.queryByTestId(TESTID_SELECTORS.headerModuleSelector)).not.toBeInTheDocument();
	});
});
