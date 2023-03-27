import * as net from "net";
import {Server, ServerOpts, Socket} from "net";
export class TCPServer {
  private readonly options: ServerOpts | undefined;
  private server: Server | undefined;
  constructor(options?: ServerOpts) {
    if(options)
      this.options = options;
  }
  create() {
    this.server = net.createServer(this.options, (c) => {
      console.log("receive socket client from ", c.address());
    });
    this.server.on("error", (error) => {
      console.log(error);
    })
    this.server.listen(8124, () => {
      console.log("server bound");
    })
  }
}
const server = new TCPServer();
server.create();