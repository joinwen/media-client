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
  0: {name: 'PCMU', mediaType: 'A', clockRate: 8000, channels: 1},
  1: {name: 'reserved', mediaType: 'A'},
  2: {name: 'reserved', mediaType: 'A'},
  3: {name: 'GSM' , mediaType: 'A', clockRate: 8000, channels: 1},
  4: {name: 'G723', mediaType: 'A', clockRate: 8000, channels: 1},
  5: {name: 'DVI4', mediaType: 'A', clockRate: 8000, channels: 1},
  6: {name: 'DVI4', mediaType: 'A', clockRate: 16000, channels: 1},
  7: {name: 'LPC', mediaType: 'A', clockRate: 8000, channels: 1},
  8: {name: 'PCMA', mediaType: 'A', clockRate: 8000, channels: 1},
  9: {name: 'G722', mediaType: 'A', clockRate: 8000, channels: 1},
  10: {name: 'L16', mediaType: 'A', clockRate: 44100, channels: 2},
  11: {name: 'L16', mediaType: 'A', clockRate: 44100, channels: 1},
  12: {name: 'QCELP', mediaType: 'A', clockRate: 8000, channels: 1},
  13: {name: 'CN', mediaType: 'A', clockRate: 8000, channels: 1},
  14: {name: 'MPA', mediaType: 'A', clockRate: 90000},
  15: {name: 'G728', mediaType: 'A', clockRate: 8000, channels: 1},
  16: {name: 'DVI4', mediaType: 'A', clockRate: 11025, channels: 1},
  17: {name: 'DVI4', mediaType: 'A', clockRate: 22050, channels: 1},
  18: {name: 'G729', mediaType: 'A', clockRate: 8000, channels: 1},
  19: {name: 'reserved', mediaType: 'A'},
  20: {name: 'unassigned', mediaType: 'A'},
  21: {name: 'unassigned', mediaType: 'A'},
  22: {name: 'unassigned', mediaType: 'A'},
  23: {name: 'unassigned', mediaType: 'A'},
  24: {name: 'unassigned', mediaType: 'V'},
  25: {name: 'CelB', mediaType: 'V', clockRate: 90000},
  26: {name: 'JPEG', mediaType: 'V', clockRate: 90000},
  27: {name: 'unassigned', mediaType: 'V'},
  28: {name: 'nv', mediaType: 'V', clockRate: 90000},
  29: {name: 'unassigned', mediaType: 'V'},
  30: {name: 'unassigned', mediaType: 'V'},
  31: {name: 'H261', mediaType: 'V', clockRate: 90000},
  32: {name: 'MPV', mediaType: 'V', clockRate: 90000},
  33: {name: 'MP2T', mediaType: 'AV', clockRate: 90000},
  34: {name: 'H263', mediaType: 'V', clockRate: 90000},
  35: {name: 'unassigned'},
  36: {name: 'unassigned'},
  37: {name: 'unassigned'},
  38: {name: 'unassigned'},
  39: {name: 'unassigned'},
  40: {name: 'unassigned'},
  41: {name: 'unassigned'},
  42: {name: 'unassigned'},
  43: {name: 'unassigned'},
  44: {name: 'unassigned'},
  45: {name: 'unassigned'},
  46: {name: 'unassigned'},
  47: {name: 'unassigned'},
  48: {name: 'unassigned'},
  49: {name: 'unassigned'},
  50: {name: 'unassigned'},
  51: {name: 'unassigned'},
  52: {name: 'unassigned'},
  53: {name: 'unassigned'},
  54: {name: 'unassigned'},
  55: {name: 'unassigned'},
  56: {name: 'unassigned'},
  57: {name: 'unassigned'},
  58: {name: 'unassigned'},
  59: {name: 'unassigned'},
  60: {name: 'unassigned'},
  61: {name: 'unassigned'},
  62: {name: 'unassigned'},
  63: {name: 'unassigned'},
  64: {name: 'unassigned'},
  65: {name: 'unassigned'},
  66: {name: 'unassigned'},
  67: {name: 'unassigned'},
  68: {name: 'unassigned'},
  69: {name: 'unassigned'},
  70: {name: 'unassigned'},
  71: {name: 'unassigned'},
  72: {name: 'reserved'},
  73: {name: 'reserved'},
  74: {name: 'reserved'},
  75: {name: 'reserved'},
  76: {name: 'reserved'},
  77: {name: 'unassigned'},
  78: {name: 'unassigned'},
  79: {name: 'unassigned'},
  80: {name: 'unassigned'},
  81: {name: 'unassigned'},
  82: {name: 'unassigned'},
  83: {name: 'unassigned'},
  84: {name: 'unassigned'},
  85: {name: 'unassigned'},
  86: {name: 'unassigned'},
  87: {name: 'unassigned'},
  88: {name: 'unassigned'},
  89: {name: 'unassigned'},
  90: {name: 'unassigned'},
  91: {name: 'unassigned'},
  92: {name: 'unassigned'},
  93: {name: 'unassigned'},
  94: {name: 'unassigned'},
  95: {name: 'unassigned'},
  96: {name: 'dynamic'},
  97: {name: 'dynamic'},
  98: {name: 'dynamic'},
  99: {name: 'dynamic'},
  100: {name: 'dynamic'},
  101: {name: 'dynamic'},
  102: {name: 'dynamic'},
  103: {name: 'dynamic'},
  104: {name: 'dynamic'},
  105: {name: 'dynamic'},
  106: {name: 'dynamic'},
  107: {name: 'dynamic'},
  108: {name: 'dynamic'},
  109: {name: 'dynamic'},
  110: {name: 'dynamic'},
  111: {name: 'dynamic'},
  112: {name: 'dynamic'},
  113: {name: 'dynamic'},
  114: {name: 'dynamic'},
  115: {name: 'dynamic'},
  116: {name: 'dynamic'},
  117: {name: 'dynamic'},
  118: {name: 'dynamic'},
  119: {name: 'dynamic'},
  120: {name: 'dynamic'},
  121: {name: 'dynamic'},
  122: {name: 'dynamic'},
  123: {name: 'dynamic'},
  124: {name: 'dynamic'},
  125: {name: 'dynamic'},
  126: {name: 'dynamic'},
  127: {name: 'dynamic'}
}
export class RTPPackage {
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
