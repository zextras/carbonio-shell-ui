/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import type React from 'react';

import type { Action } from '../types/integrations';

type handleKeyboardShortcutsProps = {
	primaryAction: Action;
	secondaryActions: Action[];
	event: KeyboardEvent;
	inputRef: React.RefObject<HTMLInputElement | HTMLTextAreaElement>;
	currentApp: string;
};

const modifierKeysFirstTier = ['g', 'n', 'v', 'm', '.', 'p', 'w'];
const modifierKeysSecondTier = ['p'];

let keySequence = '';

export const handleKeyboardShortcuts = (props: handleKeyboardShortcutsProps): void => {
	const createEmail = props.secondaryActions?.filter((item) => item.id === 'create-mail')[0]
		?.onClick;
	const createAppointment = props.secondaryActions?.filter(
		(item) => item.id === 'new-appointment'
	)[0]?.onClick;
	const createContact = props.secondaryActions?.filter((item) => item.id === 'create-contact')[0]
		?.onClick;

	// will be used in future implementations
	// const ctrlModifierIsActive = props.event.ctrlKey || props.event.metaKey;
	const consoleLogKeyCombination = (): void => {
		props.event.preventDefault();
		props.event.stopImmediatePropagation();
	};

	const eventTargetElement = props.event.target instanceof HTMLElement ? props.event.target : null;
	const isGlobalContext =
		eventTargetElement &&
		!eventTargetElement.isContentEditable &&
		eventTargetElement.nodeName !== 'INPUT' &&
		eventTargetElement.nodeName !== 'TEXTAREA';

	const callKeyboardShortcutAction = (): void => {
		switch (keySequence) {
			case 'n':
				if (props.primaryAction && isGlobalContext) {
					consoleLogKeyCombination();
					props.primaryAction.onClick?.(props.event);
				}
				break;
			case 'nm':
				if (isGlobalContext) {
					consoleLogKeyCombination();
					createEmail?.(props.event);
				}
				break;
			case 'na':
				if (isGlobalContext) {
					consoleLogKeyCombination();
					createAppointment?.(props.event);
				}
				break;
			case 'nc':
			case 'c':
				if (isGlobalContext) {
					consoleLogKeyCombination();
					createContact?.(props.event);
				}
				break;
			case '/':
				if (isGlobalContext) {
					props.event.preventDefault();
					consoleLogKeyCombination();
					props.inputRef.current?.focus();
				}
				break;
			default:
				break;
		}
		keySequence = '';
	};

	keySequence = keySequence.concat(props.event.key);
	const timer = setTimeout(callKeyboardShortcutAction, 1000);

	switch (keySequence.length) {
		case 1:
			if (modifierKeysFirstTier.indexOf(props.event.key) === -1) {
				clearTimeout(timer);
				callKeyboardShortcutAction();
			}
			break;
		case 2:
			if (modifierKeysSecondTier.indexOf(props.event.key) === -1) {
				clearTimeout(timer);
				callKeyboardShortcutAction();
			}
			break;

		default:
			break;
	}
};
