export declare class BaseError extends Error {
    private msg;
    private code;
    private request;
    private response;
    constructor(msg: string, code: string, request: unknown, response: unknown);
}
export declare function buildWarning(msg: string, code: string | undefined, request: unknown, response: unknown): BaseError;
export declare function buildError(msg: string, code: string | undefined, request: unknown, response: unknown): BaseError;
