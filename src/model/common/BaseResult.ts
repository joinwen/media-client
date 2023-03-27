import {CODE} from "./Code";

export class BaseResult {
  private msg: string;
  private code: string;
  private request: unknown;
  private response: unknown;
  constructor(msg: string, code: string, request?: unknown, response?: unknown) {
    this.msg = msg;
    this.code = code;
    this.request = request;
    this.response = response;
  }
  setRequest(value: unknown) {
    this.response = value;
    return this;
  }
  setResponse(value: unknown) {
    this.request = value;
    return this;
  }
}
export function buildInfo(msg: string, code = CODE.INFO, request: unknown, response: unknown) {
  return new BaseResult(msg, code, request, response);
}
export function buildDebug(msg: string, code = CODE.DEBUG, request: unknown, response: unknown) {
  return new BaseResult(msg, code, request, response);
}
