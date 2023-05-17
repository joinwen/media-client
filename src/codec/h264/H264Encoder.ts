class YUVToH264 {
  private width: number;
  private height: number;
  private widthMB: number;
  private heightMB: number;
  private spsHeader: any;
  private ppsHeader: any;
  private sliceHeader: any;
  constructor(format: {
    width: number,
    height: number
  }) {
    this.width = format.width;
    this.height = format.height;
    this.widthMB = Math.ceil(this.width / 16);
    this.heightMB = Math.ceil(this.height / 16);
    this.spsHeader = generateSPS(format);
    this.ppsHeader = generatePPS(format);
    this.sliceHeader = generateSliceHeader(format);
  }
  sps() {
    return this.spsHeader;
  }
  pps() {
    return this.ppsHeader;
  }
}

function generateSPS(format: {width: number, height: number}) {

}
function generatePPS(format: {width: number, height: number}) {

}
function generateSliceHeader(format: {width: number, height: number}) {
  
}
