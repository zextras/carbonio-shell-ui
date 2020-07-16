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
import {
	Accordion,
	Collapse,
	Container,
	Padding,
	Quota
} from '@zextras/zapp-ui';

export default function ShellMobileNav({
	mobileNavIsOpen,
	mainMenuItems,
	menuTree,
	quota
}) {
	return (
		<Container
			height="fill"
			width="fit"
			background="gray5"
			style={{
				position: 'absolute',
				left: 0,
				top: 0,
				zIndex: 3
			}}
		>
			<Collapse
				orientation="horizontal"
				open={mobileNavIsOpen}
				crossSize="100%"
			>
				<Container
					width={256+48+12}
					height="fill"
					orientation="vertical"
					mainAlignment="space-between"
					style={{
						maxHeight: 'calc(100vh - 48px)',
						overflowY: 'auto'
					}}
				>
					<Container
						width="fill"
						height="fit"
						orientation="vertical"
						mainAlignment="space-between"
					>
						{
							map(mainMenuItems, (app, key) =>
								<Accordion
									key={key}
									level={0}
									icon={app.icon}
									label={app.label}
									click={app.click}
									items={app.items}
									divider={true}
								/>
							)
						}
					</Container>
					<Container
						width="fill"
						height="fit"
						orientation="vertical"
						mainAlignment="flex-end"
					>
						{
							menuTree.map((app, index) =>
								<Accordion
									key={index}
									level={0}
									icon={app.icon}
									click={app.click}
									label={app.label}
									items={app.folders}
									divider={true}
								/>
							)
						}
						<Padding vertical="medium">
							<Quota fill={quota}/>
						</Padding>
					</Container>
				</Container>
			</Collapse>
		</Container>
	);
}