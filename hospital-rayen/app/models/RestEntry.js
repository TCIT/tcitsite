export default class RestEntry {
  constructor(data) {
    Object.assign(this, data);
  }
  encounterEvent(){
    return this.env().EncounterEvent.getById(this.encounterEventId);
  }
  rest() {
  	return this.env().Rest.getById(this.restId);
  }
}