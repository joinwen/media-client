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
import {HttpBase} from "./HttpBase";
export interface HttpRequestOptions {
  line: {
    method: string,
    path: string,
    protocol: string
  },
  headers: {
    [key: string]: any
  },
  body?: any
}
export class HttpRequest extends HttpBase {
  private readonly httpRequestOptions: HttpRequestOptions;
  constructor(httpRequestOptions: HttpRequestOptions | string) {
    super();
    if(typeof httpRequestOptions === "string") {
      this.httpRequestOptions = this.parse(httpRequestOptions);
    } else {
      this.httpRequestOptions = httpRequestOptions;
    }
  }
  get line() {
    if(this.httpRequestOptions)
      return this.httpRequestOptions.line;
  }
  get headers() {
    if(this.httpRequestOptions.headers)
      return this.httpRequestOptions.headers;
  }
  get body() {
    if(this.httpRequestOptions.body)
      return this.httpRequestOptions.body;
  }
  parse(str: string): HttpRequestOptions {
    const lines = str.split("\r\n");
    const headers: HttpRequestOptions["headers"] = {};
    let body = "";
    const [method, path, protocol] = lines[0].split(/\s+/);
    for(let i = 1; i < lines.length; i++) {
      if(lines[i] === "") {
        body = lines.slice(i + 1).join("\r\n");
        break;
      }
      const [name, value] = lines[i].split(/:\s*/);
      headers[name] = value;
    }
    return {
      line: {
        method,
        path,
        protocol
      },
      headers,
      body
    }
  }
  stringify() {
    const {line, headers, body} = this.httpRequestOptions;
    const { method, path, protocol } = line;
    const requestLine = `${method} ${path} ${protocol}\r\n`;
    const requestHeader = Object.keys(headers).reduce((pre,current,index, arr) => {
      return pre += `${current}: ${headers[current]}\r\n`;
    }, "");
    if(body) {
      return `${requestLine}${requestHeader}${body}\r\n`;
    } else {
      return `${requestLine}${requestHeader}\r\n`;
    }
  }
}
