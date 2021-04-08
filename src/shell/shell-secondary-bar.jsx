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

/* eslint-disable react/no-array-index-key */
import React from 'react';
import { map } from 'lodash';
import { Route, Switch } from 'react-router-dom';
import { Accordion, Collapse, Collapser, Container } from '@zextras/zapp-ui';

export default function ShellSecondaryBar({
	navigationBarIsOpen,
	mainMenuItems,
	onCollapserClick
}) {
	return (
		<>
			<Collapse orientation="horizontal" open={navigationBarIsOpen} maxSize="256px">
				<Container
					role="menu"
					width={256}
					height="fill"
					orientation="vertical"
					mainAlignment="flex-start"
					style={{
						maxHeight: 'calc(100vh - 48px)',
						overflowY: 'auto'
					}}
				>
					<Switch>
						{map(mainMenuItems, (menuItem) => (
							<Route key={`/${menuItem.pkgName}${menuItem.to}`} exact path={menuItem.allTos}>
								{menuItem.customComponent ? (
									menuItem.customComponent
								) : (
									<Accordion role="menuitem" active items={menuItem.items || []} />
								)}
							</Route>
						))}
					</Switch>
				</Container>
			</Collapse>
			<Collapser clickCallback={onCollapserClick} />
		</>
	);
}
