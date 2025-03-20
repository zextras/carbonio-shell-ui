type ApiManagerSessionInfo = {
    accountId?: string;
    accountName?: string;
    session?: {
        id: number;
        _content: number;
    };
    carbonioVersion?: string;
};
export declare class ApiManager {
    static getApiManager(): ApiManager;
    private sessionInfo;
    getSessionInfo(): ApiManagerSessionInfo;
    setSessionInfo(sessionInfo: Partial<ApiManagerSessionInfo>): void;
    constructor();
}
export {};
//# sourceMappingURL=ApiManager.d.ts.map