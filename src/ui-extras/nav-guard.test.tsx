/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React from 'react';

import { act, waitFor } from '@testing-library/react';
import i18next from 'i18next';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { Link, Route, Switch } from 'react-router-dom';

import { RouteLeavingGuard } from './nav-guard';
import { SHELL_APP_ID } from '../constants';
import { useI18nStore } from '../store/i18n/store';
import { screen, setup } from '../tests/utils';

describe('RouteLeavingGuard', () => {
	test('should show the unsaved changes modal if "when" condition is true', async () => {
		const { user } = setup(
			<>
				<Link to={'/otherPath'}>Navigate elsewhere</Link>
				<RouteLeavingGuard onSave={jest.fn()} when>
					Modal content
				</RouteLeavingGuard>
			</>
		);
		await user.click(screen.getByText('Navigate elsewhere'));
		await waitFor(() => expect(screen.getByText('You have unsaved changes')).toBeVisible());
		expect(screen.getByText('Modal content')).toBeVisible();
		expect(screen.getByRole('button', { name: /Save and leave/i })).toBeVisible();
		expect(screen.getByRole('button', { name: /Leave anyway/i })).toBeVisible();
		expect(screen.getByRole('button', { name: /Cancel/i })).toBeVisible();
	});

	test('should show the unsaved changes with error modal if "when" condition is true and dataHasError is true', async () => {
		const { user } = setup(
			<>
				<Link to={'/otherPath'}>Navigate elsewhere</Link>
				<RouteLeavingGuard onSave={jest.fn()} when dataHasError>
					Modal content
				</RouteLeavingGuard>
			</>
		);
		await user.click(screen.getByText('Navigate elsewhere'));
		await waitFor(() => expect(screen.getByText('Some changes cannot be saved')).toBeVisible());
		expect(screen.getByText('Modal content')).toBeVisible();
		expect(screen.getByRole('button', { name: /Leave anyway/i })).toBeVisible();
		expect(screen.getByRole('button', { name: /Cancel/i })).toBeVisible();
		expect(screen.queryByRole('button', { name: /Save and leave/i })).not.toBeInTheDocument();
	});

	test('should not show modal if "when" condition is false', async () => {
		const { user } = setup(
			<>
				<Link to={'/otherPath'}>Navigate elsewhere</Link>
				<RouteLeavingGuard onSave={jest.fn()} when={false}>
					Modal content
				</RouteLeavingGuard>
			</>
		);
		await user.click(screen.getByText('Navigate elsewhere'));
		act(() => {
			jest.runOnlyPendingTimers();
		});
		expect(screen.queryByText('Modal content')).not.toBeInTheDocument();
		expect(screen.queryByRole('button', { name: /Save and leave/i })).not.toBeInTheDocument();
	});

	test('should hide modal, stay on current location and not call onSave when clicking on cancel', async () => {
		const saveFn = jest.fn();
		const { user } = setup(
			<>
				<Link to={'/otherPath'}>Navigate elsewhere</Link>
				<Switch>
					<Route path={'/otherPath'}>Other location</Route>
					<Route path={'/'}>
						Current location
						<RouteLeavingGuard onSave={saveFn} when>
							Modal content
						</RouteLeavingGuard>
					</Route>
				</Switch>
			</>
		);
		await user.click(screen.getByText('Navigate elsewhere'));
		await waitFor(() => expect(screen.getByText('Modal content')).toBeVisible());
		await user.click(screen.getByRole('button', { name: /cancel/i }));
		expect(screen.queryByText('Modal content')).not.toBeInTheDocument();
		expect(screen.getByText('Current location')).toBeVisible();
		expect(saveFn).not.toHaveBeenCalled();
	});

	test('should hide modal, go on other location and not call onSave when clicking on leave anyway', async () => {
		const saveFn = jest.fn();
		const { user } = setup(
			<>
				<Link to={'/otherPath'}>Navigate elsewhere</Link>
				<Switch>
					<Route path={'/otherPath'}>Other location</Route>
					<Route path={'/'}>
						Current location
						<RouteLeavingGuard onSave={saveFn} when>
							Modal content
						</RouteLeavingGuard>
					</Route>
				</Switch>
			</>
		);
		await user.click(screen.getByText('Navigate elsewhere'));
		await waitFor(() => expect(screen.getByText('Modal content')).toBeVisible());
		await user.click(screen.getByRole('button', { name: /leave anyway/i }));
		await waitFor(() => expect(screen.queryByText('Modal content')).not.toBeInTheDocument());
		expect(screen.getByText('Other location')).toBeVisible();
		expect(saveFn).not.toHaveBeenCalled();
	});

	test('should hide modal, go on other location and call onSave when clicking on save and leave', async () => {
		const saveFn = jest.fn(() => Promise.allSettled([Promise.resolve()]));
		const { user } = setup(
			<>
				<Link to={'/otherPath'}>Navigate elsewhere</Link>
				<Switch>
					<Route path={'/otherPath'}>Other location</Route>
					<Route path={'/'}>
						Current location
						<RouteLeavingGuard onSave={saveFn} when>
							Modal content
						</RouteLeavingGuard>
					</Route>
				</Switch>
			</>
		);
		await user.click(screen.getByText('Navigate elsewhere'));
		await waitFor(() => expect(screen.getByText('Modal content')).toBeVisible());
		await act(async () => {
			await user.click(screen.getByRole('button', { name: /save and leave/i }));
		});
		await waitFor(() => expect(saveFn).toHaveBeenCalled());
		await waitFor(() => expect(screen.queryByText('Modal content')).not.toBeInTheDocument());
		await screen.findByText('Other location');
		expect(saveFn).toHaveBeenCalled();
	});

	test.each([
		[
			'with a rejection',
			(): ReturnType<(typeof Promise)['allSettled']> =>
				Promise.allSettled([Promise.reject(new Error('controlled error'))])
		],
		['with an exception', (): Promise<never> => Promise.reject(new Error('controlled error'))]
	])(
		'should hide modal, but stay on current location when clicking on save but save fails %s',
		async (_, saveImplementation) => {
			const saveFn = jest.fn(saveImplementation);
			const { user } = setup(
				<>
					<Link to={'/otherPath'}>Navigate elsewhere</Link>
					<Switch>
						<Route path={'/otherPath'}>Other location</Route>
						<Route path={'/'}>
							Current location
							<RouteLeavingGuard onSave={saveFn} when>
								Modal content
							</RouteLeavingGuard>
						</Route>
					</Switch>
				</>
			);
			await user.click(screen.getByText('Navigate elsewhere'));
			await waitFor(() => expect(screen.getByText('Modal content')).toBeVisible());
			await act(async () => {
				await user.click(screen.getByRole('button', { name: /save and leave/i }));
			});
			await waitFor(() => expect(screen.queryByText('Modal content')).not.toBeInTheDocument());
			expect(screen.getByText('Current location')).toBeVisible();
			expect(saveFn).toHaveBeenCalled();
		}
	);

	test('should translate the content using module provider', async () => {
		const moduleI18n = i18next.createInstance();
		moduleI18n.init({
			lng: 'it',
			fallbackLng: 'en',
			interpolation: {
				escapeValue: false // not needed for react as it escapes by default
			},
			resources: {
				it: {
					translation: {
						modulekey: 'Traduzione specifica del modulo'
					}
				}
			}
		});
		const shellI18n = i18next.createInstance();
		shellI18n.init({
			lng: 'it',
			fallbackLng: 'en',
			interpolation: {
				escapeValue: false
			},
			resources: {}
		});
		useI18nStore.setState({
			instances: {
				module: moduleI18n,
				[SHELL_APP_ID]: shellI18n
			}
		});
		const TestComponent = (): React.JSX.Element => {
			const [t] = useTranslation();
			return (
				<>
					<Link to={'/otherPath'}>Navigate elsewhere</Link>
					<RouteLeavingGuard onSave={jest.fn()} when>
						<div>{t('modulekey', 'a module key')}</div>
					</RouteLeavingGuard>
				</>
			);
		};
		const { user } = setup(
			<Route path={'/module'}>
				<I18nextProvider i18n={shellI18n}>
					<I18nextProvider i18n={moduleI18n}>
						<TestComponent />
					</I18nextProvider>
				</I18nextProvider>
			</Route>,
			{ initialRouterEntries: ['/module'] }
		);
		await user.click(screen.getByText('Navigate elsewhere'));
		await waitFor(() => expect(screen.getByText('Traduzione specifica del modulo')).toBeVisible());
	});

	test('should translate the title and actions using shell provider', async () => {
		const moduleI18n = i18next.createInstance();
		moduleI18n.init({
			lng: 'it',
			fallbackLng: 'en',
			interpolation: {
				escapeValue: false // not needed for react as it escapes by default
			},
			resources: {}
		});
		const shellI18n = i18next.createInstance();
		shellI18n.init({
			lng: 'it',
			fallbackLng: 'en',
			interpolation: {
				escapeValue: false
			},
			resources: {
				it: {
					translation: {
						label: {
							unsaved_changes: 'Alcune modifiche non sono salvate',
							leave_anyway: 'Esci comunque',
							save_and_leave: 'Salva e esci',
							cancel: 'Annulla'
						}
					}
				}
			}
		});
		useI18nStore.setState({
			instances: {
				module: moduleI18n,
				[SHELL_APP_ID]: shellI18n
			}
		});
		const { user } = setup(
			<Route path={'/module'}>
				<I18nextProvider i18n={shellI18n}>
					<I18nextProvider i18n={moduleI18n}>
						<Link to={'/otherPath'}>Navigate elsewhere</Link>
						<RouteLeavingGuard onSave={jest.fn()} when>
							Modal content
						</RouteLeavingGuard>
					</I18nextProvider>
				</I18nextProvider>
			</Route>,
			{ initialRouterEntries: ['/module'] }
		);
		await user.click(screen.getByText('Navigate elsewhere'));
		await waitFor(() => expect(screen.getByText('Modal content')).toBeVisible());
		expect(screen.getByText('Alcune modifiche non sono salvate')).toBeVisible();
		expect(screen.getByRole('button', { name: /Salva e esci/i })).toBeVisible();
		expect(screen.getByRole('button', { name: /Esci comunque/i })).toBeVisible();
		expect(screen.getByRole('button', { name: /Annulla/i })).toBeVisible();
	});
});
