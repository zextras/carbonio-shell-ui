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
import React, { useCallback } from 'react';
import { Catcher } from '@zextras/zapp-ui';

export default function AppErrorCatcher({ children }) {
	const onError = useCallback((error) => {
		// ({event: 'report-exception',data: { exception: error }});
	}, []);
	return <Catcher onError={onError}>{children}</Catcher>;
}
