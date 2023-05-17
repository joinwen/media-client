"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpResponse = void 0;
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
const HttpBase_1 = require("./HttpBase");
class HttpResponse extends HttpBase_1.HttpBase {
    constructor(httpResponseOptions) {
        super();
        if (typeof httpResponseOptions === "string") {
            this.httpResponseOptions = this.parse(httpResponseOptions);
        }
        else {
            this.httpResponseOptions = httpResponseOptions;
        }
    }
    get cseq() {
        if (this.httpResponseOptions)
            return this.httpResponseOptions.headers["CSeq"];
    }
    get line() {
        if (this.httpResponseOptions)
            return this.httpResponseOptions.line;
    }
    get headers() {
        if (this.httpResponseOptions)
            return this.httpResponseOptions.headers;
    }
    get body() {
        if (this.httpResponseOptions.body)
            return this.httpResponseOptions.body;
    }
    parse(str) {
        const lines = str.split("\r\n");
        const headers = {};
        let body = "";
        const [protocol, code, message] = lines[0].split(/\s+/);
        for (let i = 1; i < lines.length; i++) {
            if (lines[i] === "") {
                body = lines.slice(i + 1).join("\r\n");
                break;
            }
            const [key, value] = lines[i].split(/:\s*/);
            headers[key] = value;
        }
        return {
            line: {
                protocol,
                code: Number.parseInt(code),
                message
            },
            headers,
            body
        };
    }
    stringify() {
        const { line, headers, body } = this.httpResponseOptions;
        const { message, code, protocol } = line;
        const requestLine = `${protocol} ${code} ${message}\r\n`;
        const requestHeader = Object.keys(headers).reduce((pre, current, index, arr) => {
            return pre += `${current}:${headers[current]}\r\n`;
        }, "");
        return `${requestLine}${requestHeader}${body}`;
    }
}
exports.HttpResponse = HttpResponse;
//# sourceMappingURL=HttpResponsePacket.js.map
