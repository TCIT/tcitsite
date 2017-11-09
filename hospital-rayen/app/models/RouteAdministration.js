export default class RouteAdministration {
  constructor(data) {
    Object.assign(this, data);
  }
  medicationAlternativeEntries(){
    return this.env().MedicationAlternativeEntry.findALlBy('routeAdministrationId', this.id);
  }
}