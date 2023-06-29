/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useCallback } from 'react';
import { Catcher, CatcherProps } from '@zextras/carbonio-design-system';

export const AppErrorCatcher = ({
	children
}: {
	children?: React.ReactNode | undefined;
}): JSX.Element => {
	const onError = useCallback<NonNullable<CatcherProps['onError']>>((error) => {
		console.error(error);
		// ({event: 'report-exception',data: { exception: error }});
	}, []);
	return <Catcher onError={onError}>{children}</Catcher>;
};
