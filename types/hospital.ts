import { MeasureType } from "./measures";

export const ServiceLevel = {
  "Below the national average": "Below the national average",
  "Same as the national average": "Same as the national average",
  "Above the national average": "Above the national average",
  "Not Available": "Not Available",
} as const;
export type ServiceLevel = keyof typeof ServiceLevel;

export type Hospital = Record<MeasureType, number | undefined> & {
  id: string;
  facilityName: string;
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
  emergencyServices: "Yes" | "No";
  meetsCriteriaForPromotingInteroperabilityOfEhrs: "Y" | "";
  hospitalOverallRating: number | undefined;
  mortalityNationalComparison: ServiceLevel;
  safetyOfCareNationalComparison: ServiceLevel;
  readmissionNationalComparison: ServiceLevel;
  patientExperienceNationalComparison: ServiceLevel;
  effectivenessOfCareNationalComparison: ServiceLevel;
  timelinessOfCareNationalComparison: ServiceLevel;
  efficientUseOfMedicalImagingNationalComparison: ServiceLevel;
  lat: number;
  lon: number;
};
