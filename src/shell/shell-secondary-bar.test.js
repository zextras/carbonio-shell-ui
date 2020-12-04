/*
 * *** BEGIN LICENSE BLOCK *****
 * Copyright (C) 2011-2020 Zextras
 *
 *  The contents of this file are subject to the Zextras EULA;
 * you may not use this file except in compliance with the EULA.
 * You may obtain a copy of the EULA at
 * http://www.zextras.com/zextras-eula.html
 * *** END LICENSE BLOCK *****
 */

import React from 'react';
import { screen } from '@testing-library/dom';
import { testUtils } from '../jest-shell-mocks';
import ShellSecondaryBar from './shell-secondary-bar';

describe('Secondary bar', () => {
	test('Empty secondary bar', () => {
		const onCollapserClick = jest.fn();
		testUtils.render(
			<ShellSecondaryBar
				mainMenuItems={[]}
				navigationBarIsOpen={true}
				onCollapserClick={onCollapserClick}
			/>
		);
		expect(screen.getByRole('menu')).toBeInTheDocument();
	});

	test('Render children of current App', () => {
		const onCollapserClick = jest.fn();
		const mainMenuItems = [{
			pkgName: 'com_example_app',
			to: '/',
			allTos: ['/com_example_app/'],
			items: [{
				label: 'App 1 Folder 1'
			}, {
				label: 'App 1 Folder 2'
			}]
		}];
		testUtils.render(
			<ShellSecondaryBar
				mainMenuItems={mainMenuItems}
				navigationBarIsOpen={true}
				onCollapserClick={onCollapserClick}
			/>,
			{
				initialRouterEntries: ['/com_example_app']
			}
		);
		expect(screen.getByRole('menu')).toBeInTheDocument();
		expect(screen.getAllByRole('menuitem').length).toBe(2);
		expect(screen.getAllByRole('menuitem')[0]).toHaveTextContent('App 1 Folder 1');
		expect(screen.getAllByRole('menuitem')[1]).toHaveTextContent('App 1 Folder 2');
	});

	test('Render children of current App. Nested 3 times.', () => {
		const onCollapserClick = jest.fn();
		const mainMenuItems = [{
			pkgName: 'com_example_app',
			to: '/',
			allTos: ['/com_example_app/'],
			items: [{
				label: 'App 1 Folder 1',
				items: [{
					label: 'App 1 Folder 1.1',
					items: [{
						label: 'App 1 Folder 1.1.1'
					}]
				}]
			}, {
				label: 'App 1 Folder 2'
			}]
		}];
		testUtils.render(
			<ShellSecondaryBar
				mainMenuItems={mainMenuItems}
				navigationBarIsOpen={true}
				onCollapserClick={onCollapserClick}
			/>,
			{
				initialRouterEntries: ['/com_example_app']
			}
		);
		expect(screen.getByText(/^App 1 Folder 1$/i)).toBeInTheDocument();
		expect(screen.getByText(/^App 1 Folder 1\.1$/i)).toBeInTheDocument();
		expect(screen.getByText(/^App 1 Folder 1\.1\.1$/i)).toBeInTheDocument();
		expect(screen.getByText(/^App 1 Folder 2$/i)).toBeInTheDocument();
	});

	test('Do not render children of another App', () => {
		const onCollapserClick = jest.fn();
		const mainMenuItems = [{
			pkgName: 'com_example_app_1',
			to: '/',
			allTos: ['/com_example_app_1/'],
			items: [{
				label: 'App 1 Folder 1'
			}, {
				label: 'App 1 Folder 2'
			}]
		}];
		testUtils.render(
			<ShellSecondaryBar
				mainMenuItems={mainMenuItems}
				navigationBarIsOpen={true}
				onCollapserClick={onCollapserClick}
			/>,
			{
				initialRouterEntries: ['/com_example_app_2']
			}
		);
		expect(screen.getByRole('menu')).toBeInTheDocument();
		expect(screen.queryAllByRole('menuitem').length).toBe(0);
	});

	test('Render a custom component', () => {
		const onCollapserClick = jest.fn();
		function CustomComponent() {
			return "Hello world!";
		}
		const mainMenuItems = [{
			pkgName: 'com_example_app',
			to: '/',
			allTos: ['/com_example_app/'],
			customComponent: CustomComponent
		}];
		testUtils.render(
			<ShellSecondaryBar
				mainMenuItems={mainMenuItems}
				navigationBarIsOpen={true}
				onCollapserClick={onCollapserClick}
			/>,
			{
				initialRouterEntries: ['/com_example_app']
			}
		);
		expect(screen.getByRole('menu')).toBeInTheDocument();
		expect(screen.getByText(/hello world/i)).toBeInTheDocument();
	});
});
