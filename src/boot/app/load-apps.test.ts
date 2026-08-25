/*
 * SPDX-FileCopyrightText: 2026 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { isAppEnabled } from './load-apps';
import * as constants from '../../constants';
import { useAccountStore } from '../../store/account';
import { normalizeApp } from '../../store/app/utils';
import { setupAccountStore } from '../../tests/account-utils';

vi.mock('../../constants');

const ATTR_KEY = 'carbonioFeatureTasksEnabled';

describe('isAppEnabled', () => {
	beforeEach(() => {
		vi.mocked(constants).IS_FOCUS_MODE = false;
	});

	it.each([undefined, ''])('should enable a module whose attrKey is %j', (attrKey) => {
		setupAccountStore({ accountSettingsAttrs: {} });
		expect(
			isAppEnabled(normalizeApp({ name: 'carbonio-tasks-ui', attrKey })),
			`a module without a declared attrKey should be enabled, since there is no attribute to read`
		).toBe(true);
	});

	it.each(['TRUE', 'true'])('should enable a module whose attribute is %s', (value) => {
		setupAccountStore({ accountSettingsAttrs: { [ATTR_KEY]: value } });
		expect(
			isAppEnabled(normalizeApp({ name: 'carbonio-tasks-ui', attrKey: ATTR_KEY })),
			`a module should be enabled when ${ATTR_KEY} is ${value}`
		).toBe(true);
	});

	it.each(['FALSE', 'false'])('should not enable a module whose attribute is %s', (value) => {
		setupAccountStore({ accountSettingsAttrs: { [ATTR_KEY]: value } });
		expect(
			isAppEnabled(normalizeApp({ name: 'carbonio-tasks-ui', attrKey: ATTR_KEY })),
			`a module should not be enabled when ${ATTR_KEY} is ${value}`
		).toBe(false);
	});

	it('should not enable a module whose attribute is empty', () => {
		setupAccountStore({ accountSettingsAttrs: { [ATTR_KEY]: '' } });
		expect(
			isAppEnabled(normalizeApp({ name: 'carbonio-tasks-ui', attrKey: ATTR_KEY })),
			`a module should not be enabled when ${ATTR_KEY} has no value`
		).toBe(false);
	});

	it('should not enable a module whose attribute is missing', () => {
		setupAccountStore({ accountSettingsAttrs: {} });
		expect(
			isAppEnabled(normalizeApp({ name: 'carbonio-tasks-ui', attrKey: ATTR_KEY })),
			`a module should not be enabled when ${ATTR_KEY} is not returned at all`
		).toBe(false);
	});

	it('should enable a module whose attribute is missing when there is no account in focus mode', () => {
		vi.mocked(constants).IS_FOCUS_MODE = true;
		setupAccountStore({ accountSettingsAttrs: {} });
		useAccountStore.setState({ account: undefined });
		expect(
			isAppEnabled(normalizeApp({ name: 'carbonio-tasks-ui', attrKey: ATTR_KEY })),
			`a guest module should be enabled when there is no account to read ${ATTR_KEY} from`
		).toBe(true);
	});

	it('should not enable a module whose attribute is missing when there is no account outside focus mode', () => {
		setupAccountStore({ accountSettingsAttrs: {} });
		useAccountStore.setState({ account: undefined });
		expect(
			isAppEnabled(normalizeApp({ name: 'carbonio-tasks-ui', attrKey: ATTR_KEY })),
			`a module should stay gated outside focus mode, where an unusable session leads to login`
		).toBe(false);
	});
});
