//API
import axios from "axios";
import { APIURL } from "constants/api";
import uuid from "react-native-uuid";
import useTestAccount from "hook/useTestAccount";
import { dataDogBackendError } from "api/DataDog";

// <--진료 상태 정의 함수-->
export const getHistoryListByPatientId = async function (patientId) {
  try {
    let options = {
      url: `${APIURL}/purchase_histories/?patient_id=${patientId}`,
      method: "GET",
    };
    const response = await axios(options);
    return response;
  } catch (error) {
    dataDogBackendError(error);
    throw error.response;
  }
};

export const getHistoryStatus = async function (documentKey) {
  try {
    let options = {
      url: `${APIURL}/purchase_histories/?documentKey=${documentKey}`,
      method: "GET",
    };
    const response = await axios(options);
    return response;
  } catch (error) {
    dataDogBackendError(error);
    throw error.response;
  }
};

export const getAuditLog = async function (loginToken, fullDocumentId) {
  try {
    let options = {
      // url: `${APIURL}/audits/?focus=/merchant/cancel/${fullDocumentId}&action=POST`,
      url: `${APIURL}/audits/?focus=/merchant/cashless-cancel/${fullDocumentId}&action=POST`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${loginToken}`,
      },
    };
    const response = await axios(options);
    return response;
  } catch (error) {
    dataDogBackendError(error);
    throw error.response;
  }
};

export const getTreatmentResults = async function (loginToken, treatmentId) {
  try {
    let options = {
      url: `${APIURL}/treatments/?treatment_appointment_id=${treatmentId}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${loginToken}`,
      },
    };
    const response = await axios(options);
    return response;
  } catch (error) {
    dataDogBackendError(error);
    throw error.response;
  }
};

export const getCCTVInformation = async function (loginToken, appointmentId) {
  try {
    let options = {
      url: `${APIURL}/hospital_room_cctvs/?treatment_appointment_id=${appointmentId}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${loginToken}`,
      },
    };
    const response = await axios(options);
    return response;
  } catch (error) {
    dataDogBackendError(error);
    throw error.response;
  }
};
// <--진료 상태 정의 함수 End-->

// <--진료 상세 데이터-->
export const getTreatmentInformation = async function (
  loginToken,
  appointmentId
) {
  try {
    let options = {
      url: `${APIURL}/treatment_appointments/${appointmentId}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${loginToken}`,
      },
    };
    const response = await axios(options);
    return response;
  } catch (error) {
    dataDogBackendError(error);
    throw error.response;
  }
};

export const getBiddingInformation = async function (loginToken, biddingId) {
  try {
    let options = {
      url: `${APIURL}/biddings/${biddingId}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${loginToken}`,
      },
    };
    const response = await axios(options);
    return response;
  } catch (error) {
    dataDogBackendError(error);
    throw error.response;
  }
};

export const getInvoiceInformation = async function (loginToken, biddingId) {
  try {
    let options = {
      url: `${APIURL}/invoices/?bidding_id=${biddingId}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${loginToken}`,
      },
    };
    const response = await axios(options);
    return response;
  } catch (error) {
    dataDogBackendError(error);
    throw error.response;
  }
};

export const getPurchaseInformation = async function (
  loginToken,
  appointmentId
) {
  try {
    let options = {
      url: `${APIURL}/purchases/?treatment_appointment_id=${appointmentId}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${loginToken}`,
      },
    };
    const response = await axios(options);
    return response;
  } catch (error) {
    dataDogBackendError(error);
    throw error.response;
  }
};
// <--진료 상세 데이터 End-->

export const cancelPayment = async function (loginToken, purchaseId, P_TID) {
  try {
    let options = {
      url: `${APIURL}/merchant/cancel/${purchaseId}`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${loginToken}`,
      },
      data: {
        tid: P_TID,
        msg: "진료 예약 취소입니다.",
      },
    };
    const response = await axios(options);
    return response;
  } catch (error) {
    dataDogBackendError(error);
    throw error.response;
  }
};

// [!PROMOTION] 0원 결제 취소부
export const cancelCashlessPayment = async function (loginToken, purchaseId) {
  try {
    let options = {
      url: `${APIURL}/merchant/cashless-cancel/${purchaseId}`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${loginToken}`,
      },
    };
    const response = await axios(options);
    return response;
  } catch (error) {
    dataDogBackendError(error);
    throw error.response;
  }
};

export const patchCCTVPatientBye = async function (loginToken, CCTVId) {
  try {
    let options = {
      url: `${APIURL}/hospital_room_cctvs/${CCTVId}`,
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${loginToken}`,
      },
      data: {
        patient_motion: "bye",
      },
    };
    const response = await axios(options);
    return response;
  } catch (error) {
    dataDogBackendError(error);
    throw error.response;
  }
};

// [!PROMOTION] 연장 0원 결제 요청부
export const merchantCashlessInvoice = async function (loginToken, invoiceId) {
  const orderId = uuid.v4();
  try {
    let options = {
      url: `${APIURL}/merchant/cashless-postpaid/${invoiceId}/${orderId}`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${loginToken}`,
      },
    };
    const response = await axios(options);
    return response;
  } catch (error) {
    dataDogBackendError(error);
    throw error.response;
  }
};

export const createInvoicePaymentRequest = async function (
  telemedicineData,
  email
) {
  const orderId = uuid.v4();
  const data = {
    P_INI_PAYMENT: "CARD",
    P_MID: "insungif01",
    P_OID: orderId,
    P_NOTI: telemedicineData.invoiceInfo.id,
    P_GOODS: encodeURIComponent(
      telemedicineData.productInfo.hospital_name +
        " " +
        telemedicineData.productInfo.name
    ),
    P_UNAME: encodeURIComponent(
      telemedicineData.profileInfo?.passport?.user_name ??
        telemedicineData.profileInfo?.passapp_certification?.name
    ),
    P_NEXT_URL: `https://api.okdoc.app/merchant-webhook/post-paid/${telemedicineData.invoiceInfo.id}/${telemedicineData.id}`,
    P_EMAIL: email,
    P_CHARSET: "utf8",
    P_RESERVED: "global_visa3d=Y&apprun_check=Y&below1000=Y",
  };
  if (useTestAccount(email)) {
    data.P_AMT = "1000";
  } else {
    data.P_AMT = `${telemedicineData.productInfo.price}`;
    if (telemedicineData.productInfo?.tax) {
      data.P_TAX = `${telemedicineData.productInfo?.tax}`;
    }
    if (telemedicineData.productInfo?.tax_free) {
      data.P_TAXFREE = `${telemedicineData.productInfo?.tax_free}`;
    }
  }

  try {
    let options = {
      url: `https://mobile.inicis.com/smart/payment/`,
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: data,
    };
    const response = await axios(options);
    return response;
  } catch (error) {
    dataDogBackendError(error);
    throw error.response;
  }
};

// Iap 인보이스 결제 정보 조회
export const getInvoicePurchaseInformation = async function (
  loginToken,
  invoiceId
) {
  try {
    let options = {
      url: `${APIURL}/purchases/?invoice_id=${invoiceId}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${loginToken}`,
      },
    };
    const response = await axios(options);
    return response;
  } catch (error) {
    dataDogBackendError(error);
    throw error.response;
  }
};
