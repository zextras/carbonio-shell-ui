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

export const handleKeyboardShortcuts = (props: handleKeyboardShortcutsProps): void => {
	console.log('$$$ event ', props.event);
	const ctrlModifierIsActive = props.event.ctrlKey || props.event.metaKey;
	const consoleLogKeyCombination = (): void => {
		console.log(
			`key pressed: %c  ${props.event.ctrlKey ? 'Ctrl/Cmd + ' : ''}${props.event.key}  `,
			'color: white; background: #39b654; border-radius: 5px; padding: 8px; width: 100%; font-size:18px; font-weight: 800'
		);
		props.event.preventDefault();
		props.event.stopImmediatePropagation();
	};

	const createEmail = props.secondaryActions?.filter((item: any) => item.id === 'create-mail')[0]
		?.click;
	const createAppointment = props.secondaryActions?.filter(
		(item: any) => item.id === 'new-appointment'
	)[0]?.click;
	const createContact = props.secondaryActions?.filter(
		(item: any) => item.id === 'create-contact'
	)[0]?.click;

	switch (props.event.key) {
		case 'Escape':
			// eslint-disable-next-line
			// @ts-ignore
			document?.activeElement?.blur();
			consoleLogKeyCombination();
			break;

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

		case 'm':
			if (ctrlModifierIsActive) {
				consoleLogKeyCombination();
				createEmail();
			}
			break;

		case 'a':
			if (ctrlModifierIsActive) {
				consoleLogKeyCombination();
				createAppointment();
			}
			break;

		case 'c':
			if (ctrlModifierIsActive) {
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
};
