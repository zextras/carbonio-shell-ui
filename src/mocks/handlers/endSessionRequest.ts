/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { type ResponseResolver, type RestContext, type RestRequest } from 'msw';

type EndSessionRequestBody = {
	EndSessionRequest: {
		_jsns: string;
	};
};

type EndSessionResponseBody = {
	Body: {
		EndSessionResponse: Record<string, unknown>;
	};
};

export const endSessionRequest: ResponseResolver<
	RestRequest<EndSessionRequestBody, never>,
	RestContext,
	EndSessionResponseBody
> = (request, response, context) =>
	response(
		context.json({
			Body: {
				EndSessionResponse: {}
			}
		})
	);
