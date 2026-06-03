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
		expect(
			screen.getByText('Settings'),
			'the "Settings" breadcrumb should be visible'
		).toBeVisible();
		expect(
			screen.getByText('General'),
			'the breadcrumb with the given title "General" should be visible'
		).toBeVisible();
	});

	it('should render save and discard buttons when hideSavingOptions is false', () => {
		setup(<SettingsHeader title="General" onSave={vi.fn()} onCancel={vi.fn()} isDirty={false} />);
		expect(
			screen.getByRole('button', { name: 'Save' }),
			'the Save button should be visible when hideSavingOptions is false'
		).toBeVisible();
		expect(
			screen.getByRole('button', { name: 'DISCARD CHANGES' }),
			'the DISCARD CHANGES button should be visible when hideSavingOptions is false'
		).toBeVisible();
	});

	it('should not render save and discard buttons when hideSavingOptions is true', () => {
		setup(<SettingsHeader title="General" hideSavingOptions />);
		expect(
			screen.queryByRole('button', { name: 'Save' }),
			'the Save button should not be rendered when hideSavingOptions is true'
		).not.toBeInTheDocument();
		expect(
			screen.queryByRole('button', { name: 'DISCARD CHANGES' }),
			'the DISCARD CHANGES button should not be rendered when hideSavingOptions is true'
		).not.toBeInTheDocument();
	});

	it('should disable save and discard buttons when isDirty is false', () => {
		setup(<SettingsHeader title="General" onSave={vi.fn()} onCancel={vi.fn()} isDirty={false} />);
		expect(
			screen.getByRole('button', { name: 'Save' }),
			'the Save button should be disabled when isDirty is false'
		).toBeDisabled();
		expect(
			screen.getByRole('button', { name: 'DISCARD CHANGES' }),
			'the DISCARD CHANGES button should be disabled when isDirty is false'
		).toBeDisabled();
	});

	it('should enable save and discard buttons when isDirty is true', () => {
		setup(<SettingsHeader title="General" onSave={vi.fn()} onCancel={vi.fn()} isDirty />);
		expect(
			screen.getByRole('button', { name: 'Save' }),
			'the Save button should be enabled when isDirty is true'
		).toBeEnabled();
		expect(
			screen.getByRole('button', { name: 'DISCARD CHANGES' }),
			'the DISCARD CHANGES button should be enabled when isDirty is true'
		).toBeEnabled();
	});

	it('should disable save button when isDirty is true but hasError is true', () => {
		setup(<SettingsHeader title="General" onSave={vi.fn()} onCancel={vi.fn()} isDirty hasError />);
		expect(
			screen.getByRole('button', { name: 'Save' }),
			'the Save button should be disabled when hasError is true even though isDirty is true'
		).toBeDisabled();
		expect(
			screen.getByRole('button', { name: 'DISCARD CHANGES' }),
			'the DISCARD CHANGES button should remain enabled when hasError is true'
		).toBeEnabled();
	});

	it('should call onSave when save button is clicked', async () => {
		const onSave = vi.fn();
		const { user } = setup(
			<SettingsHeader title="General" onSave={onSave} onCancel={vi.fn()} isDirty />
		);
		await user.click(screen.getByRole('button', { name: 'Save' }));
		expect(
			onSave,
			'onSave should be called once when the Save button is clicked'
		).toHaveBeenCalledTimes(1);
	});

	it('should call onCancel when discard button is clicked', async () => {
		const onCancel = vi.fn();
		const { user } = setup(
			<SettingsHeader title="General" onSave={vi.fn()} onCancel={onCancel} isDirty />
		);
		await user.click(screen.getByRole('button', { name: 'DISCARD CHANGES' }));
		expect(
			onCancel,
			'onCancel should be called once when the DISCARD CHANGES button is clicked'
		).toHaveBeenCalledTimes(1);
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
			screen.getByText('Are you sure you want to leave this page without saving?'),
			'the unsaved changes confirmation question should be visible when the route blocker is active'
		).toBeVisible();
		expect(
			screen.getByText('All your unsaved changes will be lost'),
			'the unsaved changes warning text should be visible when the route blocker is active'
		).toBeVisible();
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
		expect(
			scrollIntoViewMock,
			'scrollIntoView should be called on the target section when the section search param is set'
		).toHaveBeenCalled();

		document.body.removeChild(element);
	});
});
