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

import React, { useMemo } from 'react';
import { map } from 'lodash';
import { Accordion, Collapse, Container, Padding, Quota } from '@zextras/zapp-ui';
import NavigationBarAccordion from './navigation-bar-custom-accordion';

export default function ShellMobileNav({ mobileNavIsOpen, mainMenuItems, menuTree, quota }) {
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
			<Collapse orientation="horizontal" open={mobileNavIsOpen} crossSize="100%">
				<Container
					width={256 + 48 + 12}
					height="fill"
					orientation="vertical"
					mainAlignment="space-between"
					style={{
						maxHeight: 'calc(100vh - 48px)',
						overflowY: 'auto'
					}}
				>
					<Container width="fill" height="fit" orientation="vertical" mainAlignment="space-between">
						{map(mainMenuItems, (app, key) =>
							app.customComponent ? (
								<NavigationBarAccordion
									key={key}
									icon={app.icon}
									label={app.label}
									click={app.click}
									customComponent={app.customComponent}
									divider
								/>
							) : (
								<Accordion
									key={key}
									items={[
										{
											...app,
											divider: true
										}
									]}
								/>
							)
						)}
					</Container>
					<Container width="fill" height="fit" orientation="vertical" mainAlignment="flex-end">
						<Accordion items={menuTree} />
						<Padding vertical="medium">
							<Quota fill={quota} />
						</Padding>
					</Container>
				</Container>
			</Collapse>
		</Container>
	);
}
