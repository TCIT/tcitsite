export default class VirtualMedicalProduct {
  constructor(data) {
    Object.assign(this, data);
  }
  medicationDilutionEntries(){
    return this.env().MedicationDilutionEntry.findALlBy('virtualMedicalProductId', this.id);
  }
  medicationRequestEntries(){
    return this.env().MedicationRequestEntry.findALlBy('virtualMedicalProductId', this.id);
  }
}