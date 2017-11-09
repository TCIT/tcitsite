export default class Encounter {
  constructor(data) {
    Object.assign(this, data);
    if (!this.patientId) {
      this.patientId = this.patient;
    }
    if (this.patient) {
      delete this.patient;
    }
    if (this.encounterEvent) {
      delete this.encounterEvent;
    }
  }
  patient(){
  	return this.env().Patient.getById(this.patientId);
  }
  practitioner(){
  	return this.env().User.getById(this.assignedHealthCarePractitionerId);
  }
  encounterEvents() {
    return this.env().EncounterEvent.findAllBy('encounterId', this.id);
  }
}
