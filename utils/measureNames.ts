import { MeasureType } from "@/types/measures";

export const measureNames: Record<MeasureType, string> = {
  H_COMP_1_A_P: "Nurses always communicated well",
  H_COMP_1_SN_P: "Nurses sometimes or never communicated well",
  H_COMP_1_U_P: "Nurses usually communicated well",
  H_COMP_1_LINEAR_SCORE: "Nurse communication - linear mean score",
  H_COMP_1_STAR_RATING: "Nurse communication - star rating",
  H_NURSE_RESPECT_A_P: "Nurses always treated them with courtesy and  respect",
  H_NURSE_RESPECT_SN_P:
    "Nurses sometimes or never treated them with courtesy and  respect",
  H_NURSE_RESPECT_U_P:
    "Nurses usually  treated them with courtesy and  respect",
  H_NURSE_LISTEN_A_P: "Nurses always listened carefully",
  H_NURSE_LISTEN_SN_P: "Nurses sometimes or never listened carefully",
  H_NURSE_LISTEN_U_P: "Nurses usually listened carefully",
  H_NURSE_EXPLAIN_A_P:
    "Nurses always explained things so they could understand",
  H_NURSE_EXPLAIN_SN_P:
    "Nurses sometimes or never explained things so they could understand",
  H_NURSE_EXPLAIN_U_P:
    "Nurses usually explained things so they could understand",
  H_COMP_2_A_P: "Doctors always communicated well",
  H_COMP_2_SN_P: "Doctors sometimes or never communicated well",
  H_COMP_2_U_P: "Doctors usually communicated well",
  H_COMP_2_LINEAR_SCORE: "Doctor communication - linear mean score",
  H_COMP_2_STAR_RATING: "Doctor communication - star rating",
  H_DOCTOR_RESPECT_A_P:
    "Doctors always treated them with courtesy and  respect",
  H_DOCTOR_RESPECT_SN_P:
    "Doctors sometimes or never treated them with courtesy and  respect",
  H_DOCTOR_RESPECT_U_P:
    "Doctors usually  treated them with courtesy and  respect",
  H_DOCTOR_LISTEN_A_P: "Doctors always listened carefully",
  H_DOCTOR_LISTEN_SN_P: "Doctors sometimes or never listened carefully",
  H_DOCTOR_LISTEN_U_P: "Doctors usually listened carefully",
  H_DOCTOR_EXPLAIN_A_P:
    "Doctors always explained things so they could understand",
  H_DOCTOR_EXPLAIN_SN_P:
    "Doctors sometimes or never explained things so they could understand",
  H_DOCTOR_EXPLAIN_U_P:
    "Doctors usually explained things so they could understand",
  H_COMP_3_A_P: "Patients always received help as soon as they wanted",
  H_COMP_3_SN_P:
    "Patients sometimes or never received help as soon as they wanted",
  H_COMP_3_U_P: "Patients usually received help as soon as they wanted",
  H_COMP_3_LINEAR_SCORE: "Staff responsiveness - linear mean score",
  H_COMP_3_STAR_RATING: "Staff responsiveness - star rating",
  H_CALL_BUTTON_A_P:
    "Patients always received call button help as soon as they wanted",
  H_CALL_BUTTON_SN_P:
    "Patients sometimes or never received call button help as soon as they wanted",
  H_CALL_BUTTON_U_P:
    "Patients usually received call button help as soon as they wanted",
  H_BATH_HELP_A_P:
    "Patients always received bathroom help as soon as they wanted",
  H_BATH_HELP_SN_P:
    "Patients sometimes or never received bathroom help as soon as they wanted",
  H_BATH_HELP_U_P:
    "Patients usually received bathroom help as soon as they wanted",
  H_COMP_5_A_P: "Staff always explained",
  H_COMP_5_SN_P: "Staff sometimes or never explained",
  H_COMP_5_U_P: "Staff usually explained",
  H_COMP_5_LINEAR_SCORE: "Communication about medicines - linear mean score",
  H_COMP_5_STAR_RATING: "Communication about medicines - star rating",
  H_MED_FOR_A_P: "Staff always explained new medications",
  H_MED_FOR_SN_P: "Staff sometimes or never explained new medications",
  H_MED_FOR_U_P: "Staff usually explained new medications",
  H_SIDE_EFFECTS_A_P: "Staff always explained possible side effects",
  H_SIDE_EFFECTS_SN_P:
    "Staff sometimes or never explained possible side effects",
  H_SIDE_EFFECTS_U_P: "Staff usually explained possible side effects",
  H_COMP_6_N_P: "No staff did not give patients this information",
  H_COMP_6_Y_P: "Yes staff did give patients this information",
  H_COMP_6_LINEAR_SCORE: "Discharge information - linear mean score",
  H_COMP_6_STAR_RATING: "Discharge information - star rating",
  H_DISCH_HELP_N_P:
    "No staff did not give patients information about help after discharge",
  H_DISCH_HELP_Y_P:
    "Yes staff did give patients information about help after discharge",
  H_SYMPTOMS_N_P:
    "No staff did not give patients information about possible symptoms",
  H_SYMPTOMS_Y_P:
    "Yes staff did give patients information about possible symptoms",
  H_COMP_7_A:
    "Patients who Agree they understood their care when they left the hospital",
  H_COMP_7_D_SD:
    "Patients who Disagree or Strongly Disagree they understood their care when they left the hospital",
  H_COMP_7_SA:
    "Patients who Strongly Agree they understood their care when they left the hospital",
  H_COMP_7_LINEAR_SCORE: "Care transition - linear mean score",
  H_COMP_7_STAR_RATING: "Care transition - star rating",
  H_CT_PREFER_A:
    "Patients who Agree that staff took their preferences into account",
  H_CT_PREFER_D_SD:
    "Patients who Disagree or Strongly Disagree that staff took their preferences into account",
  H_CT_PREFER_SA:
    "Patients who Strongly Agree that staff took their preferences into account",
  H_CT_UNDER_A:
    "Patients who Agree they understood their responsiblities when they left the hospital",
  H_CT_UNDER_D_SD:
    "Patients who Disagree or Strongly Disagree they understood their responsiblities when they left the hospital",
  H_CT_UNDER_SA:
    "Patients who Strongly Agree they understood their responsiblities when they left the hospital",
  H_CT_MED_A:
    "Patients who Agree they understood their medications when they left the hospital",
  H_CT_MED_D_SD:
    "Patients who Disagree or Strongly Disagree they understood their medications when they left the hospital",
  H_CT_MED_SA:
    "Patients who Strongly Agree they understood their medications when they left the hospital",
  H_CLEAN_HSP_A_P: "Room was always clean",
  H_CLEAN_HSP_SN_P: "Room was sometimes or never clean",
  H_CLEAN_HSP_U_P: "Room was usually clean",
  H_CLEAN_LINEAR_SCORE: "Cleanliness - linear mean score",
  H_CLEAN_STAR_RATING: "Cleanliness - star rating",
  H_QUIET_HSP_A_P: "Always quiet at night",
  H_QUIET_HSP_SN_P: "Sometimes or never quiet at night",
  H_QUIET_HSP_U_P: "Usually quiet at night",
  H_QUIET_LINEAR_SCORE: "Quietness - linear mean score",
  H_QUIET_STAR_RATING: "Quietness - star rating",
  H_HSP_RATING_0_6: "Patients who gave a rating of 6 or lower (low)",
  H_HSP_RATING_7_8: "Patients who gave a rating of 7 or 8 (medium)",
  H_HSP_RATING_9_10: "Patients who gave a rating of 9 or 10 (high)",
  H_HSP_RATING_LINEAR_SCORE: "Overall hospital rating - linear mean score",
  H_HSP_RATING_STAR_RATING: "Overall hospital rating - star rating",
  H_RECMND_DN:
    "NO patients would not recommend the hospital (they probably would not or definitely would not recommend it)",
  H_RECMND_DY: "YES patients would definitely recommend the hospital",
  H_RECMND_PY: "YES patients would probably recommend the hospital",
  H_RECMND_LINEAR_SCORE: "Recommend hospital - linear mean score",
  H_RECMND_STAR_RATING: "Recommend hospital - star rating",
  H_STAR_RATING: "Summary star rating",
};
