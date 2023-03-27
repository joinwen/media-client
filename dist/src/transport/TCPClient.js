"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.TCPClient = void 0;
const net = __importStar(require("net"));
class TCPClient {
    constructor(options, connectionListener) {
        this.options = options;
        this.forceClosed = false;
        this.connectionListener = connectionListener;
    }
    open(restart) {
        return __awaiter(this, void 0, void 0, function* () {
            this.socket = net.createConnection(this.options, this.connectionListener);
            return new Promise((resolve, reject) => {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j;
                (_a = this.socket) === null || _a === void 0 ? void 0 : _a.on("connect", () => {
                    console.log(this.socket);
                    resolve(`a socket ${this.options.host}:${this.options.port} connection is successfully established`);
                });
                (_b = this.socket) === null || _b === void 0 ? void 0 : _b.on("close", (hadError) => {
                    console.log("if the socket was closed due to a transmission error", hadError);
                });
                (_c = this.socket) === null || _c === void 0 ? void 0 : _c.on("data", (data) => {
                    console.log("receive buffer or string from the end of opposite", data);
                });
                (_d = this.socket) === null || _d === void 0 ? void 0 : _d.on("drain", () => {
                    console.log("the writer buffer becomes empty");
                });
                (_e = this.socket) === null || _e === void 0 ? void 0 : _e.once("end", () => {
                    console.log("when the end of the socket signals the end of transmission, thus ending the readable side of the socket");
                    if (!restart) {
                        reject();
                    }
                    else {
                    }
                });
                (_f = this.socket) === null || _f === void 0 ? void 0 : _f.once("error", (error) => {
                    console.log("when an error occurs, the close event will be called directly following this event", error);
                });
                (_g = this.socket) === null || _g === void 0 ? void 0 : _g.on("lookup", (err, address, family, host) => {
                    console.log("after resolving the host name but before connecting. Not applicable to Unix sockets");
                });
                (_h = this.socket) === null || _h === void 0 ? void 0 : _h.on("ready", () => {
                    console.log("triggered immediately after connect");
                });
                (_j = this.socket) === null || _j === void 0 ? void 0 : _j.on("timeout", () => {
                    console.log("if the socket times out from inactivity, this is only to notify that the socket has been idle. The user must manually close the connection");
                });
            });
        });
    }
    close(noForceClosed) {
        var _a, _b;
        this.forceClosed = !noForceClosed;
        if (!((_a = this.socket) === null || _a === void 0 ? void 0 : _a.destroyed)) {
            (_b = this.socket) === null || _b === void 0 ? void 0 : _b.destroy();
        }
    }
}
exports.TCPClient = TCPClient;
