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
import {
	Accordion,
	Collapse,
	Container,
	Responsive
} from '@zextras/zapp-ui';

export default function ShellMenuPanel({
	menuIsOpen,
	tree,
}) {
	return (
		<Container
			orientation="horizontal"
			background="gray5"
			width="fit"
			height="fill"
			mainAlignment="flex-start"
			crossAlignment="flex-start"
			style={{
				position: 'absolute',
				top: 0,
				right: 0,
				zIndex: 3,
				boxShadow: '0 2px 5px 0 rgba(125,125,125,0.5)'
			}}
		>
			<Responsive mode="desktop">
				<Collapse
					orientation="horizontal"
					open={menuIsOpen}
					maxSize="256px"
				>
					<Container
						width={256}
						height="fill"
						orientation="vertical"
						mainAlignment="flex-start"
					>
						{
							tree.map((app, index) =>
								<Accordion
									key={index}
									level={0}
									click={app.click}
									icon={app.icon}
									label={app.label}
									items={app.folders}
									divider
								/>
							)
						}
					</Container>
				</Collapse>
			</Responsive>
		</Container>
	);
}