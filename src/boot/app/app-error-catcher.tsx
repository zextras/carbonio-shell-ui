/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useCallback } from 'react';

import { Catcher } from '@zextras/carbonio-design-system';

export const AppErrorCatcher = ({ children }: React.PropsWithChildren): React.JSX.Element => {
	const onError = useCallback((error: unknown) => {
		console.error(error);
	}, []);
	return <Catcher onError={onError}>{children}</Catcher>;
};
