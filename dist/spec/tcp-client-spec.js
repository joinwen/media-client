"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TCPClient_1 = require("../src/transport/TCPClient");
describe("Test fro TCPClient", () => {
    it("1. 构造函数", () => {
        const tcpClient = new TCPClient_1.TCPClient({
            host: "192.168.50.129",
            port: 554
        }, () => {
            console.log("init listener for what");
        });
    });
});
