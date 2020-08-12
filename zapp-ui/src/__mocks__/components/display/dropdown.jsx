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
import {reduce} from 'lodash';

export default function Dropdown({ children, items }) {

	const itemsList = reduce(
		items,
		(acc,v,k)=>{
			acc.push(v.id);
			return acc;
		}, []
	);

	const wrapped = reduce(
		children,
		(acc,v,k)=>{
			acc.push(<li key={k}>{v}</li>);
			return acc;
		}, []
	);
	return (
		<ul>{`Dropdown (items id=${itemsList}):`}
			{wrapped}
		</ul>
	);
}
