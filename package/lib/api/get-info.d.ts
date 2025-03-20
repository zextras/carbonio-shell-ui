import { GetInfoResponse } from '../types/network';
type GetInfoParams = {
    rights?: string;
    sections?: string;
};
export declare const getInfo: ({ rights, sections }?: GetInfoParams) => Promise<GetInfoResponse>;
export {};
//# sourceMappingURL=get-info.d.ts.map