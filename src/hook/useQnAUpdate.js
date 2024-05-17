//React
import { useContext } from "react";
import { ApiContext } from "context/ApiContext";
import { AppContext } from "context/AppContext";

//Api
import { getAllQuestions, getMyQuestions } from "api/QnA";

export default function useQnAUpdate() {
  const {
    state: { accountData },
    dispatch,
  } = useContext(ApiContext);
  const { dispatch: appContextDispatch } = useContext(AppContext);

  const updateAllQnA = async function () {
    appContextDispatch({ type: "QUESTION_DATA_UPDATING" });
    try {
      const response = await getAllQuestions();
      const allQuestions = response.data.response;
      dispatch({
        type: "ALL_QUESTIONS",
        allQuestions: allQuestions.reverse(),
      });
    } catch {
      // QnA가 없는 경우
      dispatch({
        type: "ALL_QUESTIONS",
        allQuestions: [],
      });
    }
    appContextDispatch({ type: "QUESTION_DATA_UPDATED" });
  };

  const updateMyQnA = async function () {
    appContextDispatch({ type: "QUESTION_DATA_UPDATING" });
    try {
      const response = await getMyQuestions(accountData?.loginToken);
      const myQuestions = response.data.response;
      dispatch({
        type: "MY_QUESTIONS",
        myQuestions: myQuestions.reverse(),
      });
    } catch {
      // QnA가 없는 경우
      dispatch({
        type: "MY_QUESTIONS",
        myQuestions: [],
      });
    }
    appContextDispatch({ type: "QUESTION_DATA_UPDATED" });
  };

  return { updateAllQnA, updateMyQnA };
}
