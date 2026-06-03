/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { act, screen } from '@testing-library/react';
import { produce } from 'immer';

import { useGetPrimaryColor } from './use-get-primary-color';
import * as useLocalStorage from '../shell/hooks/useLocalStorage';
import { useAccountStore } from '../store/account';
import { useLoginConfigStore } from '../store/login/store';
import { setup } from '../tests/utils';

const PrimaryColorComponent = (): React.JSX.Element => {
	const primary = useGetPrimaryColor();
	return <div>{`color: ${primary}`}</div>;
};

describe('Use get primary color', () => {
	it('should return the carbonioWebUiPrimaryColor config when available and dark mode is disabled', async () => {
		const localStorageColor = '#aabbaa';
		const mockUseLocalStorage = vi.spyOn(useLocalStorage, 'useLocalStorage');

		mockUseLocalStorage.mockReturnValue([{ light: localStorageColor }, vi.fn()]);

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
				state.settings.prefs.carbonioPrefDarkMode = 'disabled';
			})
		);

		setup(<PrimaryColorComponent />);

		expect(
			await screen.findByText(`color: ${carbonioWebUiPrimaryColorConfig}`),
			'the light primary color config should be used when dark mode is disabled'
		).toBeVisible();
	});

	it('should return the carbonioWebUiDarkPrimaryColor config when available and dark mode is enabled', async () => {
		const localStorageColor = '#aabbaa';
		const mockUseLocalStorage = vi.spyOn(useLocalStorage, 'useLocalStorage');

		mockUseLocalStorage.mockReturnValue([{ light: localStorageColor }, vi.fn()]);

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
				state.settings.prefs.carbonioPrefDarkMode = 'enabled';
			})
		);

		setup(<PrimaryColorComponent />);

		expect(
			await screen.findByText(`color: ${carbonioWebUiDarkPrimaryColorConfig}`),
			'the dark primary color config should be used when dark mode is enabled'
		).toBeVisible();
	});

	it('should return the carbonioWebUiPrimaryColor config when available and carbonioWebUiDarkPrimaryColor is not available and dark mode is enabled', async () => {
		const localStorageColor = '#aabbaa';
		const mockUseLocalStorage = vi.spyOn(useLocalStorage, 'useLocalStorage');

		mockUseLocalStorage.mockReturnValue([{ light: localStorageColor }, vi.fn()]);

		const carbonioWebUiPrimaryColorConfig = '#bbbbbb';
		useLoginConfigStore.setState((s) => ({
			...s,
			carbonioWebUiPrimaryColor: carbonioWebUiPrimaryColorConfig,
			loaded: true
		}));

		useAccountStore.setState(
			produce((state) => {
				state.settings.prefs.carbonioPrefDarkMode = 'enabled';
			})
		);

		setup(<PrimaryColorComponent />);

		expect(
			await screen.findByText(`color: ${carbonioWebUiPrimaryColorConfig}`),
			'the light primary color config should be used as fallback when no dark color is configured and dark mode is enabled'
		).toBeVisible();
	});

	it('should return the carbonioWebUiDarkPrimaryColor config when available and carbonioWebUiPrimaryColor is not available and dark mode is disabled', async () => {
		const localStorageColor = '#aabbaa';
		const mockUseLocalStorage = vi.spyOn(useLocalStorage, 'useLocalStorage');

		mockUseLocalStorage.mockReturnValue([{ light: localStorageColor }, vi.fn()]);

		const carbonioWebUiDarkPrimaryColorConfig = '#cccccc';
		useLoginConfigStore.setState((s) => ({
			...s,
			carbonioWebUiDarkPrimaryColor: carbonioWebUiDarkPrimaryColorConfig,
			loaded: true
		}));

		useAccountStore.setState(
			produce((state) => {
				state.settings.prefs.carbonioPrefDarkMode = 'disabled';
			})
		);

		setup(<PrimaryColorComponent />);

		expect(
			await screen.findByText(`color: ${carbonioWebUiDarkPrimaryColorConfig}`),
			'the dark primary color config should be used as fallback when no light color is configured and dark mode is disabled'
		).toBeVisible();
	});

	it('should use localStore color as fallback until config color is received', async () => {
		const localStorageColor = '#aabbaa';
		const mockUseLocalStorage = vi.spyOn(useLocalStorage, 'useLocalStorage');

		mockUseLocalStorage.mockReturnValue([{ light: localStorageColor }, vi.fn()]);

		setup(<PrimaryColorComponent />);

		expect(
			await screen.findByText(`color: ${localStorageColor}`),
			'the localStorage color should be shown as fallback before the config color is received'
		).toBeVisible();

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
					state.settings.prefs.carbonioPrefDarkMode = 'disabled';
				})
			);
		});
		expect(
			await screen.findByText(`color: ${carbonioWebUiPrimaryColorConfig}`),
			'the config primary color should replace the localStorage fallback once received'
		).toBeVisible();
	});

	it('should use localStore color as fallback until configs are received and return undefined if carbonioWebUiPrimaryColor is not received', async () => {
		const localStorageColor = '#aabbaa';
		const mockUseLocalStorage = vi.spyOn(useLocalStorage, 'useLocalStorage');

		mockUseLocalStorage.mockReturnValue([{ light: localStorageColor }, vi.fn()]);

		setup(<PrimaryColorComponent />);

		expect(
			await screen.findByText(`color: ${localStorageColor}`),
			'the localStorage color should be shown as fallback before the configs are received'
		).toBeVisible();

		act(() => {
			useLoginConfigStore.setState((s) => ({
				...s,
				loaded: true
			}));

			useAccountStore.setState(
				produce((state) => {
					state.settings.prefs.carbonioPrefDarkMode = 'disabled';
				})
			);
		});
		expect(
			await screen.findByText(`color: undefined`),
			'the primary color should be undefined when no primary color config is received'
		).toBeVisible();
	});
});
