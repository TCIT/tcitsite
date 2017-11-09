export default class ReferralEntry {
  constructor(data) {
    Object.assign(this, data);
  }
  encounterEvent(){
    return this.env().EncounterEvent.getById(this.encounterEventId);
  }
  role() {
  	return this.env().Role.getById(this.healthCarePractitionerRoleId);
  }
}