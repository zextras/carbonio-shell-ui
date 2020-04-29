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
import React, { useCallback, useContext } from 'react';
import ShellContext from '../shell-context';

export default function AppPanelTab({ idx }) {
	const {
		panels,
		removePanel,
		setCurrentPanel
	} = useContext(ShellContext);

	const onClick = useCallback((ev) => {
		ev.stopPropagation();
		ev.preventDefault();
		setCurrentPanel(idx)
	}, [setCurrentPanel, idx]);

	const onRemove = useCallback((ev) => {
		ev.stopPropagation();
		ev.preventDefault();
		removePanel(idx);
	}, [removePanel, idx]);

	return (
		<div onClick={onClick} style={{ cursor: 'pointer' }}>
			App tab {idx} <span onClick={onRemove} style={{ cursor: 'pointer' }}>X</span> ({panels[idx]})
		</div>
	);
}
