/**
 *  0               1               2               3
 *  0 1 2 3 4 5 6 7 0 1 2 3 4 5 6 7 0 1 2 3 4 5 6 7 0 1 2 3 4 5 6 7
 * +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
 * |V=2|P|X|  CC   |M|     PT      |       sequence number         |
 * +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
 * |                           timestamp                           |
 * +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
 * |           synchronization source (SSRC) identifier            |
 * +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
 * |            contributing source (CSRC) identifiers             |
 * |                             ....                              |
 * +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
 * |                   RTP extension (optional)                     |
 * |                             ....                              |
 * +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
 * |                           payload                             |
 * |                             ....                              |
 * +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
 */
import {BitReader} from "../../../utils/BitReader";
import {Buffer} from "buffer";

/**
 * see https://www.rfc-editor.org/rfc/rfc3551.html
 * 0-34 encoding
 * 35-71 unassigned
 * 72-76  reserved
 * 96-127 dynamic
 */
export const payloadValueMap = {
  0: {encodingName: 'PCMU', mediaType: 'A', clockRate: 8000, channels: 1},
  1: {encodingName: 'reserved', mediaType: 'A'},
  2: {encodingName: 'reserved', mediaType: 'A'},
  3: {encodingName: 'GSM' , mediaType: 'A', clockRate: 8000, channels: 1},
  4: {encodingName: 'G723', mediaType: 'A', clockRate: 8000, channels: 1},
  5: {encodingName: 'DVI4', mediaType: 'A', clockRate: 8000, channels: 1},
  6: {encodingName: 'DVI4', mediaType: 'A', clockRate: 16000, channels: 1},
  7: {encodingName: 'LPC', mediaType: 'A', clockRate: 8000, channels: 1},
  8: {encodingName: 'PCMA', mediaType: 'A', clockRate: 8000, channels: 1},
  9: {encodingName: 'G722', mediaType: 'A', clockRate: 8000, channels: 1},
  10: {encodingName: 'L16', mediaType: 'A', clockRate: 44100, channels: 2},
  11: {encodingName: 'L16', mediaType: 'A', clockRate: 44100, channels: 1},
  12: {encodingName: 'QCELP', mediaType: 'A', clockRate: 8000, channels: 1},
  13: {encodingName: 'CN', mediaType: 'A', clockRate: 8000, channels: 1},
  14: {encodingName: 'MPA', mediaType: 'A', clockRate: 90000},
  15: {encodingName: 'G728', mediaType: 'A', clockRate: 8000, channels: 1},
  16: {encodingName: 'DVI4', mediaType: 'A', clockRate: 11025, channels: 1},
  17: {encodingName: 'DVI4', mediaType: 'A', clockRate: 22050, channels: 1},
  18: {encodingName: 'G729', mediaType: 'A', clockRate: 8000, channels: 1},
  19: {encodingName: 'reserved', mediaType: 'A'},
  20: {encodingName: 'unassigned', mediaType: 'A'},
  21: {encodingName: 'unassigned', mediaType: 'A'},
  22: {encodingName: 'unassigned', mediaType: 'A'},
  23: {encodingName: 'unassigned', mediaType: 'A'},
  24: {encodingName: 'unassigned', mediaType: 'V'},
  25: {encodingName: 'CelB', mediaType: 'V', clockRate: 90000},
  26: {encodingName: 'JPEG', mediaType: 'V', clockRate: 90000},
  27: {encodingName: 'unassigned', mediaType: 'V'},
  28: {encodingName: 'nv', mediaType: 'V', clockRate: 90000},
  29: {encodingName: 'unassigned', mediaType: 'V'},
  30: {encodingName: 'unassigned', mediaType: 'V'},
  31: {encodingName: 'H261', mediaType: 'V', clockRate: 90000},
  32: {encodingName: 'MPV', mediaType: 'V', clockRate: 90000},
  33: {encodingName: 'MP2T', mediaType: 'AV', clockRate: 90000},
  34: {encodingName: 'H263', mediaType: 'V', clockRate: 90000},
  35: {encodingName: 'unassigned'},
  36: {encodingName: 'unassigned'},
  37: {encodingName: 'unassigned'},
  38: {encodingName: 'unassigned'},
  39: {encodingName: 'unassigned'},
  40: {encodingName: 'unassigned'},
  41: {encodingName: 'unassigned'},
  42: {encodingName: 'unassigned'},
  43: {encodingName: 'unassigned'},
  44: {encodingName: 'unassigned'},
  45: {encodingName: 'unassigned'},
  46: {encodingName: 'unassigned'},
  47: {encodingName: 'unassigned'},
  48: {encodingName: 'unassigned'},
  49: {encodingName: 'unassigned'},
  50: {encodingName: 'unassigned'},
  51: {encodingName: 'unassigned'},
  52: {encodingName: 'unassigned'},
  53: {encodingName: 'unassigned'},
  54: {encodingName: 'unassigned'},
  55: {encodingName: 'unassigned'},
  56: {encodingName: 'unassigned'},
  57: {encodingName: 'unassigned'},
  58: {encodingName: 'unassigned'},
  59: {encodingName: 'unassigned'},
  60: {encodingName: 'unassigned'},
  61: {encodingName: 'unassigned'},
  62: {encodingName: 'unassigned'},
  63: {encodingName: 'unassigned'},
  64: {encodingName: 'unassigned'},
  65: {encodingName: 'unassigned'},
  66: {encodingName: 'unassigned'},
  67: {encodingName: 'unassigned'},
  68: {encodingName: 'unassigned'},
  69: {encodingName: 'unassigned'},
  70: {encodingName: 'unassigned'},
  71: {encodingName: 'unassigned'},
  72: {encodingName: 'reserved'},
  73: {encodingName: 'reserved'},
  74: {encodingName: 'reserved'},
  75: {encodingName: 'reserved'},
  76: {encodingName: 'reserved'},
  77: {encodingName: 'unassigned'},
  78: {encodingName: 'unassigned'},
  79: {encodingName: 'unassigned'},
  80: {encodingName: 'unassigned'},
  81: {encodingName: 'unassigned'},
  82: {encodingName: 'unassigned'},
  83: {encodingName: 'unassigned'},
  84: {encodingName: 'unassigned'},
  85: {encodingName: 'unassigned'},
  86: {encodingName: 'unassigned'},
  87: {encodingName: 'unassigned'},
  88: {encodingName: 'unassigned'},
  89: {encodingName: 'unassigned'},
  90: {encodingName: 'unassigned'},
  91: {encodingName: 'unassigned'},
  92: {encodingName: 'unassigned'},
  93: {encodingName: 'unassigned'},
  94: {encodingName: 'unassigned'},
  95: {encodingName: 'unassigned'},
  96: {encodingName: 'dynamic'},
  97: {encodingName: 'dynamic'},
  98: {encodingName: 'dynamic'},
  99: {encodingName: 'dynamic'},
  100: {encodingName: 'dynamic'},
  101: {encodingName: 'dynamic'},
  102: {encodingName: 'dynamic'},
  103: {encodingName: 'dynamic'},
  104: {encodingName: 'dynamic'},
  105: {encodingName: 'dynamic'},
  106: {encodingName: 'dynamic'},
  107: {encodingName: 'dynamic'},
  108: {encodingName: 'dynamic'},
  109: {encodingName: 'dynamic'},
  110: {encodingName: 'dynamic'},
  111: {encodingName: 'dynamic'},
  112: {encodingName: 'dynamic'},
  113: {encodingName: 'dynamic'},
  114: {encodingName: 'dynamic'},
  115: {encodingName: 'dynamic'},
  116: {encodingName: 'dynamic'},
  117: {encodingName: 'dynamic'},
  118: {encodingName: 'dynamic'},
  119: {encodingName: 'dynamic'},
  120: {encodingName: 'dynamic'},
  121: {encodingName: 'dynamic'},
  122: {encodingName: 'dynamic'},
  123: {encodingName: 'dynamic'},
  124: {encodingName: 'dynamic'},
  125: {encodingName: 'dynamic'},
  126: {encodingName: 'dynamic'},
  127: {encodingName: 'dynamic'}
}

/**
 * @see https://www.rfc-editor.org/rfc/rfc3550
 */
export class RTPPacket {
  private buffer: Uint8Array;
  private reader: BitReader;
  constructor(buffer: Buffer) {
    this.buffer = buffer;
    this.reader = new BitReader(buffer);
  }

  /**
   * version indicates rtp version, mostly is 2
   */
  get version(): number {
    return this.reader.readBitRange(0,2);
  }

  /**
   * padding indicates rtp has extra bytes
   */
  get padding() {
    return this.reader.readBitRange(2,1);
  }
  get extension() {
    return this.reader.readBitRange(3,1);
  }
  get cc() {
    return this.reader.readBitRange(4,4);
  }
  get marker() {
    return this.reader.readBitRange(8, 1);
  }
  get payloadType() {
    return this.reader.readBitRange(9,7);
  }
  get sequenceNumber() {
    return this.reader.readBitRange(16, 16);
  }

  get timestamp() {
    return this.reader.readBitRange(32, 32);
  }

  get ssrc() {
    return this.reader.readBitRange(64, 32);
  }

  get csrc() {
    const csrc = [];
    for(let i = 0; i < this.cc; i++) {
      csrc.push(this.reader.readBitRange(96 + i * 32, 32));
    }
    return csrc;
  }

  get rtpExtension() {
    let headerExtension = null;
    if(this.extension) {
      const extensionType = this.reader.readBitRange(96 + this.cc * 32, 16);
      const extensionLength = this.reader.readBitRange(96 + this.cc * 32 + 16, 16);
      headerExtension = {
        type: extensionType,
        length: extensionLength,
        data: this.buffer.slice(
          (96 * this.cc * 32 + 16 + 16) % 8,
          (96 * this.cc * 32 + 16 + 16) % 8 + extensionLength
        ),
      };
    }
    return headerExtension;
  }

  get payload() {
    return this.buffer.slice(

    )
  }

}
