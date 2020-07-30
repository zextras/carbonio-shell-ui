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

import { useEffect, useMemo } from 'react';
import { map, forEach } from 'lodash';

export function getKeyboardPreset(type, callback, ref = undefined) {

	function handleArrowUp(e) {
		const focusedElement = ref.current.querySelector('[tabindex]:focus');
		if (focusedElement) {
			const prevEl = focusedElement.previousElementSibling;
			if (prevEl) {
				prevEl.focus();
			}
			else {
				ref.current.querySelector('[tabindex]:last-child').focus();
			}
		}
		else {
			ref.current.querySelector('[tabindex]:first-child').focus();
		}
	}
	function handleArrowDown(e) {
		const focusedElement = ref.current.querySelector('[tabindex]:focus');
		if (focusedElement) {
			const nextEl = focusedElement.nextElementSibling;
			if (nextEl) {
				nextEl.focus();
			} else {
				ref.current.querySelector('[tabindex]:first-child').focus();
			}
		}
		else {
			ref.current.querySelector('[tabindex]:first-child').focus();
		}
	}

	const eventsArray = [];
	switch (type) {
		case 'listItem': {
			eventsArray.push({ type: 'keypress', callback: callback, keys: ['Enter', 'NumpadEnter'] });
			break;
		}
		case 'button': {
			eventsArray.push({ type: 'keyup', callback: callback, keys: ['Space'] });
			eventsArray.push({ type: 'keypress', callback: (e) => e.preventDefault(), keys: ['Space'] });
			eventsArray.push({ type: 'keypress', callback: callback, keys: ['Enter', 'NumpadEnter'] });
			break;
		}
		case 'list': {
			eventsArray.push({ type: 'keydown', callback: handleArrowUp, keys: ['ArrowUp'] });
			eventsArray.push({ type: 'keydown', callback: handleArrowDown, keys: ['ArrowDown'] });
			break;
		}
	}
	return eventsArray;
}

export function useKeyboard(ref, events) {
	if (events.length === 0) return;

	const keyEvents = useMemo(() => {
		return map(events, ({ keys, callback, haveToPreventDefault = true }) => {
			return (e) => {
				if (!keys.length || keys.includes(e.key) || keys.includes(e.code)) {
					if (haveToPreventDefault) {
						e.preventDefault();
					}
					callback(e);
				}
			};
		});
	}, [events]);

	useEffect(() => {
		if (ref.current != null) {
			forEach(keyEvents, (keyEvent, index) => {
				ref.current.addEventListener(events[index].type, keyEvent);
			});
		}

		return () => {
			if (ref.current != null) {
				forEach(keyEvents, (keyEvent, index) => {
					ref.current.removeEventListener(events[index].type, keyEvent);
				});
			}
		};
	}, [ref, events, keyEvents]);
}

export default useKeyboard;
