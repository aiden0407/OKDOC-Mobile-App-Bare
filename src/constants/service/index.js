//POLICY
import THIRD_PARTY from "constants/service/THIRD_PARTY.js";
import REFUND from "constants/service/REFUND.js";
import BUSINESS from "constants/service/BUSINESS.js";

//symptoms icons
import fluIcon from "assets/icons/symptoms/flu.png";
import headacheIcon from "assets/icons/symptoms/headache.png";
import highFeverIcon from "assets/icons/symptoms/high-fever.png";
import stomachacheIcon from "assets/icons/symptoms/stomachache.png";
import indigestionIcon from "assets/icons/symptoms/indigestion.png";
import acheIcon from "assets/icons/symptoms/ache.png";
import chillIcon from "assets/icons/symptoms/chill.png";
import constipationIcon from "assets/icons/symptoms/constipation.png";
import diarrheaIcon from "assets/icons/symptoms/diarrhea.png";
import heartburnIcon from "assets/icons/symptoms/heartburn.png";
import muscularPainIcon from "assets/icons/symptoms/muscular-pain.png";
import arthralgiaIcon from "assets/icons/symptoms/arthralgia.png";

//medical-subjects icons
import internalMedicineIcon from "assets/icons/medical-subjects/internal-medicine.png";
import internalMedicineIcon2 from "assets/icons/medical-subjects/internal-medicine2.png";
import otolaryngologyIcon from "assets/icons/medical-subjects/otolaryngology.png";
import surgeryIcon from "assets/icons/medical-subjects/surgery.png";
import dentistryIcon from "assets/icons/medical-subjects/dentistry.png";
import pediatryIcon from "assets/icons/medical-subjects/pediatry.png";
import gynecologyIcon from "assets/icons/medical-subjects/gynecology.png";
import dermatologyIcon from "assets/icons/medical-subjects/dermatology.png";
import ophthalmologyIcon from "assets/icons/medical-subjects/ophthalmology.png";
import emergencyMedicineIcon from "assets/icons/medical-subjects/emergency-medicine.png";
import familyMedicineIcon from "assets/icons/medical-subjects/family-medicine.png";
import urologyIcon from "assets/icons/medical-subjects/urology.png";
import psychiatryIcon from "assets/icons/medical-subjects/psychiatry.png";
import orthopedicsIcon from "assets/icons/medical-subjects/orthopedics.png";
import rehabilitationMedicineIcon from "assets/icons/medical-subjects/rehabilitation-medicine.png";
import rheumatismIcon from "assets/icons/medical-subjects/rheumatism.png";
import cardiologyIcon from "assets/icons/medical-subjects/cardiology.png";
import laboratoryMedicineIcon from "assets/icons/medical-subjects/laboratory-medicine.png";
import infectionMedicineIcon from "assets/icons/medical-subjects/infection-medicine.png";
import endocrineMedicineIcon from "assets/icons/medical-subjects/endocrine-medicine.png";
import anesthesiologyIcon from "assets/icons/medical-subjects/anesthesiology.png";
import radiationOncologyIcon from "assets/icons/medical-subjects/radiation-oncology.png";
import thoracicSurgeryIcon from "assets/icons/medical-subjects/thoracic-surgery.png";
import pathologyIcon from "assets/icons/medical-subjects/pathology.png";
import nuclearMedicineIcon from "assets/icons/medical-subjects/nuclear-medicine.png";
import plasticSurgeryIcon from "assets/icons/medical-subjects/plastic-surgery.png";
import hematoOncologyIcon from "assets/icons/medical-subjects/hemato-oncology.png";
import pulmonologyIcon from "assets/icons/medical-subjects/pulmonology.png";
import neurologyIcon from "assets/icons/medical-subjects/neurology.png";
import neurosurgeryIcon from "assets/icons/medical-subjects/neurosurgery.png";
import nephrologyIcon from "assets/icons/medical-subjects/nephrology.png";
import radiologyIcon from "assets/icons/medical-subjects/radiology.png";
import breastSurgeryIcon from "assets/icons/medical-subjects/breast-surgery.png";
import vascularTransplantSurgeryIcon from "assets/icons/medical-subjects/vascular-transplant-surgery.png";
import oncologyIcon from "assets/icons/medical-subjects/oncology.png";

export const IAP_PRODUCT_ID = {
  TREATMENT_APPOINTMENT: "treatment.appointment",
  TREATMENT_EXTENSION: "treatment.extension",
  INTERNAL_TOKEN: "internal.staff.token",
};

export const POLICY = {
  TERMS_OF_SERVICE: {
    TITLE: "OK DOC 서비스 이용약관",
  },
  PRIVACY_POLICY: {
    TITLE: "OK DOC 개인정보 처리방침",
  },
  LOCATION_OF_SERVICE: {
    TITLE: "위치기반서비스 이용약관",
  },
  SIGNUP_OF_SERVICE: {
    TITLE: "회원가입 유의사항",
  },
  UNIQUE_IDENTIFICATION_POLICY: {
    TITLE: "고유 식별정보 수집 및 이용동의",
  },
  COLLECT_PRIVACY_POLICY: {
    TITLE: "개인정보 수집 및 이용동의",
  },
  SENSITIVE_INFOMATION_POLICY: {
    TITLE: "민감정보 수집 및 이용동의",
  },
  MARKETING_OF_SERVICE: {
    TITLE: "마케팅 정보 활용 동의",
  },
};

export const CONSTANT_POLICY = {
  THIRD_PARTY: THIRD_PARTY,
  REFUND: REFUND,
  BUSINESS: BUSINESS,
};

export const SYMPTOM = {
  감기: {
    NAME: "flu",
    DEPARTMENT: ["가정의학과", "소아청소년과"],
    ICON: fluIcon,
  },
  두통: {
    NAME: "headache",
    DEPARTMENT: ["가정의학과", "소아청소년과"],
    ICON: headacheIcon,
  },
  "고열/미열": {
    NAME: "highFever",
    DEPARTMENT: ["가정의학과", "소아청소년과"],
    ICON: highFeverIcon,
  },
  복통: {
    NAME: "stomachache",
    DEPARTMENT: ["소화기내과"],
    ICON: stomachacheIcon,
  },
  소화불량: {
    NAME: "indigestion",
    DEPARTMENT: ["소화기내과"],
    ICON: indigestionIcon,
  },
  몸살: {
    NAME: "ache",
    DEPARTMENT: ["가정의학과", "소아청소년과"],
    ICON: acheIcon,
  },
  오한: {
    NAME: "chill",
    DEPARTMENT: ["가정의학과", "소아청소년과"],
    ICON: chillIcon,
  },
  변비: {
    NAME: "constipation",
    DEPARTMENT: ["소화기내과"],
    ICON: constipationIcon,
  },
  설사: {
    NAME: "diarrhea",
    DEPARTMENT: ["소화기내과"],
    ICON: diarrheaIcon,
  },
  속쓰림: {
    NAME: "heartburn",
    DEPARTMENT: ["소화기내과"],
    ICON: heartburnIcon,
  },
  근육통: {
    NAME: "muscularPain",
    DEPARTMENT: ["정형외과"],
    ICON: muscularPainIcon,
  },
  관절통: {
    NAME: "arthralgia",
    DEPARTMENT: ["정형외과"],
    ICON: arthralgiaIcon,
  },
};

export const DEPARTMENT = {
  가정의학과: {
    NAME: "familyMedicine",
    ICON: familyMedicineIcon,
  },
  감염내과: {
    NAME: "infectionMedicine",
    ICON: infectionMedicineIcon,
  },
  내분비내과: {
    NAME: "endocrineMedicine",
    ICON: endocrineMedicineIcon,
  },
  류마티스과: {
    NAME: "rheumatism",
    ICON: rheumatismIcon,
  },
  비뇨의학과: {
    NAME: "urology",
    ICON: urologyIcon,
  },
  산부인과: {
    NAME: "gynecology",
    ICON: gynecologyIcon,
  },
  소아청소년과: {
    NAME: "pediatry",
    ICON: pediatryIcon,
  },
  소화기내과: {
    NAME: "internalMedicine",
    ICON: internalMedicineIcon2,
  },
  신경과: {
    NAME: "neurology",
    ICON: neurologyIcon,
  },
  신경외과: {
    NAME: "neurosurgery",
    ICON: neurosurgeryIcon,
  },
  신장내과: {
    NAME: "nephrology",
    ICON: nephrologyIcon,
  },
  심장내과: {
    NAME: "cardiology",
    ICON: cardiologyIcon,
  },
  안과: {
    NAME: "ophthalmology",
    ICON: ophthalmologyIcon,
  },
  외과: {
    NAME: "surgery",
    ICON: surgeryIcon,
    DEPARTMENT: ["외과", "중환자외상외과"],
  },
  중환자외상외과: {
    // 의료질문 단독과 때문에 생성, 진료과 목록에서는 외과에 포함되어서 나옴
    ICON: surgeryIcon,
  },
  유방외과: {
    NAME: "breastSurgery",
    ICON: breastSurgeryIcon,
  },
  이비인후과: {
    // 의사가 없으므로 진료과 목록 및 의료 질문에서 노출되지 않음
    NAME: "otolaryngology",
    ICON: otolaryngologyIcon,
  },
  재활의학과: {
    NAME: "rehabilitationMedicine",
    ICON: rehabilitationMedicineIcon,
  },
  정신건강의학과: {
    NAME: "psychiatry",
    ICON: psychiatryIcon,
  },
  정형외과: {
    NAME: "orthopedics",
    ICON: orthopedicsIcon,
  },
  종양내과: {
    NAME: "oncology",
    ICON: oncologyIcon,
  },
  치과: {
    NAME: "dentistry",
    ICON: dentistryIcon,
  },
  피부과: {
    NAME: "dermatology",
    ICON: dermatologyIcon,
  },
  혈관이식외과: {
    NAME: "vascularTransplantSurgery",
    ICON: vascularTransplantSurgeryIcon,
  },
  혈액종양내과: {
    NAME: "hematoOncology",
    ICON: hematoOncologyIcon,
  },
  호흡기내과: {
    NAME: "pulmonology",
    ICON: pulmonologyIcon,
  },
  흉부외과: {
    NAME: "thoracicSurgery",
    ICON: thoracicSurgeryIcon,
  },

  마취통증의학과: {
    NAME: "anesthesiology",
    ICON: anesthesiologyIcon,
  },
  방사선종양학과: {
    NAME: "radiationOncology",
    ICON: radiationOncologyIcon,
  },
  성형외과: {
    NAME: "plasticSurgery",
    ICON: plasticSurgeryIcon,
  },
  영상의학과: {
    NAME: "radiology",
    ICON: radiologyIcon,
  },
  응급의학과: {
    NAME: "emergencyMedicine",
    ICON: emergencyMedicineIcon,
  },
  진단검사의학과: {
    NAME: "laboratoryMedicine",
    ICON: laboratoryMedicineIcon,
  },
  핵의학과: {
    NAME: "nuclearMedicine",
    ICON: nuclearMedicineIcon,
  },
};
