"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const RTSP_1 = require("../src/scheme/rtsp/RTSP");
describe("Test fro RTSP", () => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 600 * 60 * 1000;
    it("1. 构造函数", () => __awaiter(void 0, void 0, void 0, function* () {
        const rtsp = new RTSP_1.RTSP({
            hostname: "192.168.50.123",
            port: 554
        });
        yield rtsp.connect();
        yield rtsp.OPTIONS();
        try {
            yield rtsp.DESCRIBE();
        }
        catch (error) {
            console.log(rtsp.needAuthentication);
            console.log(rtsp.authenticationType);
        }
        try {
            yield rtsp.DESCRIBE();
        }
        catch (error) {
            console.log(error);
        }
        console.log(rtsp.sdp);
        yield rtsp.SETUP();
        yield new Promise(res => setTimeout(res, 30000));
        console.log("30s");
    }));
});
//# sourceMappingURL=tcp-client-spec.js.map