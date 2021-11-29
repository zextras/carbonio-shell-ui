/*
 * SPDX-FileCopyrightText: 2021 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React from 'react';
// import { screen } from '@testing-library/dom';
import { testUtils } from '../jest-shell-mocks';
import ShellSecondaryBar from './shell-secondary-bar';

describe.skip('Secondary bar', () => {
	test('Empty secondary bar', () => {
		// const onCollapserClick = jest.fn();
		// testUtils.render(
		// 	<ShellSecondaryBar
		// 		mainMenuItems={[]}
		// 		navigationBarIsOpen
		// 		onCollapserClick={onCollapserClick}
		// 	/>
		// );
		// expect(screen.getByRole('menu')).toBeInTheDocument();
	});

	test('Render children of current App', () => {
		const onCollapserClick = jest.fn();
		const mainMenuItems = [
			{
				pkgName: 'com_example_app',
				to: '/',
				allTos: ['/com_example_app/'],
				items: [
					{
						label: 'App 1 Folder 1'
					},
					{
						label: 'App 1 Folder 2'
					}
				]
			}
		];
		testUtils.render(
			<ShellSecondaryBar
				mainMenuItems={mainMenuItems}
				navigationBarIsOpen
				onCollapserClick={onCollapserClick}
			/>,
			{
				initialRouterEntries: ['/com_example_app']
			}
		);
		// expect(screen.getByRole('menu')).toBeInTheDocument();
		// expect(screen.getAllByRole('menuitem').length).toBe(1);
		// expect(screen.getAllByRole('menuitem')[0]).toHaveTextContent('App 1 Folder 1');
		// expect(screen.getAllByRole('menuitem')[0]).toHaveTextContent('App 1 Folder 2');
	});

	test('Render children of current App. Nested 3 times.', () => {
		const onCollapserClick = jest.fn();
		const mainMenuItems = [
			{
				pkgName: 'com_example_app',
				to: '/',
				allTos: ['/com_example_app/'],
				items: [
					{
						label: 'App 1 Folder 1',
						items: [
							{
								label: 'App 1 Folder 1.1',
								items: [
									{
										label: 'App 1 Folder 1.1.1'
									}
								]
							}
						]
					},
					{
						label: 'App 1 Folder 2'
					}
				]
			}
		];
		testUtils.render(
			<ShellSecondaryBar
				mainMenuItems={mainMenuItems}
				navigationBarIsOpen
				onCollapserClick={onCollapserClick}
			/>,
			{
				initialRouterEntries: ['/com_example_app']
			}
		);
		// expect(screen.getByText(/^App 1 Folder 1$/i)).toBeInTheDocument();
		// expect(screen.getByText(/^App 1 Folder 1\.1$/i)).toBeInTheDocument();
		// expect(screen.getByText(/^App 1 Folder 1\.1\.1$/i)).toBeInTheDocument();
		// expect(screen.getByText(/^App 1 Folder 2$/i)).toBeInTheDocument();
	});

	test('Do not render children of another App', () => {
		const onCollapserClick = jest.fn();
		const mainMenuItems = [
			{
				pkgName: 'com_example_app_1',
				to: '/',
				allTos: ['/com_example_app_1/'],
				items: [
					{
						label: 'App 1 Folder 1'
					},
					{
						label: 'App 1 Folder 2'
					}
				]
			}
		];
		testUtils.render(
			<ShellSecondaryBar
				mainMenuItems={mainMenuItems}
				navigationBarIsOpen
				onCollapserClick={onCollapserClick}
			/>,
			{
				initialRouterEntries: ['/com_example_app_2']
			}
		);
		// expect(screen.getByRole('menu')).toBeInTheDocument();
		// expect(screen.queryAllByRole('menuitem').length).toBe(0);
	});

	test('Render a custom component', () => {
		const onCollapserClick = jest.fn();
		function CustomComponent() {
			return 'Hello world!';
		}
		const mainMenuItems = [
			{
				pkgName: 'com_example_app',
				to: '/',
				allTos: ['/com_example_app/'],
				customComponent: CustomComponent
			}
		];
		testUtils.render(
			<ShellSecondaryBar
				mainMenuItems={mainMenuItems}
				navigationBarIsOpen
				onCollapserClick={onCollapserClick}
			/>,
			{
				initialRouterEntries: ['/com_example_app']
			}
		);
		// expect(screen.getByRole('menu')).toBeInTheDocument();
		// expect(screen.getByText(/hello world/i)).toBeInTheDocument();
	});
});
