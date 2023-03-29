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
exports.RTSP = void 0;
const TCPClient_1 = require("../../transport/TCPClient");
const HttpRequest_1 = require("../../model/http/HttpRequest");
const url_1 = require("url");
const HttpResponse_1 = require("../../model/http/HttpResponse");
const buffer_1 = require("buffer");
class RTSP {
    constructor(rtspOptions) {
        const path = rtspOptions.path;
        if (path) {
            const url = new url_1.URL(path);
            this.hostname = url.hostname;
            this.port = Number.parseInt(url.port) || 554;
        }
        else if (rtspOptions.hostname) {
            this.hostname = rtspOptions.hostname;
            this.port = rtspOptions.port || 554;
        }
        else {
            throw "Please specified hostname or path";
        }
        this.username = rtspOptions.username;
        this.password = rtspOptions.password;
        this.protocolVersion = rtspOptions.protocolVersion || "RTSP/1.0";
        this.rtspProtocol = rtspOptions.rtspProtocol || "rtsp";
        this.rtpProtocol = rtspOptions.rtpProtocol || "auto";
        this.userAgent = rtspOptions.userAgent || "media-client/1.0.0";
        this.path = path || `${this.rtspProtocol}://${this.hostname}`;
        this.cseq = 0;
        this.supportedMethods = [];
        this.tcpClient = new TCPClient_1.TCPClient({
            port: this.port,
            host: this.hostname
        });
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.tcpClient.open();
        });
    }
    OPTIONS() {
        return new Promise((resolve, reject) => {
            const requestData = new HttpRequest_1.HttpRequest({
                line: {
                    method: "OPTIONS",
                    path: this.path,
                    protocol: this.protocolVersion
                },
                headers: {
                    "CSeq": ++this.cseq,
                    "User-Agent": this.userAgent
                }
            });
            const str = requestData.stringify();
            const listener = (data) => {
                const str = data.toString();
                const httpResponse = new HttpResponse_1.HttpResponse(str);
                const headers = httpResponse.headers;
                const cseq = headers && headers["CSeq"];
                if (cseq && cseq.toString() === this.cseq.toString()) {
                    const methods = headers["Public"];
                    this.supportedMethods = methods.split(/,\s*/);
                    this.tcpClient.off("data", listener);
                    resolve(httpResponse);
                }
            };
            this.tcpClient.on("data", listener);
            this.tcpClient.send(str);
        });
    }
    DESCRIBE() {
        return new Promise((resolve, reject) => {
            const requestData = new HttpRequest_1.HttpRequest({
                line: {
                    method: "DESCRIBE",
                    path: this.path,
                    protocol: this.protocolVersion
                },
                headers: {
                    "Accept": "application/sdp",
                    "CSeq": ++this.cseq,
                    "User-Agent": this.userAgent
                }
            });
            if (this.needAuthentication) {
                const headers = requestData.headers;
                if (headers)
                    headers["Authorization"] = `Basic ${(0, buffer_1.btoa)("admin:able123456")}`;
            }
            const str = requestData.stringify();
            const listener = (data) => {
                const str = data.toString();
                const httpResponse = new HttpResponse_1.HttpResponse(str);
                const line = httpResponse.line;
                const headers = httpResponse.headers;
                const code = line === null || line === void 0 ? void 0 : line.code;
                const cseq = httpResponse.cseq;
                if (cseq && cseq.toString() === this.cseq.toString()) {
                    if (code && code.toString() === "401") {
                        this.needAuthentication = true;
                        const value = headers && headers["WWW-Authenticate"];
                        if (value) {
                            this.authenticationType = value;
                        }
                        this.tcpClient.off("data", listener);
                        reject(httpResponse);
                    }
                    if (code && code.toString() === "200") {
                        this.tcpClient.off("data", listener);
                        this.sdp = httpResponse.body;
                        resolve(httpResponse);
                    }
                }
            };
            this.tcpClient.on("data", listener);
            this.tcpClient.send(str);
        });
    }
    SETUP() {
        return new Promise((resolve, reject) => {
            const requestData = new HttpRequest_1.HttpRequest({
                line: {
                    method: "SETUP",
                    path: "rtsp://192.168.50.123/trackID=1",
                    protocol: this.protocolVersion
                },
                headers: {
                    "CSeq": ++this.cseq,
                    // "Transport": "RTP/AVP/UDP;unicast;client_port=3056-3057",
                    "Transport": "RTP/AVP/TCP;unicast;interleaved=0-1",
                    "User-Agent": this.userAgent,
                    "Authorization": `Basic ${(0, buffer_1.btoa)("admin:able1234")}`
                }
            });
            const str = requestData.stringify();
            const listener = (data) => {
                const str = data.toString();
                const httpResponse = new HttpResponse_1.HttpResponse(str);
                const line = httpResponse.line;
                const headers = httpResponse.headers;
                const code = line === null || line === void 0 ? void 0 : line.code;
                const cseq = httpResponse.cseq;
                if (cseq && cseq.toString() === this.cseq.toString()) {
                    if (code && code.toString() === "200") {
                        const session = headers && headers["Session"];
                        this.sessionId = session === null || session === void 0 ? void 0 : session.split(";")[0];
                        resolve(httpResponse);
                    }
                    else {
                        reject(httpResponse);
                    }
                }
            };
            this.tcpClient.on("data", listener);
            this.tcpClient.send(str);
        });
    }
    PLAY() {
        return new Promise((resolve, reject) => {
            const requestData = new HttpRequest_1.HttpRequest({
                line: {
                    method: "PLAY",
                    path: "rtsp://192.168.50.123/trackID=1",
                    protocol: this.protocolVersion
                },
                headers: {
                    "CSeq": ++this.cseq,
                    "Session": this.sessionId,
                    "Range": "npt=0-",
                    "User-Agent": this.userAgent,
                }
            });
            const str = requestData.stringify();
            this.tcpClient.send(str);
        });
    }
}
exports.RTSP = RTSP;
//# sourceMappingURL=RTSP.js.map