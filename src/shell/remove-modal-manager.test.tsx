/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React, { useEffect } from 'react';

import { act } from '@testing-library/react';
import { useModal } from '@zextras/carbonio-design-system';

import AppViewContainer from './app-view-container';
import { useAppStore } from '../store/app';
import { setup } from '../tests/utils';

const WithUseModalHookView = (): null => {
	const createModal = useModal();
	useEffect(() => {
		createModal({ id: 'modal-1', title: 'modal test title' });
	}, [createModal]);

	return null;
};

test('Using useModal hook without a ModalManager, log a Modal manager context not initialized console error', async () => {
	const mockedError = jest.fn();
	console.error = mockedError;

	setup(<AppViewContainer />, { withoutModalManager: true });

	act(() => {
		useAppStore.getState().setApps([
			{
				commit: '',
				description: 'Mails module',
				display: 'Mails',
				icon: 'MailModOutline',
				js_entrypoint: '',
				name: 'carbonio-mails-ui',
				priority: 1,
				type: 'carbonio',
				version: '0.0.1'
			}
		]);
		useAppStore.getState().addRoute({
			id: 'mails',
			route: 'mails',
			position: 1,
			visible: true,
			label: 'Mails',
			primaryBar: 'MailModOutline',
			appView: WithUseModalHookView,
			badge: { show: false },
			app: 'carbonio-mails-ui'
		});
	});

	expect(mockedError).toBeCalled();

	expect(mockedError).toBeCalledWith('Modal manager context not initialized');
});
