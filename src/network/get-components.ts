/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { filter } from 'lodash';
import { useAppStore } from '../store/app';
import { CarbonioModule } from '../../types';

export const getComponents = (): Promise<void> =>
	fetch('/static/iris/components.json')
		.then((response) => {
			if (response.ok) {
				return response.json();
			}
			throw Error(response.statusText);
		})
		.then(({ components }: { components: Array<CarbonioModule> }) => {
			useAppStore
				.getState()
				.setters.addApps(filter(components, ({ type }) => type === 'shell' || type === 'carbonio'));
		});
