import {TCPClient} from "../../transport/TCPClient";
import {HttpRequest} from "../../model/protocol/http/HttpRequest";
import { URL } from "url";
import {HttpResponse} from "../../model/protocol/http/HttpResponse";
import {btoa} from "buffer";
import {clearTimeout} from "timers";
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
  timeout?: number;
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
  private sessionId?: string;
  private timeout: number;
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
    this.timeout = rtspOptions.timeout || 6000;
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
  async OPTIONS() {
    const httpRequest = new HttpRequest({
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
    const httpResponse = await this.request(httpRequest);
    if(httpResponse && httpResponse.methods)
      this.supportedMethods = httpResponse?.methods;
  }
  async DESCRIBE() {
    const httpRequest = new HttpRequest({
      line: {
        method: "DESCRIBE",
        path: this.path,
        protocol: this.protocolVersion
      },
      headers: {
        "Accept": "application/sdp",
        "CSeq": ++this.cseq,
        "User-Agent": this.userAgent,
        "Authorization": this.needAuthentication ? `Basic ${btoa("admin:able123456")}` : undefined
      }
    });
    try {
      const httpResponse = await this.request(httpRequest);
      this.sdp = httpResponse.body;
    }catch (error) {
      if(error instanceof HttpResponse && error?.code?.toString() === "401") {
        this.needAuthentication = true;
        const headers = error.headers;
        this.authenticationType = headers && headers["WWW-Authenticate"];
      }
      throw error;
    }
  }
  async SETUP() {
    const httpRequest = new HttpRequest({
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
        "Authorization": `Basic ${btoa("admin:able1234")}`
      }
    });
    const httpResponse = await this.request(httpRequest);
    const headers = httpResponse.headers;
    const session = headers && headers["Session"];
    this.sessionId = session?.split(";")[0];
  }
  PLAY() {
    return new Promise((resolve, reject) => {
      const requestData = new HttpRequest({
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
  request(httpRequest: HttpRequest): Promise<HttpResponse> {
    return new Promise((resolve, reject) => {
      const listener = (data?: any) => {
        const httpResponse = new HttpResponse(data.toString());
        const requestCSeq = httpRequest.cseq;
        const responseCSeq = httpResponse.cseq;
        if(responseCSeq && requestCSeq.toString() === responseCSeq.toString()) {
          const code = httpResponse.code;
          if(code && code.toString() === "200") {
            clearTimeout(timer);
            this.tcpClient.off("data", listener);
            resolve(httpResponse);
          }
          else {
            clearTimeout(timer);
            this.tcpClient.off("data", listener);
            reject(httpResponse);
          }
        }
      };
      const timer = setTimeout(() => {
        this.tcpClient.off("data", listener);
        reject(`Request httpRequest.stringify(),but response timed out after ${this.timeout}ms`);
      }, this.timeout);
      this.tcpClient.on("data", listener);
      this.tcpClient.send(httpRequest.stringify());
    });
  }
}
