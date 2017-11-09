export default class MedicationRequestEntry {
  constructor(data) {
    Object.assign(this, data);
    delete this.virtualMedicalProduct;
    delete this.routeAdministration;
  }
  encounterEvent(){
    return this.env().EncounterEvent.getById(this.encounterEventId);
  }
  virtualMedicalProduct() {
  	return this.env().VirtualMedicalProduct.getById(this.virtualMedicalProductId);
  }
}