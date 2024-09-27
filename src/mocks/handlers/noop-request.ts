/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import type { HttpResponseResolver } from 'msw';
import { HttpResponse } from 'msw';

import type { SoapBody } from '../../types/network';

type NoOpRequestBody = {
	NoOpRequest: SoapBody;
};

type NoOpResponseBody = {
	Body: {
		NoOpResponse: Record<string, unknown>;
	};
};

export const noOpRequest: HttpResponseResolver<never, NoOpRequestBody, NoOpResponseBody> = () =>
	HttpResponse.json({
		Body: {
			NoOpResponse: {}
		}
	});
