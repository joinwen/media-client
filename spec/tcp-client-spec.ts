import { RTSP } from "../src/scheme/rtsp/RTSP";

describe("Test fro RTSP", () => {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 600 * 60 * 1000;
  it("1. 构造函数", async () => {
    const rtsp = new RTSP({
      hostname: "192.168.50.123",
      port: 554
    });
    await rtsp.connect();
    await rtsp.OPTIONS();
    try {
      await rtsp.DESCRIBE();
    }catch (error) {
      console.log(rtsp.needAuthentication);
      console.log(rtsp.authenticationType);
    }
    try {
      await rtsp.DESCRIBE();
    }catch (error) {
      console.log(error);
    }
    console.log(rtsp.sdp);
    await rtsp.SETUP();
    await new Promise(res => setTimeout(res, 30000));
    console.log("30s");
  })
});
