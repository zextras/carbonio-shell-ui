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

});
