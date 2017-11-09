export default class MedicationDilutionEntry {
  constructor(data) {
    Object.assign(this, data);
    delete this.virtualMedicalProduct;
  }
  encounterEvent(){
    return this.env().EncounterEvent.getById(this.encounterEventId);
  }
  virtualMedicalProducts() {
    return this.medicationDilutionRequestEntryDetail.map((detail) =>this.env().VirtualMedicalProduct.getById(detail.virtualMedicalProductId));
  }
}