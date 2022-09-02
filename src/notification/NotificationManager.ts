/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { debounce, noop } from 'lodash';
import {
	NotificationConfig,
	PopupNotificationConfig,
	AudioNotificationConfig,
	INotificationManager
} from '../../types/notification';
import defaultAudio from '../../assets/notification.mp3';
import defaultIcon from '../../assets/carbonio-logo.png';

const PopupNotificationDefaultConfig = {
	title: 'Carbonio client',
	icon: defaultIcon,
	vibrate: [200, 100, 200]
};

const AudioNotificationDefaultConfig = {
	sound: defaultAudio
};

const NotificationDefaultConfig: NotificationConfig = {
	...PopupNotificationDefaultConfig,
	...AudioNotificationDefaultConfig,
	showPopup: true,
	playSound: false
};

/**
 * The main goals of the NotificationManager are:
 * - to provide a single and rich implementation for all the Carbonio modules,
 *   reducing the boilerplate code needed to send a notification to the user
 * - to optimize the audio notifications avoiding to spam the same sound file
 *   in a short period of time
 * - to act as a collector for all the notification (for possible future
 *   implementations)
 *
 * In order to reduce the effort needed to send a notification the class
 * provided a set of default values/assets (e.g. icon, sound, title, ...)
 *
 * The class is provided as a singleton
 */
export class NotificationManager implements INotificationManager {
	private static instance: NotificationManager;

	/**
	 * Minimum time (ms) to wait before the same audio file will be played
	 * @private
	 */
	private static DEBOUNCE_TIME = 1000;

	/**
	 * Map of functions to play a specific audio file
	 * @private
	 */
	private functions = new Map<string, () => void>();

	/**
	 * Gets or creates the (debounced) function to play the audio file
	 * @param sound - relative path to the audio file to play
	 */
	private getAudioFileFunction = (sound: string): (() => void) => {
		if (!this.functions.has(sound)) {
			this.functions.set(
				sound,
				debounce(() => {
					new Audio(sound).play().then();
					this.functions.delete(sound);
				}, NotificationManager.DEBOUNCE_TIME)
			);
		}
		const result = this.functions.get(sound);
		return result ?? noop;
	};

	/**
	 * Executes the debounced function to play the audio file
	 * @param config - Configuration for the audio notification. In case of
	 * missing properties default values are used
	 */
	public playSound = (config: AudioNotificationConfig): void => {
		const defConfig = {
			...AudioNotificationDefaultConfig,
			...config
		};
		if (!defConfig.sound) {
			return;
		}

		this.getAudioFileFunction(defConfig.sound)();
	};

	/**
	 * Shows a popup notification
	 * @param config - Configuration for the popup notification. In case of
	 * missing properties default values are used
	 */
	public showPopup = (config: PopupNotificationConfig): void => {
		const defConfig = {
			...PopupNotificationDefaultConfig,
			...config
		};

		const n = new Notification(defConfig.title, {
			body: defConfig.message,
			vibrate: defConfig.vibrate,
			icon: defConfig.icon,
			tag: defConfig?.tag
		});

		if (defConfig.onClick) {
			n.addEventListener('click', defConfig.onClick);
		}
	};

	/**
	 * Sends a popup/audio notification to the user
	 * @param config - Configuration for the notification. In case of
	 * missing properties default values are used
	 */
	public notify = (config: NotificationConfig): void => {
		const defConfig = {
			...NotificationDefaultConfig,
			...config
		};

		if (defConfig?.showPopup) {
			this.showPopup(defConfig);
		}

		if (defConfig?.playSound) {
			this.playSound(defConfig);
		}
	};

	/**
	 * Sends multiple notifications
	 * @param config - Array of configurations for the notifications. In case of
	 * missing properties default values are used
	 */
	public multipleNotify = (config: NotificationConfig[]): void => {
		config.forEach((conf) => this.notify(conf));
	};

	/**
	 * Return the singleton instance
	 */
	public static getInstance(): NotificationManager {
		if (!NotificationManager.instance) {
			NotificationManager.instance = new NotificationManager();
		}

		return NotificationManager.instance;
	}
}

export const getNotificationManager = (): INotificationManager => NotificationManager.getInstance();
