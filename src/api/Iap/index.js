//API
import axios from "axios";
import { IAP_PRODUCT_ID } from "constants/service";
import { APIURL } from "constants/api";
import uuid from "react-native-uuid";
import { dataDogBackendError } from "api/DataDog";

export const getIosReuseBidding = async function (loginToken) {
  try {
    let options = {
      url: `${APIURL}/ios-iap-consumable/reuse?type=bidding`,
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
export const getAndroidReuseBidding = async function (loginToken) {
  try {
    let options = {
      url: `${APIURL}/android-iap-consumable/reuse?type=bidding`,
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

export const consumeIosBidding = async function (
  loginToken,
  biddingId,
  transactionId
) {
  const orderId = uuid.v4();
  try {
    let options = {
      url: `${APIURL}/ios-iap-consumable/prepaid/${biddingId}/${orderId}`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${loginToken}`,
      },
      data: {
        transactionId: transactionId,
      },
    };
    const response = await axios(options);
    return response;
  } catch (error) {
    dataDogBackendError(error);
    throw error.response;
  }
};
export const consumeAndroidBidding = async function (
  loginToken,
  biddingId,
  transactionId,
  purchaseToken
) {
  const orderId = uuid.v4();
  try {
    let options = {
      url: `${APIURL}/android-iap-consumable/prepaid/${biddingId}/${orderId}`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${loginToken}`,
      },
      data: {
        transactionId: transactionId,
        purchaseToken: purchaseToken,
        productId: IAP_PRODUCT_ID.TREATMENT_APPOINTMENT,
      },
    };
    const response = await axios(options);
    return response;
  } catch (error) {
    dataDogBackendError(error);
    throw error.response;
  }
};

export const consumeIosInvoice = async function (
  loginToken,
  invoiceId,
  transactionId
) {
  const orderId = uuid.v4();
  try {
    let options = {
      url: `${APIURL}/ios-iap-consumable/postpaid/${invoiceId}/${orderId}`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${loginToken}`,
      },
      data: {
        transactionId: transactionId,
      },
    };
    const response = await axios(options);
    return response;
  } catch (error) {
    dataDogBackendError(error);
    throw error.response;
  }
};
export const consumeAndroidInvoice = async function (
  loginToken,
  invoiceId,
  transactionId,
  purchaseToken
) {
  const orderId = uuid.v4();
  try {
    let options = {
      url: `${APIURL}/android-iap-consumable/postpaid/${invoiceId}/${orderId}`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${loginToken}`,
      },
      data: {
        transactionId: transactionId,
        purchaseToken: purchaseToken,
        productId: IAP_PRODUCT_ID.TREATMENT_EXTENSION,
      },
    };
    const response = await axios(options);
    return response;
  } catch (error) {
    dataDogBackendError(error);
    throw error.response;
  }
};

export const unlockIosPurchase = async function (loginToken, purchaseId) {
  try {
    let options = {
      url: `${APIURL}/ios-iap-consumable/unlock/${purchaseId}`,
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
export const unlockAndroidBidding = async function (
  loginToken,
  purchaseId,
  purchaseToken
) {
  try {
    let options = {
      url: `${APIURL}/android-iap-consumable/unlock/${purchaseId}`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${loginToken}`,
      },
      data: {
        purchaseToken: purchaseToken,
        productId: IAP_PRODUCT_ID.TREATMENT_APPOINTMENT,
      },
    };
    const response = await axios(options);
    return response;
  } catch (error) {
    throw error.response;
  }
};
export const unlockAndroidInvoice = async function (
  loginToken,
  purchaseId,
  purchaseToken
) {
  try {
    let options = {
      url: `${APIURL}/android-iap-consumable/unlock/${purchaseId}`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${loginToken}`,
      },
      data: {
        purchaseToken: purchaseToken,
        productId: IAP_PRODUCT_ID.TREATMENT_EXTENSION,
      },
    };
    const response = await axios(options);
    return response;
  } catch (error) {
    dataDogBackendError(error);
    throw error.response;
  }
};

export const cancleIosPurchase = async function (loginToken, purchaseId) {
  try {
    let options = {
      url: `${APIURL}/ios-iap-consumable/cancel/${purchaseId}`,
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
export const cancleAndroidPurchase = async function (loginToken, purchaseId) {
  try {
    let options = {
      url: `${APIURL}/android-iap-consumable/cancel/${purchaseId}`,
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

export const getIosAuditLog = async function (loginToken, fullDocumentId) {
  try {
    let options = {
      url: `${APIURL}/audits/?focus=/ios-iap-consumable/cancel/${fullDocumentId}&action=POST`,
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
export const getAndroidAuditLog = async function (loginToken, fullDocumentId) {
  try {
    let options = {
      url: `${APIURL}/audits/?focus=/android-iap-consumable/cancel/${fullDocumentId}&action=POST`,
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
