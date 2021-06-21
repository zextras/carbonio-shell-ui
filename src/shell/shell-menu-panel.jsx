/*
 * *** BEGIN LICENSE BLOCK *****
 * Copyright (C) 2011-2021 Zextras
 *
 *  The contents of this file are subject to the Zextras EULA;
 * you may not use this file except in compliance with the EULA.
 * You may obtain a copy of the EULA at
 * http://www.zextras.com/zextras-eula.html
 * *** END LICENSE BLOCK *****
 */

/* eslint-disable react/no-array-index-key */
import React from 'react';
import { Accordion, Collapse, Container, Responsive } from '@zextras/zapp-ui';

export default function ShellMenuPanel({ menuIsOpen, tree }) {
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
				<Collapse orientation="horizontal" open={menuIsOpen} maxSize="256px">
					<Container width={256} height="fill" orientation="vertical" mainAlignment="flex-start">
						<Accordion items={tree} />
					</Container>
				</Collapse>
			</Responsive>
		</Container>
	);
}
