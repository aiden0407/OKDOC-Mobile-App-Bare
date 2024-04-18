//API
import axios from "axios";
import { APIURL } from "constants/api";
import uuid from "react-native-uuid";
import { dataDogBackendError } from "api/DataDog";

function generateRandomPassword() {
  const length = Math.floor(Math.random() * 7) + 8; // 8자~14자 사이의 길이 생성
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.?!@#$%^&*+=";

  let password = "";

  while (password.length < length) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    password += chars[randomIndex];
  }

  if (
    password.match(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[.?!@#$%^&*+=]).{8,14}$/
    )
  ) {
    return password;
  } else {
    return generateRandomPassword(); // 조건을 만족하지 않으면 다시 생성
  }
}

export const familyAppleLogin = async function (credential) {
  try {
    let options = {
      url: `${APIURL}/apple/sign-in`,
      method: "POST",
      data: {
        code: `${credential.authorizationCode}`,
      },
    };
    const response = await axios(options);
    return response;
  } catch (error) {
    dataDogBackendError(error);
    throw error;
  }
};

export const familyGoogleLogin = async function (credential) {
  try {
    let options = {
      url: `${APIURL}/google/sign-in`,
      method: "POST",
      data: {
        access_token: `${credential.authentication.accessToken}`,
      },
    };
    const response = await axios(options);
    return response;
  } catch (error) {
    dataDogBackendError(error);
    throw error;
  }
};

export const familyLocalLogin = async function (id, password) {
  try {
    let options = {
      url: `${APIURL}/authentication/sign-in`,
      method: "POST",
      data: {
        id: id,
        password: password,
      },
    };
    const response = await axios(options);
    return response;
  } catch (error) {
    dataDogBackendError(error);
    throw error;
  }
};

export const getRegisterTerms = async function () {
  try {
    let options = {
      url: `${APIURL}/terms/?sort_by=level&sort_order=-1&category=html`,
      method: "GET",
    };
    const response = await axios(options);
    return response;
  } catch (error) {
    dataDogBackendError(error);
    throw error;
  }
};

export const emailAvailabilityCheck = async function (email) {
  try {
    let options = {
      url: `${APIURL}/authentication/availability-check`,
      method: "POST",
      data: {
        email: email,
      },
    };
    const response = await axios(options);
    return response;
  } catch (error) {
    dataDogBackendError(error);
    throw error;
  }
};

export const emailCheckOpen = async function (email) {
  try {
    let options = {
      url: `${APIURL}/authentication/email-check-open`,
      method: "POST",
      data: {
        email: email,
      },
    };
    const response = await axios(options);
    return response;
  } catch (error) {
    dataDogBackendError(error);
    throw error;
  }
};

export const emailCheckClose = async function (
  verifiedToken,
  email,
  certificationNumber
) {
  try {
    let options = {
      url: `${APIURL}/authentication/email-check-close`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${verifiedToken}`,
      },
      data: {
        email: email,
        verification_number: Number(certificationNumber),
      },
    };
    const response = await axios(options);
    return response;
  } catch (error) {
    dataDogBackendError(error);
    throw error;
  }
};

export const createAppleAccount = async function (
  email,
  policy,
  deviceType,
  deviceToken,
  apple_id
) {
  try {
    let options = {
      url: `${APIURL}/authentication/sign-up`,
      method: "POST",
      data: {
        id: email,
        password: generateRandomPassword(),
        agreements: policy,
        device_type: deviceType,
        device_token: deviceToken,
        apple_id: apple_id,
      },
    };
    const response = await axios(options);
    return response;
  } catch (error) {
    dataDogBackendError(error);
    throw error;
  }
};

export const createGoogleAccount = async function (
  email,
  policy,
  deviceType,
  deviceToken,
  google_id
) {
  try {
    let options = {
      url: `${APIURL}/authentication/sign-up`,
      method: "POST",
      data: {
        id: email,
        password: generateRandomPassword(),
        agreements: policy,
        device_type: deviceType,
        device_token: deviceToken,
        google_id: google_id,
      },
    };
    const response = await axios(options);
    return response;
  } catch (error) {
    dataDogBackendError(error);
    throw error;
  }
};

export const createLocalAccount = async function (
  email,
  password,
  policy,
  deviceType,
  deviceToken,
  emailToken
) {
  try {
    let options = {
      url: `${APIURL}/authentication/sign-up`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${emailToken}`,
      },
      data: {
        id: email,
        password: password,
        agreements: policy,
        device_type: deviceType,
        device_token: deviceToken,
      },
    };
    const response = await axios(options);
    return response;
  } catch (error) {
    dataDogBackendError(error);
    throw error;
  }
};

export const createPatientByBirth = async function (
  loginToken,
  email,
  name,
  birth,
  gender
) {
  try {
    let options = {
      url: `${APIURL}/families/${email}/patients/${uuid.v4()}`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${loginToken}`,
      },
      data: {
        user_name: name,
        birth: birth,
        gender: gender,
        relationship: "본인",
      },
    };
    const response = await axios(options);
    return response;
  } catch (error) {
    dataDogBackendError(error);
    throw error;
  }
};

export const createPatientByPassport = async function (
  loginToken,
  email,
  name,
  birth,
  passportNumber,
  dateOfIssue,
  dateOfExpiry,
  gender
) {
  try {
    let options = {
      url: `${APIURL}/families/${email}/patients/${uuid.v4()}`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${loginToken}`,
      },
      data: {
        user_name: name,
        birth: birth,
        passport_number: passportNumber,
        issue_date: dateOfIssue,
        close_date: dateOfExpiry,
        gender: gender,
        relationship: "본인",
      },
    };
    const response = await axios(options);
    return response;
  } catch (error) {
    dataDogBackendError(error);
    throw error;
  }
};

export const createPatientByPassApp = async function (loginToken, imp_uid) {
  try {
    let options = {
      url: `${APIURL}/authentication/give-birth-by-passapp`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${loginToken}`,
      },
      data: {
        id: uuid.v4(),
        imp_uid: imp_uid,
        relationship: "본인",
      },
    };
    const response = await axios(options);
    return response;
  } catch (error) {
    dataDogBackendError(error);
    throw error;
  }
};

export const findFamilyAccount = async function (name, birth) {
  try {
    let options = {
      url: `${APIURL}/authentication/ids-inquiry`,
      method: "POST",
      data: {
        name: name,
        birth: birth,
      },
    };
    const response = await axios(options);
    return response;
  } catch (error) {
    dataDogBackendError(error);
    throw error;
  }
};

export const changePassword = async function (
  accessToken,
  email,
  newPassword,
  name,
  birth
) {
  try {
    let options = {
      url: `${APIURL}/authentication/password-reset`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      data: {
        email: email,
        new_password: newPassword,
        name: name,
        birth: birth,
      },
    };
    const response = await axios(options);
    return response;
  } catch (error) {
    dataDogBackendError(error);
    throw error;
  }
};
