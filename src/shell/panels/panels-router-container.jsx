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

import React, { useEffect, useState } from 'react';
import { Switch } from 'react-router-dom';
import styled from 'styled-components';
import { reduce } from 'lodash';
import { Container } from '@zextras/zapp-ui';
import { useAppsCache } from '../../app/app-loader-context';
import AppPanelRoutes from '../../app/app-panel-routes';

const _PanelsRouterContainer = styled(Container)`
	flex-grow: 1;
	flex-basis: 0;
	min-width: 1px;
	max-height: calc(100vh - 48px);
	overflow-y: auto;
`;

export default function PanelsRouterContainer() {
	const [appsCache, appsLoaded] = useAppsCache();
	const [children, setChildren] = useState([]);

	useEffect(() => {
		const childrn = reduce(
			appsCache,
			(r, v, k) => {
				r.push((
					<AppPanelRoutes key={k} app={v} />
				));
				return r;
			},
			[]
		);
		setChildren(childrn);
	}, [appsCache, appsLoaded, setChildren]);

	return (
		<_PanelsRouterContainer>
			<Switch>
				{ children }
			</Switch>
		</_PanelsRouterContainer>
	);
}
