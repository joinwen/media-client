export class BitReader {
  private buffer: Buffer;
  private byteOffset: number;
  private bitOffset: number;
  constructor(buffer: Buffer) {
    this.buffer = buffer;
    this.byteOffset = 0;
    this.bitOffset = 0;
  }
  readBit(): number {
    const byte = this.buffer.readUint8(this.byteOffset);
    const bit = byte >> (7 - this.bitOffset) & 1;
    this.bitOffset++;
    if(this.bitOffset >= 8) {
      this.bitOffset = 0;
      this.byteOffset++;
    }
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
    this.byteOffset++;
    this.bitOffset = 0;
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
  readInt32() {
    const int = this.buffer.readInt32BE(this.byteOffset);
    this.byteOffset++;
    this.bitOffset = 0;
    return int;
  }
  readASCII(length: number) {

  }
}

