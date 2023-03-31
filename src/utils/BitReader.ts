export class BitReader {
  private buffer: Buffer;
  private offset: number;
  constructor(buffer: Buffer) {
    this.buffer = buffer;
    this.offset = 0;
  }
  get byteOffset() {
    return this.offset % 8;
  }
  readBit(): number {
    const byte = this.buffer.readUint8(this.byteOffset);
    const bit = byte >> (7 - this.offset % 8) & 1;
    this.offset++;
    return bit;
  }
  readBits(length: number): number {
    let bits = 0;
    for(let i = 0; i < length; i++) {
      bits = (bits << 1) | this.readBit();
    }
    return bits;
  }
  readByte(): number {
    const byte = this.buffer.readUint8(this.byteOffset);
    this.offset += 8;
    return byte;
  }
  readBytes(): number[] {
    const bytes = [];
    for(let i = 0; i < length; i++) {
      bytes.push(this.readByte());
    }
    return bytes;
  }
  readUTF8(): number {
    let val = this.readBits(8);
    if ((val & 0x80) == 0x00) {
      return val & 0x7f;
    } else if ((val & 0xe0) == 0xc0) {
      val = ((val & 0x1f) << 6) | this.readBits(6);
      return val;
    } else if ((val & 0xf0) == 0xe0) {
      val = ((val & 0x0f) << 12) | (this.readBits(6) << 6) | this.readBits(6);
      return val;
    } else {
      val = ((val & 0x07) << 18) | (this.readBits(6) << 12) | (this.readBits(6) << 6) | this.readBits(6);
      return val;
    }
  }
  readBitRange(start: number, length: number) {
    this.offset = start;
    return this.readBits(length);
  }
  readInt32() {
    const int = this.buffer.readInt32BE(this.byteOffset);
    this.offset += 32
    return int;
  }
}

