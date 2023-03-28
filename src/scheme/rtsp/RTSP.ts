import {TCPClient} from "../../transport/TCPClient";
import {HttpRequest} from "../../model/http/HttpRequest";
import { URL } from "url";
import {HttpResponse} from "../../model/http/HttpResponse";
import {btoa} from "buffer";
type RTSPVersion = "RTSP/1.0" | "RTSP/2.0";
type RTPProtocol = "tcp" | "udp";
type RTSPProtocol = "rtsp" | "rtspu" | "srtsp";
export interface RTSPOptions {
  hostname?: string;
  port?: number;
  protocolVersion?: RTSPVersion;
  rtspProtocol?: RTSPProtocol;
  rtpProtocol?: RTPProtocol;
  userAgent?: string;
  path?: string;
  username?: string;
  password?: string;
}
export class RTSP {
  private readonly hostname: string;
  private readonly port: number;
  private readonly protocolVersion: RTSPVersion;
  // If the RTSP protocol is not specified, the default value is 'auto',which will attempt to use RTSP,RTSPU,and SRTSP protocols.
  private readonly rtspProtocol: RTSPProtocol | "auto";
  // If the RTP protocol is not specified, the default value is 'auto', which will attempt to use both UDP and TCP protocols.
  private rtpProtocol: RTPProtocol | "auto";
  private tcpClient: TCPClient;
  private cseq: number;
  private readonly userAgent: string;
  private readonly path: string;
  public supportedMethods: string[];
  public needAuthentication?: boolean;
  public authenticationType?: string;
  private username: string | undefined;
  private password: string | undefined;
  public sdp?: string;
  constructor(rtspOptions: RTSPOptions) {
    const path = rtspOptions.path;
    if(path) {
      const url = new URL(path);
      this.hostname = url.hostname;
      this.port = Number.parseInt(url.port) || 554;
    } else if(rtspOptions.hostname) {
      this.hostname = rtspOptions.hostname;
      this.port = rtspOptions.port || 554;
    } else {
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
    this.tcpClient = new TCPClient({
      port: this.port,
      host: this.hostname
    });
  }
  async connect() {
    await this.tcpClient.open();
  }
  OPTIONS() {
    return new Promise((resolve, reject) => {
      const requestData = new HttpRequest({
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
      const listener = (data?: any) => {
        const str = data.toString();
        const httpResponse = new HttpResponse(str);
        const headers = httpResponse.headers;
        const cseq = headers && headers["CSeq"];
        if(cseq && cseq.toString() === this.cseq.toString()) {
          const methods = headers["Public"];
          this.supportedMethods = methods.split(/,\s*/);
          this.tcpClient.off("data", listener);
          resolve(httpResponse);
        }
      };
      this.tcpClient.on("data", listener);
      this.tcpClient.send(str);
    })
  }
  DESCRIBE() {
    return new Promise((resolve, reject) => {
      const requestData = new HttpRequest({
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
      if(this.needAuthentication) {
        const headers = requestData.headers;
        if(headers)
          headers["Authorization"] = `Basic ${btoa("admin:able123456")}`;
      }
      const str = requestData.stringify();
      const listener = (data: any) => {
        const str = data.toString();
        const httpResponse = new HttpResponse(str);
        const line = httpResponse.line;
        const headers = httpResponse.headers;
        const code = line?.code;
        const cseq = httpResponse.cseq;
        if(cseq && cseq.toString() === this.cseq.toString()) {
          if(code && code.toString() === "401") {
            this.needAuthentication = true;
            const value = headers && headers["WWW-Authenticate"];
            if(value) {
              this.authenticationType = value;
            }
            this.tcpClient.off("data", listener);
            reject(httpResponse);
          }
          if(code && code.toString() === "200") {
            this.tcpClient.off("data", listener);
            this.sdp = httpResponse.body;
            resolve(httpResponse);
          }
        }
      };
      this.tcpClient.on("data", listener);
      this.tcpClient.send(str);
    })
  }
  SETUP() {
    return new Promise((resolve, reject) => {
      const requestData = new HttpRequest({
        line: {
          method: "SETUP",
          path: "rtsp://192.168.50.123/trackID=1",
          protocol: this.protocolVersion
        },
        headers: {
          "CSeq": ++this.cseq,
          "Transport": "RTP/AVP;unicast;client_port=3056-3057",
          "User-Agent": this.userAgent,
          "Authorization": `Basic ${btoa("admin:able1234")}`
        }
      });
      const str = requestData.stringify();
      const listener = (data?: any) => {
        const str = data.toString();
        const httpResponse = new HttpResponse(str);
        const line = httpResponse.line;
        const code = line?.code;
        const cseq = httpResponse.cseq;
        if(cseq && cseq.toString() === this.cseq.toString()) {
          if(code && code.toString() === "200") {
            resolve(httpResponse);
          } else {
            reject(httpResponse);
          }
        }
      };
      this.tcpClient.on("data", listener);
      this.tcpClient.send(str);
    });
  }
  PLAY() {

  }
}