//React
import { useState, useContext } from "react";
import { AppContext } from "context/AppContext";
import styled from "styled-components/native";

//Components
import * as Device from "expo-device";
import { COLOR } from "constants/design";
import { Keyboard } from "react-native";
import {
  SafeArea,
  KeyboardAvoiding,
  Container,
  ScrollView,
} from "components/Layout";
import { Text } from "components/Text";
import { Image } from "components/Image";
import { BoxInput } from "components/TextInput";
import { SolidButton } from "components/Button";
import NavigationBackArrow from "components/NavigationBackArrow";

//Assets
import largeBanner1 from "assets/images/large_banner1.png";

export default function PostQuestionScreen({ navigation }) {
  const { dispatch } = useContext(AppContext);
  const [question, setQuestion] = useState();
  const [loading, setLoading] = useState(false);

  function handleSubmitPostQuestion() {
    Keyboard.dismiss();
    setLoading(true);
    setTimeout(() => {
      dispatch({ type: "USE_QUESTION_SHORTCUT" });
      setLoading(false);
      navigation.navigate("QuestionDetail", {
        type: "MY",
        questionDetailData: {
          question: question,
          answer: {
            message:
              "충분한 수면은 신체와 정신 건강에 필수적입니다. 수면 부족은 주의력, 기억력 및 판단력 저하, 기분 변화, 면역 체계 약화, 만성 건강 문제의 위험 증가와 관련이 있습니다. 대부분의 성인은 밤에 최소 7-8시간의 수면이 필요합니다.",
            department: "가정의학과",
          },
        },
      });
    }, 5000);
  }

  return (
    <>
      <SafeArea>
        <KeyboardAvoiding>
          <Container paddingHorizontal={20}>
            <CustomHeader>
              <BackArrowWrapper>
                <NavigationBackArrow action={() => navigation.goBack()} />
              </BackArrowWrapper>
              <Text T4 medium>
                질문 작성
              </Text>
            </CustomHeader>

            <ScrollView>
              <Text T3 bold mTop={30}>
                질문을 올리고{"\n"}
                고민을 해결해 보세요
              </Text>
              <Text T6 medium color={COLOR.GRAY1} mTop={12}>
                로그인 후 질문을 등록하면{"\n"}
                추후 '나의 질문' 페이지에서 답변을 재확인할 수 있어요{"\n"}
              </Text>

              <Text T6 medium mTop={36}>
                질문
              </Text>
              <QuestionContainer>
                <BoxInput
                  large
                  mTop={12}
                  placeholder="예) 앞쪽 머리가 아픈데 타이레놀을 먹어도 될까요?"
                  value={question}
                  onChangeText={setQuestion}
                  maxLength={500}
                />
                <QuestionCount>
                  <Text T7 color={COLOR.GRAY2}>
                    {question?.length ?? 0}/500
                  </Text>
                </QuestionCount>
              </QuestionContainer>
            </ScrollView>

            <SolidButton
              text="질문하기"
              mBottom={20}
              disabled={!question}
              action={() => handleSubmitPostQuestion()}
            />
          </Container>
        </KeyboardAvoiding>
      </SafeArea>

      {loading && (
        <LoadingBackground>
          <LoadingBannerBox>
            <Image
              source={largeBanner1}
              width={300}
              height={246}
              mLeft={16}
              mTop={-20}
            />
          </LoadingBannerBox>
          <Text T3 medium center color="#FFFFFF" mTop={20}>
            잠시만 기다려주세요.{`\n`}
            오케이닥 AI가 답변을 생성중이에요.
          </Text>
        </LoadingBackground>
      )}
    </>
  );
}

const CustomHeader = styled.View`
  width: 100%;
  height: ${Device.osName === "Android" ? "90px" : "50px"};
  padding: ${Device.osName === "Android" ? "26px 24px 0px 24px" : "0 24px"};
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
`;

const BackArrowWrapper = styled.View`
  position: absolute;
  top: ${Device.osName === "Android" ? "44px" : "10px"};
  left: -4px;
`;

const QuestionContainer = styled.View`
  position: relative;
`;

const QuestionCount = styled.View`
  position: absolute;
  bottom: 10px;
  right: 12px;
`;

const LoadingBackground = styled.View`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #000000aa;
  justify-content: center;
  align-items: center;
`;

const LoadingBannerBox = styled.View`
  height: 280px;
  width: 320px;
  background-color: #ffffff;
  border-radius: 12px;
  justify-content: center;
  align-items: center;
`;
