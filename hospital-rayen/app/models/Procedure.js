export default class Procedure {
  constructor(data) {
    Object.assign(this, data)
  }
  proceduresEntries(){
    return this.env().ProcedureEntry.findALlBy('procedureId', this.id);
  }
}
