/**
 * @see https://www.rfc-editor.org/rfc/rfc2616
 */
export class HttpPacket {
  parse(str: string):unknown {
    throw "You should implemented this method by your sub class";
  }
  stringify(){
    throw "You should implemented this method by your sub class";
  }
}
