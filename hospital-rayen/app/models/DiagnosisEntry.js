import React from 'react';
export default class DiagnosisEntry {
  constructor(data) {
    Object.assign(this, data);
  }
  encounterEvent(){
    return this.env().EncounterEvent.getById(this.encounterEventId);
  }
  diagnosis() {
  	return this.env().Diagnosis.getById(this.diagnosisClassifyId);
  }
  diagnosisState() {
  	return this.env().DiagnosisState.getById(this.diagnosisEntryStateId);
  }
  name() {
    const diagnosis = this.diagnosis();
    return <div>
      <div>{diagnosis.name}</div>
      <div style={{color: 'lightGray'}}>{diagnosis.standarCode}: {this.description} </div>
    </div>;
  }
}