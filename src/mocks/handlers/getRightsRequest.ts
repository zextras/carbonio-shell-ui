/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { faker } from '@faker-js/faker';
import type { HttpResponseResolver } from 'msw';
import { HttpResponse } from 'msw';

import type { GetRightsResponse } from '../../types/network';

export type GetRightsRequestBody = {
	GetRightsRequest: {
		_jsns: string;
		ace: Array<{ right: string }>;
	};
};

export type GetRightsResponseBody = {
	Body: {
		GetRightsResponse: GetRightsResponse;
		Fault?: { Detail?: { Error?: { Code?: string; Detail?: string } }; Reason?: { Text: string } };
	};
};
export const getRightsRequest: HttpResponseResolver<
	never,
	GetRightsRequestBody,
	GetRightsResponseBody
> = () =>
	HttpResponse.json({
		Body: {
			GetRightsResponse: {
				ace: [{ right: 'sendAs', d: faker.internet.email(), zid: faker.string.uuid(), gt: 'usr' }]
			}
		}
	});
