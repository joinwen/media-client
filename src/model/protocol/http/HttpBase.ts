export class HttpBase {
  parse(str: string):unknown {
    throw "You should implemented this method by your sub class";
  }
  stringify(){
    throw "You should implemented this method by your sub class";
  }
}
