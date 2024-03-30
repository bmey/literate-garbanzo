import { Hospital } from "@/types/hospital";
import React from "react";
import { Popup } from "react-map-gl";

export default function HospitalTooltip({
  hospital,
  onClose,
}: {
  hospital: Hospital;
  onClose: VoidFunction;
}) {
  return (
    <Popup
      anchor="top"
      longitude={hospital.lon}
      latitude={hospital.lat}
      onClose={onClose}
    >
      <div className="text-slate-800 grid grid-cols-2 text-xs">
        <div className="text-slate-600">Name:</div>
        <div>{hospital.name}</div>
        <div className="text-slate-600">Location:</div>
        <div>
          {hospital.city}, {hospital.state}
        </div>
        {/* <div className="text-slate-600">Survey response rate:</div><div>{facility.surveyResponseRatePercent}</div>
            <div className="text-slate-600">Hospital type:</div><div>{facility.hospitalType}</div>
            <div className="text-slate-600">Hospital ownership:</div><div>{facility.hospitalOwnership}</div>
            <div className="text-slate-600">Emergency services?</div><div>{facility.emergencyServices}</div>
            <div className="text-slate-600">EHRS?</div><div>{facility.meetsCriteriaForPromotingInteroperabilityOfEhrs}</div> */}
        <div className="text-slate-600">Overall rating:</div>
        <div>{hospital.hospitalOverallRating || "-"}</div>
        <div className="text-slate-600">Star rating:</div>
        <div>{hospital.H_STAR_RATING || "-"}</div>
        {/* <div className="text-slate-600">Mortality:</div><div>{facility.mortalityNationalComparison}</div>
            <div className="text-slate-600">Safety of care:</div><div>{facility.safetyOfCareNationalComparison}</div>
            <div className="text-slate-600">Readmission:</div><div>{facility.readmissionNationalComparison}</div>
            <div className="text-slate-600">Patient experience:</div><div>{facility.patientExperienceNationalComparison}</div>
            <div className="text-slate-600">Effectiveness:</div><div>{facility.effectivenessOfCareNationalComparison}</div>
            <div className="text-slate-600">Timeliness:</div><div>{facility.timelinessOfCareNationalComparison}</div>
            <div className="text-slate-600">Medical imaging:</div><div>{facility.efficientUseOfMedicalImagingNationalComparison}</div> */}
      </div>
    </Popup>
  );
}
