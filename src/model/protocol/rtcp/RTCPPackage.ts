export class RTCPPackage {
  private buffer: Buffer | ArrayBuffer | Uint8Array;
  constructor(buffer: Buffer | ArrayBuffer | Uint8Array) {
    this.buffer = buffer;
  }
}
