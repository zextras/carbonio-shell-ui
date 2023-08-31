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
import { useAppStore } from '../store/app';
import { ICONS } from '../test/constants';
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

	test('should render the module selector and the input of the search bar', async () => {
		const app = generateCarbonioModule();
		const route = 'appRoute';

		useSearchStore.setState({
			module: 'route'
		});
		useAppStore.getState().setters.addSearchView({
			app: app.name,
			icon: app.icon,
			route,
			label: app.display,
			position: app.priority,
			id: app.name,
			component: () => <div>{app.name}</div>
		});
		setup(<SearchBar />, { initialRouterEntries: [`/search/${route}`] });
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
		useAppStore.getState().setters.addSearchView({
			app: app1.name,
			icon: app1.icon,
			route: route1.route,
			label: app1.display,
			position: app1.priority,
			id: app1.name,
			component: () => <div>{app1.name}</div>
		});
		useAppStore.getState().setters.addSearchView({
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
			within(screen.getByTestId('location-display')).getByText(`/search/${route1.route}`)
		).toBeVisible();
		await user.click(screen.getByText(app1.display));
		expect(screen.getByText(app2.display)).toBeVisible();
		await user.click(screen.getByText(app2.display));
		expect(
			within(screen.getByTestId('location-display')).getByText(`/search/${route2.route}`)
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
		useAppStore.getState().setters.addSearchView({
			app: app1.name,
			icon: app1.icon,
			route: route1.route,
			label: app1.display,
			position: app1.priority,
			id: app1.name,
			component: () => <div>{app1.name}</div>
		});
		useAppStore.getState().setters.addSearchView({
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
			within(screen.getByTestId('location-display')).getByText(`/search/${route1.route}`)
		).toBeVisible();
		await act(async () => {
			await user.type(screen.getByRole('textbox'), 'key1');
		});
		await user.click(screen.getByRoleWithIcon('button', { icon: ICONS.search }));
		expect(
			within(screen.getByTestId('location-display')).getByText(`/search/${route1.route}`)
		).toBeVisible();
	});
});
