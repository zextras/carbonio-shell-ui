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
/* eslint-env worker */
import { reduce } from 'lodash';
import { unwrapResponse, wrapRequest } from './Soap';
import IdbService from '../idb/IdbService';


const idbSrvc = new IdbService();

let started = false;
let _latestNoop = Date.now();
let _noopFails = 0;
let _timeoutId = null;
let _intervalId = null;
let _sessionId = '';
let _lastNotifyTimeout = 500;
let _useInstant = true;

async function sendSOAPRequest() {
	if (_sessionId === '') { return; }
	let sessionData = {
		id: '',
		notifySeq: -1,
		authToken: ''
	};
	const db = await idbSrvc.openDb();
	const storedAccountData = await db.get('soapSessions', _sessionId);
	if (storedAccountData) {
		sessionData = storedAccountData;
		if (_lastNotifyTimeout !== storedAccountData.zimbraPrefMailPollingInterval) {
			// TODO: Update interval
		}
		_lastNotifyTimeout = storedAccountData.zimbraPrefMailPollingInterval;
	}

	const reqBody = {};
	if (_useInstant) {
		reqBody.wait = 1;
		reqBody.limitToOneBlocked = 1;
	}
	const response = await fetch(
		`/service/soap/NoOpRequest`,
		{
			method: 'POST',
			body: JSON.stringify(
				wrapRequest(
					'NoOp',
					reqBody,
					sessionData
				)
			)
		}
	);
	if (!response.ok) {
		if (response.status === 500) {
			throw new Error('Authentication Error');
		} else {
			throw new Error('HTTP Error');
		}
	} else {
		const resp = await response.json();
		const [data, notifications] = unwrapResponse('NoOp', resp);
		if (notifications) {
			const newNotifySeq	= reduce(notifications, (max, { seq }) => (max < seq) ? seq : max, sessionData.notifySeq);
			const storedAccountData = await db.get('soapSessions', _sessionId);
			if (storedAccountData) {
				await db.put('soapSessions', {
					...storedAccountData,
					notifySeq: newNotifySeq
				});
			}
			/* Then handle the notifications and return the response */
			postMessage({ action: 'notifications', notifications });
		}
		return data;
	}
}

function _sendNoop() {
	if (!started) {
		postMessage({ action: 'stopped' });
		return;
	}
	if (_noopFails >= 5) {
		if (_timeoutId) { clearTimeout(_timeoutId);  }
		if (_intervalId) { clearInterval(_intervalId);  }
		postMessage({ action: 'stopped' });
		return;
	}
	if (Date.now() - _latestNoop < 500) {
		_noopFails++;
		setTimeout(
			_sendNoop,
			500
		);
		return;
	}
	_latestNoop = Date.now();
	sendSOAPRequest()
		.then(
			(response) => {
				_noopFails = 0;
				if (response.waitDisallowed) {
					_useInstant = false;
					_intervalId = setInterval(
						_sendNoop,
						_lastNotifyTimeout * 1000
					);
					return
				}
				if (_useInstant) {
					_timeoutId = setTimeout(
						_sendNoop,
						1
					);
				}
			}
		)
		.catch(
			() => {
				if (Date.now() - _latestNoop < 100) _noopFails++;
				_timeoutId = setTimeout(
					_sendNoop,
					500
				);
			}
		);
}

self.addEventListener(
	'message',
	(e) => {
		switch (e.data.action) {
			case 'start':
				if (!started) {
					started = true;
					_sendNoop();
					postMessage({ action: 'started' });
				}
				break;
			case 'stop':
				if (started) {
					started = false;
					if (_timeoutId) {
						clearTimeout(_timeoutId);
						postMessage({ action: 'stopped' });
					}
				}
				break;
			case 'set-session-id':
				_sessionId = e.data.sessionId;
				break;
		}
	}
);
