export default class HealthProblem {
  constructor(data) {
    Object.assign(this, data);
  }
  diagnosisEntries(){
    return this.env().DiagnosisEntry.findAllBy('healthProblemId', this.id);
  }
}