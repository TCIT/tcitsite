export default class Facility {
  constructor(data) {
    Object.assign(this, data)
  }
  sessions() {
  	return this.env().Session.findAllBy('facilityId', this.id);
  }
}
