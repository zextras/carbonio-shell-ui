/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import type { HttpResponseResolver } from 'msw';
import { HttpResponse } from 'msw';

import { LOGGED_USER } from '../../tests/constants';
import type { GetInfoResponse, SoapBody } from '../../types/network';

type GetInfoRequestBody = {
	GetInfoRequest: SoapBody<{
		rights: string;
	}>;
};

type GetInfoResponseBody = {
	Body: {
		GetInfoResponse: GetInfoResponse;
		Fault?: { Detail?: { Error?: { Code?: string; Detail?: string } }; Reason?: { Text: string } };
	};
};
export const getInfoRequest: HttpResponseResolver<
	never,
	GetInfoRequestBody,
	GetInfoResponseBody
> = () =>
	HttpResponse.json({
		Body: {
			GetInfoResponse: {
				id: LOGGED_USER.id,
				name: LOGGED_USER.name,
				prefs: { _attrs: LOGGED_USER.prefs },
				attrs: { _attrs: LOGGED_USER.attrs },
				props: {
					prop: LOGGED_USER.props
				},
				identities: LOGGED_USER.identities,
				signatures: { signature: [] },
				rights: { targets: [] },
				version: '',
				zimlets: { zimlet: [] }
			}
		}
	});
