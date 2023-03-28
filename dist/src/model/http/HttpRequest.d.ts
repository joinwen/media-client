/**
 * 一个典型的 HTTP 请求内容如下所示：
 * 1. 请求行
 * GET /example HTTP/1.1
 *
 * 2. 请求头
 * Host: www.example.com
 * User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)
 * Accept-Language: en-US,en;q=0.5
 * Accept-Encoding: gzip, deflate, br
 * Connection: keep-alive
 * Cookie: sessionId=123456789
 *
 * 3. 请求体
 *
 * {
 *   "name": "John Doe",
 *   "age": 30
 * }
 */
import { HttpBase } from "./HttpBase";
export interface HttpRequestOptions {
    line: {
        method: string;
        path: string;
        protocol: string;
    };
    headers: {
        [key: string]: any;
    };
    body?: any;
}
export declare class HttpRequest extends HttpBase {
    private readonly httpRequestOptions;
    constructor(httpRequestOptions: HttpRequestOptions | string);
    parse(str: string): HttpRequestOptions;
    stringify(): string;
}
