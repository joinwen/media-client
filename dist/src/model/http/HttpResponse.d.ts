/**
 * 一个典型的 HTTP 响应如下所示：
 * 1. 响应行：
 * HTTP/1.1 200 OK
 *
 * 2. 响应头：
 * Content-Type: text/html; charset=UTF-8
 * Content-Length: 1024
 * Connection: keep-alive
 * Cache-Control: max-age=3600
 * Expires: Wed, 29 Mar 2023 12:00:00 GMT
 *
 * 3. 响应体：
 *
 * <html>
 * <head>
 * <title>Example Page</title>
 * </head>
 * <body>
 * <h1>Welcome to Example Page</h1>
 * <p>This is an example page.</p>
 * </body>
 * </html>
 */
import { HttpBase } from "./HttpBase";
export interface HttpResponseOptions {
    line: {
        protocol: string;
        code: number;
        message: string;
    };
    headers: {
        [key: string]: string;
    };
    body: any;
}
export declare class HttpResponse extends HttpBase {
    private httpResponseOptions;
    constructor(httpResponseOptions: HttpResponseOptions | string);
    parse(str: string): HttpResponseOptions;
    stringify(): string;
}
