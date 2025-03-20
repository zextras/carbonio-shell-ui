/*
 * SPDX-FileCopyrightText: 2025 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

type ApiManagerSessionInfo = {
	accountId?: string;
	accountName?: string;
	session?: { id: number; _content: number };
	carbonioVersion?: string;
};

export class ApiManager {
	static getApiManager(): ApiManager {
		if (!window.carbonioApiManager) {
			window.carbonioApiManager = new ApiManager();
		}
		return window.carbonioApiManager;
	}

	private sessionInfo: ApiManagerSessionInfo;

	getSessionInfo(): ApiManagerSessionInfo {
		return this.sessionInfo;
	}

	setSessionInfo(sessionInfo: Partial<ApiManagerSessionInfo>): void {
		this.sessionInfo = { ...this.sessionInfo, ...sessionInfo };
	}

	constructor() {
		this.sessionInfo = {};
		// TODO INIT POLLING
	}
}
