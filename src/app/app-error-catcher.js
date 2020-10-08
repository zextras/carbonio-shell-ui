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
import { useFiberChannel } from './app-context';
import Catcher from "../../zapp-ui/src/components/utilities/Catcher";

function AppErrorCatcher({ children }) {

	const { fiberChannelSink } = useFiberChannel();

	const onError = useCallback((error) => {
		fiberChannelSink({
			event: 'report-exception',
			data: { exception: error }
		})
	}, [fiberChannelSink])
	return (
		<Catcher onError={onError}>
			{children}
		</Catcher>
	);
}

export default AppErrorCatcher;
