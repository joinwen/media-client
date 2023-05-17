/**
 * @see https://www.rfc-editor.org/rfc/rfc2616
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP
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
import {HttpPacket} from "./HttpPacket";
export interface HttpResponseOptions {
  line: {
    protocol: string,
    code: number,
    message: string
  },
  headers: {
    [key: string]: string
  },
  body: any
}
export class HttpResponsePacket extends HttpPacket {
  private httpResponseOptions: HttpResponseOptions;
  constructor(httpResponseOptions: HttpResponseOptions | string) {
    super();
    if(typeof httpResponseOptions === "string") {
      this.httpResponseOptions = this.parse(httpResponseOptions);
    } else {
      this.httpResponseOptions = httpResponseOptions;
    }
  }
  get cseq() {
    if(this.httpResponseOptions)
      return this.httpResponseOptions.headers["CSeq"];
  }
  get code() {
    if(this.httpResponseOptions)
      return this.httpResponseOptions.line.code;
  }
  get line() {
    if(this.httpResponseOptions)
      return this.httpResponseOptions.line;
  }
  get headers() {
    if(this.httpResponseOptions)
      return this.httpResponseOptions.headers;
  }
  get methods() {
    const methods = this.headers && this.headers["Public"];
    return methods?.split(/,\s*/);
  }
  get body() {
    if(this.httpResponseOptions.body)
      return this.httpResponseOptions.body;
  }
  parse(str: string): HttpResponseOptions {
    const lines = str.split("\r\n");
    const headers: HttpResponseOptions["headers"] = {};
    let body = "";
    const [protocol, code, message ] = lines[0].split(/\s+/);
    for(let i = 1; i < lines.length; i++) {
      if(lines[i] === "") {
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
    }
  }
  stringify() {
    const {line, headers, body} = this.httpResponseOptions;
    const { message, code, protocol } = line;
    const requestLine = `${protocol} ${code} ${message}\r\n`;
    const requestHeader = Object.keys(headers).reduce((pre,current,index, arr) => {
      return pre += current && headers[current] ? `${current}:${headers[current]}\r\n` : "";
    }, "");
    return `${requestLine}${requestHeader}${body}`;
  }
}
