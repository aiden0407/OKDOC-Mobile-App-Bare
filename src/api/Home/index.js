//API
import axios from "axios";
import { APIURL } from "constants/api";
import uuid from "react-native-uuid";
import useTestAccount from "hook/useTestAccount";
import { dataDogBackendError } from "api/DataDog";

export const getProducts = async function () {
  try {
    let options = {
      url: `${APIURL}/products/`,
      method: "GET",
    };
    const response = await axios(options);
    return response;
  } catch (error) {
    dataDogBackendError(error);
    throw error.response;
  }
};

export const getSymptoms = async function () {
  try {
    let options = {
      url: `${APIURL}/symptoms/`,
      method: "GET",
    };
    const response = await axios(options);
    return response;
  } catch (error) {
    dataDogBackendError(error);
    throw error.response;
  }
};

export const getDepartments = async function () {
  try {
    let options = {
      url: `${APIURL}/departments/`,
      method: "GET",
    };
    const response = await axios(options);
    return response;
  } catch (error) {
    dataDogBackendError(error);
    throw error.response;
  }
};

export const getDoctorsByDepartment = async function (department) {
  try {
    let options = {
      url: `${APIURL}/doctors/?department_name=${department}&sort_by=name&sort_order=1`,
      method: "GET",
    };
    const response = await axios(options);
    return response;
  } catch (error) {
    dataDogBackendError(error);
    throw error.response;
  }
};

export const getScheduleByDoctorId = async function (doctorId) {
  try {
    let options = {
      url: `${APIURL}/treatment_appointments/?doctor_id=${doctorId}`,
      method: "GET",
    };
    const response = await axios(options);
    return response;
  } catch (error) {
    dataDogBackendError(error);
    throw error.response;
  }
};

export const getScheduleByPatientId = async function (loginToken, patientId) {
  try {
    let options = {
      url: `${APIURL}/treatment_appointments/?patient_id=${patientId}`,
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

export const createBidding = async function (loginToken, reservationInfo) {
  const formData = new FormData();
  formData.append("doctor_id", reservationInfo.doctorInfo.doctorId);
  formData.append("patient_id", reservationInfo.profileInfo.id);
  formData.append("wish_at", reservationInfo.doctorInfo.scheduleTime);
  formData.append("department_name", reservationInfo.doctorInfo.subject);
  formData.append("explain_symptom", reservationInfo.symptom);
  reservationInfo.images.forEach(function (image) {
    formData.append("images", {
      uri: image,
      type: "image/jpeg",
      name: `${uuid.v4()}.jpg`,
    });
  });

  try {
    let options = {
      url: `${APIURL}/products/${
        reservationInfo.product.id
      }/biddings/${uuid.v4()}`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${loginToken}`,
        "Content-Type": "multipart/form-data",
      },
      data: formData,
    };
    const response = await axios(options);
    return response;
  } catch (error) {
    dataDogBackendError(error);
    throw error.response;
  }
};

// [!PROMOTION] 0원 결제 요청부
export const merchantCashlessBidding = async function (loginToken, biddingId) {
  const orderId = uuid.v4();
  try {
    let options = {
      url: `${APIURL}/merchant/cashless-prepaid/${biddingId}/${orderId}`,
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

export const createPaymentRequest = async function (reservationInfo, email) {
  const orderId = uuid.v4();
  const data = {
    P_INI_PAYMENT: "CARD",
    P_MID: "insungif01",
    P_OID: orderId,
    P_NOTI: reservationInfo.biddingId,
    P_GOODS: encodeURIComponent(reservationInfo.product.introduction),
    P_UNAME: encodeURIComponent(reservationInfo.profileInfo.name),
    P_NEXT_URL: `${APIURL}/merchant-webhook/advanced-paid/${reservationInfo.biddingId}/${orderId}`,
    P_EMAIL: email,
    P_CHARSET: "utf8",
    P_RESERVED: "global_visa3d=Y&apprun_check=Y&below1000=Y",
  };
  if (useTestAccount(email)) {
    data.P_AMT = "1000";
  } else {
    data.P_AMT = `${reservationInfo.product.price}`;
    if (reservationInfo.product?.tax) {
      data.P_TAX = `${reservationInfo.product?.tax}`;
    }
    if (reservationInfo.product?.tax_free) {
      data.P_TAXFREE = `${reservationInfo.product?.tax_free}`;
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

export const getPaymentInformation = async function (P_TID) {
  try {
    let options = {
      url: `${APIURL}/payment/inquiry`,
      method: "POST",
      data: {
        originalTid: P_TID,
      },
    };
    const response = await axios(options);
    return response;
  } catch (error) {
    dataDogBackendError(error);
    throw error.response;
  }
};
