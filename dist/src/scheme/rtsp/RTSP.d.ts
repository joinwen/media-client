declare type RTSPVersion = "RTSP/1.0" | "RTSP/2.0";
declare type RTPProtocol = "tcp" | "udp";
declare type RTSPProtocol = "rtsp" | "rtspu" | "srtsp";
export interface RTSPOptions {
    hostname?: string;
    port?: number;
    protocolVersion?: RTSPVersion;
    rtspProtocol?: RTSPProtocol;
    rtpProtocol?: RTPProtocol;
    userAgent?: string;
    path?: string;
}
export declare class RTSP {
    private readonly hostname;
    private readonly port;
    private protocolVersion;
    private rtspProtocol;
    private rtpProtocol;
    private tcpClient;
    private cseq;
    private readonly userAgent;
    private path;
    constructor(rtspOptions: RTSPOptions);
    connect(): Promise<void>;
    OPTIONS(): void;
    DESCRIBE(): void;
    SETUP(): void;
    PLAY(): void;
}
export {};
