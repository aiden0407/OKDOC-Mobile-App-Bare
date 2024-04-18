//API
import axios from "axios";
import { APIURL, MOCKAPIURL } from "constants/api";
import uuid from "react-native-uuid";
import { dataDogBackendError } from "api/DataDog";

export const getQuestions = async function () {
  try {
    let options = {
      // url: `${APIURL}/ai_qnas/?category=clinical_department`,
      url: `${MOCKAPIURL}/ai_qnas/?category=clinical_department`,
      method: "GET",
    };
    const response = await axios(options);
    return response;
  } catch (error) {
    dataDogBackendError(error);
    throw error.response;
  }
};

export const postQuestion = async function (question) {
  const qnaId = uuid.v4();
  try {
    let options = {
      // url: `${APIURL}/ai_qnas/${qnaId}`,
      url: `${MOCKAPIURL}/ai_qnas/${qnaId}`,
      method: "POST",
      data: {
        question_message: question,
      },
    };
    const response = await axios(options);
    return response;
  } catch (error) {
    dataDogBackendError(error);
    throw error.response;
  }
};
