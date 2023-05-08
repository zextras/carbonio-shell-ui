/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React, { FC } from 'react';
import { act, screen } from '@testing-library/react';
import { useHistory } from 'react-router-dom';
import { setup } from '../test/utils';
import ShellView from './shell-view';
import { useBoardStore } from '../store/boards';
import { Board } from '../../types';
import { useAppStore } from '../store/app';
import { useBridge } from '../store/context-bridge';

const ContextBridge: FC = () => {
	const history = useHistory();
	useBridge({
		functions: {
			getHistory: () => history
		}
	});
	return null;
};

const Dummy: FC = () => null;

jest.mock('../utility-bar/bar', () => ({
	ShellUtilityBar: Dummy
}));

jest.mock('./shell-header', () => Dummy);

test('When resizing under mobile breakpoint, board does not disappear', () => {
	const boards: Record<string, Board> = {
		'board-1': { id: 'board-1', url: '/url', app: 'app', title: 'title1', icon: 'CubeOutline' }
	};

	useBoardStore.setState(() => ({
		boards,
		orderedBoards: ['board-1'],
		current: 'board-1'
	}));

	useAppStore.getState().setters.addApps([
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
	useAppStore.getState().setters.addRoute({
		id: 'mails',
		route: 'mails',
		position: 1,
		visible: true,
		label: 'Mails',
		primaryBar: 'MailModOutline',
		appView: () => <div></div>,
		badge: { show: false },
		app: 'carbonio-mails-ui'
	});

	setup(
		<>
			<ContextBridge /> <ShellView />
		</>
	);

	expect(screen.getByText('title1')).toBeVisible();
	act(() => {
		window.resizeTo(500, 300);
	});
	expect(screen.getByText('title1')).toBeVisible();
});
