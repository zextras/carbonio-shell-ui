/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import JSDOMEnvironment from 'jest-environment-jsdom';

class JSDOMEnvironmentExtended extends JSDOMEnvironment {
	constructor(...args: ConstructorParameters<typeof JSDOMEnvironment>) {
		super(...args);

		this.global.ReadableStream = ReadableStream;
		this.global.TextDecoder = TextDecoder;
		this.global.TextEncoder = TextEncoder;

		this.global.Blob = Blob;
		this.global.Headers = Headers;
		this.global.FormData = FormData;
		this.global.Request = Request;
		this.global.Response = Response;
		this.global.Request = Request;
		this.global.Response = Response;
		this.global.fetch = fetch;
		this.global.structuredClone = structuredClone;
	}
}

export default JSDOMEnvironmentExtended;
