export default class ReferralPriority {
  constructor(data) {
    Object.assign(this, data);
  }
  referralEntry(){
    return this.env().ReferralEntry.getById(this.referralRequestPriorityId);
  }
}