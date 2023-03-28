import * as Buffer from "buffer";
import * as net from "net";
import EventEmitter from "events";
import {Socket, TcpSocketConnectOpts} from "net";
export class TCPClient extends EventEmitter{
  public socket: Socket | undefined;
  public options: TcpSocketConnectOpts;
  public connectionListener: () => void;
  private forceClosed: boolean;
  constructor(options: TcpSocketConnectOpts, connectionListener?: () => void) {
    super();
    this.options = options;
    this.forceClosed = false;
    this.connectionListener = connectionListener || (() => {});
  }
  async open(restart?: boolean) {
    this.socket = net.createConnection(this.options, this.connectionListener);
    return new Promise((resolve, reject) => {
      this.socket?.on("connect", () => {
        resolve(`a socket ${this.options.host}:${this.options.port} connection is successfully established`);
      });
      this.socket?.on("close", (hadError: boolean) => {
        console.log("if the socket was closed due to a transmission error", hadError);
      });
      this.socket?.on("data", (data: Buffer | string) => {
        this.emit("data", data);
      });
      this.socket?.on("drain", () => {
        console.log("the writer buffer becomes empty");
      });
      this.socket?.once("end", () => {
        console.log("when the end of the socket signals the end of transmission, thus ending the readable side of the socket");
        if(!restart) {
          reject();
        } else {
        }
      });
      this.socket?.once("error", (error) => {
        console.log("when an error occurs, the close event will be called directly following this event",error);
      });
      this.socket?.on("lookup", (err, address, family, host) => {
        console.log("after resolving the host name but before connecting. Not applicable to Unix sockets");
      });
      this.socket?.on("ready", () => {
        console.log("triggered immediately after connect");
      });
      this.socket?.on("timeout", () => {
        console.log("if the socket times out from inactivity, this is only to notify that the socket has been idle. The user must manually close the connection");
      });
    })
  }
  send(data: string | Buffer | Uint8Array) {
    this.socket?.write(data);
  }
  close(noForceClosed: boolean) {
    this.forceClosed = !noForceClosed;
    if(!this.socket?.destroyed) {
      this.socket?.destroy();
    }
  }
}
