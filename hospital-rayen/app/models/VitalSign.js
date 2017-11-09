export default class VitalSign {
  constructor(data) {
    Object.assign(this, data);
  }
  drugEntries(){
    return this.env().DrugEntry.findALlBy('drugId', this.id);
  }
}