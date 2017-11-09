export default (activeSession) => [
  { name: "diagnoses", path: "/core/diagnosisClassify", tidLabel: "timestamp", inMemory: false },
  { name: "virtualMedicalProducts", path: `/core/facility/${activeSession.facilityId}/virtualMedicalProduct`, tidLabel: "timestamp", inMemory: false },
  { name: "roles", path: '/core/healthCarePractitionerRole', tidLabel: "timestamp", inMemory: false },
  { name: "routeAdministrations", path: '/core/routeAdministration', tidLabel: "timestamp", inMemory: false },
  { name: "procedures", path: '/core/procedure', tidLabel: "timestamp", inMemory: false },
  { name: "rests", path: '/core/rest', tidLabel: "timestamp", inMemory: false },
  { name: "diets", path: '/core/diet', tidLabel: "timestamp", inMemory: false },
  { name: "referralPriorities", path: '/core/referralRequestPriority', tidLabel: "timestamp", inMemory: false },
  { name: "referralReasons", path: '/core/referralRequestReason', tidLabel: "timestamp", inMemory: false },
  { name: "diagnosisStates", path: '/core/diagnosisEntryStatus', tidLabel: "timestamp", inMemory: false },
  { name: "healthProblems", path: '/core/healthProblem', tidLabel: "timestamp", inMemory: false },
];