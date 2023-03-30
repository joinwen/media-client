import {Buffer} from "buffer";
export class BitWriter {
  private buffer: Buffer;
  private offset: number;
  constructor() {
    this.buffer = Buffer.alloc(1);
    this.offset = 0;
  }
  writeBit(bit: 0 | 1) {
    if(this.offset % 8 === 0)
      this.buffer = Buffer.concat([this.buffer, Buffer.alloc(1)]);
    if(bit) {
      this.buffer[this.buffer.length - 1] |= (1 << (7 - this.offset % 8));
    }
    this.offset++;
  }
  writeByte(byte: number) {
    if(this.offset % 8 === 0) {
      this.buffer = Buffer.concat([this.buffer, Buffer.from([byte])]);
    } else {
      this.buffer[this.buffer.length - 1] |= (byte >> this.offset % 8);
      this.buffer = Buffer.concat([this.buffer, Buffer.from([byte << (8 - this.offset % 8)])]);
    }
    this.offset += 8;
  }
  writeBytes(bytes: Buffer | Uint8Array) {
    for(let i = 0; i < bytes.length; i++) {
      this.writeByte(bytes[i]);
    }
  }
  writeUTF8(str: string) {
    const buffer = Buffer.from(str, "utf-8");
    this.writeBytes(buffer);
  }

  get length() {
    if(this.buffer)
      return this.buffer.buffer.byteLength;
    return 0;
  }

  getBuffer() {
    return this.buffer.slice(0, -1);
  }
}
