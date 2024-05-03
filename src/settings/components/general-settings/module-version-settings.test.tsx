/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React from 'react';

import { produce } from 'immer';

import ModuleVersionSettings from './module-version-settings';
import { useAppStore } from '../../../store/app';
import { screen, setup } from '../../../test/utils';

describe('Module Version Settings', () => {
	it('should render the application version section', () => {
		const description = 'Mails module';
		const display = 'Mails';
		const version = '1.11.1';
		useAppStore.setState(
			produce((state) => {
				state.apps = [
					{
						description,
						display,
						name: 'carbonio-mails-ui',
						version
					}
				];
			})
		);

		setup(<ModuleVersionSettings />);

		expect(screen.getByText(/application versions/i)).toBeVisible();
		expect(screen.getByText(display)).toBeVisible();
		expect(screen.getByText(description)).toBeVisible();
		expect(screen.getByText(`Version: ${version}`)).toBeVisible();
		expect(screen.getByText(/active/i)).toBeVisible();
	});

	it('should not render the carbonio shell application version', () => {
		const description = 'The Zextras Carbonio web client';
		const display = 'Shell';
		const version = '5.1.0';
		useAppStore.getState().setApps([
			{
				commit: '',
				description,
				display,
				icon: 'CubeOutline',
				js_entrypoint: '',
				name: 'carbonio-shell-ui',
				priority: -1,
				type: 'shell',
				version
			}
		]);
		setup(<ModuleVersionSettings />);
		expect(screen.getByText(/application versions/i)).toBeVisible();
		expect(screen.queryByText(display)).not.toBeInTheDocument();
		expect(screen.queryByText(description)).not.toBeInTheDocument();
		expect(screen.queryByText(`Version: ${version}`)).not.toBeInTheDocument();
	});

	it('should not overwrite display of "main" route if focus mode is true', () => {
		const display1 = 'Chats';
		const version1 = '1.8.1';
		const description1 = 'Chats module';
		const display2 = 'Meetings';
		const description2 = 'Chats Module for Zextras Carbonio';
		const version2 = '0.9.1';
		useAppStore.getState().setApps([
			{
				commit: '',
				description: description1,
				display: 'Chats',
				icon: 'TeamOutline',
				js_entrypoint: '',
				name: 'carbonio-chats-ui',
				priority: 8,
				type: 'carbonio',
				version: version1
			},
			{
				commit: '',
				description: description2,
				display: 'Chats',
				icon: 'DriveOutline',
				js_entrypoint: '',
				name: 'carbonio-ws-collaboration-ui',
				priority: 404,
				type: 'carbonio',
				version: version2
			}
		]);

		useAppStore.getState().addRoute({
			app: 'carbonio-ws-collaboration-ui',
			appView: jest.fn(),
			badge: {
				show: false
			},
			focusMode: undefined,
			id: 'chats',
			label: display1,
			position: 404,
			primaryBar: '',
			route: 'chats',
			secondaryBar: jest.fn(),
			visible: true
		});

		useAppStore.getState().addRoute({
			app: 'carbonio-ws-collaboration-ui',
			appView: jest.fn(),
			badge: {
				show: false
			},
			focusMode: true,
			id: 'meetings',
			label: display2,
			position: 404,
			primaryBar: 'TeamOutline',
			route: 'meetings',
			secondaryBar: jest.fn(),
			visible: false
		});
		setup(<ModuleVersionSettings />);
		expect(screen.getByText(/application versions/i)).toBeVisible();
		const labels = screen.getAllByText(display1);
		expect(labels).toHaveLength(2);
		expect(labels[0]).toBeVisible();
		expect(labels[1]).toBeVisible();
		expect(screen.getByText(description1)).toBeVisible();
		expect(screen.getByText(`Version: ${version1}`)).toBeVisible();
		expect(screen.queryByText(display2)).not.toBeInTheDocument();
		expect(screen.getByText(description2)).toBeVisible();
		expect(screen.getByText(`Version: ${version2}`)).toBeVisible();
	});
});
