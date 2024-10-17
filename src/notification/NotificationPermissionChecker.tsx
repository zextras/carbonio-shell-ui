/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React, { useEffect } from 'react';

export const NotificationPermissionChecker = (): React.JSX.Element => {
	useEffect(() => {
		if (!('Notification' in window)) {
			// eslint-disable-next-line no-console
			console.warn('This browser does not support desktop notifications');
		} else {
			Notification.requestPermission();
		}
	}, []);

	return <></>;
};
