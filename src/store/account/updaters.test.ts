/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { faker } from '@faker-js/faker';
import { times } from 'lodash';

import { useAccountStore } from './store';
import { updateAccount, updateSettings } from './updaters';
import { setupAccountStore } from '../../tests/account-utils';
import type { Identity, Signature } from '../../types/account';

describe('updateSettings', () => {
	it('should leave the settings state unchanged if no mods are set', () => {
		setupAccountStore();
		const prevSettings = useAccountStore.getState().settings;
		updateSettings({});
		expect(useAccountStore.getState().settings).toEqual(prevSettings);
	});

	it('should merge the given attr and leave the existing unchanged', () => {
		setupAccountStore({
			accountSettingsAttrs: {
				existingAttr: 'existing attr value'
			}
		});
		updateSettings({ attrs: { newAttr: 'new attr value' } });
		expect(useAccountStore.getState().settings).toEqual(
			expect.objectContaining({
				attrs: { existingAttr: 'existing attr value', newAttr: 'new attr value' }
			})
		);
	});

	it('should merge the given prop and leave the existing unchanged', () => {
		setupAccountStore({
			accountSettingsProps: [
				{
					name: 'existing prop name',
					zimlet: 'existing prop zimlet',
					_content: 'existing prop content'
				}
			]
		});
		updateSettings({
			props: {
				newProp: { app: 'new zimlet', value: 'enabled' }
			}
		});
		expect(useAccountStore.getState().settings).toEqual(
			expect.objectContaining({
				props: expect.arrayContaining([
					expect.objectContaining({ name: 'existing prop name' }),
					expect.objectContaining({ name: 'newProp' })
				])
			})
		);
	});

	it('should merge the given pref and leave the existing unchanged', () => {
		setupAccountStore({
			accountSettingsPrefs: {
				existingPref: 'existing pref value'
			}
		});
		updateSettings({ prefs: { newPref: 'new pref value' } });
		expect(useAccountStore.getState().settings).toEqual(
			expect.objectContaining({
				prefs: { existingPref: 'existing pref value', newPref: 'new pref value' }
			})
		);
	});
});

describe('updateAccount', () => {
	it('should leave the account state unchanged if no mods are set', () => {
		setupAccountStore();
		const prevState = useAccountStore.getState().account;
		updateAccount({});
		expect(useAccountStore.getState().account).toEqual(prevState);
	});

	it('should change the displayName of the account if the identity of the primary account is changed', () => {
		setupAccountStore();
		const prevState = useAccountStore.getState().account;
		if (!prevState) {
			throw new Error('Account not found in the store');
		}

		const newIdentityName = faker.person.fullName();
		updateAccount({
			identities: {
				identitiesMods: {
					modifyList: {
						[prevState.id]: {
							id: prevState.id,
							prefs: {
								zimbraPrefIdentityName: newIdentityName
							}
						}
					}
				},
				newIdentities: []
			}
		});
		expect(useAccountStore.getState().account?.displayName).toEqual(newIdentityName);
	});

	it('should update the store with a new identity', () => {
		setupAccountStore();
		const prevState = useAccountStore.getState().account;
		if (!prevState) {
			throw new Error('Account not found in the store');
		}

		const newIdentity: Identity = {
			id: faker.string.uuid(),
			name: faker.person.fullName(),
			_attrs: {}
		};

		updateAccount({
			identities: {
				identitiesMods: {},
				newIdentities: [newIdentity]
			}
		});

		expect(useAccountStore.getState().account?.identities.identity).toHaveLength(
			prevState.identities.identity.length + 1
		);
	});

	it('should update the store with the given signatures', () => {
		setupAccountStore();
		const prevState = useAccountStore.getState().account;
		if (!prevState) {
			throw new Error('Account not found in the store');
		}

		const signatures: Array<Signature> = times(
			5,
			(): Signature => ({
				id: faker.string.uuid(),
				name: faker.word.noun(),
				content: [
					{
						type: 'text/html',
						_content: `<p>${faker.person.fullName()}</p>`
					}
				]
			})
		);

		updateAccount({
			signatures
		});

		expect(useAccountStore.getState().account?.signatures.signature).toEqual(signatures);
	});

	it('updates in signatures should not change the identities in the store', () => {
		setupAccountStore();
		const prevState = useAccountStore.getState().account;
		if (!prevState) {
			throw new Error('Account not found in the store');
		}

		const signatures: Array<Signature> = times(
			5,
			(): Signature => ({
				id: faker.string.uuid(),
				name: faker.word.noun(),
				content: [
					{
						type: 'text/html',
						_content: `<p>${faker.person.fullName()}</p>`
					}
				]
			})
		);

		updateAccount({
			signatures
		});

		expect(useAccountStore.getState().account?.identities.identity).toEqual(
			prevState.identities.identity
		);
	});

	it('updates in identities should not change the signatures in the store', () => {
		setupAccountStore();
		const prevState = useAccountStore.getState().account;
		if (!prevState) {
			throw new Error('Account not found in the store');
		}

		const newIdentity: Identity = {
			id: faker.string.uuid(),
			name: faker.person.fullName(),
			_attrs: {}
		};

		updateAccount({
			identities: {
				identitiesMods: {},
				newIdentities: [newIdentity]
			}
		});

		expect(useAccountStore.getState().account?.signatures.signature).toEqual(
			prevState.signatures.signature
		);
	});
});
