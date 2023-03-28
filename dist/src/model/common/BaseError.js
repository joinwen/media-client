"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildError = exports.buildWarning = exports.BaseError = void 0;
const Code_1 = require("./Code");
class BaseError extends Error {
    constructor(msg, code, request, response) {
        super(msg);
        this.msg = msg;
        this.code = code;
        this.request = request;
        this.response = response;
    }
}
exports.BaseError = BaseError;
function buildWarning(msg, code = Code_1.CODE.WARNING, request, response) {
    return new BaseError(msg, code, request, response);
}
exports.buildWarning = buildWarning;
function buildError(msg, code = Code_1.CODE.ERROR, request, response) {
    return new BaseError(msg, code, request, response);
}
exports.buildError = buildError;
//# sourceMappingURL=BaseError.js.map