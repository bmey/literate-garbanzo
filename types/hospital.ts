import { MeasureType } from "./measures";

export type Hospital = Record<MeasureType, number | undefined> & {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  countyName: string;
  phoneNumber: string;
  numberOfCompletedSurveys: number | undefined;
  surveyResponseRatePercent: number | undefined;
  hospitalType: string;
  hospitalOwnership: string;
  emergencyServices: string;
  meetsCriteriaForPromotingInteroperabilityOfEhrs: string;
  hospitalOverallRating: number | undefined;
  mortalityNationalComparison: string;
  safetyOfCareNationalComparison: string;
  readmissionNationalComparison: string;
  patientExperienceNationalComparison: string;
  effectivenessOfCareNationalComparison: string;
  timelinessOfCareNationalComparison: string;
  efficientUseOfMedicalImagingNationalComparison: string;
  lat: number;
  lon: number;
};
