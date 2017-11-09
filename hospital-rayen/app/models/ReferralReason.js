export default class ReferralReason {
  constructor(data) {
    Object.assign(this, data);
  }
  referralEntry(){
    return this.env().ReferralEntry.getById(this.referralRequestReasonId);
  }
}