export default class DietEntry {
  constructor(data) {
    Object.assign(this, data);
  }
  encounterEvent(){
    return this.env().EncounterEvent.getById(this.encounterEventId);
  }
  diet() {
  	return this.env().Diet.getById(this.dietId);
  }
}