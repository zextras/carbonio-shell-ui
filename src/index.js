/*
 * *** BEGIN LICENSE BLOCK *****
 * Copyright (C) 2011-2019 ZeXtras
 *
 * The contents of this file are subject to the ZeXtras EULA;
 * you may not use this file except in compliance with the EULA.
 * You may obtain a copy of the EULA at
 * http://www.zextras.com/zextras-eula.html
 * *** END LICENSE BLOCK *****
 */

// import SplashPage from './view/SplashPage';
import 'typeface-roboto';
import style from './index.css';

if ('serviceWorker' in navigator) {
	window.addEventListener('load', () => {
		navigator.serviceWorker.register('service-worker.js').then(registration => {
			console.debug('SW registered: ', registration);
		}).catch(registrationError => {
			console.debug('SW registration failed: ', registrationError);
		});
	});
}

window.addEventListener('load', () => {
	const splash = document.createElement('div');
	splash.className = style.splash;
	document.body.appendChild(splash);

	import(/* webpackChunkName: "ShellContext" */ './ShellContext').then(
		({ ShellContext }) => {
			const context = new ShellContext(splash);
			context.renderShell().then(() => undefined);
		}
	);
});

/*
function continueNoop() {
    noop().then(r => {
        doNoop();
    }).catch(e => null);
}

function doNoop() {
    setTimeout(() => continueNoop(), 1);
}

login('user@example.com', '12345678').then(
    r => {
        // getApps().then(exts => forEach(exts, loadApp));
        doNoop();
    }
).catch(console.error);
*/
