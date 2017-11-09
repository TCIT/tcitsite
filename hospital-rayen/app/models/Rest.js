export default class Rest {
  constructor(data) {
    Object.assign(this, data);
  }
  restEntries(){
    return this.env().RestEntry.findAllBy('restId', this.id);
  }
}