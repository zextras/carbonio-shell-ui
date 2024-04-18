/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import type { HttpResponseResolver } from 'msw';
import { HttpResponse } from 'msw';

import type { SoapBody } from '../../types/network';

type EndSessionRequestBody = {
	EndSessionRequest: SoapBody;
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
