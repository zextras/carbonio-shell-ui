export declare const ApiEvents: {
    readonly UserQuota: "UserQuotaEvent";
    readonly Notify: "NotifyEvent";
    readonly AuthError: "AuthErrorEvent";
};
export type UserQuotaEvent = {
    name: typeof ApiEvents.UserQuota;
    payload: {
        quota: number;
    };
};
export type NotifyEvent = {
    name: typeof ApiEvents.Notify;
    payload: {
        quota: number;
    };
};
export type AuthErrorEvent = {
    name: typeof ApiEvents.AuthError;
    payload: {
        error: 'NOT_AUTHENTICATED';
    };
};
export declare const dispatchUserQuotaEvent: (quota: number) => void;
export declare const dispatchNotifyEvent: (quota: number) => void;
export declare const dispatchAuthErrorEvent: (error: "NOT_AUTHENTICATED") => void;
//# sourceMappingURL=custumEventDispatcher.d.ts.map