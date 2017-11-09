export default class Procedure {
  constructor(data) {
    Object.assign(this, data)
  }
  encounterEvent(){
    return this.env().EncounterEvent.getById(this.encounterEventId);
  }
  procedure() {
  	return this.env().Procedure.getById(this.procedureId);
  }
  role() {
  	return this.env().Role.getById(this.healthCarePractitionerRoleId);
  }
}
