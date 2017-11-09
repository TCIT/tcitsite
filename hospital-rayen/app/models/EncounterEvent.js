export default class EncounterEvent {
  constructor(data) {
    Object.assign(this, data);
    if (this.observationEntry) {
      delete this.observationEntry;
    }
    if (this.nutritionOrderEntry) {
      delete this.nutritionOrderEntry;
    }
    if (this.restEntry) {
      delete this.restEntry;
    }
    if (this.procedureEntry !== undefined) {
      delete this.procedureEntry;
    }
  }
  encounter(){
    return this.env().Encounter.getById(this.encounterId);
  }
  observationEntry(){
    return this.env().ObservationEntry.findBy('encounterEventId', this.id);
  }
  restEntry(){
    return this.env().RestEntry.findBy('encounterEventId', this.id);
  }
  dietEntry(){
    return this.env().DietEntry.findBy('encounterEventId', this.id);
  }
  procedureEntries(){
    return this.env().ProcedureEntry.findAllBy('encounterEventId', this.id);
  }
  medicationRequestEntries(){
    return this.env().MedicationRequestEntry.findAllBy('encounterEventId', this.id);
  }
  medicationDilutionEntries(){
    return this.env().MedicationDilutionEntry.findAllBy('encounterEventId', this.id);
  }
  medicationAlternativeEntries(){
    return this.env().MedicationAlternativeEntry.findAllBy('encounterEventId', this.id);
  }
  alertEntries(){
    return this.env().AlertEntry.findAllBy('encounterEventId', this.id);
  }
  diagnosisEntries(){
    return this.env().DiagnosisEntry.findAllBy('encounterEventId', this.id);
  }
  referralEntries(){
    return this.env().ReferralEntry.findAllBy('encounterEventId', this.id);
  }
  shiftCHangeEntries(){
    return this.env().ShiftChangeEntry.findAllBy('encounterEventId', this.id);
  }
  practitioner(){
    return this.env().User.getById(this.healthCarePractitionerId);
  }
}