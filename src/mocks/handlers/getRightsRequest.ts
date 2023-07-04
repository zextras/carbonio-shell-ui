/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { type ResponseResolver, type RestContext, type RestRequest } from 'msw';
import { faker } from '@faker-js/faker';
import { GetRightsResponse } from '../../../types';

type GetRightsRequestBody = {
	GetRightsRequest: {
		_jsns: string;
		ace: Array<{ right: string }>;
	};
};

type GetRightsResponseBody = {
	Body: {
		GetRightsResponse: GetRightsResponse;
		Fault?: { Detail?: { Error?: { Code?: string; Detail?: string } }; Reason?: { Text: string } };
	};
};
export const getRightsRequest: ResponseResolver<
	RestRequest<GetRightsRequestBody, never>,
	RestContext,
	GetRightsResponseBody
> = (request, response, context) =>
	response(
		context.json({
			Body: {
				GetRightsResponse: {
					ace: [{ right: 'sendAs', d: faker.internet.email(), zid: faker.string.uuid(), gt: 'usr' }]
				}
			}
		})
	);
