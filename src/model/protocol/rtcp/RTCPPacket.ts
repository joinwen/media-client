/**
 * @see https://www.rfc-editor.org/rfc/rfc3550
 */
export class RTCPPacket {
  private buffer: Buffer | ArrayBuffer | Uint8Array;
  constructor(buffer: Buffer | ArrayBuffer | Uint8Array) {
    this.buffer = buffer;
  }
}
