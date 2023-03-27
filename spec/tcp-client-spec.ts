import {TCPClient} from "../src/transport/TCPClient";
describe("Test fro TCPClient", () => {
  it("1. 构造函数", () => {
    const tcpClient = new TCPClient({
      host: "192.168.50.129",
      port: 554
    }, () => {
      console.log("init listener for what");
    })
  })
});
