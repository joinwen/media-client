"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildDebug = exports.buildInfo = exports.BaseResult = void 0;
const Code_1 = require("./Code");
class BaseResult {
    constructor(msg, code, request, response) {
        this.msg = msg;
        this.code = code;
        this.request = request;
        this.response = response;
    }
    setRequest(value) {
        this.response = value;
        return this;
    }
    setResponse(value) {
        this.request = value;
        return this;
    }
}
exports.BaseResult = BaseResult;
function buildInfo(msg, code = Code_1.CODE.INFO, request, response) {
    return new BaseResult(msg, code, request, response);
}
exports.buildInfo = buildInfo;
function buildDebug(msg, code = Code_1.CODE.DEBUG, request, response) {
    return new BaseResult(msg, code, request, response);
}
exports.buildDebug = buildDebug;
//# sourceMappingURL=BaseResult.js.map