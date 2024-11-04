/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import type { HttpResponseResolver } from 'msw';
import { HttpResponse } from 'msw';

import { JSNS } from '../../constants';
import type { NoOpRequest, NoOpResponse } from '../../network/fetch';
import type { SoapRequest, SoapResponse } from '../../types/network';

export const noOpRequest: HttpResponseResolver<
	never,
	SoapRequest<{ NoOpRequest: NoOpRequest }>,
	SoapResponse<NoOpResponse>
> = () =>
	HttpResponse.json({
		Body: {
			NoOpResponse: {
				_jsns: JSNS.mail
			}
		},
		Header: {
			context: {}
		}
	});
