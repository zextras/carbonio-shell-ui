import { CarbonioModule } from '../../../types';

/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
export const normalizeApp = (app: Partial<CarbonioModule>): CarbonioModule => ({
	commit: app.commit ?? '',
	description: app.description ?? 'A carbonio Module',
	// eslint-disable-next-line camelcase
	js_entrypoint: app.js_entrypoint ?? '',
	name: app.name ?? 'module',
	priority: 99,
	version: app.version ?? '',
	type: 'app',
	attrKey: app.attrKey ?? '',
	icon: app.icon ?? 'Cube',
	displayName: app.displayName ?? 'Module'
});
