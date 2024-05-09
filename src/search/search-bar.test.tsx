/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React from 'react';

import { act } from '@testing-library/react';
import { useLocation } from 'react-router-dom';

import { SearchBar } from './search-bar';
import { useSearchStore } from './search-store';
import { ContextBridge } from '../boot/context-bridge';
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

describe('Search bar', () => {
	const LocationDisplayer = (): React.JSX.Element => {
		const location = useLocation();

		return (
			<div data-testid="location-display">
				{location.pathname}
				{location.search}
			</div>
		);
	};

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
			await act(async () => {
				await user.type(inputElement, textContent);
			});
			await act(async () => {
				await user.keyboard(',');
			});
			await act(async () => {
				await user.type(inputElement, 'test2');
			});
			await act(async () => {
				await user.click(screen.getByRoleWithIcon('button', { icon: ICONS.clearSearch }));
			});
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
			await act(async () => {
				await user.type(screen.getByRole('textbox', { name: /search in/i }), 'test');
			});
			const searchButton = screen.getByRoleWithIcon('button', { icon: ICONS.search });
			expect(searchButton).toBeEnabled();
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
				await act(async () => {
					await user.type(inputElement, chip1);
				});
				await act(async () => {
					await user.keyboard(key);
				});
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
			await act(async () => {
				await user.type(inputElement, chip1);
			});
			await act(async () => {
				await user.click(searchButton);
			});
			await act(async () => {
				await user.type(inputElement, 'test2');
			});
			await act(async () => {
				await user.click(searchButton);
			});
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
				initialRouterEntries: [`/${SEARCH_APP_ID}/${route}`]
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
				initialRouterEntries: [`/${SEARCH_APP_ID}/${route}`]
			});
			await act(async () => {
				await user.type(screen.getByRole('textbox', { name: `Search in ${app.display}` }), 't');
			});
			const dropdown = await screen.findByTestId(TESTID_SELECTORS.dropdown);
			expect(within(dropdown).getByText('test')).toBeVisible();
			expect(within(dropdown).getByText('test2')).toBeVisible();
			expect(within(dropdown).queryByText('test3')).not.toBeInTheDocument();
			expect(within(dropdown).queryByText('release')).not.toBeInTheDocument();
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
				initialRouterEntries: [`/${SEARCH_APP_ID}/${route}`]
			});
			await act(async () => {
				await user.type(screen.getByRole('textbox', { name: `Search in ${app.display}` }), 't');
			});
			const dropdown = await screen.findByTestId(TESTID_SELECTORS.dropdown);
			await act(async () => {
				await user.click(within(dropdown).getByText('test'));
			});
			expect(dropdown).not.toBeInTheDocument();
			// chip is created
			expect(screen.getByText('test')).toBeVisible();
		});
	});

	test('should render the module selector and the input of the search bar', async () => {
		const app = generateCarbonioModule();
		const route = 'appRoute';

		useSearchStore.setState({
			module: 'route'
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
		setup(<SearchBar />, { initialRouterEntries: [`/${SEARCH_APP_ID}/${route}`] });
		expect(screen.getByText(app.display)).toBeVisible();
		expect(screen.getByRole('textbox', { name: `Search in ${app.display}` })).toBeVisible();
	});

	test('should navigate to the search of the module when selected', async () => {
		const app1 = generateCarbonioModule({ priority: 1 });
		const route1 = generateModuleRouteDescriptor({ id: app1.name, position: 1 });
		const app2 = generateCarbonioModule({ priority: 2 });
		const route2 = generateModuleRouteDescriptor({ id: app2.name, position: 2 });
		const searchApp = generateCarbonioModule({ priority: 3, name: SEARCH_APP_ID });
		const searchRoute = generateModuleRouteDescriptor({
			label: 'search',
			position: 3,
			id: SEARCH_APP_ID
		});
		useSearchStore.setState({
			module: route1.route
		});
		setupAppStore([app1, app2, searchApp], [route1, route2, searchRoute]);
		useAppStore.getState().addSearchView({
			app: app1.name,
			icon: app1.icon,
			route: route1.route,
			label: app1.display,
			position: app1.priority,
			id: app1.name,
			component: () => <div>{app1.name}</div>
		});
		useAppStore.getState().addSearchView({
			app: app2.name,
			icon: app2.icon,
			route: route2.route,
			label: app2.display,
			position: app2.priority,
			id: app2.name,
			component: () => <div>{app2.name}</div>
		});

		const { user } = setup(
			<>
				<ContextBridge />
				<SearchBar />
				<LocationDisplayer />
			</>,
			{ initialRouterEntries: [`/search/${route1.route}`] }
		);
		expect(
			within(screen.getByTestId('location-display')).getByText(`/${SEARCH_APP_ID}/${route1.route}`)
		).toBeVisible();
		await user.click(screen.getByText(app1.display));
		expect(screen.getByText(app2.display)).toBeVisible();
		await user.click(screen.getByText(app2.display));
		expect(
			within(screen.getByTestId('location-display')).getByText(`/${SEARCH_APP_ID}/${route2.route}`)
		).toBeVisible();
	});

	test('should navigate to the search of the module when search is run', async () => {
		const app1 = generateCarbonioModule({ priority: 1 });
		const route1 = generateModuleRouteDescriptor({ id: app1.name, position: 1 });
		const app2 = generateCarbonioModule({ priority: 2 });
		const route2 = generateModuleRouteDescriptor({ id: app2.name, position: 2 });
		const searchApp = generateCarbonioModule({ priority: 3, name: SEARCH_APP_ID });
		const searchRoute = generateModuleRouteDescriptor({
			label: 'search',
			position: 3,
			id: SEARCH_APP_ID
		});
		useSearchStore.setState({
			module: route1.route
		});
		setupAppStore([app1, app2, searchApp], [route1, route2, searchRoute]);
		useAppStore.getState().addSearchView({
			app: app1.name,
			icon: app1.icon,
			route: route1.route,
			label: app1.display,
			position: app1.priority,
			id: app1.name,
			component: () => <div>{app1.name}</div>
		});
		useAppStore.getState().addSearchView({
			app: app2.name,
			icon: app2.icon,
			route: route2.route,
			label: app2.display,
			position: app2.priority,
			id: app2.name,
			component: () => <div>{app2.name}</div>
		});

		const { user } = setup(
			<>
				<ContextBridge />
				<SearchBar />
				<LocationDisplayer />
			</>,
			{ initialRouterEntries: [`/search/${route1.route}`] }
		);
		expect(
			within(screen.getByTestId('location-display')).getByText(`/${SEARCH_APP_ID}/${route1.route}`)
		).toBeVisible();
		await act(async () => {
			await user.type(screen.getByRole('textbox'), 'key1');
		});
		await user.click(screen.getByRoleWithIcon('button', { icon: ICONS.search }));
		expect(
			within(screen.getByTestId('location-display')).getByText(`/${SEARCH_APP_ID}/${route1.route}`)
		).toBeVisible();
	});

	it('should show the label of the first module if the module in the store is undefined', () => {
		const app1 = generateCarbonioModule({ priority: 1 });
		const app2 = generateCarbonioModule({ priority: 2 });
		const searchRoute = generateModuleRouteDescriptor({
			label: SEARCH_APP_ID,
			position: 3,
			id: SEARCH_APP_ID
		});
		useSearchStore.setState({
			module: undefined
		});
		setupAppStore([app1, app2], [searchRoute]);
		useAppStore.getState().addSearchView({
			app: app1.name,
			icon: app1.icon,
			id: app1.name,
			label: app1.display,
			position: 6,
			route: app1.name,
			component: () => <div>{app1.name}</div>
		});
		useAppStore.getState().addSearchView({
			app: app2.name,
			icon: app2.icon,
			id: app2.name,
			label: app2.display,
			position: 9,
			route: app2.name,
			component: () => <div>{app2.name}</div>
		});
		setup(<SearchBar />, { initialRouterEntries: [`/${SEARCH_APP_ID}/${app2.name}`] });
		const selector = screen.getByTestId(TESTID_SELECTORS.headerModuleSelector);
		expect(within(selector).getByText(app1.display)).toBeVisible();
		expect(screen.getByRole('textbox', { name: `Search in ${app1.display}` })).toBeVisible();
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
			position: 6,
			route: app.name,
			component: () => <div>{app.name}</div>
		});
		setup(<SearchBar />, { initialRouterEntries: [`/${app.name}`] });
		const selector = screen.getByTestId(TESTID_SELECTORS.headerModuleSelector);
		expect(within(selector).getByText(app.display)).toBeVisible();
		expect(screen.getByRole('textbox', { name: `Search in ${app.display}` })).toBeVisible();
	});

	it('should show the label of the first module (which has the search) if the user navigates to a module which does not have the search', () => {
		const app1 = generateCarbonioModule({ priority: 1 });
		const app2 = generateCarbonioModule({ priority: 2 });
		const searchRoute = generateModuleRouteDescriptor({
			label: app2.name,
			position: 3,
			id: app2.name,
			route: app2.name
		});
		setupAppStore([app1, app2], [searchRoute]);
		useAppStore.getState().addSearchView({
			app: app1.name,
			icon: app1.icon,
			id: app1.name,
			label: app1.display,
			position: 6,
			route: app1.name,
			component: () => <div>{app1.name}</div>
		});
		setup(<SearchBar />, { initialRouterEntries: [`/${app2.name}`] });
		const selector = screen.getByTestId(TESTID_SELECTORS.headerModuleSelector);
		expect(within(selector).getByText(app1.display)).toBeVisible();
		expect(screen.getByRole('textbox', { name: `Search in ${app1.display}` })).toBeVisible();
	});

	it('should show the label of the first module if the user searches directly a module without the search', () => {
		const app1 = generateCarbonioModule({ priority: 1 });
		const app2 = generateCarbonioModule({ priority: 2 });
		const searchRoute = generateModuleRouteDescriptor({
			label: SEARCH_APP_ID,
			position: 3,
			id: SEARCH_APP_ID
		});
		useSearchStore.setState({
			module: undefined
		});
		setupAppStore([app1, app2], [searchRoute]);
		useAppStore.getState().addSearchView({
			app: app1.name,
			icon: app1.icon,
			id: app1.name,
			label: app1.display,
			position: 6,
			route: app1.name,
			component: () => <div>{app1.name}</div>
		});
		setup(
			<>
				<ContextBridge />
				<SearchBar />
				<LocationDisplayer />
			</>,
			{ initialRouterEntries: [`/${SEARCH_APP_ID}/${app2.name}`] }
		);
		const selector = screen.getByTestId(TESTID_SELECTORS.headerModuleSelector);
		expect(within(selector).getByText(app1.display)).toBeVisible();
		expect(screen.getByRole('textbox', { name: `Search in ${app1.display}` })).toBeVisible();
		expect(
			within(screen.getByTestId('location-display')).getByText(`/${SEARCH_APP_ID}/${app1.name}`)
		).toBeVisible();
	});
});
