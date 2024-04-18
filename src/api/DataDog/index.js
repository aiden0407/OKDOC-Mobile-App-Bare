// DataDog API
import axios from "axios";
import { DD_API_KEY } from "constants/api";
import { Platform } from "react-native";
import Constants from "expo-constants";
import uuid from "react-native-uuid";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UserAgent from "react-native-user-agent";

export const dataDogBackendError = async function (error) {
  const traceId = uuid.v4();
  const userAgent = UserAgent.getUserAgent();
  let accountData;
  let netInfo;

  try {
    const jsonValue = await AsyncStorage.getItem("@account_data");
    if (jsonValue !== null) {
      accountData = JSON.parse(jsonValue);
    }
  } catch (error) {
    console.log(error);
  }

  try {
    const jsonValue = await AsyncStorage.getItem("@net_information");
    if (jsonValue !== null) {
      netInfo = JSON.parse(jsonValue);
    }
  } catch (error) {
    console.log(error);
  }

  try {
    let options = {
      url: "https://http-intake.logs.datadoghq.com/api/v2/logs",
      method: "POST",
      headers: {
        "DD-API-KEY": DD_API_KEY,
      },
      data: {
        message: JSON.stringify(error?.response?.data?.message ?? error),
        message_detail: error?.response?.data ?? error,
        ddsource: "react-native",
        ddtags: `level:error,env:local,version:${Constants.manifest.version},platform:${Platform.OS}`,
        hostname: "backend",
        service: "okdoc-app",
        status: error?.response?.status === 404 ? "warn" : "error",
        trace_id: traceId,
        http: {
          url: error?.response?.config?.url,
          status_code: error?.response?.status,
          method: error?.response?.config?.method,
          request_id: traceId,
          useragent: userAgent,
        },
        platform_detail: Platform,
        network_detail: netInfo?.netInfo,
        "network.client.geoip": netInfo?.geoip,
        "usr.email": accountData?.email,
      },
    };
    await axios(options);
    console.log(
      "dataDogBackend:",
      options.data.message_detail?.path,
      options.data.message
    );
  } catch (error) {
    console.log("dataDogBackend error:", error);
  }
};

export const dataDogFrontendError = async function (error) {
  const traceId = uuid.v4();
  let accountData;
  let netInfo;

  try {
    const jsonValue = await AsyncStorage.getItem("@account_data");
    if (jsonValue !== null) {
      accountData = JSON.parse(jsonValue);
    }
  } catch (error) {
    console.log(error);
  }

  try {
    const jsonValue = await AsyncStorage.getItem("@net_information");
    if (jsonValue !== null) {
      netInfo = JSON.parse(jsonValue);
    }
  } catch (error) {
    console.log(error);
  }

  try {
    let options = {
      url: "https://http-intake.logs.datadoghq.com/api/v2/logs",
      method: "POST",
      headers: {
        "DD-API-KEY": DD_API_KEY,
      },
      data: {
        message: error.toString(),
        message_detail: JSON.stringify(error),
        ddsource: "react-native",
        ddtags: `level:error,env:local,version:${Constants.manifest.version},platform:${Platform.OS}`,
        hostname: "frontend",
        service: "okdoc-app",
        status: "error",
        trace_id: traceId,
        platform_detail: Platform,
        network_detail: netInfo?.netInfo,
        "network.client.geoip": netInfo?.geoip,
        "usr.email": accountData?.email,
      },
    };
    await axios(options);
    console.log("dataDogFrontend:", error?.data ?? error);
  } catch (error) {
    console.log("dataDogFrontend error:", error);
  }
};
