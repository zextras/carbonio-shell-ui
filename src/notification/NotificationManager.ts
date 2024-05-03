/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { debounce, noop } from 'lodash';

import defaultAudio from '../../assets/notification.mp3';
import { getFavicon } from '../store/login/getters';

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
class NotificationManager implements INotificationManager {
	private static instance: NotificationManager;

	/**
	 * Minimum time (ms) to wait before the same audio file will be played
	 * @private
	 */
	private static DEBOUNCE_TIME = 1000;

	/**
	 * Default configuration for the popup-only notification
	 * @private
	 */
	private PopupNotificationDefaultConfig = {
		title: '',
		vibrate: [200, 100, 200],
		icon: getFavicon()
	};

	/**
	 * Default configuration for the audio-only notification
	 * @private
	 */
	private AudioNotificationDefaultConfig: AudioNotificationConfig = {
		sound: defaultAudio
	};

	/**
	 * Default configuration for a notification with both popup and audio
	 * @private
	 */
	private NotificationDefaultConfig: NotificationConfig = {
		...this.PopupNotificationDefaultConfig,
		...this.AudioNotificationDefaultConfig,
		showPopup: true,
		playSound: false
	};

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
			...this.AudioNotificationDefaultConfig,
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
			...this.PopupNotificationDefaultConfig,
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
			...this.NotificationDefaultConfig,
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
