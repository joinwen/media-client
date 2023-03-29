import * as dgram from "dgram";
import {Socket} from "dgram";
import {EventEmitter} from "events";
interface UDPOptions {
  port?: number;
  hostname?: string;
}
export class UDPClient extends EventEmitter{
  private client: Socket;
  constructor(udpOptions?: UDPOptions) {
    super();
    this.client = dgram.createSocket("udp4");
    if(udpOptions) {
      const {port, hostname } = udpOptions;
      this.client.bind(port, hostname);
    } else {
      this.client.bind(0);
    }
  }
  connect(port: number, hostname: string) {
    return new Promise((resolve, reject) => {
      this.client.on("connect", (event: any) => {
        resolve(event);
      });
      this.client.on("error", (error) => {
        reject(error);
      });
      this.client.on("message", (data) => {
        this.emit("message", data);
      });
      this.client.connect(port, hostname);
    });
  }
  close() {
    return new Promise((resolve, reject) => {
      this.client.on("close", (event: any) => {
        resolve(event);
      });
      this.client.on("error", (error) => {
        reject(error);
      });
      this.client.close();
    })
  }
  disconnect() {
    this.client.disconnect();
  }
  get port() {
    return this.client.address().port;
  }
}
