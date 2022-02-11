/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

/* eslint-disable import/no-import-module-exports */

import './index.css';
import React, { lazy, Suspense } from 'react';
import { render } from 'react-dom';
import LoadingView from './boot/splash';

// window.addEventListener('contextmenu', (ev) => {
// 	if (
// 		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// 		// @ts-ignore
// 		!['IMG', 'A'].find((name) => ev?.target?.tagName === name) ||
// 		ev.view?.getSelection?.()?.type !== 'Range' ||
// 		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// 		// @ts-ignore
// 		!ev.path?.find((element) =>
// 			element.classList?.find?.((cl: string) => cl === 'carbonio-bypass-context-menu')
// 		)
// 	)
// 		ev.preventDefault();
// });
const Bootstrapper = lazy(() => import('./boot/bootstrapper'));

if (module.hot) module.hot.accept();
render(
	<Suspense fallback={<LoadingView />}>
		<Bootstrapper key="boot" />
	</Suspense>,
	document.getElementById('app')
);
