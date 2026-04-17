/*
 * SPDX-FileCopyrightText: 2026 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React from 'react';

import { act } from '@testing-library/react';
import { useBlocker } from 'react-router-dom';

import { SettingsHeader } from './settings-header';
import { TIMERS } from '../../tests/constants';
import { screen, setup } from '../../tests/utils';

describe('SettingsHeader', () => {
	it('should render breadcrumbs with Settings and the given title', () => {
		setup(<SettingsHeader title="General" onSave={vi.fn()} onCancel={vi.fn()} isDirty={false} />);
		expect(screen.getByText('Settings')).toBeVisible();
		expect(screen.getByText('General')).toBeVisible();
	});

	it('should render save and discard buttons when hideSavingOptions is false', () => {
		setup(<SettingsHeader title="General" onSave={vi.fn()} onCancel={vi.fn()} isDirty={false} />);
		expect(screen.getByRole('button', { name: 'Save' })).toBeVisible();
		expect(screen.getByRole('button', { name: 'DISCARD CHANGES' })).toBeVisible();
	});

	it('should not render save and discard buttons when hideSavingOptions is true', () => {
		setup(<SettingsHeader title="General" hideSavingOptions />);
		expect(screen.queryByRole('button', { name: 'Save' })).not.toBeInTheDocument();
		expect(screen.queryByRole('button', { name: 'DISCARD CHANGES' })).not.toBeInTheDocument();
	});

	it('should disable save and discard buttons when isDirty is false', () => {
		setup(<SettingsHeader title="General" onSave={vi.fn()} onCancel={vi.fn()} isDirty={false} />);
		expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
		expect(screen.getByRole('button', { name: 'DISCARD CHANGES' })).toBeDisabled();
	});

	it('should enable save and discard buttons when isDirty is true', () => {
		setup(<SettingsHeader title="General" onSave={vi.fn()} onCancel={vi.fn()} isDirty />);
		expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled();
		expect(screen.getByRole('button', { name: 'DISCARD CHANGES' })).toBeEnabled();
	});

	it('should disable save button when isDirty is true but hasError is true', () => {
		setup(<SettingsHeader title="General" onSave={vi.fn()} onCancel={vi.fn()} isDirty hasError />);
		expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
		expect(screen.getByRole('button', { name: 'DISCARD CHANGES' })).toBeEnabled();
	});

	it('should call onSave when save button is clicked', async () => {
		const onSave = vi.fn();
		const { user } = setup(
			<SettingsHeader title="General" onSave={onSave} onCancel={vi.fn()} isDirty />
		);
		await user.click(screen.getByRole('button', { name: 'Save' }));
		expect(onSave).toHaveBeenCalledTimes(1);
	});

	it('should call onCancel when discard button is clicked', async () => {
		const onCancel = vi.fn();
		const { user } = setup(
			<SettingsHeader title="General" onSave={vi.fn()} onCancel={onCancel} isDirty />
		);
		await user.click(screen.getByRole('button', { name: 'DISCARD CHANGES' }));
		expect(onCancel).toHaveBeenCalledTimes(1);
	});

	it('should render unsaved changes text in the modal when the route blocker is active', async () => {
		vi.mocked(useBlocker).mockReturnValue({
			state: 'blocked',
			proceed: vi.fn(),
			reset: vi.fn(),
			location: {} as never
		});

		await act(() =>
			setup(
				<SettingsHeader
					title="General"
					onSave={vi.fn().mockResolvedValue([])}
					onCancel={vi.fn()}
					isDirty
				/>
			)
		);

		act(() => {
			vitest.advanceTimersByTime(TIMERS.modalShow);
		});

		expect(
			screen.getByText('Are you sure you want to leave this page without saving?')
		).toBeVisible();
		expect(screen.getByText('All your unsaved changes will be lost')).toBeVisible();
	});

	it('should scroll to section when section search param is set', () => {
		const scrollIntoViewMock = vi.fn();
		const element = document.createElement('div');
		element.id = 'my-section';
		element.scrollIntoView = scrollIntoViewMock;
		document.body.appendChild(element);

		setup(<SettingsHeader title="General" onSave={vi.fn()} onCancel={vi.fn()} isDirty={false} />, {
			initialRouterEntries: ['/?section=my-section']
		});

		vi.advanceTimersByTime(10);
		expect(scrollIntoViewMock).toHaveBeenCalled();

		document.body.removeChild(element);
	});
});
