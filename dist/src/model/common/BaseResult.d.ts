export declare class BaseResult {
    private msg;
    private code;
    private request;
    private response;
    constructor(msg: string, code: string, request?: unknown, response?: unknown);
    setRequest(value: unknown): this;
    setResponse(value: unknown): this;
}
export declare function buildInfo(msg: string, code: string | undefined, request: unknown, response: unknown): BaseResult;
export declare function buildDebug(msg: string, code: string | undefined, request: unknown, response: unknown): BaseResult;
