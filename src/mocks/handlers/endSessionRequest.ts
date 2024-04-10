/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { HttpResponse, HttpResponseResolver } from 'msw';

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

export const endSessionRequest: HttpResponseResolver<
	never,
	EndSessionRequestBody,
	EndSessionResponseBody
> = () =>
	HttpResponse.json({
		Body: {
			EndSessionResponse: {}
		}
	});
