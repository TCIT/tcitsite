import { schema } from 'normalizr';

// Entries
const observationSchema = new schema.Entity('observationEntries', {});
const dietSchema = new schema.Entity('dietEntries', {});
const restSchema = new schema.Entity('restEntries', {});
const procedureSchema = new schema.Entity('procedureEntries', {});
const medicationRequestSchema = new schema.Entity('medicationRequestEntries', {});
const medicationDilutionSchema = new schema.Entity('medicationDilutionEntries', {});
const medicationAlternativeSchema = new schema.Entity('medicationAlternativeEntries', {});
const alertSchema = new schema.Entity('alertEntries', {});
const diagnosisSchema = new schema.Entity('diagnosisEntries', {});
const referralSchema = new schema.Entity('referralEntries', {});
const shiftChangeSchema = new schema.Entity('shiftChangeEntries', {});
const userSchema = new schema.Entity('users', {});
const encounterEventsSchema = new schema.Entity('encounterEvents', 
	{
    observationEntry: new schema.Array(observationSchema),
	nutritionOrderEntry: new schema.Array(dietSchema),
	medicationRequestEntry: new schema.Array(medicationRequestSchema),
	medicationDilutionRequestEntry: new schema.Array(medicationDilutionSchema),
	alternativeMedicationRequestEntry: new schema.Array(medicationAlternativeSchema),
    restEntry: new schema.Array(restSchema),
    procedureEntry: new schema.Array(procedureSchema),
    alertEntry: new schema.Array(alertSchema),
    diagnosisEntry: new schema.Array(diagnosisSchema),
    referralRequestEntry: new schema.Array(referralSchema),
    shiftChangeEntry: new schema.Array(shiftChangeSchema),
    healthCarePractitionerInfo: userSchema
  });
const patientSchema = new schema.Entity('patients', {});
const encounterSchema = new schema.Entity('encounters', {patient: patientSchema, encounterEvent: new schema.Array(encounterEventsSchema)});
export default encounterSchema;
