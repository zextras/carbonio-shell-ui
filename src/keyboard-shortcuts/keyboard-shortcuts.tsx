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

type handleKeyboardShortcutsProps = {
	primaryAction: any;
	secondaryActions: any;
	event: any;
	inputRef: any;
	currentApp: string;
};

const modifierKeysFirstTier = ['g', 'n', 'v', 'm', '.', 'p', 'w'];
const modifierKeysSecondTier = ['p'];

let keySequence = '';

export const handleKeyboardShortcuts = (props: handleKeyboardShortcutsProps): void => {
	const createEmail = props.secondaryActions?.filter((item: any) => item.id === 'create-mail')[0]
		?.click;
	const createAppointment = props.secondaryActions?.filter(
		(item: any) => item.id === 'new-appointment'
	)[0]?.click;
	const createContact = props.secondaryActions?.filter(
		(item: any) => item.id === 'create-contact'
	)[0]?.click;

	// will be used in future implementations
	const ctrlModifierIsActive = props.event.ctrlKey || props.event.metaKey;

	const consoleLogKeyCombination = (): void => {
		console.log(
			`keys pressed: %c  ${props.event.ctrlKey ? 'Ctrl/Cmd + ' : ''}${keySequence
				?.split('')
				.join(' + ')} `,
			'color: white; background: #39b654; border-radius: 5px; padding: 8px; width: 100%; font-size:18px; font-weight: 800'
		);
		props.event.preventDefault();
		props.event.stopImmediatePropagation();
	};

	const callKeyboardShortcutAction = (): void => {
		switch (keySequence) {
			case 'n':
				if (
					props.primaryAction &&
					props.event?.target?.isContentEditable === false &&
					props.event?.target?.nodeName !== 'INPUT'
				) {
					consoleLogKeyCombination();
					props.primaryAction.click();
				}
				break;

			case 'nm':
				if (
					props.event?.target?.isContentEditable === false &&
					props.event?.target?.nodeName !== 'INPUT'
				) {
					consoleLogKeyCombination();
					createEmail();
				}
				break;

			case 'na':
				if (
					props.event?.target?.isContentEditable === false &&
					props.event?.target?.nodeName !== 'INPUT'
				) {
					consoleLogKeyCombination();
					createAppointment();
				}
				break;

			case 'nc':
				if (
					props.event?.target?.isContentEditable === false &&
					props.event?.target?.nodeName !== 'INPUT'
				) {
					consoleLogKeyCombination();
					createContact();
				}
				break;

			case '/':
				if (
					props.event?.target?.isContentEditable === false &&
					props.event?.target?.nodeName !== 'INPUT'
				) {
					props.event.preventDefault();
					consoleLogKeyCombination();
					props.inputRef ? props.inputRef.current?.focus() : null;
				}
				break;

			default:
				null;
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
			null;
	}
};
