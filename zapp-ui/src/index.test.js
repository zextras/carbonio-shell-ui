/*
 * *** BEGIN LICENSE BLOCK *****
 * Copyright (C) 2011-2020 ZeXtras
 *
 * The contents of this file are subject to the ZeXtras EULA;
 * you may not use this file except in compliance with the EULA.
 * You may obtain a copy of the EULA at
 * http://www.zextras.com/zextras-eula.html
 * *** END LICENSE BLOCK *****
 */
import React from 'react';
import renderer from 'react-test-renderer';

jest.mock('./index');
import * as Components from './index';

describe('Test Mocks', () => {

	describe('basic components', () => {

		test('Mock of Avatar Component', () => {
			const component = renderer.create(
				<Components.Avatar label="Sent"/>,
			);
			let tree = component.toJSON();
			expect(tree).toMatchSnapshot();
		});

		test('Mock of Badge Component', () => {
			const component = renderer.create(
				<Components.Badge value="testValue"/>,
			);
			let tree = component.toJSON();
			expect(tree).toMatchSnapshot();
		});

		test('Mock of Button Component', () => {
			const component = renderer.create(
				<Components.Button label="Button"/>
			);
			let tree = component.toJSON();
			expect(tree).toMatchSnapshot();
		});

		test('Mock of Icon Component', () => {
			const component = renderer.create(
				<Components.Icon size="small"/>,
			);
			let tree = component.toJSON();
			expect(tree).toMatchSnapshot();
		});

		test('Mock of Link Component', () => {
			const component = renderer.create(
				<Components.Link color="primary"/>
			);
			let tree = component.toJSON();
			expect(tree).toMatchSnapshot();
		});

		test('Mock of LoadMore Component', () => {
			const component = renderer.create(
				<Components.LoadMore label="open"/>
			);
			let tree = component.toJSON();
			expect(tree).toMatchSnapshot();
		});

		test('Mock of Text Component', () => {
			const component = renderer.create(
				<Components.Text size="small">Example Text</Components.Text>
			);
			let tree = component.toJSON();
			expect(tree).toMatchSnapshot();
		});

		test('Mock of Logo Component', () => {
			const component = renderer.create(
				<Components.Logo size="small">Example Text</Components.Logo>
			);
			let tree = component.toJSON();
			expect(tree).toMatchSnapshot();
		});

	});

	describe('layout components', () => {

		test('Mock of Container Component', () => {
			const component = renderer.create(
				<Components.Container orientation="vertical">
					<Components.Text size="small">Example Text 1</Components.Text>
					<Components.Text size="medium">Example Text 2</Components.Text>
					<Components.Text size="large">Example Text 3</Components.Text>
				</Components.Container>
			);
			let tree = component.toJSON();
			expect(tree).toMatchSnapshot();
		});

		test('Mock of Divider Component', () => {
			const component = renderer.create(
				<Components.Divider color="gray2"/>
			);
			let tree = component.toJSON();
			expect(tree).toMatchSnapshot();
		});

		test('Mock of Padding Component', () => {
			const component = renderer.create(
				<Components.Padding vertical="small">Example Padding</Components.Padding>
			);
			let tree = component.toJSON();
			expect(tree).toMatchSnapshot();
		});

		test('Mock of Paragraph Component', () => {
			const component = renderer.create(
				<Components.Paragraph overflow="break-word">Example Text</Components.Paragraph>
			);
			let tree = component.toJSON();
			expect(tree).toMatchSnapshot();
		});

		test('Mock of Row Component', () => {
			const component = renderer.create(
				<Components.Row display="flex">Example Text</Components.Row>
			);
			let tree = component.toJSON();
			expect(tree).toMatchSnapshot();
		});

	});

	describe('inputs components', () => {

		test('Mock of Checkbox Component', () => {
			const component = renderer.create(
				<Components.Checkbox label="checkbox label"/>
			);
			let tree = component.toJSON();
			expect(tree).toMatchSnapshot();
		});

		test('Mock of ChipInput Component', () => {
			const component = renderer.create(
				<Components.ChipInput value="contactsTo"/>
			);
			let tree = component.toJSON();
			expect(tree).toMatchSnapshot();
		});

		test('Mock of EmailComposerInput Component', () => {
			const component = renderer.create(
				<Components.EmailComposerInput placeholder="Object"/>
			);
			let tree = component.toJSON();
			expect(tree).toMatchSnapshot();
		});

		test('Mock of FileLoader Component', () => {
			const component = renderer.create(
				<Components.FileLoader/>
			);
			let tree = component.toJSON();
			expect(tree).toMatchSnapshot();
		});

		test('Mock of IconButton Component', () => {
			const component = renderer.create(
				<Components.IconButton icon="Pricetags"/>
			);
			let tree = component.toJSON();
			expect(tree).toMatchSnapshot();
		});

		test('Mock of IconCheckbox Component', () => {
			const component = renderer.create(
				<Components.IconCheckbox icon="Text"/>
			);
			let tree = component.toJSON();
			expect(tree).toMatchSnapshot();
		});

		test('Mock of PasswordInput Component', () => {
			const component = renderer.create(
				<Components.PasswordInput label="PasswordInput"/>
			);
			let tree = component.toJSON();
			expect(tree).toMatchSnapshot();
		});

		test('Mock of Input Component', () => {
			const component = renderer.create(
				<Components.Input label="Input"/>
			);
			let tree = component.toJSON();
			expect(tree).toMatchSnapshot();
		});

		test('Mock of SearchInput Component', () => {
			const component = renderer.create(
				<Components.SearchInput/>
			);
			let tree = component.toJSON();
			expect(tree).toMatchSnapshot();
		});

		test('Mock of Select Component', () => {
			const component = renderer.create(
				<Components.Select label="Select an item"/>
			);
			let tree = component.toJSON();
			expect(tree).toMatchSnapshot();
		});

		/*	test('Mock of RichTextEditor Component', () => {
				const component = renderer.create(
					<Components.RichTextEditor initialValue="<p>This is the initial content of the editor</p>"/>
				);
				let tree = component.toJSON();
				expect(tree).toMatchSnapshot();
			});*/
	});

	describe('navigation components', () => {

		test('Mock of Accordion Component', () => {
			const component = renderer.create(
				<Components.Accordion label="Accordion"/>
			);
			let tree = component.toJSON();
			expect(tree).toMatchSnapshot();
		});

		test('Mock of Breadcrumbs Component', () => {
			const component = renderer.create(
				<Components.Breadcrumbs/>
			);
			let tree = component.toJSON();
			expect(tree).toMatchSnapshot();
		});

	});

	describe('display components', () => {

		test('Mock of Chip Component', () => {
			const component = renderer.create(
				<Components.Chip label="example"/>
			);
			let tree = component.toJSON();
			expect(tree).toMatchSnapshot();
		});

		test('Mock of Dropdown Component', () => {
			const items = [
				{
					id: 'activity-1',
					icon: 'Activity',
					label: 'Some Item',
					click: () => console.log("click1")
				},
				{
					id: 'activity-2',
					icon: 'Plus',
					label: 'Some  Other Item',
					click: () => console.log("click2")
				},
				{
					id: 'activity-3',
					icon: 'Activity',
					label: 'Some Item',
					click: () => console.log("click3")
				}
			];

			const component = renderer.create(
				<Components.Dropdown items={items}>
					<Components.IconButton icon="ArrowDown"/>
					<Components.IconButton icon="ArrowUp"/>
					<Components.IconButton icon="ArrowLeft"/>
					<Components.IconButton icon="ArrowRight"/>
				</Components.Dropdown>,
			);
			let tree = component.toJSON();
			expect(tree).toMatchSnapshot();
		});

		test('Mock of List Component', () => {
			const component = renderer.create(
				<Components.List amount={2}/>
			);
			let tree = component.toJSON();
			expect(tree).toMatchSnapshot();
		});

		test('Mock of ListHeader Component', () => {
			const component = renderer.create(
				<Components.ListHeader/>
			);
			let tree = component.toJSON();
			expect(tree).toMatchSnapshot();
		});

		test('Mock of Popover Component', () => {
			const component = renderer.create(
				<Components.Popover placement="right"/>
			);
			let tree = component.toJSON();
			expect(tree).toMatchSnapshot();
		});

		test('Mock of Popper Component', () => {
			const component = renderer.create(
				<Components.Popover placement="left"/>
			);
			let tree = component.toJSON();
			expect(tree).toMatchSnapshot();
		});

		test('Mock of tooltip Component', () => {
			const component = renderer.create(
				<Components.Tooltip label='test label'/>
			);
			let tree = component.toJSON();
			expect(tree).toMatchSnapshot();
		});

		test('Mock of Table Component', () => {
			const component = renderer.create(
				<Components.Table/>
			);
			let tree = component.toJSON();
			expect(tree).toMatchSnapshot();
		});

	});

	describe('modal components', () => {
		test('Mock of Modal Component', () => {
			const component = renderer.create(
				<Components.Modal title='title test'/>
			);
			let tree = component.toJSON();
			expect(tree).toMatchSnapshot();
		});

		test('Mock of Quota Component', () => {
			const component = renderer.create(
				<Components.Quota fill={10}/>
			);
			let tree = component.toJSON();
			expect(tree).toMatchSnapshot();
		});

		test('Mock of Snackbar Component', () => {
			const component = renderer.create(
				<Components.Snackbar label="test label"/>
			);
			let tree = component.toJSON();
			expect(tree).toMatchSnapshot();
		});
	});

	describe('utilities components', () => {
		test('Mock of Catcher Component', () => {
			const component = renderer.create(
				<Components.Catcher/>
			);
			let tree = component.toJSON();
			expect(tree).toMatchSnapshot();
		});

		test('Mock of Collapse Component', () => {
			const component = renderer.create(
				<Components.Collapse/>
			);
			let tree = component.toJSON();
			expect(tree).toMatchSnapshot();
		});

		test('Mock of Responsive Component', () => {
			const component = renderer.create(
				<Components.Responsive mode="mobile"/>
			);
			let tree = component.toJSON();
			expect(tree).toMatchSnapshot();
		});

	/*	test('SnackbarManager', ()=>{
			const component = renderer.create(
				<Components.SnackbarManager>
				</Components.SnackbarManager>
			);
			let tree = component.toJSON();
			expect(tree).toMatchSnapshot();
		});*/

		test('Mock of Transition Component', () => {
			const component = renderer.create(
				<Components.Transition transitionTarget='all'>
					<Components.Button label='test'/>
				</Components.Transition>
			);
			let tree = component.toJSON();
			expect(tree).toMatchSnapshot();
		});

	});

	describe('composites components', () => {

		/*test('Mock of ContactListItem Component', () => {
			const component = renderer.create(
				<Components.ContactListItem
					contact={
						{
							firstName: 'Mario',
							lastName: 'Super',
							email: 'ifixyourpipes@gmail.com',
							jobTitle: 'Lead Plumber',
							department: 'Peach\'s Castle'
						}
					}
				/>
			);
			let tree = component.toJSON();
			expect(tree).toMatchSnapshot();
		});*/

		test('Mock of DownloadFileButton Component', () => {
			const component = renderer.create(
				<Components.DownloadFileButton fileName="Example.text"/>
			);
			let tree = component.toJSON();
			expect(tree).toMatchSnapshot();
		});

		test('Mock of FormSection Component', () => {
			const component = renderer.create(
				<Components.FormSection label="test label"/>
			);
			let tree = component.toJSON();
			expect(tree).toMatchSnapshot();
		});

		test('Mock of GenericFileIcon Component', () => {
			const component = renderer.create(
				<Components.GenericFileIcon fileName="test name"/>
			);
			let tree = component.toJSON();
			expect(tree).toMatchSnapshot();
		});

		test('Mock of Header Component',()=>{

			const component = renderer.create(
				<Components.Header quota={63}/>
			);
			let tree = component.toJSON();
			expect(tree).toMatchSnapshot();
		});

		test('Mock of MenuPanel Component',()=>{
			const tree = [
				{
					label: 'Mail',
					app: 'Mail',
					icon: 'EmailOutline',
					folders: [
						{
							label: 'Inbox',
							subfolders: [
								{
									label: 'Troubles',
									subfolders: [{ label: 'A subset of troubles' }]
								},
								{
									label: 'Newsletters'
								}
							]
						}
					],
				},
				{
					label: 'Contacts',
					app: 'Contacts',
					icon: 'PersonOutline',
					folders: [
						{
							label: 'The ones I like',
						},
						{
							label: 'The ones I don\'t',
						}
					]
				}
			];
			const component = renderer.create(
				<Components.MenuPanel
					tree={tree}
				/>
			);
			let trees = component.toJSON();
			expect(trees).toMatchSnapshot();
		});

		test('Mock of NavigationPanel Component',()=>{
			const tree = [
				{
					label: 'Mail',
					app: 'Mail',
					icon: 'EmailOutline',
					folders: [
						{
							label: 'Inbox',
							subfolders: [
								{
									label: 'Troubles',
									subfolders: [{ label: 'A subset of troubles' }]
								},
								{
									label: 'Newsletters'
								}
							]
						}
					],
				},
				{
					label: 'Contacts',
					app: 'Contacts',
					icon: 'PersonOutline',
					folders: [
						{
							label: 'The ones I like'
						},
						{
							label: 'The ones I don\'t',
						}
					]
				}
			];

			const menuTree = [
				{
					label: 'Settings',
					icon: 'Settings2',
					folders: []
				}
			];

			const component = renderer.create(
				<Components.NavigationPanel menuTree={menuTree} tree={tree}/>
			);
			let trees = component.toJSON();
			expect(trees).toMatchSnapshot();
		});

		test('Mock of MessageBubble Component',()=>{

			const component = renderer.create(
				<Components.MessageBubble position="left"/>
			);
			let tree = component.toJSON();
			expect(tree).toMatchSnapshot();
		});

	});

});