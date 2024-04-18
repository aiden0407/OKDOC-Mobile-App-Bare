//API
import axios from "axios";
import { APIURL } from "constants/api";
import { dataDogBackendError } from "api/DataDog";

export const getAlarmHistory = async function (loginToken, patientId) {
  try {
    let options = {
      url: `${APIURL}/notifications/?patient_id=${patientId}&sort_by=createdAt&sort_order=-1&limit=100`,
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
