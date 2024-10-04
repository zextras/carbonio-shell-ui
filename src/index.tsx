/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
/* eslint-disable import/no-import-module-exports */

import './index.css';
import React, { lazy, Suspense } from 'react';

import ReactDOM from 'react-dom/client';

import { LoadingView } from './boot/splash';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

window.addEventListener('contextmenu', (ev) => {
	if (
		!(
			['IMG', 'A'].find(
				(name) => ev?.target instanceof HTMLElement && ev.target.tagName === name
			) ||
			ev.view?.getSelection?.()?.type === 'Range' ||
			ev
				.composedPath()
				.find(
					(element) =>
						element instanceof HTMLElement &&
						element.classList.contains('carbonio-bypass-context-menu')
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

const root = ReactDOM.createRoot(document.getElementById('app')!);
root.render(
	<React.StrictMode>
		<Suspense fallback={<LoadingView />}>
			<Bootstrapper key="boot" />
		</Suspense>
	</React.StrictMode>
);
