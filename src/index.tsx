/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable import/no-import-module-exports */

import './index.css';
import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom';
import LoadingView from './boot/splash';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

window.addEventListener('contextmenu', (ev) => {
	if (
		!(
			['IMG', 'A'].find(
				// @ts-ignore
				(name) => ev?.target?.tagName === name
			) ||
			ev.view?.getSelection?.()?.type === 'Range' ||
			// @ts-ignore
			ev.path?.find((element) =>
				element.classList?.find?.((cl: string) => cl === 'carbonio-bypass-context-menu')
			)
		)
	) {
		ev.preventDefault();
	}
});

const Bootstrapper = lazy(() => import('./boot/bootstrapper'));

if (module.hot) {
	module.hot.accept();
}

ReactDOM.render(
	<Suspense fallback={<LoadingView />}>
		<Bootstrapper key="boot" />
	</Suspense>,
	document.getElementById('app')
);
