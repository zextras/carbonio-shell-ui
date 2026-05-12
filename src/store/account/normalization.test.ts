/*
 * SPDX-FileCopyrightText: 2026 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import type { GetInfoResponse } from '@zextras/carbonio-ui-soap-lib';

import { normalizeAccount } from './normalization';
import { LOGGED_USER } from '../../tests/constants';
import type { BooleanString } from '../../types/account';

const baseGetInfoResponse: GetInfoResponse & { zimbraPasswordLocked?: BooleanString } = {
	id: LOGGED_USER.id,
	name: LOGGED_USER.name,
	version: '1.0.0',
	identities: LOGGED_USER.identities,
	signatures: { signature: [] },
	rights: { targets: [] },
	zimlets: { zimlet: [] },
	lifetime: 86400000,
	prefs: { _attrs: {} },
	attrs: { _attrs: { displayName: LOGGED_USER.attrs.displayName } },
	props: { prop: [] }
};

describe('normalizeAccount', () => {
	describe('changePasswordURL', () => {
		it('should include changePasswordURL when present in the response', () => {
			const { changePasswordURL } = normalizeAccount({
				...baseGetInfoResponse,
				changePasswordURL: 'https://example.com/change-password'
			});
			expect(changePasswordURL).toBe('https://example.com/change-password');
		});

		it('should have changePasswordURL undefined when absent from the response', () => {
			const { changePasswordURL } = normalizeAccount(baseGetInfoResponse);
			expect(changePasswordURL).toBeUndefined();
		});
	});

	describe('zimbraPasswordLocked', () => {
		it('should include zimbraPasswordLocked as TRUE when present in the response', () => {
			const { zimbraPasswordLocked } = normalizeAccount({
				...baseGetInfoResponse,
				zimbraPasswordLocked: 'TRUE'
			});
			expect(zimbraPasswordLocked).toBe('TRUE');
		});

		it('should include zimbraPasswordLocked as FALSE when present in the response', () => {
			const { zimbraPasswordLocked } = normalizeAccount({
				...baseGetInfoResponse,
				zimbraPasswordLocked: 'FALSE'
			});
			expect(zimbraPasswordLocked).toBe('FALSE');
		});

		it('should have zimbraPasswordLocked undefined when absent from the response', () => {
			const { zimbraPasswordLocked } = normalizeAccount(baseGetInfoResponse);
			expect(zimbraPasswordLocked).toBeUndefined();
		});
	});
});
