/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React from 'react';

import 'jest-styled-components';
import { faker } from '@faker-js/faker';
import { act, screen, waitFor, within } from '@testing-library/react';
import { forEach, head, shuffle, tail } from 'lodash';
import { http, HttpResponse } from 'msw';
import { Link, Route, Switch } from 'react-router-dom';

import { AccountsSettings } from './accounts-settings';
import { BatchRequest, CreateIdentityResponse } from '../../types';
import {
	getRightsRequest,
	GetRightsRequestBody,
	GetRightsResponseBody
} from '../mocks/handlers/getRightsRequest';
import server, { waitForRequest } from '../mocks/server';
import { useAccountStore } from '../store/account';
import { createAccount, createIdentity, setupAccountStore } from '../test/account-utils';
import { setup } from '../test/utils';

describe('Account setting', () => {
	async function waitForGetRightsRequest(): Promise<void> {
		await waitForRequest('post', '/service/soap/GetRightsRequest');
		await screen.findByText('sendAs');
	}
	const defaultFirstName = faker.person.firstName();
	const defaultLastName = faker.person.lastName();
	const defaultFullName = faker.person.fullName({
		firstName: defaultFirstName,
		lastName: defaultLastName
	});
	const defaultEmail = 'default@email.com';
	const defaultId = faker.string.uuid();

	const persona1FullName = 'New Persona 1';
	const persona1Email = 'persona1@email.com';
	const persona1Id = faker.string.uuid();

	const persona2FullName = 'New Persona 2';
	const persona2Email = 'persona2@email.com';
	const persona2Id = faker.string.uuid();

	const persona3FullName = 'New Persona 3';
	const persona3Email = 'persona3@email.com';
	const persona3Id = faker.string.uuid();
	test('When saving the order should not change', async () => {
		setupAccountStore(
			createAccount(defaultEmail, defaultId, [
				createIdentity(
					{
						zimbraPrefIdentityId: defaultId,
						zimbraPrefIdentityName: 'defaultFullName',
						zimbraPrefFromAddress: 'default@email.com'
					},
					true
				)
			])
		);
		const batchRequestUrl = '/service/soap/BatchRequest';
		server.use(
			http.post(batchRequestUrl, () =>
				HttpResponse.json({
					Body: {
						BatchResponse: {
							CreateIdentityResponse: [
								{
									identity: [
										createIdentity(
											{
												zimbraPrefIdentityId: persona1Id,
												zimbraPrefIdentityName: persona1FullName,
												zimbraPrefFromAddress: defaultEmail
											},
											false
										)
									]
								},
								{
									identity: [
										createIdentity(
											{
												zimbraPrefIdentityId: persona2Id,
												zimbraPrefIdentityName: persona2FullName,
												zimbraPrefFromAddress: defaultEmail
											},
											false
										)
									]
								},
								{
									identity: [
										createIdentity(
											{
												zimbraPrefIdentityId: persona3Id,
												zimbraPrefIdentityName: persona3FullName,
												zimbraPrefFromAddress: defaultEmail
											},
											false
										)
									]
								}
							] as CreateIdentityResponse[]
						}
					}
				})
			)
		);

		const pendingBatchRequest = waitForRequest('POST', batchRequestUrl);

		const { user } = setup(<AccountsSettings />);

		await waitForGetRightsRequest();

		await user.click(screen.getByRole('button', { name: /add persona/i }));
		await waitFor(() =>
			expect(screen.getByRole('textbox', { name: /persona name/i })).toHaveDisplayValue(
				persona1FullName
			)
		);

		await user.click(screen.getByRole('button', { name: /add persona/i }));
		await waitFor(() =>
			expect(screen.getByRole('textbox', { name: /persona name/i })).toHaveDisplayValue(
				persona2FullName
			)
		);

		await user.click(screen.getByRole('button', { name: /add persona/i }));
		await waitFor(() =>
			expect(screen.getByRole('textbox', { name: /persona name/i })).toHaveDisplayValue(
				persona3FullName
			)
		);

		const snapShot = `
		[
		  "defaultFullName(default@email.com)Primary",
		  "New Persona 1(default@email.com)Persona",
		  "New Persona 2(default@email.com)Persona",
		  "New Persona 3(default@email.com)Persona",
		]
	`;
		expect(screen.getAllByRole('listitem').map((item) => item.textContent)).toMatchInlineSnapshot(
			snapShot
		);

		await user.click(screen.getByRole('button', { name: /save/i }));

		const { Body: requestBody } = await pendingBatchRequest.then(
			(req) => req.json() as Promise<{ Body: { BatchRequest: BatchRequest } }>
		);
		expect(requestBody.BatchRequest.CreateIdentityRequest).toHaveLength(3);
		expect(requestBody.BatchRequest.DeleteIdentityRequest).toBeUndefined();
		expect(requestBody.BatchRequest.ModifyIdentityRequest).toBeUndefined();

		const successSnackbar = await screen.findByText('Edits saved correctly');
		expect(successSnackbar).toBeVisible();
		expect(screen.getAllByRole('listitem').map((item) => item.textContent)).toMatchInlineSnapshot(
			snapShot
		);
	});

	test('When discarding the order should be the same of the initial one', async () => {
		setupAccountStore(
			createAccount(defaultEmail, defaultId, [
				createIdentity(
					{
						zimbraPrefIdentityId: defaultId,
						zimbraPrefIdentityName: 'defaultFullName',
						zimbraPrefFromAddress: 'default@email.com'
					},
					true
				),
				createIdentity(
					{
						zimbraPrefIdentityId: persona1Id,
						zimbraPrefIdentityName: persona1FullName,
						zimbraPrefFromAddress: persona1Email
					},
					false
				)
			])
		);

		const snapShot = `
		[
		  "defaultFullName(default@email.com)Primary",
		  "New Persona 1(persona1@email.com)Persona",
		]
		`;
		const { user } = setup(<AccountsSettings />);
		await waitForGetRightsRequest();

		const renderedItems = screen.getAllByRole('listitem');
		expect(renderedItems.length).toEqual(2);
		expect(renderedItems.map((item) => item.textContent)).toMatchInlineSnapshot(snapShot);

		await user.click(screen.getByText(persona1FullName));
		await user.click(screen.getByRole('button', { name: /delete/i }));
		const confirmButton = screen.getByRole('button', { name: /delete permanently/i });
		act(() => {
			// run modal timers
			jest.runOnlyPendingTimers();
		});
		await user.click(confirmButton);

		await user.click(screen.getByRole('button', { name: /discard changes/i }));

		expect(screen.getByText(persona1FullName)).toBeVisible();
		expect(screen.getAllByRole('listitem').map((item) => item.textContent)).toMatchInlineSnapshot(
			snapShot
		);
	});

	test('Check that the default is always the first item', async () => {
		setupAccountStore(
			createAccount(
				defaultEmail,
				defaultId,
				shuffle([
					createIdentity(
						{
							zimbraPrefIdentityId: persona3Id,
							zimbraPrefIdentityName: persona3FullName,
							zimbraPrefFromAddress: persona3Email
						},
						false
					),
					createIdentity(
						{
							zimbraPrefIdentityId: persona2Id,
							zimbraPrefIdentityName: persona2FullName,
							zimbraPrefFromAddress: persona2Email
						},
						false
					),
					createIdentity(
						{
							zimbraPrefIdentityId: persona1Id,
							zimbraPrefIdentityName: persona1FullName,
							zimbraPrefFromAddress: persona1Email
						},
						false
					),
					createIdentity(
						{
							zimbraPrefIdentityId: defaultId,
							zimbraPrefIdentityName: 'defaultFullName',
							zimbraPrefFromAddress: 'default@email.com'
						},
						true
					)
				])
			)
		);

		setup(<AccountsSettings />);

		await waitForGetRightsRequest();
		const renderedItems = screen.getAllByRole('listitem');
		expect(renderedItems.length).toEqual(4);
		expect(head(renderedItems.map((item) => item.textContent))).toMatchInlineSnapshot(
			`"defaultFullName(default@email.com)Primary"`
		);
	});

	test('When adding an item it is always placed as last', async () => {
		setupAccountStore(
			createAccount(defaultEmail, defaultId, [
				createIdentity(
					{
						zimbraPrefIdentityId: defaultId,
						zimbraPrefIdentityName: defaultFullName,
						zimbraPrefFromAddress: defaultEmail
					},
					true
				)
			])
		);

		const { user } = setup(<AccountsSettings />);
		await waitForGetRightsRequest();
		await user.click(screen.getByRole('button', { name: /add persona/i }));

		const renderedItems = screen.getAllByRole('listitem');
		expect(renderedItems.length).toEqual(2);
		expect(tail(renderedItems.map((item) => item.textContent))).toMatchInlineSnapshot(`
		[
		  "New Persona 1(default@email.com)Persona",
		]
	`);
	});

	test('Show primary identity inside the list', async () => {
		setupAccountStore(
			createAccount(defaultEmail, defaultId, [
				createIdentity(
					{
						zimbraPrefIdentityId: defaultId,
						zimbraPrefIdentityName: defaultFullName,
						zimbraPrefFromAddress: defaultEmail
					},
					true
				)
			])
		);

		setup(<AccountsSettings />);

		await waitForGetRightsRequest();
		expect(screen.getByText(defaultFullName)).toBeVisible();
		expect(screen.getByText(`(${defaultEmail})`)).toBeVisible();
		expect(screen.getByText('Primary')).toBeVisible();
	});

	test('Should show the new identity in the list when clicking on add', async () => {
		setupAccountStore(
			createAccount(defaultEmail, defaultId, [
				createIdentity(
					{
						zimbraPrefIdentityId: defaultId,
						zimbraPrefIdentityName: defaultFullName,
						zimbraPrefFromAddress: defaultEmail,
						zimbraPrefFromDisplay: defaultFirstName
					},
					true
				)
			])
		);

		const { user } = setup(<AccountsSettings />);
		await waitForGetRightsRequest();
		await user.click(screen.getByRole('button', { name: /add persona/i }));
		expect(screen.getByText(persona1FullName)).toBeVisible();
	});

	test('Should increase the number of the persona when there are already identities with the default name', async () => {
		setupAccountStore(
			createAccount(defaultEmail, defaultId, [
				createIdentity(
					{
						zimbraPrefIdentityId: persona1Id,
						zimbraPrefIdentityName: persona1FullName,
						zimbraPrefFromAddress: persona1Email
					},
					false
				),
				createIdentity(
					{
						zimbraPrefIdentityId: defaultId,
						zimbraPrefIdentityName: defaultFullName,
						zimbraPrefFromAddress: defaultEmail,
						zimbraPrefFromDisplay: defaultFirstName
					},
					true
				)
			])
		);

		const { user } = setup(<AccountsSettings />);
		await waitForGetRightsRequest();
		expect(screen.getByText(persona1FullName)).toBeVisible();

		await user.click(screen.getByRole('button', { name: /add persona/i }));
		expect(screen.getByText(persona2FullName)).toBeVisible();
	});

	test('When existing persona identityName is updated but not yet saved, the old (but current) identityName should not be used as default one for a new persona', async () => {
		setupAccountStore(
			createAccount(defaultEmail, defaultId, [
				createIdentity(
					{
						zimbraPrefIdentityId: persona1Id,
						zimbraPrefIdentityName: persona1FullName,
						zimbraPrefFromAddress: persona1Email
					},
					false
				),
				createIdentity(
					{
						zimbraPrefIdentityId: defaultId,
						zimbraPrefIdentityName: defaultFullName,
						zimbraPrefFromAddress: defaultEmail,
						zimbraPrefFromDisplay: defaultFirstName
					},
					true
				)
			])
		);

		const { user } = setup(<AccountsSettings />);
		await waitForGetRightsRequest();

		const persona1Row = screen.getByText(persona1FullName);
		expect(persona1Row).toBeVisible();
		await user.click(persona1Row);

		const accountNameInput = screen.getByRole('textbox', { name: /persona name/i });
		expect(accountNameInput).toHaveDisplayValue(persona1FullName);

		expect(
			within(screen.getByTestId(`account-list-item-${persona1Id}`)).getByText(persona1FullName)
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
			within(screen.getByTestId(`account-list-item-0`)).getByText(persona2FullName)
		).toBeVisible();
	});

	test('When create a new persona and modify the proposed identityName before saving and than create another persona the proposed identityName should be the same', async () => {
		setupAccountStore(
			createAccount(defaultEmail, defaultId, [
				createIdentity(
					{
						zimbraPrefIdentityId: defaultId,
						zimbraPrefIdentityName: defaultFullName,
						zimbraPrefFromAddress: defaultEmail,
						zimbraPrefFromDisplay: defaultFirstName
					},
					true
				)
			])
		);

		const { user } = setup(<AccountsSettings />);
		await waitForGetRightsRequest();

		await user.click(screen.getByRole('button', { name: /add persona/i }));

		const persona1Row = screen.getByText(persona1FullName);
		expect(persona1Row).toBeVisible();
		await user.click(persona1Row);

		const accountNameInput = screen.getByRole('textbox', { name: /persona name/i });
		expect(accountNameInput).toHaveDisplayValue(persona1FullName);

		expect(
			within(screen.getByTestId(`account-list-item-0`)).getByText(persona1FullName)
		).toBeVisible();

		const newName = 'Updated Name';
		await user.clear(accountNameInput);
		await user.type(accountNameInput, newName);

		expect(accountNameInput).toHaveDisplayValue(newName);
		expect(within(screen.getByTestId(`account-list-item-0`)).getByText(newName)).toBeVisible();

		await user.click(screen.getByRole('button', { name: /add persona/i }));
		expect(screen.getByText(persona1FullName)).toBeVisible();
		expect(
			within(screen.getByTestId(`account-list-item-1`)).getByText(persona1FullName)
		).toBeVisible();
		expect(screen.queryByText(persona2FullName)).not.toBeInTheDocument();
	});

	test('When existing persona is deleted but not yet saved, the old (but current) identityName should not be used as default one for a new persona', async () => {
		setupAccountStore(
			createAccount(defaultEmail, defaultId, [
				createIdentity(
					{
						zimbraPrefIdentityId: persona1Id,
						zimbraPrefIdentityName: persona1FullName,
						zimbraPrefFromAddress: persona1Email
					},
					false
				),
				createIdentity(
					{
						zimbraPrefIdentityId: defaultId,
						zimbraPrefIdentityName: defaultFullName,
						zimbraPrefFromAddress: defaultEmail,
						zimbraPrefFromDisplay: defaultFirstName
					},
					true
				)
			])
		);
		const { user } = setup(<AccountsSettings />);
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

		await user.click(screen.getByRole('button', { name: /add persona/i }));
		expect(
			within(screen.getByTestId(`account-list-item-0`)).getByText(persona2FullName)
		).toBeVisible();
	});

	test('When create a new persona and delete it before saving and than create another persona the proposed identityName should be the same', async () => {
		setupAccountStore(
			createAccount(defaultEmail, defaultId, [
				createIdentity(
					{
						zimbraPrefIdentityId: defaultId,
						zimbraPrefIdentityName: defaultFullName,
						zimbraPrefFromAddress: defaultEmail,
						zimbraPrefFromDisplay: defaultFirstName
					},
					true
				)
			])
		);

		const { user } = setup(<AccountsSettings />);
		await waitForGetRightsRequest();

		await user.click(screen.getByRole('button', { name: /add persona/i }));

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

		await user.click(screen.getByRole('button', { name: /add persona/i }));
		expect(screen.getByText(persona1FullName)).toBeVisible();
		expect(
			within(screen.getByTestId(`account-list-item-1`)).getByText(persona1FullName)
		).toBeVisible();
		expect(screen.queryByText(persona2FullName)).not.toBeInTheDocument();
	});

	test('Should not increase the counter if the identities have a name different from the default', async () => {
		setupAccountStore(
			createAccount(defaultEmail, defaultId, [
				createIdentity(
					{
						zimbraPrefIdentityId: persona1Id,
						zimbraPrefIdentityName: persona1FullName,
						zimbraPrefFromAddress: persona1Email
					},
					false
				),
				createIdentity(
					{
						zimbraPrefIdentityId: defaultId,
						zimbraPrefIdentityName: defaultFullName,
						zimbraPrefFromAddress: defaultEmail,
						zimbraPrefFromDisplay: defaultFirstName
					},
					true
				)
			])
		);
		const { user } = setup(<AccountsSettings />);
		await waitForGetRightsRequest();
		expect(screen.getByText(persona1FullName)).toBeVisible();

		await user.click(screen.getByRole('button', { name: /add persona/i }));
		expect(screen.getByText(persona1FullName)).toBeVisible();
	});

	test('Should remove the identity from the list on delete action', async () => {
		setupAccountStore(
			createAccount(defaultEmail, defaultId, [
				createIdentity(
					{
						zimbraPrefIdentityId: persona1Id,
						zimbraPrefIdentityName: persona1FullName,
						zimbraPrefFromAddress: persona1Email
					},
					false
				),
				createIdentity(
					{
						zimbraPrefIdentityId: defaultId,
						zimbraPrefIdentityName: defaultFullName,
						zimbraPrefFromAddress: defaultEmail,
						zimbraPrefFromDisplay: defaultFirstName
					},
					true
				)
			])
		);

		const { user } = setup(<AccountsSettings />);
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
		setupAccountStore(
			createAccount(defaultEmail, defaultId, [
				createIdentity(
					{
						zimbraPrefIdentityId: defaultId,
						zimbraPrefIdentityName: defaultFullName,
						zimbraPrefFromAddress: defaultEmail,
						zimbraPrefFromDisplay: defaultFirstName
					},
					true
				)
			])
		);

		const batchRequestUrl = '/service/soap/BatchRequest';
		server.use(
			http.post(batchRequestUrl, () =>
				HttpResponse.json({
					Body: {
						BatchResponse: {
							CreateIdentityResponse: []
						}
					}
				})
			)
		);

		const pendingBatchRequest = waitForRequest('POST', batchRequestUrl);

		const { user } = setup(<AccountsSettings />);

		await waitForGetRightsRequest();

		await user.click(screen.getByRole('button', { name: /add persona/i }));
		await waitFor(() =>
			expect(screen.getByRole('textbox', { name: /persona name/i })).toHaveDisplayValue(
				persona1FullName
			)
		);

		expect(screen.getByText(persona1FullName)).toBeVisible();

		await user.click(screen.getByRole('button', { name: /add persona/i }));
		await waitFor(() =>
			expect(screen.getByRole('textbox', { name: /persona name/i })).toHaveDisplayValue(
				persona2FullName
			)
		);
		expect(screen.getByText(persona2FullName)).toBeVisible();

		await user.click(screen.getByRole('button', { name: /add persona/i }));
		await waitFor(() =>
			expect(screen.getByRole('textbox', { name: /persona name/i })).toHaveDisplayValue(
				persona3FullName
			)
		);
		expect(screen.getByText(persona3FullName)).toBeVisible();

		await user.click(screen.getByText(persona1FullName));
		await waitFor(() =>
			expect(screen.getByRole('textbox', { name: /persona name/i })).toHaveDisplayValue(
				persona1FullName
			)
		);
		await user.click(screen.getByRole('button', { name: /delete/i }));
		let confirmButton = await screen.findByRole('button', { name: /delete permanently/i });
		act(() => {
			// run modal timers
			jest.runOnlyPendingTimers();
		});
		await user.click(confirmButton);
		await screen.findByText(/primary account settings/i);
		expect(screen.queryByText(persona1FullName)).not.toBeInTheDocument();

		await user.click(screen.getByText(persona2FullName));
		await waitFor(() =>
			expect(screen.getByRole('textbox', { name: /persona name/i })).toHaveDisplayValue(
				persona2FullName
			)
		);
		await user.click(screen.getByRole('button', { name: /delete/i }));
		confirmButton = await screen.findByRole('button', { name: /delete permanently/i });
		act(() => {
			// run modal timers
			jest.runOnlyPendingTimers();
		});
		await user.click(confirmButton);
		await screen.findByText(/primary account settings/i);
		expect(screen.queryByText(persona2FullName)).not.toBeInTheDocument();

		await user.click(screen.getByRole('button', { name: /save/i }));

		const { Body: requestBody } = await pendingBatchRequest.then(
			(req) => req.json() as Promise<{ Body: { BatchRequest: BatchRequest } }>
		);

		expect(requestBody.BatchRequest.CreateIdentityRequest).toHaveLength(1);
		expect(requestBody.BatchRequest.DeleteIdentityRequest).toBeUndefined();
		expect(requestBody.BatchRequest.ModifyIdentityRequest).toBeUndefined();

		const successSnackbar = await screen.findByText('Edits saved correctly');
		expect(successSnackbar).toBeVisible();
	});

	test('Should remove from the list added identities not saved on discard changes', async () => {
		setupAccountStore(
			createAccount(defaultEmail, defaultId, [
				createIdentity(
					{
						zimbraPrefIdentityId: defaultId,
						zimbraPrefIdentityName: defaultFullName,
						zimbraPrefFromAddress: defaultEmail,
						zimbraPrefFromDisplay: defaultFirstName
					},
					true
				)
			])
		);

		const { user } = setup(<AccountsSettings />);

		await waitForGetRightsRequest();

		await user.click(screen.getByRole('button', { name: /add persona/i }));
		expect(screen.getByText(persona1FullName)).toBeVisible();

		await user.click(screen.getByRole('button', { name: /discard changes/i }));
		expect(screen.queryByText(persona1FullName)).not.toBeInTheDocument();
	});

	test('Should add in the list removed identities not saved on discard changes', async () => {
		setupAccountStore(
			createAccount(defaultEmail, defaultId, [
				createIdentity(
					{
						zimbraPrefIdentityId: persona1Id,
						zimbraPrefIdentityName: persona1FullName,
						zimbraPrefFromAddress: persona1Email
					},
					false
				),
				createIdentity(
					{
						zimbraPrefIdentityId: defaultId,
						zimbraPrefIdentityName: defaultFullName,
						zimbraPrefFromAddress: defaultEmail,
						zimbraPrefFromDisplay: defaultFirstName
					},
					true
				)
			])
		);

		const { user } = setup(<AccountsSettings />);
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
		setupAccountStore(
			createAccount(defaultEmail, defaultId, [
				createIdentity(
					{
						zimbraPrefIdentityId: defaultId,
						zimbraPrefIdentityName: defaultFullName,
						zimbraPrefFromAddress: defaultEmail,
						zimbraPrefFromDisplay: defaultFirstName
					},
					true
				)
			])
		);
		const { user } = setup(<AccountsSettings />);
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

	test('When modify an identity, should populate a ModifyIdentityRequest', async () => {
		setupAccountStore(
			createAccount(defaultEmail, defaultId, [
				createIdentity(
					{
						zimbraPrefIdentityId: defaultId,
						zimbraPrefIdentityName: defaultFullName,
						zimbraPrefFromAddress: defaultEmail,
						zimbraPrefFromDisplay: defaultFirstName
					},
					true
				)
			])
		);

		server.use(
			http.post('/service/soap/BatchRequest', () =>
				HttpResponse.json({
					Body: {
						BatchResponse: {
							ModifyPrefsResponse: [{ _jsns: 'urn:zimbraAccount' }]
						}
					}
				})
			)
		);

		const batchRequestUrl = '/service/soap/BatchRequest';
		const pendingBatchRequest = waitForRequest('POST', batchRequestUrl);
		const { user } = setup(<AccountsSettings />);
		await waitForGetRightsRequest();

		const accountNameInput = screen.getByRole('textbox', { name: /account name/i });

		const newName = 'Updated Name';
		await user.clear(accountNameInput);
		await user.type(accountNameInput, newName);

		await user.click(screen.getByRole('button', { name: /save/i }));

		const { Body: requestBody } = await pendingBatchRequest.then(
			(req) => req.json() as Promise<{ Body: { BatchRequest: BatchRequest } }>
		);
		expect(requestBody.BatchRequest.CreateIdentityRequest).toBeUndefined();
		expect(requestBody.BatchRequest.DeleteIdentityRequest).toBeUndefined();
		expect(requestBody.BatchRequest.ModifyIdentityRequest).toHaveLength(1);

		const successSnackbar = await screen.findByText('Edits saved correctly');
		expect(successSnackbar).toBeVisible();
	});

	test('When modify an identity, the new value must be shown after save', async () => {
		setupAccountStore(
			createAccount(defaultEmail, defaultId, [
				createIdentity(
					{
						zimbraPrefIdentityId: defaultId,
						zimbraPrefIdentityName: defaultFullName,
						zimbraPrefFromAddress: defaultEmail,
						zimbraPrefFromDisplay: defaultFirstName
					},
					true
				)
			])
		);

		server.use(
			http.post('/service/soap/BatchRequest', () =>
				HttpResponse.json({
					Body: {
						BatchResponse: {
							ModifyPrefsResponse: [{ _jsns: 'urn:zimbraAccount' }]
						}
					}
				})
			)
		);

		const batchRequestUrl = '/service/soap/BatchRequest';
		const pendingBatchRequest = waitForRequest('POST', batchRequestUrl);
		const { user } = setup(<AccountsSettings />);
		await waitForGetRightsRequest();

		const accountNameInput = screen.getByRole('textbox', { name: /account name/i });

		const newName = 'Updated Name';
		await user.clear(accountNameInput);
		await user.type(accountNameInput, newName);

		await user.click(screen.getByRole('button', { name: /save/i }));

		await pendingBatchRequest;

		const successSnackbar = await screen.findByText('Edits saved correctly');
		expect(successSnackbar).toBeVisible();

		expect(accountNameInput).toHaveDisplayValue(newName);
	});

	test('When delete an identity, it must not be present after save', async () => {
		setupAccountStore(
			createAccount(defaultEmail, defaultId, [
				createIdentity(
					{
						zimbraPrefIdentityId: persona1Id,
						zimbraPrefIdentityName: persona1FullName,
						zimbraPrefFromAddress: persona1Email
					},
					false
				),
				createIdentity(
					{
						zimbraPrefIdentityId: defaultId,
						zimbraPrefIdentityName: defaultFullName,
						zimbraPrefFromAddress: defaultEmail,
						zimbraPrefFromDisplay: defaultFirstName
					},
					true
				)
			])
		);

		server.use(
			http.post('/service/soap/BatchRequest', () =>
				HttpResponse.json({
					Body: {
						BatchResponse: {
							ModifyPrefsResponse: [{ _jsns: 'urn:zimbraAccount' }]
						}
					}
				})
			)
		);

		const batchRequestUrl = '/service/soap/BatchRequest';
		const pendingBatchRequest = waitForRequest('POST', batchRequestUrl);

		const { user } = setup(<AccountsSettings />);
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

		await user.click(screen.getByRole('button', { name: /save/i }));

		await pendingBatchRequest;

		const successSnackbar = await screen.findByText('Edits saved correctly');
		expect(successSnackbar).toBeVisible();

		expect(screen.queryByText(persona1FullName)).not.toBeInTheDocument();
	});

	test('Should reset the updated identity name on discard changes(default case)', async () => {
		setupAccountStore(
			createAccount(defaultEmail, defaultId, [
				createIdentity(
					{
						zimbraPrefIdentityId: defaultId,
						zimbraPrefIdentityName: defaultFullName,
						zimbraPrefFromAddress: defaultEmail,
						zimbraPrefFromDisplay: defaultFirstName
					},
					true
				)
			])
		);
		const { user } = setup(<AccountsSettings />);
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
		setupAccountStore(
			createAccount(defaultEmail, defaultId, [
				createIdentity(
					{
						zimbraPrefIdentityId: defaultId,
						zimbraPrefIdentityName: defaultFullName,
						zimbraPrefFromAddress: defaultEmail,
						zimbraPrefFromDisplay: defaultFirstName
					},
					true
				)
			])
		);
		const { user } = setup(<AccountsSettings />);
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
		const delegatedSendSaveTargetLabelsMap = {
			owner: 'Save a copy of sent messages to my Sent folder',
			sender: 'Save a copy of sent messages to delegate’s Sent folder',
			both: 'Save a copy of sent messages to my Sent folder and delegate’s folder',
			none: 'Don’t save a copy of sent messages'
		};

		test.each([
			['owner', delegatedSendSaveTargetLabelsMap.owner],
			['sender', delegatedSendSaveTargetLabelsMap.sender],
			['both', delegatedSendSaveTargetLabelsMap.both],
			['none', delegatedSendSaveTargetLabelsMap.none]
		])(
			'When zimbraPrefDelegatedSendSaveTarget is %s then %s radio is checked',
			async (zimbraPrefDelegatedSendSaveTarget) => {
				setupAccountStore(
					createAccount(defaultEmail, defaultId, [
						createIdentity(
							{
								zimbraPrefIdentityId: defaultId,
								zimbraPrefIdentityName: defaultFullName,
								zimbraPrefFromAddress: defaultEmail,
								zimbraPrefFromDisplay: defaultFirstName
							},
							true
						)
					]),
					{ zimbraPrefDelegatedSendSaveTarget }
				);

				setup(<AccountsSettings />);
				await waitForGetRightsRequest();

				forEach(delegatedSendSaveTargetLabelsMap, (label, pref) => {
					if (pref === zimbraPrefDelegatedSendSaveTarget) {
						expect(screen.getByRole('radio', { name: label })).toBeChecked();
					} else {
						expect(screen.getByRole('radio', { name: label })).not.toBeChecked();
					}
				});
			}
		);

		test('When the value change, the save button and discard button becomes enabled', async () => {
			setupAccountStore(
				createAccount(defaultEmail, defaultId, [
					createIdentity(
						{
							zimbraPrefIdentityId: defaultId,
							zimbraPrefIdentityName: defaultFullName,
							zimbraPrefFromAddress: defaultEmail,
							zimbraPrefFromDisplay: defaultFirstName
						},
						true
					)
				]),
				{ zimbraPrefDelegatedSendSaveTarget: 'owner' }
			);

			const { user } = setup(<AccountsSettings />);
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
			setupAccountStore(
				createAccount(defaultEmail, defaultId, [
					createIdentity(
						{
							zimbraPrefIdentityId: defaultId,
							zimbraPrefIdentityName: defaultFullName,
							zimbraPrefFromAddress: defaultEmail,
							zimbraPrefFromDisplay: defaultFirstName
						},
						true
					)
				]),
				{ zimbraPrefDelegatedSendSaveTarget: 'owner' }
			);

			server.use(
				http.post('/service/soap/BatchRequest', () =>
					HttpResponse.json({
						Body: {
							BatchResponse: {
								ModifyPrefsResponse: [{ _jsns: 'urn:zimbraAccount' }]
							}
						}
					})
				)
			);
			const pendingBatchRequest = waitForRequest('POST', '/service/soap/BatchRequest');

			const { user } = setup(<AccountsSettings />);
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

			const { Body: requestBody } = await pendingBatchRequest.then(
				(req) => req.json() as Promise<{ Body: { BatchRequest: BatchRequest } }>
			);

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
			setupAccountStore(
				createAccount(defaultEmail, defaultId, [
					createIdentity(
						{
							zimbraPrefIdentityId: defaultId,
							zimbraPrefIdentityName: defaultFullName,
							zimbraPrefFromAddress: defaultEmail,
							zimbraPrefFromDisplay: defaultFirstName
						},
						true
					)
				])
			);

			const requestFn = jest.fn();
			server.use(
				http.post<never, GetRightsRequestBody, GetRightsResponseBody>(
					'/service/soap/GetRightsRequest',
					(info) => {
						requestFn();
						return getRightsRequest(info);
					}
				)
			);

			const TestComponent = (): JSX.Element => (
				<>
					<Switch>
						<Route path="/other">
							<div>
								<span data-testid="text">Other page</span>
								<Link to="/settings/accounts">Go to Account Settings</Link>
							</div>
						</Route>
						<Route path="/settings/accounts">
							<AccountsSettings />
							<Link to="/other">Go to Other page</Link>
						</Route>
					</Switch>
				</>
			);

			const { user } = setup(<TestComponent />, { initialRouterEntries: [`/settings/accounts`] });

			await waitForGetRightsRequest();
			expect(requestFn).toHaveBeenCalledTimes(1);
			expect(screen.queryByTestId('text')).not.toBeInTheDocument();
			expect(screen.getByText(/Accounts List/i)).toBeVisible();
			await user.click(screen.getByRole('link', { name: 'Go to Other page' }));
			expect(screen.queryByTestId('text')).toBeVisible();
			expect(screen.queryByText('sendAs')).not.toBeInTheDocument();
			await user.click(screen.getByRole('link', { name: 'Go to Account Settings' }));
			expect(screen.getByText('sendAs')).toBeVisible();
			expect(requestFn).toHaveBeenCalledTimes(1);
		});

		test('When rights state is updated, the delegates list will be updated accordingly', async () => {
			setupAccountStore(
				createAccount(defaultEmail, defaultId, [
					createIdentity(
						{
							zimbraPrefIdentityId: defaultId,
							zimbraPrefIdentityName: defaultFullName,
							zimbraPrefFromAddress: defaultEmail,
							zimbraPrefFromDisplay: defaultFirstName
						},
						true
					)
				])
			);

			const requestFn = jest.fn();
			server.use(
				http.post<never, GetRightsRequestBody, GetRightsResponseBody>(
					'/service/soap/GetRightsRequest',
					(info) => {
						requestFn();
						return getRightsRequest(info);
					}
				)
			);

			setup(<AccountsSettings />);

			await waitForGetRightsRequest();
			expect(requestFn).toHaveBeenCalledTimes(1);
			expect(screen.getByText(/Accounts List/i)).toBeVisible();

			act(() => {
				useAccountStore.setState((previousState) => ({
					...previousState,
					rights: []
				}));
			});
			expect(screen.queryByText('sendAs')).not.toBeInTheDocument();
		});
	});
});
