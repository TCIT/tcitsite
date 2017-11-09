import { schema } from 'normalizr';


const patientSchema = new schema.Entity('patients', {});
const encountersSchema = new schema.Entity('encounters', {patient: patientSchema});
export default new schema.Array(encountersSchema);
