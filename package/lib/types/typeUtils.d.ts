export type StringOfLength<Min, Max = Min> = string & {
    min: Min;
    max: Max;
    readonly StringOfLength: unique symbol;
};
export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> & {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
}[Keys];
export type AnyFunction = (...args: any[]) => any;
export type ValueOf<T> = T[keyof T];
export type Exactify<T, X extends T> = T & {
    [K in keyof X]: K extends keyof T ? X[K] : never;
};
//# sourceMappingURL=typeUtils.d.ts.map