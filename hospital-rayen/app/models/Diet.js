export default class Diet {
  constructor(data) {
    Object.assign(this, data);
  }
  dietEntries(){
    return this.env().DietEntry.findAllBy('dietId', this.id);
  }
}