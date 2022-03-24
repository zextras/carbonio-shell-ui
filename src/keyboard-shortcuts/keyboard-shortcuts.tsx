/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
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
		// console.log(
		// 	`keys pressed: %c  ${props.event.ctrlKey ? 'Ctrl/Cmd + ' : ''}${keySequence
		// 		?.split('')
		// 		.join(' + ')} `,
		// 	'color: white; background: #39b654; border-radius: 5px; padding: 8px; width: 100%; font-size:18px; font-weight: 800'
		// );
		props.event.preventDefault();
		props.event.stopImmediatePropagation();
	};

	const isGlobalContext =
		props.event?.target?.isContentEditable === false &&
		props.event?.target?.nodeName !== 'INPUT' &&
		props.event.target.nodeName !== 'TEXTAREA';

	const callKeyboardShortcutAction = (): void => {
		switch (keySequence) {
			case 'n':
				if (props.primaryAction && isGlobalContext) {
					consoleLogKeyCombination();
					props.primaryAction.click();
				}
				break;

			case 'nm':
				if (isGlobalContext) {
					consoleLogKeyCombination();
					createEmail();
				}
				break;

			case 'na':
				if (isGlobalContext) {
					consoleLogKeyCombination();
					createAppointment();
				}
				break;

			case 'nc':
				if (isGlobalContext) {
					consoleLogKeyCombination();
					createContact();
				}
				break;

			case 'c':
				if (isGlobalContext) {
					consoleLogKeyCombination();
					createContact();
				}
				break;

			case '/':
				if (isGlobalContext) {
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
