/// <reference types="node" />
import { ServerOpts } from "net";
export declare class TCPServer {
    private readonly options;
    private server;
    constructor(options?: ServerOpts);
    create(): void;
}
