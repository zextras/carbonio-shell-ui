/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React from 'react';

import { act, screen } from '@testing-library/react';
import { produce } from 'immer';

import { useGetPrimaryColor } from './use-get-primary-color';
import { DARK_READER_PROP_KEY, SHELL_APP_ID } from '../constants';
import * as useLocalStorage from '../shell/hooks/useLocalStorage';
import { useAccountStore } from '../store/account';
import { useLoginConfigStore } from '../store/login/store';
import { setup } from '../test/utils';

const PrimaryColorComponent = (): React.JSX.Element => {
	const primary = useGetPrimaryColor();
	return <div>{`color: ${primary}`}</div>;
};

describe('Use get primary color', () => {
	it('should return the carbonioWebUiPrimaryColor config when available and dark mode is disabled', async () => {
		const localStorageColor = '#aabbaa';
		const mockUseLocalStorage = jest.spyOn(useLocalStorage, 'useLocalStorage');

		mockUseLocalStorage.mockReturnValue([{ light: localStorageColor }, jest.fn()]);

		const carbonioWebUiPrimaryColorConfig = '#bbbbbb';
		const carbonioWebUiDarkPrimaryColorConfig = '#cccccc';
		useLoginConfigStore.setState((s) => ({
			...s,
			carbonioWebUiPrimaryColor: carbonioWebUiPrimaryColorConfig,
			carbonioWebUiDarkPrimaryColor: carbonioWebUiDarkPrimaryColorConfig,
			loaded: true
		}));

		useAccountStore.setState(
			produce((state) => {
				state.settings.props = [
					{ name: DARK_READER_PROP_KEY, zimlet: SHELL_APP_ID, _content: 'disabled' }
				];
			})
		);

		setup(<PrimaryColorComponent />);

		expect(await screen.findByText(`color: ${carbonioWebUiPrimaryColorConfig}`)).toBeVisible();
	});

	it('should return the carbonioWebUiDarkPrimaryColor config when available and dark mode is enabled', async () => {
		const localStorageColor = '#aabbaa';
		const mockUseLocalStorage = jest.spyOn(useLocalStorage, 'useLocalStorage');

		mockUseLocalStorage.mockReturnValue([{ light: localStorageColor }, jest.fn()]);

		const carbonioWebUiPrimaryColorConfig = '#bbbbbb';
		const carbonioWebUiDarkPrimaryColorConfig = '#cccccc';
		useLoginConfigStore.setState((s) => ({
			...s,
			carbonioWebUiPrimaryColor: carbonioWebUiPrimaryColorConfig,
			carbonioWebUiDarkPrimaryColor: carbonioWebUiDarkPrimaryColorConfig,
			loaded: true
		}));

		useAccountStore.setState(
			produce((state) => {
				state.settings.props = [
					{ name: DARK_READER_PROP_KEY, zimlet: SHELL_APP_ID, _content: 'enabled' }
				];
			})
		);

		setup(<PrimaryColorComponent />);

		expect(await screen.findByText(`color: ${carbonioWebUiDarkPrimaryColorConfig}`)).toBeVisible();
	});

	it('should return the carbonioWebUiPrimaryColor config when available and carbonioWebUiDarkPrimaryColor is not available and dark mode is enabled', async () => {
		const localStorageColor = '#aabbaa';
		const mockUseLocalStorage = jest.spyOn(useLocalStorage, 'useLocalStorage');

		mockUseLocalStorage.mockReturnValue([{ light: localStorageColor }, jest.fn()]);

		const carbonioWebUiPrimaryColorConfig = '#bbbbbb';
		useLoginConfigStore.setState((s) => ({
			...s,
			carbonioWebUiPrimaryColor: carbonioWebUiPrimaryColorConfig,
			loaded: true
		}));

		useAccountStore.setState(
			produce((state) => {
				state.settings.props = [
					{ name: DARK_READER_PROP_KEY, zimlet: SHELL_APP_ID, _content: 'enabled' }
				];
			})
		);

		setup(<PrimaryColorComponent />);

		expect(await screen.findByText(`color: ${carbonioWebUiPrimaryColorConfig}`)).toBeVisible();
	});

	it('should return the carbonioWebUiDarkPrimaryColor config when available and carbonioWebUiPrimaryColor is not available and dark mode is disabled', async () => {
		const localStorageColor = '#aabbaa';
		const mockUseLocalStorage = jest.spyOn(useLocalStorage, 'useLocalStorage');

		mockUseLocalStorage.mockReturnValue([{ light: localStorageColor }, jest.fn()]);

		const carbonioWebUiDarkPrimaryColorConfig = '#cccccc';
		useLoginConfigStore.setState((s) => ({
			...s,
			carbonioWebUiDarkPrimaryColor: carbonioWebUiDarkPrimaryColorConfig,
			loaded: true
		}));

		useAccountStore.setState(
			produce((state) => {
				state.settings.props = [
					{ name: DARK_READER_PROP_KEY, zimlet: SHELL_APP_ID, _content: 'disabled' }
				];
			})
		);

		setup(<PrimaryColorComponent />);

		expect(await screen.findByText(`color: ${carbonioWebUiDarkPrimaryColorConfig}`)).toBeVisible();
	});

	it('should use localStore color as fallback until config color is received', async () => {
		const localStorageColor = '#aabbaa';
		const mockUseLocalStorage = jest.spyOn(useLocalStorage, 'useLocalStorage');

		mockUseLocalStorage.mockReturnValue([{ light: localStorageColor }, jest.fn()]);

		setup(<PrimaryColorComponent />);

		expect(await screen.findByText(`color: ${localStorageColor}`)).toBeVisible();

		const carbonioWebUiPrimaryColorConfig = '#bbbbbb';
		const carbonioWebUiDarkPrimaryColorConfig = '#cccccc';
		act(() => {
			useLoginConfigStore.setState((s) => ({
				...s,
				carbonioWebUiPrimaryColor: carbonioWebUiPrimaryColorConfig,
				carbonioWebUiDarkPrimaryColor: carbonioWebUiDarkPrimaryColorConfig,
				loaded: true
			}));

			useAccountStore.setState(
				produce((state) => {
					state.settings.props = [
						{ name: DARK_READER_PROP_KEY, zimlet: SHELL_APP_ID, _content: 'disabled' }
					];
				})
			);
		});
		expect(await screen.findByText(`color: ${carbonioWebUiPrimaryColorConfig}`)).toBeVisible();
	});

	it('should use localStore color as fallback until configs are received and return undefined if carbonioWebUiPrimaryColor is not received', async () => {
		const localStorageColor = '#aabbaa';
		const mockUseLocalStorage = jest.spyOn(useLocalStorage, 'useLocalStorage');

		mockUseLocalStorage.mockReturnValue([{ light: localStorageColor }, jest.fn()]);

		setup(<PrimaryColorComponent />);

		expect(await screen.findByText(`color: ${localStorageColor}`)).toBeVisible();

		act(() => {
			useLoginConfigStore.setState((s) => ({
				...s,
				loaded: true
			}));

			useAccountStore.setState(
				produce((state) => {
					state.settings.props = [
						{ name: DARK_READER_PROP_KEY, zimlet: SHELL_APP_ID, _content: 'disabled' }
					];
				})
			);
		});
		expect(await screen.findByText(`color: undefined`)).toBeVisible();
	});
});
