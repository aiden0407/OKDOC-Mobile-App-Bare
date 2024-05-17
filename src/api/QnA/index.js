//API
import axios from "axios";
import { APIURL } from "constants/api";
import uuid from "react-native-uuid";
import { dataDogBackendError } from "api/DataDog";

export const getAllQuestions = async function () {
  try {
    let options = {
      url: `${APIURL}/ai_qnas/?category=clinical_department`,
      method: "GET",
    };
    const response = await axios(options);
    return response;
  } catch (error) {
    dataDogBackendError(error);
    throw error.response;
  }
};

export const getMyQuestions = async function (loginToken) {
  try {
    let options = {
      url: `${APIURL}/ai_qnas`,
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

export const postTemporaryQuestion = async function (question) {
  const qnaId = uuid.v4();
  try {
    let options = {
      url: `${APIURL}/ai_qnas/${qnaId}`,
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

export const postMyQuestion = async function (loginToken, patientId, question) {
  const qnaId = uuid.v4();
  try {
    let options = {
      url: `${APIURL}/ai_qnas/${qnaId}`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${loginToken}`,
      },
      data: {
        question_message: question,
        patient_id: patientId,
      },
    };
    const response = await axios(options);
    return response;
  } catch (error) {
    dataDogBackendError(error);
    throw error.response;
  }
};

export const deleteMyQuestion = async function (loginToken, qnaId) {
  try {
    let options = {
      url: `${APIURL}/ai_qnas/${qnaId}`,
      method: "DELETE",
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

export const postFeedback = async function (qnaId, type) {
  const feedbackId = uuid.v4();
  try {
    let options = {
      url: `${APIURL}/feedbacks/${feedbackId}`,
      method: "POST",
      data: {
        ai_qna_id: qnaId,
        types: [type],
      },
    };
    const response = await axios(options);
    return response;
  } catch (error) {
    dataDogBackendError(error);
    throw error.response;
  }
};
