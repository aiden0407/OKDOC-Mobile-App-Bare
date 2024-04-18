//API
import axios from "axios";
import { APIURL } from "constants/api";
import { dataDogBackendError } from "api/DataDog";

export const getFamilyInfo = async function (loginToken, email) {
  try {
    let options = {
      url: `${APIURL}/families/${email}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${loginToken}`,
      },
    };
    const response = await axios(options);
    return response;
  } catch (error) {
    dataDogBackendError(error);
    throw error;
  }
};

export const getPatientList = async function (loginToken, email) {
  try {
    let options = {
      url: `${APIURL}/patients/?family_id=${email}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${loginToken}`,
      },
    };
    const response = await axios(options);
    return response;
  } catch (error) {
    dataDogBackendError(error);
    throw error;
  }
};

export const modifyPatientInformation = async function (
  loginToken,
  patientId,
  patientInformation
) {
  const data = {
    height: patientInformation.height,
    weight: patientInformation.weight,
    drinker: patientInformation.drinker,
    smoker: patientInformation.smoker,
    medical_history: patientInformation.medical_history,
    family_medical_history: patientInformation.family_medical_history,
    medication: patientInformation.medication,
    allergic_reaction: patientInformation.allergic_reaction,
    consideration: patientInformation.consideration,
  };
  try {
    let options = {
      url: `${APIURL}/patients/${patientId}`,
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${loginToken}`,
      },
      data: data,
    };
    const response = await axios(options);
    return response;
  } catch (error) {
    dataDogBackendError(error);
    throw error;
  }
};

export const changePassword = async function (
  loginToken,
  email,
  password,
  newPassword
) {
  try {
    let options = {
      url: `${APIURL}/authentication/change-password`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${loginToken}`,
      },
      data: {
        id: email,
        password: password,
        new_password: newPassword,
      },
    };
    const response = await axios(options);
    return response;
  } catch (error) {
    dataDogBackendError(error);
    throw error;
  }
};

export const deleteFamilyAccout = async function (loginToken, email) {
  try {
    let options = {
      url: `${APIURL}/authentication/leave`,
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${loginToken}`,
      },
      data: {
        id: email,
      },
    };
    const response = await axios(options);
    return response;
  } catch (error) {
    dataDogBackendError(error);
    throw error;
  }
};
