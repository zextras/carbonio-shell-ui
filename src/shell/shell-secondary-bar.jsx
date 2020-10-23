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
import { map } from 'lodash';
import { Route, Switch } from 'react-router-dom';
import {
	Accordion,
	Collapse,
	Collapser,
	Container
} from '@zextras/zapp-ui';

export default function ShellSecondaryBar({
	navigationBarIsOpen,
	mainMenuItems,
	onCollapserClick
}) {
	return (
		<>
			<Collapse
				orientation="horizontal"
				open={navigationBarIsOpen}
				maxSize="256px"
			>
				<Container
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
						{
							map(
								mainMenuItems,
								(menuItem) => (
									<Route key={`/${menuItem.pkgName}${menuItem.to}`} exact path={menuItem.allTos}>
										{
											menuItem.customComponent
												? menuItem.customComponent
												: menuItem.items.map((folder, index) => (
													<Accordion
														key={index}
														click={folder.click}
														active={true}
														icon={folder.icon}
														label={folder.label}
														items={folder.items || []}
													/>
												))
										}
									</Route>
								)
							)
						}
					</Switch>
				</Container>
			</Collapse>
			<Collapser clickCallback={onCollapserClick} />
		</>
	);
}
