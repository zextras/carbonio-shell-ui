/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

export type PopupNotificationConfig = {
	title?: string;
	message?: string;
	icon?: string;
	vibrate?: Array<number>;
	tag?: string;
	onClick?: (event: Event) => void;
};

export type AudioNotificationConfig = {
	sound?: string;
};

export type NotificationConfig = {
	showPopup?: boolean;
	playSound?: boolean;
} & PopupNotificationConfig &
	AudioNotificationConfig;

export interface INotificationManager {
	playSound: (config: AudioNotificationConfig) => void;
	showPopup: (config: PopupNotificationConfig) => void;
	notify: (config: NotificationConfig) => void;
	multipleNotify: (config: NotificationConfig[]) => void;
}