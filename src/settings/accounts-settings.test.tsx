/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React from 'react';

import 'jest-styled-components';
import { faker } from '@faker-js/faker';
import { act, screen, waitFor, within } from '@testing-library/react';
import { map } from 'lodash';
import { rest } from 'msw';
import { Link, Route, Switch } from 'react-router-dom';

import { identityToIdentityProps } from './account-wrapper';
import { AccountsSettings } from './accounts-settings';
import { Account, BatchRequest, IdentityProps } from '../../types';
import {
	GetRightsRequestBody,
	GetRightsResponseBody,
	getRightsRequest
} from '../mocks/handlers/getRightsRequest';
import server, { waitForRequest } from '../mocks/server';
import { useAccountStore } from '../store/account';
import { setup } from '../test/utils';

describe('Account setting', () => {
	async function waitForGetRightsRequest(): Promise<void> {
		await waitForRequest('post', '/service/soap/GetRightsRequest');
		await screen.findByText('sendAs');
	}

	test('Show primary identity inside the list', async () => {
		const fullName = faker.person.fullName();
		const email = faker.internet.email();
		const id = faker.string.uuid();

		const identitiesArray = [
			{
				id,
				name: 'DEFAULT',
				_attrs: {
					zimbraPrefIdentityName: fullName
				}
			}
		];

		const account: Account = {
			name: email,
			rights: { targets: [] },
			signatures: { signature: [] },
			id,
			displayName: '',
			identities: {
				identity: identitiesArray
			}
		};

		setup(
			<AccountsSettings
				account={account}
				identitiesDefault={map(identitiesArray, (item, index) =>
					identityToIdentityProps(item, index)
				)}
			/>
		);

		await waitForGetRightsRequest();
		expect(screen.getByText(fullName)).toBeVisible();
		expect(screen.getByText(`(${email})`)).toBeVisible();
		expect(screen.getByText('Primary')).toBeVisible();
	});

	test('Should show the new identity in the list when clicking on add', async () => {
		const firstName = faker.person.firstName();
		const lastName = faker.person.lastName();
		const fullName = faker.person.fullName({ firstName, lastName });
		const email = faker.internet.email({ firstName, lastName });
		const id = faker.string.uuid();

		const identitiesArray: Account['identities']['identity'] = [
			{
				id,
				name: 'DEFAULT',
				_attrs: {
					zimbraPrefIdentityName: fullName,
					zimbraPrefReplyToEnabled: 'FALSE',
					zimbraPrefFromDisplay: firstName
				}
			}
		];

		const account: Account = {
			name: email,
			rights: { targets: [] },
			signatures: { signature: [] },
			id,
			displayName: '',
			identities: {
				identity: identitiesArray
			}
		};

		const { user } = setup(
			<AccountsSettings
				account={account}
				identitiesDefault={map(identitiesArray, (item, index) =>
					identityToIdentityProps(item, index)
				)}
			/>
		);
		await waitForGetRightsRequest();
		await user.click(screen.getByRole('button', { name: /add persona/i }));
		expect(screen.getByText('New Persona 1')).toBeVisible();
	});

	test('Should increase the number of the persona when there are already identities with the default name', async () => {
		const defaultFirstName = faker.person.firstName();
		const defaultLastName = faker.person.lastName();
		const defaultFullName = faker.person.fullName({
			firstName: defaultFirstName,
			lastName: defaultLastName
		});
		const defaultEmail = faker.internet.email({
			firstName: defaultFirstName,
			lastName: defaultLastName
		});
		const defaultId = faker.string.uuid();

		const persona1FullName = 'New Persona 1';
		const persona1Email = faker.internet.email();
		const persona1Id = faker.string.uuid();

		const identitiesArray: Account['identities']['identity'] = [
			{
				id: persona1Id,
				name: persona1FullName,
				_attrs: {
					zimbraPrefIdentityName: persona1FullName,
					zimbraPrefReplyToEnabled: 'FALSE',
					zimbraPrefFromDisplay: '',
					zimbraPrefFromAddress: persona1Email,
					zimbraPrefIdentityId: persona1Id
				}
			},
			{
				id: defaultId,
				name: 'DEFAULT',
				_attrs: {
					zimbraPrefIdentityName: defaultFullName,
					zimbraPrefReplyToEnabled: 'FALSE',
					zimbraPrefFromDisplay: defaultFirstName,
					zimbraPrefFromAddress: defaultEmail,
					zimbraPrefIdentityId: defaultId
				}
			}
		];

		const account: Account = {
			name: defaultEmail,
			rights: { targets: [] },
			signatures: { signature: [] },
			id: defaultId,
			displayName: '',
			identities: {
				identity: identitiesArray
			}
		};

		const identitiesDefault = map(identitiesArray, (item, index) =>
			identityToIdentityProps(item, index)
		);

		identitiesDefault.unshift(identitiesDefault.pop() as IdentityProps);

		const { user } = setup(
			<AccountsSettings account={account} identitiesDefault={identitiesDefault} />
		);
		await waitForGetRightsRequest();
		expect(screen.getByText('New Persona 1')).toBeVisible();

		await user.click(screen.getByRole('button', { name: /add persona/i }));
		expect(screen.getByText('New Persona 2')).toBeVisible();
	});

	test('When existing persona identityName is updated but not yet saved, the old (but current) identityName should not be used as default one for a new persona', async () => {
		const defaultFirstName = faker.person.firstName();
		const defaultLastName = faker.person.lastName();
		const defaultFullName = faker.person.fullName({
			firstName: defaultFirstName,
			lastName: defaultLastName
		});
		const defaultEmail = faker.internet.email({
			firstName: defaultFirstName,
			lastName: defaultLastName
		});
		const defaultId = faker.string.uuid();

		const persona1FullName = 'New Persona 1';
		const persona1Email = faker.internet.email();
		const persona1Id = faker.string.uuid();

		const identitiesArray: Account['identities']['identity'] = [
			{
				id: persona1Id,
				name: persona1FullName,
				_attrs: {
					zimbraPrefIdentityName: persona1FullName,
					zimbraPrefReplyToEnabled: 'FALSE',
					zimbraPrefFromDisplay: '',
					zimbraPrefFromAddress: persona1Email,
					zimbraPrefIdentityId: persona1Id
				}
			},
			{
				id: defaultId,
				name: 'DEFAULT',
				_attrs: {
					zimbraPrefIdentityName: defaultFullName,
					zimbraPrefReplyToEnabled: 'FALSE',
					zimbraPrefFromDisplay: defaultFirstName,
					zimbraPrefFromAddress: defaultEmail,
					zimbraPrefIdentityId: defaultId
				}
			}
		];

		const account: Account = {
			name: defaultEmail,
			rights: { targets: [] },
			signatures: { signature: [] },
			id: defaultId,
			displayName: '',
			identities: {
				identity: identitiesArray
			}
		};

		const identitiesDefault = map(identitiesArray, (item, index) =>
			identityToIdentityProps(item, index)
		);

		identitiesDefault.unshift(identitiesDefault.pop() as IdentityProps);

		const { user } = setup(
			<AccountsSettings account={account} identitiesDefault={identitiesDefault} />
		);
		await waitForGetRightsRequest();

		const persona1Row = screen.getByText('New Persona 1');
		expect(persona1Row).toBeVisible();
		await user.click(persona1Row);

		const accountNameInput = screen.getByRole('textbox', { name: /persona name/i });
		expect(accountNameInput).toHaveDisplayValue('New Persona 1');

		expect(
			within(screen.getByTestId(`account-list-item-${persona1Id}`)).getByText('New Persona 1')
		).toBeVisible();

		const newName = 'Updated Name';
		await user.clear(accountNameInput);
		await user.type(accountNameInput, newName);

		expect(accountNameInput).toHaveDisplayValue(newName);
		expect(
			within(screen.getByTestId(`account-list-item-${persona1Id}`)).getByText(newName)
		).toBeVisible();

		await user.click(screen.getByRole('button', { name: /add persona/i }));
		expect(
			within(screen.getByTestId(`account-list-item-0`)).getByText('New Persona 2')
		).toBeVisible();
	});

	test('When create a new persona and modify the proposed identityName before saving and than create another persona the proposed identityName should be the same', async () => {
		const defaultFirstName = faker.person.firstName();
		const defaultLastName = faker.person.lastName();
		const defaultFullName = faker.person.fullName({
			firstName: defaultFirstName,
			lastName: defaultLastName
		});
		const defaultEmail = faker.internet.email({
			firstName: defaultFirstName,
			lastName: defaultLastName
		});
		const defaultId = faker.string.uuid();

		const identitiesArray: Account['identities']['identity'] = [
			{
				id: defaultId,
				name: 'DEFAULT',
				_attrs: {
					zimbraPrefIdentityName: defaultFullName,
					zimbraPrefReplyToEnabled: 'FALSE',
					zimbraPrefFromDisplay: defaultFirstName,
					zimbraPrefFromAddress: defaultEmail,
					zimbraPrefIdentityId: defaultId
				}
			}
		];

		const account: Account = {
			name: defaultEmail,
			rights: { targets: [] },
			signatures: { signature: [] },
			id: defaultId,
			displayName: '',
			identities: {
				identity: identitiesArray
			}
		};

		const identitiesDefault = map(identitiesArray, (item, index) =>
			identityToIdentityProps(item, index)
		);

		identitiesDefault.unshift(identitiesDefault.pop() as IdentityProps);

		const { user } = setup(
			<AccountsSettings account={account} identitiesDefault={identitiesDefault} />
		);
		await waitForGetRightsRequest();

		await user.click(screen.getByRole('button', { name: /add persona/i }));

		const persona1Row = screen.getByText('New Persona 1');
		expect(persona1Row).toBeVisible();
		await user.click(persona1Row);

		const accountNameInput = screen.getByRole('textbox', { name: /persona name/i });
		expect(accountNameInput).toHaveDisplayValue('New Persona 1');

		expect(
			within(screen.getByTestId(`account-list-item-0`)).getByText('New Persona 1')
		).toBeVisible();

		const newName = 'Updated Name';
		await user.clear(accountNameInput);
		await user.type(accountNameInput, newName);

		expect(accountNameInput).toHaveDisplayValue(newName);
		expect(within(screen.getByTestId(`account-list-item-0`)).getByText(newName)).toBeVisible();

		await user.click(screen.getByRole('button', { name: /add persona/i }));
		expect(screen.getByText('New Persona 1')).toBeVisible();
		expect(
			within(screen.getByTestId(`account-list-item-1`)).getByText('New Persona 1')
		).toBeVisible();
		expect(screen.queryByText('New Persona 2')).not.toBeInTheDocument();
	});

	test('When existing persona is deleted but not yet saved, the old (but current) identityName should not be used as default one for a new persona', async () => {
		const defaultFirstName = faker.person.firstName();
		const defaultLastName = faker.person.lastName();
		const defaultFullName = faker.person.fullName({
			firstName: defaultFirstName,
			lastName: defaultLastName
		});
		const defaultEmail = faker.internet.email({
			firstName: defaultFirstName,
			lastName: defaultLastName
		});
		const defaultId = faker.string.uuid();

		const persona1FullName = 'New Persona 1';
		const persona1Email = faker.internet.email();
		const persona1Id = faker.string.uuid();

		const identitiesArray: Account['identities']['identity'] = [
			{
				id: persona1Id,
				name: persona1FullName,
				_attrs: {
					zimbraPrefIdentityName: persona1FullName,
					zimbraPrefReplyToEnabled: 'FALSE',
					zimbraPrefFromDisplay: '',
					zimbraPrefFromAddress: persona1Email,
					zimbraPrefIdentityId: persona1Id
				}
			},
			{
				id: defaultId,
				name: 'DEFAULT',
				_attrs: {
					zimbraPrefIdentityName: defaultFullName,
					zimbraPrefReplyToEnabled: 'FALSE',
					zimbraPrefFromDisplay: defaultFirstName,
					zimbraPrefFromAddress: defaultEmail,
					zimbraPrefIdentityId: defaultId
				}
			}
		];

		const account: Account = {
			name: defaultEmail,
			rights: { targets: [] },
			signatures: { signature: [] },
			id: defaultId,
			displayName: '',
			identities: {
				identity: identitiesArray
			}
		};

		const identitiesDefault = map(identitiesArray, (item, index) =>
			identityToIdentityProps(item, index)
		);

		identitiesDefault.unshift(identitiesDefault.pop() as IdentityProps);

		const { user } = setup(
			<AccountsSettings account={account} identitiesDefault={identitiesDefault} />
		);
		await waitForGetRightsRequest();

		const persona1Row = screen.getByText('New Persona 1');
		expect(persona1Row).toBeVisible();
		await user.click(persona1Row);

		await user.click(screen.getByRole('button', { name: /delete/i }));
		const confirmButton = await screen.findByRole('button', { name: /delete permanently/i });
		act(() => {
			// run modal timers
			jest.runOnlyPendingTimers();
		});
		await user.click(confirmButton);
		expect(persona1Row).not.toBeInTheDocument();

		await user.click(screen.getByRole('button', { name: /add persona/i }));
		expect(
			within(screen.getByTestId(`account-list-item-0`)).getByText('New Persona 2')
		).toBeVisible();
	});

	test('When create a new persona and delete it before saving and than create another persona the proposed identityName should be the same', async () => {
		const defaultFirstName = faker.person.firstName();
		const defaultLastName = faker.person.lastName();
		const defaultFullName = faker.person.fullName({
			firstName: defaultFirstName,
			lastName: defaultLastName
		});
		const defaultEmail = faker.internet.email({
			firstName: defaultFirstName,
			lastName: defaultLastName
		});
		const defaultId = faker.string.uuid();

		const identitiesArray: Account['identities']['identity'] = [
			{
				id: defaultId,
				name: 'DEFAULT',
				_attrs: {
					zimbraPrefIdentityName: defaultFullName,
					zimbraPrefReplyToEnabled: 'FALSE',
					zimbraPrefFromDisplay: defaultFirstName,
					zimbraPrefFromAddress: defaultEmail,
					zimbraPrefIdentityId: defaultId
				}
			}
		];

		const account: Account = {
			name: defaultEmail,
			rights: { targets: [] },
			signatures: { signature: [] },
			id: defaultId,
			displayName: '',
			identities: {
				identity: identitiesArray
			}
		};

		const identitiesDefault = map(identitiesArray, (item, index) =>
			identityToIdentityProps(item, index)
		);

		identitiesDefault.unshift(identitiesDefault.pop() as IdentityProps);

		const { user } = setup(
			<AccountsSettings account={account} identitiesDefault={identitiesDefault} />
		);
		await waitForGetRightsRequest();

		await user.click(screen.getByRole('button', { name: /add persona/i }));

		const persona1Row = screen.getByText('New Persona 1');
		expect(persona1Row).toBeVisible();
		await user.click(persona1Row);

		await user.click(screen.getByRole('button', { name: /delete/i }));
		const confirmButton = await screen.findByRole('button', { name: /delete permanently/i });
		act(() => {
			// run modal timers
			jest.runOnlyPendingTimers();
		});
		await user.click(confirmButton);
		expect(persona1Row).not.toBeInTheDocument();

		await user.click(screen.getByRole('button', { name: /add persona/i }));
		expect(screen.getByText('New Persona 1')).toBeVisible();
		expect(
			within(screen.getByTestId(`account-list-item-1`)).getByText('New Persona 1')
		).toBeVisible();
		expect(screen.queryByText('New Persona 2')).not.toBeInTheDocument();
	});

	test('Should not increase the counter if the identities have a name different from the default', async () => {
		const defaultFirstName = faker.person.firstName();
		const defaultLastName = faker.person.lastName();
		const defaultFullName = faker.person.fullName({
			firstName: defaultFirstName,
			lastName: defaultLastName
		});
		const defaultEmail = faker.internet.email({
			firstName: defaultFirstName,
			lastName: defaultLastName
		});
		const defaultId = faker.string.uuid();

		const persona1FullName = faker.person.fullName();
		const persona1Email = faker.internet.email();
		const persona1Id = faker.string.uuid();

		const identitiesArray: Account['identities']['identity'] = [
			{
				id: persona1Id,
				name: persona1FullName,
				_attrs: {
					zimbraPrefIdentityName: persona1FullName,
					zimbraPrefReplyToEnabled: 'FALSE',
					zimbraPrefFromDisplay: '',
					zimbraPrefFromAddress: persona1Email,
					zimbraPrefIdentityId: persona1Id
				}
			},
			{
				id: defaultId,
				name: 'DEFAULT',
				_attrs: {
					zimbraPrefIdentityName: defaultFullName,
					zimbraPrefReplyToEnabled: 'FALSE',
					zimbraPrefFromDisplay: defaultFirstName,
					zimbraPrefFromAddress: defaultEmail,
					zimbraPrefIdentityId: defaultId
				}
			}
		];

		const account: Account = {
			name: defaultEmail,
			rights: { targets: [] },
			signatures: { signature: [] },
			id: defaultId,
			displayName: '',
			identities: {
				identity: identitiesArray
			}
		};

		const identitiesDefault = map(identitiesArray, (item, index) =>
			identityToIdentityProps(item, index)
		);

		identitiesDefault.unshift(identitiesDefault.pop() as IdentityProps);

		const { user } = setup(
			<AccountsSettings account={account} identitiesDefault={identitiesDefault} />
		);
		await waitForGetRightsRequest();
		expect(screen.getByText(persona1FullName)).toBeVisible();

		await user.click(screen.getByRole('button', { name: /add persona/i }));
		expect(screen.getByText('New Persona 1')).toBeVisible();
	});

	test('Should remove the identity from the list on delete action', async () => {
		const defaultFirstName = faker.person.firstName();
		const defaultLastName = faker.person.lastName();
		const defaultFullName = faker.person.fullName({
			firstName: defaultFirstName,
			lastName: defaultLastName
		});
		const defaultEmail = faker.internet.email({
			firstName: defaultFirstName,
			lastName: defaultLastName
		});
		const defaultId = faker.string.uuid();

		const persona1FullName = faker.person.fullName();
		const persona1Email = faker.internet.email();
		const persona1Id = faker.string.uuid();

		const identitiesArray: Account['identities']['identity'] = [
			{
				id: persona1Id,
				name: persona1FullName,
				_attrs: {
					zimbraPrefIdentityName: persona1FullName,
					zimbraPrefReplyToEnabled: 'FALSE',
					zimbraPrefFromDisplay: '',
					zimbraPrefFromAddress: persona1Email,
					zimbraPrefIdentityId: persona1Id
				}
			},
			{
				id: defaultId,
				name: 'DEFAULT',
				_attrs: {
					zimbraPrefIdentityName: defaultFullName,
					zimbraPrefReplyToEnabled: 'FALSE',
					zimbraPrefFromDisplay: defaultFirstName,
					zimbraPrefFromAddress: defaultEmail,
					zimbraPrefIdentityId: defaultId
				}
			}
		];

		const account: Account = {
			name: defaultEmail,
			rights: { targets: [] },
			signatures: { signature: [] },
			id: defaultId,
			displayName: '',
			identities: {
				identity: identitiesArray
			}
		};

		const identitiesDefault = map(identitiesArray, (item, index) =>
			identityToIdentityProps(item, index)
		);

		identitiesDefault.unshift(identitiesDefault.pop() as IdentityProps);

		const { user } = setup(
			<AccountsSettings account={account} identitiesDefault={identitiesDefault} />
		);
		await waitForGetRightsRequest();
		const persona1Row = screen.getByText(persona1FullName);
		expect(persona1Row).toBeVisible();
		await user.click(persona1Row);
		await user.click(screen.getByRole('button', { name: /delete/i }));
		const confirmButton = await screen.findByRole('button', { name: /delete permanently/i });
		act(() => {
			// run modal timers
			jest.runOnlyPendingTimers();
		});
		await user.click(confirmButton);
		expect(persona1Row).not.toBeInTheDocument();
	});

	test('Should create only identities which have not been removed from the unsaved changes', async () => {
		const defaultFirstName = faker.person.firstName();
		const defaultLastName = faker.person.lastName();
		const defaultFullName = faker.person.fullName({
			firstName: defaultFirstName,
			lastName: defaultLastName
		});
		const defaultEmail = faker.internet.email({
			firstName: defaultFirstName,
			lastName: defaultLastName
		});
		const defaultId = faker.string.uuid();

		const identitiesArray: Account['identities']['identity'] = [
			{
				id: defaultId,
				name: 'DEFAULT',
				_attrs: {
					zimbraPrefIdentityName: defaultFullName,
					zimbraPrefReplyToEnabled: 'FALSE',
					zimbraPrefFromDisplay: defaultFirstName,
					zimbraPrefFromAddress: defaultEmail,
					zimbraPrefIdentityId: defaultId
				}
			}
		];

		const account: Account = {
			name: defaultEmail,
			rights: { targets: [] },
			signatures: { signature: [] },
			id: defaultId,
			displayName: '',
			identities: {
				identity: identitiesArray
			}
		};

		const identitiesDefault = map(identitiesArray, (item, index) =>
			identityToIdentityProps(item, index)
		);

		identitiesDefault.unshift(identitiesDefault.pop() as IdentityProps);

		const batchRequestUrl = '/service/soap/BatchRequest';
		server.use(
			rest.post(batchRequestUrl, (req, res, ctx) =>
				res(
					ctx.json({
						Body: {
							BatchResponse: {
								CreateIdentityResponse: []
							}
						}
					})
				)
			)
		);

		const pendingBatchRequest = waitForRequest('POST', batchRequestUrl);

		const { user } = setup(
			<AccountsSettings account={account} identitiesDefault={identitiesDefault} />
		);

		await waitForGetRightsRequest();

		await user.click(screen.getByRole('button', { name: /add persona/i }));
		await waitFor(() =>
			expect(screen.getByRole('textbox', { name: /persona name/i })).toHaveDisplayValue(
				/new persona 1/i
			)
		);

		const persona1 = 'New Persona 1';
		const persona2 = 'New Persona 2';
		const persona3 = 'New Persona 3';
		expect(screen.getByText(persona1)).toBeVisible();

		await user.click(screen.getByRole('button', { name: /add persona/i }));
		await waitFor(() =>
			expect(screen.getByRole('textbox', { name: /persona name/i })).toHaveDisplayValue(persona2)
		);
		expect(screen.getByText(persona2)).toBeVisible();

		await user.click(screen.getByRole('button', { name: /add persona/i }));
		await waitFor(() =>
			expect(screen.getByRole('textbox', { name: /persona name/i })).toHaveDisplayValue(persona3)
		);
		expect(screen.getByText(persona3)).toBeVisible();

		await user.click(screen.getByText(persona1));
		await waitFor(() =>
			expect(screen.getByRole('textbox', { name: /persona name/i })).toHaveDisplayValue(persona1)
		);
		await user.click(screen.getByRole('button', { name: /delete/i }));
		let confirmButton = await screen.findByRole('button', { name: /delete permanently/i });
		act(() => {
			// run modal timers
			jest.runOnlyPendingTimers();
		});
		await user.click(confirmButton);
		await screen.findByText(/primary account settings/i);
		expect(screen.queryByText(persona1)).not.toBeInTheDocument();

		await user.click(screen.getByText(persona2));
		await waitFor(() =>
			expect(screen.getByRole('textbox', { name: /persona name/i })).toHaveDisplayValue(persona2)
		);
		await user.click(screen.getByRole('button', { name: /delete/i }));
		confirmButton = await screen.findByRole('button', { name: /delete permanently/i });
		act(() => {
			// run modal timers
			jest.runOnlyPendingTimers();
		});
		await user.click(confirmButton);
		await screen.findByText(/primary account settings/i);
		expect(screen.queryByText(persona2)).not.toBeInTheDocument();

		await user.click(screen.getByRole('button', { name: /save/i }));

		const request = await pendingBatchRequest;

		const requestBody = (request?.body as { Body: { BatchRequest: BatchRequest } }).Body;
		expect(requestBody.BatchRequest.CreateIdentityRequest).toHaveLength(1);
		expect(requestBody.BatchRequest.DeleteIdentityRequest).toBeUndefined();
		expect(requestBody.BatchRequest.ModifyIdentityRequest).toBeUndefined();

		const successSnackbar = await screen.findByText('Edits saved correctly');
		expect(successSnackbar).toBeVisible();
	});

	test('Should remove from the list added identities not saved on discard changes', async () => {
		const defaultFirstName = faker.person.firstName();
		const defaultLastName = faker.person.lastName();
		const defaultFullName = faker.person.fullName({
			firstName: defaultFirstName,
			lastName: defaultLastName
		});
		const defaultEmail = faker.internet.email({
			firstName: defaultFirstName,
			lastName: defaultLastName
		});
		const defaultId = faker.string.uuid();

		const identitiesArray: Account['identities']['identity'] = [
			{
				id: defaultId,
				name: 'DEFAULT',
				_attrs: {
					zimbraPrefIdentityName: defaultFullName,
					zimbraPrefReplyToEnabled: 'FALSE',
					zimbraPrefFromDisplay: defaultFirstName,
					zimbraPrefFromAddress: defaultEmail,
					zimbraPrefIdentityId: defaultId
				}
			}
		];

		const account: Account = {
			name: defaultEmail,
			rights: { targets: [] },
			signatures: { signature: [] },
			id: defaultId,
			displayName: '',
			identities: {
				identity: identitiesArray
			}
		};

		const identitiesDefault = map(identitiesArray, (item, index) =>
			identityToIdentityProps(item, index)
		);

		identitiesDefault.unshift(identitiesDefault.pop() as IdentityProps);

		const { user } = setup(
			<AccountsSettings account={account} identitiesDefault={identitiesDefault} />
		);

		await waitForGetRightsRequest();

		const persona1 = 'New Persona 1';
		await user.click(screen.getByRole('button', { name: /add persona/i }));
		expect(screen.getByText(persona1)).toBeVisible();

		await user.click(screen.getByRole('button', { name: /discard changes/i }));
		expect(screen.queryByText(persona1)).not.toBeInTheDocument();
	});

	test('Should add in the list removed identities not saved on discard changes', async () => {
		const defaultFirstName = faker.person.firstName();
		const defaultLastName = faker.person.lastName();
		const defaultFullName = faker.person.fullName({
			firstName: defaultFirstName,
			lastName: defaultLastName
		});
		const defaultEmail = faker.internet.email({
			firstName: defaultFirstName,
			lastName: defaultLastName
		});
		const defaultId = faker.string.uuid();

		const persona1FullName = 'New Persona 1';
		const persona1Email = faker.internet.email();
		const persona1Id = faker.string.uuid();

		const identitiesArray: Account['identities']['identity'] = [
			{
				id: persona1Id,
				name: persona1FullName,
				_attrs: {
					zimbraPrefIdentityName: persona1FullName,
					zimbraPrefReplyToEnabled: 'FALSE',
					zimbraPrefFromDisplay: '',
					zimbraPrefFromAddress: persona1Email,
					zimbraPrefIdentityId: persona1Id
				}
			},
			{
				id: defaultId,
				name: 'DEFAULT',
				_attrs: {
					zimbraPrefIdentityName: defaultFullName,
					zimbraPrefReplyToEnabled: 'FALSE',
					zimbraPrefFromDisplay: defaultFirstName,
					zimbraPrefFromAddress: defaultEmail,
					zimbraPrefIdentityId: defaultId
				}
			}
		];

		const account: Account = {
			name: defaultEmail,
			rights: { targets: [] },
			signatures: { signature: [] },
			id: defaultId,
			displayName: '',
			identities: {
				identity: identitiesArray
			}
		};

		const identitiesDefault = map(identitiesArray, (item, index) =>
			identityToIdentityProps(item, index)
		);

		identitiesDefault.unshift(identitiesDefault.pop() as IdentityProps);

		const { user } = setup(
			<AccountsSettings account={account} identitiesDefault={identitiesDefault} />
		);
		await waitForGetRightsRequest();

		expect(screen.getByText(persona1FullName)).toBeVisible();

		await user.click(screen.getByText(persona1FullName));
		await user.click(screen.getByRole('button', { name: /delete/i }));
		const confirmButton = screen.getByRole('button', { name: /delete permanently/i });
		act(() => {
			// run modal timers
			jest.runOnlyPendingTimers();
		});
		await user.click(confirmButton);
		expect(screen.queryByText(persona1FullName)).not.toBeInTheDocument();

		await user.click(screen.getByRole('button', { name: /discard changes/i }));

		expect(screen.getByText(persona1FullName)).toBeVisible();
	});

	test('Should update name of the identity in the list if the user change it from the input(default case)', async () => {
		const defaultFirstName = faker.person.firstName();
		const defaultLastName = faker.person.lastName();
		const defaultFullName = faker.person.fullName({
			firstName: defaultFirstName,
			lastName: defaultLastName
		});
		const defaultEmail = faker.internet.email({
			firstName: defaultFirstName,
			lastName: defaultLastName
		});
		const defaultId = faker.string.uuid();

		const identitiesArray: Account['identities']['identity'] = [
			{
				id: defaultId,
				name: 'DEFAULT',
				_attrs: {
					zimbraPrefIdentityName: defaultFullName,
					zimbraPrefReplyToEnabled: 'FALSE',
					zimbraPrefFromDisplay: defaultFirstName,
					zimbraPrefFromAddress: defaultEmail,
					zimbraPrefIdentityId: defaultId
				}
			}
		];

		const account: Account = {
			name: defaultEmail,
			rights: { targets: [] },
			signatures: { signature: [] },
			id: defaultId,
			displayName: '',
			identities: {
				identity: identitiesArray
			}
		};

		const identitiesDefault = map(identitiesArray, (item, index) =>
			identityToIdentityProps(item, index)
		);

		identitiesDefault.unshift(identitiesDefault.pop() as IdentityProps);

		const { user } = setup(
			<AccountsSettings account={account} identitiesDefault={identitiesDefault} />
		);
		await waitForGetRightsRequest();

		const accountNameInput = screen.getByRole('textbox', { name: /account name/i });
		expect(accountNameInput).toHaveDisplayValue(defaultFullName);

		expect(
			within(screen.getByTestId(`account-list-item-${defaultId}`)).getByText(defaultFullName)
		).toBeVisible();

		const newName = 'Updated Name';
		await user.clear(accountNameInput);
		await user.type(accountNameInput, newName);

		expect(accountNameInput).toHaveDisplayValue(newName);
		expect(
			within(screen.getByTestId(`account-list-item-${defaultId}`)).getByText(newName)
		).toBeVisible();
	});

	test('Should reset the updated identity name on discard changes(default case)', async () => {
		const defaultFirstName = faker.person.firstName();
		const defaultLastName = faker.person.lastName();
		const defaultFullName = faker.person.fullName({
			firstName: defaultFirstName,
			lastName: defaultLastName
		});
		const defaultEmail = faker.internet.email({
			firstName: defaultFirstName,
			lastName: defaultLastName
		});
		const defaultId = faker.string.uuid();

		const identitiesArray: Account['identities']['identity'] = [
			{
				id: defaultId,
				name: 'DEFAULT',
				_attrs: {
					zimbraPrefIdentityName: defaultFullName,
					zimbraPrefReplyToEnabled: 'FALSE',
					zimbraPrefFromDisplay: defaultFirstName,
					zimbraPrefFromAddress: defaultEmail,
					zimbraPrefIdentityId: defaultId
				}
			}
		];

		const account: Account = {
			name: defaultEmail,
			rights: { targets: [] },
			signatures: { signature: [] },
			id: defaultId,
			displayName: '',
			identities: {
				identity: identitiesArray
			}
		};

		const identitiesDefault = map(identitiesArray, (item, index) =>
			identityToIdentityProps(item, index)
		);

		identitiesDefault.unshift(identitiesDefault.pop() as IdentityProps);

		const { user } = setup(
			<AccountsSettings account={account} identitiesDefault={identitiesDefault} />
		);
		await waitForGetRightsRequest();

		const accountNameInput = screen.getByRole('textbox', { name: /account name/i });
		expect(accountNameInput).toHaveDisplayValue(defaultFullName);

		expect(
			within(screen.getByTestId(`account-list-item-${defaultId}`)).getByText(defaultFullName)
		).toBeVisible();

		const newName = 'Updated Name';
		await user.clear(accountNameInput);
		await user.type(accountNameInput, newName);

		expect(accountNameInput).toHaveDisplayValue(newName);
		expect(
			within(screen.getByTestId(`account-list-item-${defaultId}`)).getByText(newName)
		).toBeVisible();

		await user.click(screen.getByRole('button', { name: /discard changes/i }));

		expect(
			within(screen.getByTestId(`account-list-item-${defaultId}`)).getByText(defaultFullName)
		).toBeVisible();
		expect(accountNameInput).toHaveDisplayValue(defaultFullName);
	});

	test('Should not allow updating primary account email', async () => {
		const defaultFirstName = faker.person.firstName();
		const defaultLastName = faker.person.lastName();
		const defaultFullName = faker.person.fullName({
			firstName: defaultFirstName,
			lastName: defaultLastName
		});
		const defaultEmail = faker.internet.email({
			firstName: defaultFirstName,
			lastName: defaultLastName
		});
		const defaultId = faker.string.uuid();

		const identitiesArray: Account['identities']['identity'] = [
			{
				id: defaultId,
				name: 'DEFAULT',
				_attrs: {
					zimbraPrefIdentityName: defaultFullName,
					zimbraPrefReplyToEnabled: 'FALSE',
					zimbraPrefFromDisplay: defaultFirstName,
					zimbraPrefFromAddress: defaultEmail,
					zimbraPrefIdentityId: defaultId
				}
			}
		];

		const account: Account = {
			name: defaultEmail,
			rights: { targets: [] },
			signatures: { signature: [] },
			id: defaultId,
			displayName: '',
			identities: {
				identity: identitiesArray
			}
		};

		const identitiesDefault = map(identitiesArray, (item, index) =>
			identityToIdentityProps(item, index)
		);

		identitiesDefault.unshift(identitiesDefault.pop() as IdentityProps);

		const { user } = setup(
			<AccountsSettings account={account} identitiesDefault={identitiesDefault} />
		);
		await waitForGetRightsRequest();

		const emailAddressInput = screen.getByRole('textbox', { name: /E-mail address/i });
		expect(emailAddressInput).toHaveDisplayValue(defaultEmail);

		const newMail = 'acb';
		await user.clear(emailAddressInput);

		expect(screen.getByRole('button', { name: /discard changes/i })).toBeDisabled();
		expect(screen.getByRole('button', { name: /save/i })).toBeDisabled();

		await user.type(emailAddressInput, newMail);

		expect(screen.getByRole('button', { name: /discard changes/i })).toBeDisabled();
		expect(screen.getByRole('button', { name: /save/i })).toBeDisabled();

		expect(emailAddressInput).toHaveDisplayValue(defaultEmail);
	});

	describe('Delegates', () => {
		// TODO waiting for radio component refactor to better find active radio
		test.todo('The value received in the pref is the one checked in the UI');

		test('When the value change, the save button and discard button becomes enabled', async () => {
			useAccountStore.setState((previousState) => ({
				...previousState,
				settings: {
					...previousState.settings,
					prefs: { zimbraPrefDelegatedSendSaveTarget: 'owner' }
				}
			}));

			const defaultFirstName = faker.person.firstName();
			const defaultLastName = faker.person.lastName();
			const defaultFullName = faker.person.fullName({
				firstName: defaultFirstName,
				lastName: defaultLastName
			});
			const defaultEmail = faker.internet.email({
				firstName: defaultFirstName,
				lastName: defaultLastName
			});
			const defaultId = faker.string.uuid();

			const identitiesArray: Account['identities']['identity'] = [
				{
					id: defaultId,
					name: 'DEFAULT',
					_attrs: {
						zimbraPrefIdentityName: defaultFullName,
						zimbraPrefReplyToEnabled: 'FALSE',
						zimbraPrefFromDisplay: defaultFirstName,
						zimbraPrefFromAddress: defaultEmail,
						zimbraPrefIdentityId: defaultId
					}
				}
			];

			const account: Account = {
				name: defaultEmail,
				rights: { targets: [] },
				signatures: { signature: [] },
				id: defaultId,
				displayName: '',
				identities: {
					identity: identitiesArray
				}
			};

			const identitiesDefault = map(identitiesArray, (item, index) =>
				identityToIdentityProps(item, index)
			);

			identitiesDefault.unshift(identitiesDefault.pop() as IdentityProps);

			const { user } = setup(
				<AccountsSettings account={account} identitiesDefault={identitiesDefault} />
			);
			await waitForGetRightsRequest();

			expect(screen.getByRole('button', { name: /discard changes/i })).toBeDisabled();
			expect(screen.getByRole('button', { name: /save/i })).toBeDisabled();

			const senderOptionRow = screen.getByText(
				'Save a copy of sent messages to delegate’s Sent folder'
			);
			await user.click(senderOptionRow);

			expect(screen.getByRole('button', { name: /discard changes/i })).toBeEnabled();
			expect(screen.getByRole('button', { name: /save/i })).toBeEnabled();
		});

		test('When the user change the value and click on save, the network request contains the new value', async () => {
			useAccountStore.setState((previousState) => ({
				...previousState,
				settings: {
					...previousState.settings,
					prefs: { zimbraPrefDelegatedSendSaveTarget: 'owner' }
				}
			}));

			const defaultFirstName = faker.person.firstName();
			const defaultLastName = faker.person.lastName();
			const defaultFullName = faker.person.fullName({
				firstName: defaultFirstName,
				lastName: defaultLastName
			});
			const defaultEmail = faker.internet.email({
				firstName: defaultFirstName,
				lastName: defaultLastName
			});
			const defaultId = faker.string.uuid();

			const identitiesArray: Account['identities']['identity'] = [
				{
					id: defaultId,
					name: 'DEFAULT',
					_attrs: {
						zimbraPrefIdentityName: defaultFullName,
						zimbraPrefReplyToEnabled: 'FALSE',
						zimbraPrefFromDisplay: defaultFirstName,
						zimbraPrefFromAddress: defaultEmail,
						zimbraPrefIdentityId: defaultId
					}
				}
			];

			const account: Account = {
				name: defaultEmail,
				rights: { targets: [] },
				signatures: { signature: [] },
				id: defaultId,
				displayName: '',
				identities: {
					identity: identitiesArray
				}
			};

			const identitiesDefault = map(identitiesArray, (item, index) =>
				identityToIdentityProps(item, index)
			);

			identitiesDefault.unshift(identitiesDefault.pop() as IdentityProps);
			server.use(
				rest.post('/service/soap/BatchRequest', (req, res, ctx) =>
					res(
						ctx.json({
							Body: {
								BatchResponse: {
									ModifyPrefsResponse: [{ _jsns: 'urn:zimbraAccount' }]
								}
							}
						})
					)
				)
			);
			const pendingBatchRequest = waitForRequest('POST', '/service/soap/BatchRequest');

			const { user } = setup(
				<AccountsSettings account={account} identitiesDefault={identitiesDefault} />
			);
			await waitForGetRightsRequest();

			expect(screen.getByRole('button', { name: /discard changes/i })).toBeDisabled();
			expect(screen.getByRole('button', { name: /save/i })).toBeDisabled();

			const senderOptionRow = screen.getByText(
				'Save a copy of sent messages to delegate’s Sent folder'
			);
			await user.click(senderOptionRow);

			expect(screen.getByRole('button', { name: /discard changes/i })).toBeEnabled();
			expect(screen.getByRole('button', { name: /save/i })).toBeEnabled();

			await user.click(screen.getByRole('button', { name: /save/i }));
			const request = await pendingBatchRequest;
			const requestBody = (request?.body as { Body: { BatchRequest: BatchRequest } }).Body;
			expect(requestBody.BatchRequest.CreateIdentityRequest).toBeUndefined();
			expect(requestBody.BatchRequest.DeleteIdentityRequest).toBeUndefined();
			expect(requestBody.BatchRequest.ModifyIdentityRequest).toBeUndefined();

			expect(
				requestBody.BatchRequest.ModifyPrefsRequest?._attrs.zimbraPrefDelegatedSendSaveTarget
			).toBe('sender');

			const successSnackbar = await screen.findByText('Edits saved correctly');
			expect(successSnackbar).toBeVisible();
		});
		test('GetRightRequest is called only once when the user navigates inside account settings', async () => {
			const defaultFirstName = faker.person.firstName();
			const defaultLastName = faker.person.lastName();
			const defaultFullName = faker.person.fullName({
				firstName: defaultFirstName,
				lastName: defaultLastName
			});
			const defaultEmail = faker.internet.email({
				firstName: defaultFirstName,
				lastName: defaultLastName
			});
			const defaultId = faker.string.uuid();

			const identitiesArray: Account['identities']['identity'] = [
				{
					id: defaultId,
					name: 'DEFAULT',
					_attrs: {
						zimbraPrefIdentityName: defaultFullName,
						zimbraPrefReplyToEnabled: 'FALSE',
						zimbraPrefFromDisplay: defaultFirstName,
						zimbraPrefFromAddress: defaultEmail,
						zimbraPrefIdentityId: defaultId
					}
				}
			];

			const account: Account = {
				name: defaultEmail,
				rights: { targets: [] },
				signatures: { signature: [] },
				id: defaultId,
				displayName: '',
				identities: {
					identity: identitiesArray
				}
			};

			const identitiesDefault = map(identitiesArray, (item, index) =>
				identityToIdentityProps(item, index)
			);

			identitiesDefault.unshift(identitiesDefault.pop() as IdentityProps);
			const requestFn = jest.fn();
			server.use(
				rest.post<GetRightsRequestBody, never, GetRightsResponseBody>(
					'/service/soap/GetRightsRequest',
					(req, res, context) => {
						requestFn();
						return getRightsRequest(req, res, context);
					}
				)
			);

			const TestComponent = (): JSX.Element => (
				<>
					<AccountsSettings account={account} identitiesDefault={identitiesDefault} />
					<Link to="/other">Go to Other page</Link>
					<Switch>
						<Route path="/other">
							<div>
								<span data-testid="text">Other page</span>
								<Link to="/settings/accounts">Go to Account Settings</Link>
							</div>
						</Route>
					</Switch>
				</>
			);

			const { user } = setup(<TestComponent />);

			await waitForGetRightsRequest();
			await waitFor(() => {
				expect(requestFn).toHaveBeenCalledTimes(1);
			});
			expect(screen.queryByTestId('text')).not.toBeInTheDocument();
			expect(screen.getByText(/Accounts List/i)).toBeVisible();
			await user.click(screen.getByRole('link', { name: 'Go to Other page' }));
			await user.click(screen.getByRole('link', { name: 'Go to Account Settings' }));
			await waitFor(() => {
				expect(requestFn).toHaveBeenCalledTimes(1);
			});
		});
	});
});
