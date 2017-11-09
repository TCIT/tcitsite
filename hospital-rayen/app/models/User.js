export default class User {
  constructor(data) {
    Object.assign(this, data)
  }
  sessions() {
  	return this.env().Session.findAllBy('userId', this.id);
  }
  name() {
  	return `Dr. ${this.firstGivenName} ${this.firstFamilyName}`;
  }
}
