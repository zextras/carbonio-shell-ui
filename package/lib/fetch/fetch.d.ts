import type { RawSoapResponse } from '../types/network';
/**
 * @deprecated Use soapFetchV2 instead
 */
export declare const legacySoapFetch: <Request, Response extends Record<string, unknown>>(api: string, body: Request, otherAccount?: string, signal?: AbortSignal) => Promise<Response>;
export declare const soapFetchV2: <Request, Response extends Record<string, unknown>>(api: string, body: Request, otherAccount?: string, signal?: AbortSignal) => Promise<RawSoapResponse<Response>>;
/**
 * @deprecated Use soapFetchV2 instead
 */
export declare const legacyXmlSoapFetch: <Request, Response extends Record<string, unknown>>(api: string, body: Request, otherAccount?: string) => Promise<Response>;
//# sourceMappingURL=fetch.d.ts.map