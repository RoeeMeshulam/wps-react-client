export default class Input {
  constructor(id, type, title, abstract, minOccurs, maxOccurs, values = []) {
    this.id = id;
    this.type = type;
    this.title = title;
    this.abstract = abstract;
    this.minOccurs = minOccurs;
    this.maxOccurs = maxOccurs;
    this.values = values;
  }
}
