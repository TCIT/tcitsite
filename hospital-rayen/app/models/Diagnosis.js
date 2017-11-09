export default class Diagnosis {
  constructor(data) {
    Object.assign(this, data);
  }
  diagnosisEntries(){
    return this.env().DiagnosisEntry.findAllBy('diagnosisEntryStateId', this.id);
  }
}