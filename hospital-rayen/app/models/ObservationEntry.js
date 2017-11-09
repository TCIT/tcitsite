export default class ObservationEntry {
  constructor(data) {
    Object.assign(this, data);
  }
  encounterEvent(){
    return this.env().EncounterEvent.getById(this.encounterEventId);
  }
}