import type { RawSoapResponse, SoapBody } from '../types/network';
export type NoOpRequest = SoapBody<{
    limitToOneBlocked?: 0 | 1;
    wait?: 0 | 1;
}>;
export type NoOpResponse = SoapBody<{
    waitDisallowed?: boolean;
}>;
export declare const soapFetch: <Request, Response extends Record<string, unknown>>(api: string, body: Request, account?: string, signal?: AbortSignal) => Promise<RawSoapResponse<Response>>;
//# sourceMappingURL=fetch-utils.d.ts.map