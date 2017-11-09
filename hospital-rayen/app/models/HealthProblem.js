export default class DiagnosisState {
  constructor(data) {
    Object.assign(this, data);
  }
  diagnosisEntries(){
    return this.env().DiagnosisEntry.findAllBy('diagnosisId', this.id);
  }
}