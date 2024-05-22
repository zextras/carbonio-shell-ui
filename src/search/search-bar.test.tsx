/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React from 'react';

import { act, waitFor } from '@testing-library/react';
import { Link } from 'react-router-dom';

import { SearchAppView } from './search-app-view';
import { SearchBar } from './search-bar';
import { useSearchStore } from './search-store';
import { SEARCH_MODULE_KEY } from './useSearchModule';
import { SEARCH_APP_ID } from '../constants';
import * as useLocalStorage from '../shell/hooks/useLocalStorage';
import { useAppStore } from '../store/app';
import { ICONS, TESTID_SELECTORS } from '../test/constants';
import {
	generateCarbonioModule,
	generateModuleRouteDescriptor,
	setupAppStore
} from '../test/test-app-utils';
import { setup, screen, within } from '../test/utils';
import type { SearchView } from '../types/apps';

describe('Search bar', () => {
	describe('Clear search', () => {
		it('should hide the clear button, by default, when the search input is empty or not valued', () => {
			setup(<SearchBar />);
			const inputElement = screen.getByRole('textbox', { name: /search in/i });
			expect(inputElement).toBeVisible();
			expect(inputElement).toHaveValue('');
			expect(
				screen.queryByRoleWithIcon('button', { icon: ICONS.clearSearch })
			).not.toBeInTheDocument();
		});

		it('should clear the input element when the user clicks on clear button', async () => {
			const { user } = setup(<SearchBar />);
			const inputElement = screen.getByRole('textbox', { name: /search in/i });
			const textContent = 'test';
			await user.type(inputElement, textContent);
			await user.keyboard(',');
			await user.type(inputElement, 'test2');
			await user.click(screen.getByRoleWithIcon('button', { icon: ICONS.clearSearch }));
			expect(inputElement).toHaveValue('');
			expect(inputElement).toHaveFocus();
			expect(screen.queryByText(textContent)).not.toBeInTheDocument();
		});
	});

	describe('Search button', () => {
		it('should disable the search button, by default, when the input element is empty and there are no chips', async () => {
			setup(<SearchBar />);
			const inputElement = screen.getByRole('textbox', { name: /search in/i });
			expect(inputElement).toBeVisible();
			expect(inputElement).toHaveValue('');
			const searchButton = screen.getByRoleWithIcon('button', { icon: ICONS.search });
			expect(searchButton).toBeVisible();
			expect(searchButton).toBeDisabled();
		});

		it('should enable the search button when the user starts typing inside the input element', async () => {
			const { user } = setup(<SearchBar />);
			await user.type(screen.getByRole('textbox', { name: /search in/i }), 'test');
			const searchButton = screen.getByRoleWithIcon('button', { icon: ICONS.search });
			await waitFor(() => expect(searchButton).toBeEnabled());
			jest.advanceTimersToNextTimer();
			await user.hover(searchButton);
			act(() => {
				// run timers of tooltip
				jest.advanceTimersToNextTimer();
			});
			expect(
				await screen.findByText(/Type or choose some keywords to start a search/i)
			).toBeVisible();
		});

		it.each(['[Enter]', ',', '[Space]'])(
			'should enable the search button when the user presses keyboard key (%s) to add the chips',
			async (key) => {
				const { user } = setup(<SearchBar />);
				const inputElement = screen.getByRole('textbox', { name: /search in/i });
				const chip1 = 'test';
				await user.type(inputElement, chip1);
				await user.keyboard(key);
				expect(screen.getByText(chip1)).toBeVisible();
				expect(inputElement).toHaveValue('');
				const searchButton = screen.getByRoleWithIcon('button', { icon: ICONS.search });
				expect(searchButton).toBeEnabled();
				jest.advanceTimersToNextTimer();
				await user.hover(searchButton);
				act(() => {
					// run timers of tooltip
					jest.advanceTimersToNextTimer();
				});
				expect(await screen.findByText(/Start search/i)).toBeVisible();
			}
		);

		it('should render the chips when the user clicks on the search button', async () => {
			const { user } = setup(<SearchBar />);
			const inputElement = screen.getByRole('textbox', { name: /search in/i });
			const searchButton = screen.getByRoleWithIcon('button', { icon: ICONS.search });
			const chip1 = 'test';
			const chip2 = 'test2';
			await user.type(inputElement, chip1);
			await user.click(searchButton);
			await user.type(inputElement, 'test2');
			await user.click(searchButton);
			expect(screen.getByText(chip1)).toBeVisible();
			expect(screen.getByText(chip2)).toBeVisible();
			expect(inputElement).not.toHaveFocus();
			expect(inputElement).toHaveValue('');
		});
	});

	describe('Dropdown suggestions', () => {
		it('should render the last 5 words of the suggestion array when the user clicks on the input element', async () => {
			const app = generateCarbonioModule();
			const mockUseLocalStorage = jest.spyOn(useLocalStorage, 'useLocalStorage');
			const route = 'mails';
			useSearchStore.setState({
				module: 'mails'
			});
			useAppStore.getState().addSearchView({
				app: app.name,
				icon: app.icon,
				route,
				label: app.display,
				position: app.priority,
				id: app.name,
				component: () => <div>{app.name}</div>
			});
			mockUseLocalStorage.mockReturnValue([
				[
					{ value: 'test1', label: 'test1', icon: 'ClockOutline', app: 'mails', id: 'test1' },
					{ value: 'test2', label: 'test2', icon: 'ClockOutline', app: 'mails', id: 'test2' },
					{ value: 'test3', label: 'test3', icon: 'ClockOutline', app: 'mails', id: 'test3' },
					{ value: 'test4', label: 'test4', icon: 'ClockOutline', app: 'mails', id: 'test4' },
					{ value: 'test5', label: 'test5', icon: 'ClockOutline', app: 'mails', id: 'test5' },
					{ value: 'test6', label: 'test6', icon: 'ClockOutline', app: 'files', id: 'test6' },
					{ value: 'release', label: 'release', icon: 'ClockOutline', app: 'mails', id: 'release' }
				],
				jest.fn()
			]);
			const { user } = setup(<SearchBar />, {
				initialRouterEntries: [`/${SEARCH_APP_ID}`]
			});
			await user.click(screen.getByRole('textbox', { name: `Search in ${app.display}` }));
			const dropdown = await screen.findByTestId(TESTID_SELECTORS.dropdown);
			expect(within(dropdown).getByText('release')).toBeVisible();
			expect(within(dropdown).queryByText('test6')).not.toBeInTheDocument();
			expect(within(dropdown).getByText('test5')).toBeVisible();
			expect(within(dropdown).getByText('test4')).toBeVisible();
			expect(within(dropdown).getByText('test3')).toBeVisible();
			expect(within(dropdown).getByText('test2')).toBeVisible();
		});

		it('should render the suggestions when the user starts typing in the input element', async () => {
			const app = generateCarbonioModule();
			const mockUseLocalStorage = jest.spyOn(useLocalStorage, 'useLocalStorage');
			const route = 'mails';
			useSearchStore.setState({
				module: 'mails'
			});
			useAppStore.getState().addSearchView({
				app: app.name,
				icon: app.icon,
				route,
				label: app.display,
				position: app.priority,
				id: app.name,
				component: () => <div>{app.name}</div>
			});
			mockUseLocalStorage.mockReturnValue([
				[
					{ value: 'test', label: 'test', icon: 'ClockOutline', app: 'mails', id: 'test' },
					{ value: 'test2', label: 'test2', icon: 'ClockOutline', app: 'mails', id: 'test2' },
					{ value: 'test3', label: 'test3', icon: 'ClockOutline', app: 'files', id: 'test3' },
					{ value: 'release', label: 'release', icon: 'ClockOutline', app: 'mails', id: 'release' }
				],
				jest.fn()
			]);
			const { user } = setup(<SearchBar />, {
				initialRouterEntries: [`/${SEARCH_APP_ID}`]
			});
			await user.type(screen.getByRole('textbox', { name: `Search in ${app.display}` }), 't');
			const dropdown = await screen.findByTestId(TESTID_SELECTORS.dropdown);
			expect(within(dropdown).getByText('test')).toBeVisible();
			expect(within(dropdown).getByText('test2')).toBeVisible();
			expect(within(dropdown).queryByText('test3')).not.toBeInTheDocument();
			await waitFor(() => expect(within(dropdown).queryByText('release')).not.toBeInTheDocument());
		});

		it('should create chip when the user clicks on the dropdown suggestion', async () => {
			const app = generateCarbonioModule();
			const mockUseLocalStorage = jest.spyOn(useLocalStorage, 'useLocalStorage');
			const route = 'mails';
			useSearchStore.setState({
				module: 'mails'
			});
			useAppStore.getState().addSearchView({
				app: app.name,
				icon: app.icon,
				route,
				label: app.display,
				position: app.priority,
				id: app.name,
				component: () => <div>{app.name}</div>
			});
			mockUseLocalStorage.mockReturnValue([
				[{ value: 'test', label: 'test', icon: 'ClockOutline', app: 'mails', id: 'test' }],
				jest.fn()
			]);
			const { user } = setup(<SearchBar />, {
				initialRouterEntries: [`/${SEARCH_APP_ID}`]
			});
			await user.type(screen.getByRole('textbox', { name: `Search in ${app.display}` }), 't');
			const dropdown = await screen.findByTestId(TESTID_SELECTORS.dropdown);
			await user.click(within(dropdown).getByText('test'));
			expect(dropdown).not.toBeInTheDocument();
			// chip is created
			expect(screen.getByText('test')).toBeVisible();
		});
	});

	test('should render the module selector and the input of the search bar', async () => {
		const app = generateCarbonioModule();
		const route = 'appRoute';

		useAppStore.getState().addSearchView({
			app: app.name,
			icon: app.icon,
			route,
			label: app.display,
			position: app.priority,
			id: app.name,
			component: () => <div>{app.name}</div>
		});
		useAppStore.getState().addRoute({
			id: SEARCH_APP_ID,
			app: SEARCH_APP_ID,
			route: SEARCH_APP_ID,
			appView: SearchAppView,
			badge: {
				show: false
			},
			label: 'Search',
			position: 1000,
			visible: true,
			primaryBar: 'SearchModOutline'
		});

		setup(<SearchBar />, { initialRouterEntries: [`/${SEARCH_APP_ID}`] });
		expect(screen.getByText(app.display)).toBeVisible();
		expect(screen.getByRole('textbox', { name: `Search in ${app.display}` })).toBeVisible();
	});

	it('should show the label of the module if the user is already inside that module', () => {
		const app = generateCarbonioModule({ priority: 1 });
		const searchRoute = generateModuleRouteDescriptor({
			label: app.name,
			position: 3,
			id: app.name,
			route: app.name
		});
		useSearchStore.setState({
			module: undefined
		});
		setupAppStore([app], [searchRoute]);
		useAppStore.getState().addSearchView({
			app: app.name,
			icon: app.icon,
			id: app.name,
			label: app.display,
			position: app.priority,
			route: app.name,
			component: () => <div>{app.name}</div>
		});
		setup(<SearchBar />, { initialRouterEntries: [`/${app.name}`] });
		const selector = screen.getByTestId(TESTID_SELECTORS.headerModuleSelector);
		expect(within(selector).getByText(app.display)).toBeVisible();
		expect(screen.getByRole('textbox', { name: `Search in ${app.display}` })).toBeVisible();
	});

	it('should not update module if the user navigates to a module without search', async () => {
		const app1 = generateCarbonioModule({ priority: 1 });
		const app2 = generateCarbonioModule({ priority: 2 });
		const app1Route = generateModuleRouteDescriptor({
			label: app1.name,
			position: 1,
			id: app1.name,
			route: app1.name
		});
		const app2Route = generateModuleRouteDescriptor({
			label: app2.name,
			position: 2,
			id: app2.name,
			route: app2.name
		});
		setupAppStore([app1, app2], [app1Route, app2Route]);
		const app1SearchView = {
			app: app1.name,
			icon: app1.icon,
			id: app1.name,
			label: app1.display,
			position: app1.priority,
			route: app1.name,
			component: (): React.JSX.Element => <div>{app1.name}</div>
		} satisfies SearchView;
		useAppStore.getState().addSearchView(app1SearchView);
		const { user } = setup(
			<>
				<SearchBar />
				<Link to={app2Route.route}>go to app2</Link>
			</>,
			{ initialRouterEntries: [`/${app1Route.route}`] }
		);
		await user.click(screen.getByRole('link', { name: 'go to app2' }));
		expect(screen.getByRole('textbox', { name: `Search in ${app1.display}` })).toBeVisible();
		const selector = screen.getByTestId(TESTID_SELECTORS.headerModuleSelector);
		expect(within(selector).getByText(app1SearchView.label)).toBeVisible();
	});

	it('should show the module with the lowest priority if both store and session storage are undefined', () => {
		const app1 = generateCarbonioModule({ priority: 1 });
		const app2 = generateCarbonioModule({ priority: 2 });
		const app1Route = generateModuleRouteDescriptor({
			label: app1.name,
			position: 1,
			id: app1.name,
			route: app1.name
		});
		const app2Route = generateModuleRouteDescriptor({
			label: app2.name,
			position: 2,
			id: app2.name,
			route: app2.name
		});
		setupAppStore([app1, app2], [app1Route, app2Route]);
		const app1SearchView = {
			app: app1.name,
			icon: app1.icon,
			id: app1.name,
			label: app1.display,
			position: app1.priority,
			route: app1.name,
			component: (): React.JSX.Element => <div>{app1.name}</div>
		} satisfies SearchView;
		const app2SearchView = {
			app: app2.name,
			icon: app2.icon,
			id: app2.name,
			label: app2.display,
			position: app2.priority,
			route: app2.name,
			component: (): React.JSX.Element => <div>{app2.name}</div>
		} satisfies SearchView;
		useAppStore.getState().addSearchView(app1SearchView);
		useAppStore.getState().addSearchView(app2SearchView);
		setup(<SearchBar />);
		const selector = screen.getByTestId(TESTID_SELECTORS.headerModuleSelector);
		expect(within(selector).getByText(app1.display)).toBeVisible();
		expect(screen.getByRole('textbox', { name: `Search in ${app1.display}` })).toBeVisible();
	});

	it('should show the module with the lowest priority if the session storage has an invalid value(sasso)', () => {
		const app1 = generateCarbonioModule({ priority: 1 });
		const app2 = generateCarbonioModule({ priority: 2 });
		const app1Route = generateModuleRouteDescriptor({
			label: app1.name,
			position: 1,
			id: app1.name,
			route: app1.name
		});
		const app2Route = generateModuleRouteDescriptor({
			label: app2.name,
			position: 2,
			id: app2.name,
			route: app2.name
		});
		setupAppStore([app1, app2], [app1Route, app2Route]);
		const app1SearchView = {
			app: app1.name,
			icon: app1.icon,
			id: app1.name,
			label: app1.display,
			position: app1.priority,
			route: app1.name,
			component: (): React.JSX.Element => <div>{app1.name}</div>
		} satisfies SearchView;
		const app2SearchView = {
			app: app2.name,
			icon: app2.icon,
			id: app2.name,
			label: app2.display,
			position: app2.priority,
			route: app2.name,
			component: (): React.JSX.Element => <div>{app2.name}</div>
		} satisfies SearchView;
		sessionStorage.setItem(SEARCH_MODULE_KEY, 'sasso');
		useAppStore.getState().addSearchView(app1SearchView);
		useAppStore.getState().addSearchView(app2SearchView);
		setup(<SearchBar />);
		const selector = screen.getByTestId(TESTID_SELECTORS.headerModuleSelector);
		expect(within(selector).getByText(app1.display)).toBeVisible();
		expect(screen.getByRole('textbox', { name: `Search in ${app1.display}` })).toBeVisible();
	});

	it('should show the module matching the session storage if the module has a searchView', () => {
		const app1 = generateCarbonioModule({ priority: 1 });
		const app2 = generateCarbonioModule({ priority: 2 });
		const app1Route = generateModuleRouteDescriptor({
			label: app1.name,
			position: 1,
			id: app1.name,
			route: app1.name
		});
		const app2Route = generateModuleRouteDescriptor({
			label: app2.name,
			position: 2,
			id: app2.name,
			route: app2.name
		});
		setupAppStore([app1, app2], [app1Route, app2Route]);
		const app1SearchView = {
			app: app1.name,
			icon: app1.icon,
			id: app1.name,
			label: app1.display,
			position: app1.priority,
			route: app1.name,
			component: (): React.JSX.Element => <div>{app1.name}</div>
		} satisfies SearchView;
		const app2SearchView = {
			app: app2.name,
			icon: app2.icon,
			id: app2.name,
			label: app2.display,
			position: app2.priority,
			route: app2.name,
			component: (): React.JSX.Element => <div>{app2.name}</div>
		} satisfies SearchView;
		sessionStorage.setItem(SEARCH_MODULE_KEY, app2.name);
		useAppStore.getState().addSearchView(app1SearchView);
		useAppStore.getState().addSearchView(app2SearchView);
		setup(<SearchBar />);
		const selector = screen.getByTestId(TESTID_SELECTORS.headerModuleSelector);
		expect(within(selector).getByText(app2.display)).toBeVisible();
		expect(screen.getByRole('textbox', { name: `Search in ${app2.display}` })).toBeVisible();
	});

	it('should show the module with the lowest priority if the session storage module has not a searchView(tasks/chats)', () => {
		const app1 = generateCarbonioModule({ priority: 1 });
		const app2 = generateCarbonioModule({ priority: 2 });
		const app1Route = generateModuleRouteDescriptor({
			label: app1.name,
			position: 1,
			id: app1.name,
			route: app1.name
		});
		const app2Route = generateModuleRouteDescriptor({
			label: app2.name,
			position: 2,
			id: app2.name,
			route: app2.name
		});
		setupAppStore([app1, app2], [app1Route, app2Route]);
		const app1SearchView = {
			app: app1.name,
			icon: app1.icon,
			id: app1.name,
			label: app1.display,
			position: app1.priority,
			route: app1.name,
			component: (): React.JSX.Element => <div>{app1.name}</div>
		} satisfies SearchView;
		sessionStorage.setItem(SEARCH_MODULE_KEY, app2.name);
		useAppStore.getState().addSearchView(app1SearchView);
		setup(<SearchBar />);
		const selector = screen.getByTestId(TESTID_SELECTORS.headerModuleSelector);
		expect(within(selector).getByText(app1.display)).toBeVisible();
		expect(screen.getByRole('textbox', { name: `Search in ${app1.display}` })).toBeVisible();
	});
});
