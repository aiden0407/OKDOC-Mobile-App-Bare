//React
import { useContext } from "react";
import { AppContext } from "context/AppContext";

//Navigation
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PostQuestionScreen from "screens/Home/MedicalQuestion/PostQuestion";
import AllQuestionsScreen from "screens/Home/MedicalQuestion/AllQuestions";
import QuestionDetailScreen from "screens/Home/MedicalQuestion/QuestionDetail";

//Components
import NavigationBackArrow from "components/NavigationBackArrow";

const Stack = createNativeStackNavigator();

export default function MedicalQuestionNavigation({ navigation }) {
  const {
    state: { isQuestionShorcutUsed },
    dispatch,
  } = useContext(AppContext);

  function handleReservationBack() {
    if (isQuestionShorcutUsed) {
      dispatch({ type: "DELETE_QUESTION_SHORTCUT" });
      navigation.goBack();
    } else {
      navigation.navigate("AllQuestions");
    }
  }

  return (
    <Stack.Navigator>
      <Stack.Group screenOptions={{ headerLargeTitleShadowVisible: false }}>
        <Stack.Screen
          name="PostQuestion"
          component={PostQuestionScreen}
          options={{
            title: "질문 작성",
            headerLeft: () => (
              <NavigationBackArrow action={() => handleReservationBack()} />
            ),
          }}
        />
        <Stack.Screen
          name="AllQuestions"
          component={AllQuestionsScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="QuestionDetail"
          component={QuestionDetailScreen}
          options={{
            title: "전체 질문",
            headerLeft: () => (
              <NavigationBackArrow action={() => handleReservationBack()} />
            ),
          }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
}
