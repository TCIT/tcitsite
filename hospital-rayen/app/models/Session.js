export default class Session {
  constructor(data) {
    Object.assign(this, data)
  }
  user() {
  	return this.env().User.getById(this.userId);
  }
  facility() {
  	return this.env().Facility.getById(this.facilityId);
  }
  practitioner() {
    return this.env().Practitioner.getById(this.practitionerId);
  }
  role() {
  	return this.env().Role.getById(this.roleId);
  }

}
