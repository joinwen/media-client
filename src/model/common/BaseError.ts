import {CODE} from "./Code";

export class BaseError extends Error {
  private msg: string;
  private code: string;
  private request: unknown;
  private response: unknown;
  constructor(msg: string, code: string, request: unknown, response: unknown) {
    super(msg);
    this.msg = msg;
    this.code = code;
    this.request = request;
    this.response = response;
  }
}
export function buildWarning(msg: string, code = CODE.WARNING, request: unknown, response: unknown) {
  return new BaseError(msg, code, request, response);
}
export function buildError(msg: string, code = CODE.ERROR, request: unknown, response: unknown) {
  return new BaseError(msg, code, request, response);
}
