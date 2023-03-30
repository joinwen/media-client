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
// 10010101
export class RTPPackage {
  private buffer: Uint8Array;
  constructor(buffer: Uint8Array) {
    this.buffer = buffer;
  }

  /**
   * version indicates rtp version, mostly is 2
   */
  set version(number) {

  }
  get version(): number {
    const firstByte = this.buffer[0];
    return (firstByte >> 6);
  }

  /**
   * padding indicates rtp has extra bytes
   */
  set padding() {

  }
  get padding() {

  }
  set extension() {

  }
  get extension() {

  }
  set cc() {

  }
  get cc() {

  }
  get marker() {

  }
  set marker() {

  }
  get payloadType() {

  }
  set payloadType() {

  }
  get sequenceNumber() {

  }
  set sequenceNumber() {

  }
  get timestamp() {

  }
  set timestamp() {

  }
  get ssrc() {

  }
  set ssrc() {

  }
  get csrc() {

  }
  set csrc() {

  }
  get rtpExtension() {

  }
  set rtpExtension() {

  }
  get payload() {

  }
  set payload() {

  }
}
