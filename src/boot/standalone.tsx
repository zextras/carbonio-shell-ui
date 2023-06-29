/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { Route, Switch, useParams } from 'react-router-dom';
import React, { useEffect } from 'react';
import { useAppStore } from '../store/app';

const StandaloneListener = (): null => {
	const { route } = useParams<{ route?: string }>();
	useEffect(() => {
		if (route) {
			useAppStore.setState({ standalone: route });
		}
	}, [route]);

	return null;
};

export const Standalone = (): JSX.Element => (
	<Switch>
		<Route path={'/:route'}>
			<StandaloneListener />
		</Route>
	</Switch>
);
