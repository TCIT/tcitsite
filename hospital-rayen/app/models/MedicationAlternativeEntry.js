export default class MedicationAlternativeEntry {
  constructor(data) {
    Object.assign(this, data);
    delete this.routeAdministration;
  }
  encounterEvent(){
    return this.env().EncounterEvent.getById(this.encounterEventId);
  }
  routeAdministration() {
  	return this.env().RouteAdministration.getById(this.routeAdministrationId);
  }
}