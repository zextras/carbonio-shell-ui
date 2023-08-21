/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { ResponseResolver, RestContext, RestRequest } from 'msw';

import { CarbonioModule } from '../../../types';

export type GetComponentsJsonResponseBody = { components: Array<CarbonioModule> };
export const getComponentsJson: ResponseResolver<
	RestRequest<never, never>,
	RestContext,
	GetComponentsJsonResponseBody
> = (request, response, context) => {
	const componentsJson: GetComponentsJsonResponseBody = {
		components: [
			{
				name: 'carbonio-shell-ui',
				js_entrypoint: 'src/index.ts',
				description: 'The Zextras Carbonio web client',
				version: '0.0.0',
				commit: '',
				priority: -1,
				type: 'shell',
				attrKey: '',
				icon: 'CubeOutline',
				display: 'Shell',
				sentryDsn: ''
			}
		]
	};
	return response(context.json(componentsJson));
};
