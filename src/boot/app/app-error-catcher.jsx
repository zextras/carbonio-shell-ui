/*
 * SPDX-FileCopyrightText: 2021 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useCallback } from 'react';
import { Catcher } from '@zextras/zapp-ui';

export default function AppErrorCatcher({ children }) {
	const onError = useCallback((error) => {
		// ({event: 'report-exception',data: { exception: error }});
	}, []);
	return <Catcher onError={onError}>{children}</Catcher>;
}
