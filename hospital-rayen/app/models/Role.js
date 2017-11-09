export default class Role {
  constructor(data) {
    Object.assign(this, data)
  }
  sessions() {
  	return this.env().Session.findAllBy('roleId', this.id);
  }
}
