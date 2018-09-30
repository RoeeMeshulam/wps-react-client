import Input from "../ProcessForm/Input";

function S4() {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}
function idGenerator() {
  return S4() + S4();
}

export class QueryRecord {
  constructor(
    wpsServerPath,
    precessIdentifier,
    title,
    inputs,
    outputs,
    status,
    timestamp = new Date().getTime(),
    _query_id = idGenerator()
  ) {
    this.wpsServerPath = wpsServerPath;
    this.precessIdentifier = precessIdentifier;
    this.title = title;
    this.inputs = inputs;
    this.outputs = outputs;
    this.status = status;
    this.timestamp = timestamp;
    this.queryId = _query_id;
  }

  static fromObject(obj) {
    const {
      wpsServerPath,
      precessIdentifier,
      title,
      inputs,
      outputs,
      status,
      timestamp,
      queryId
    } = obj;
    return new QueryRecord(
      wpsServerPath,
      precessIdentifier,
      title,
      inputs.map(input => Object.assign(new Input(), input)),
      outputs,
      status,
      timestamp,
      queryId
    );
  }
}

export const Statuses = {
  SUCCESS: 0,
  FAIL: 1,
  RUNNING: 2,
  SAVE_WITHOUT_RUN: 3
};
