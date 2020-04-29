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
import styled from 'styled-components';
import { NewButton } from './new-button';

const _ShellHeader = styled.div`
	display: flex;
	flex-direction: row;
	min-height: 50px;
	max-height: 50px;
`;

export default function ShellHeader() {
	return (
		<_ShellHeader>
			<div>Logo</div>
			<NewButton />
		</_ShellHeader>
	);
}
