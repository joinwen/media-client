/// <reference types="node" />
/// <reference types="node" />
import { Socket, TcpSocketConnectOpts } from "net";
export declare class TCPClient {
    socket: Socket | undefined;
    options: TcpSocketConnectOpts;
    connectionListener: () => void;
    private forceClosed;
    constructor(options: TcpSocketConnectOpts, connectionListener?: () => void);
    open(restart?: boolean): Promise<unknown>;
    send(data: string | Buffer | Uint8Array): void;
    close(noForceClosed: boolean): void;
}
