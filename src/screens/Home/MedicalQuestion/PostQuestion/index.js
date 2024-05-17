//React
import { useEffect, useState, useContext, useRef, useCallback } from "react";
import { ApiContext } from "context/ApiContext";
import { AppContext } from "context/AppContext";
import useQnAUpdate from "hook/useQnAUpdate";
import styled from "styled-components/native";

//Components
import { COLOR, TYPOGRAPHY } from "constants/design";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
  Keyboard,
  Alert,
  Animated,
  FlatList,
  useWindowDimensions,
  StyleSheet,
} from "react-native";
import {
  SafeArea,
  KeyboardAvoiding,
  Container,
  ScrollView,
  Row,
  Box,
} from "components/Layout";
import { Text } from "components/Text";
import { Image } from "components/Image";
import { SolidButton } from "components/Button";
import { ExpandingDot } from "react-native-animated-pagination-dots";

//Api
import { postTemporaryQuestion, postMyQuestion, getMyQuestions } from "api/QnA";

//Assets
import largeBanner1 from "assets/images/large_banner1.png";
import largeBanner2 from "assets/images/large_banner2.png";
import largeBanner3 from "assets/images/large_banner3.png";

const banner = [
  // {
  //   key: "1",
  //   image: largeBanner1,
  // },
  {
    key: "2",
    image: largeBanner2,
  },
  {
    key: "3",
    image: largeBanner3,
  },
];

export default function PostQuestionScreen({ navigation }) {
  const { updateAllQnA, updateMyQnA } = useQnAUpdate();
  const {
    state: { accountData, profileData },
  } = useContext(ApiContext);
  const { dispatch } = useContext(AppContext);
  const [question, setQuestion] = useState();
  const [loading, setLoading] = useState(false);

  async function handleSubmitPostQuestion() {
    Keyboard.dismiss();
    setLoading(true);
    if (accountData.loginToken) {
      try {
        const response = await postMyQuestion(
          accountData.loginToken,
          profileData[0].id,
          question
        );
        updateAllQnA();
        updateMyQnA();
        dispatch({ type: "USE_QUESTION_SHORTCUT" });
        setLoading(false);
        navigation.replace("QuestionDetail", {
          type: "MY",
          questionDetailData: response.data.response,
        });
      } catch (error) {
        if (error?.response?.data) {
          setLoading(false);
          Alert.alert("오류", "답변 생성에 실패하였습니다. 다시 시도해주세요.");
        } else {
          setTimeout(async () => {
            try {
              const response = await getMyQuestions(accountData.loginToken);
              const myQuestions = response.data.response;
              updateAllQnA();
              updateMyQnA();
              dispatch({ type: "USE_QUESTION_SHORTCUT" });
              setLoading(false);
              navigation.replace("QuestionDetail", {
                type: "MY",
                questionDetailData: myQuestions[myQuestions.length - 1],
              });
            } catch {
              setLoading(false);
            }
          }, 10000);
        }
      }
    } else {
      try {
        const response = await postTemporaryQuestion(question);
        updateAllQnA();
        updateMyQnA();
        dispatch({ type: "USE_QUESTION_SHORTCUT" });
        setLoading(false);
        navigation.replace("QuestionDetail", {
          type: "MY",
          questionDetailData: response.data.response,
        });
      } catch {
        setLoading(false);
        Alert.alert("오류", "답변 생성에 실패하였습니다. 다시 시도해주세요.");
      }
    }
  }

  const { width } = useWindowDimensions();
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex =
        currentIndex + 1 === banner.length ? 0 : currentIndex + 1;
      flatListRef.current?.scrollToIndex({
        animated: true,
        index: nextIndex,
      });
      setCurrentIndex(nextIndex);
    }, 2000); // 3초마다 다음 항목으로 자동 스크롤

    return () => clearInterval(interval); // 컴포넌트 언마운트시 인터벌 정리
  }, [currentIndex, banner.length]);

  const renderItem = useCallback(
    ({ item }) => {
      return (
        <BannerImage key={`banner_${item.key}`}>
          <Image source={item.image} width={300} height={300} />
        </BannerImage>
      );
    },
    [width]
  );
  const keyExtractor = useCallback((item) => item.key, []);

  return (
    <>
      <SafeArea>
        <KeyboardAvoiding>
          <ScrollView>
            <Container paddingHorizontal={20}>
              <ScrollView>
                <Text T3 bold mTop={30}>
                  질문을 올리고{"\n"}
                  고민을 해결해 보세요
                </Text>
                <Text T6 medium color={COLOR.GRAY1} mTop={12}>
                  로그인 후 질문을 등록하면{"\n"}
                  추후 '나의 질문' 페이지에서 답변을 재확인할 수 있어요{"\n"}
                </Text>

                <Text T6 medium mTop={20}>
                  질문
                </Text>
                <QuestionContainer>
                  <TextInputBackground>
                    <StyledTextInput
                      multiline
                      textAlignVertical="top"
                      placeholder="예) 앞쪽 머리가 아픈데 타이레놀을 먹어도 될까요?"
                      value={question}
                      onChangeText={setQuestion}
                      maxLength={500}
                    />
                  </TextInputBackground>
                  <QuestionCount>
                    <Text T7 color={COLOR.GRAY2}>
                      {question?.length ?? 0}/500
                    </Text>
                  </QuestionCount>
                </QuestionContainer>

                <Row mTop={16}>
                  <Ionicons
                    name="alert-circle-outline"
                    size={14}
                    color={COLOR.GRAY2}
                    style={{ marginTop: 1 }}
                  />
                  <NoticeBox>
                    <Text T7 color={COLOR.GRAY2} mLeft={4}>
                      개인 정보 보호를 위해 개인정보는 입력하지 않도록 주의해
                      주세요.
                    </Text>
                  </NoticeBox>
                </Row>

                <Row mTop={5}>
                  <Ionicons
                    name="alert-circle-outline"
                    size={14}
                    color={COLOR.GRAY2}
                    style={{ marginTop: 1 }}
                  />
                  <NoticeBox>
                    <Text T7 color={COLOR.GRAY2} mLeft={4}>
                      서비스 목적과 맞지 않은 질문과 운영을 방해하는 행위가
                      지속될 경우 사전 안내 없이 이용이 한시적 또는 영구적으로
                      제한 될 수 있어요.
                    </Text>
                  </NoticeBox>
                </Row>

                <Box height={120} />
              </ScrollView>
            </Container>
          </ScrollView>
        </KeyboardAvoiding>

        <LinearGradient
          colors={["rgba(255,255,255,0)", "#FFFFFF", "#FFFFFF", "#FFFFFF"]}
          style={{
            width: "100%",
            marginBottom: 0,
            padding: 20,
            paddingTop: 0,
            position: "absolute",
            bottom: 0,
          }}
        >
          <SolidButton
            mTop={60}
            mBottom={20}
            text="질문하기"
            action={() => handleSubmitPostQuestion()}
          />
        </LinearGradient>
      </SafeArea>

      {loading && (
        <LoadingBackground>
          <LoadingBannerBox>
            <FlatList
              ref={flatListRef}
              data={banner}
              keyExtractor={keyExtractor}
              showsHorizontalScrollIndicator={false}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                {
                  useNativeDriver: false,
                }
              )}
              style={styles.flatList}
              pagingEnabled
              horizontal
              decelerationRate={"fast"}
              renderItem={renderItem}
              getItemLayout={(data, index) => ({
                length: 300,
                offset: 300 * index,
                index,
              })}
            />
            <ExpandingDot
              data={banner}
              expandingDotWidth={20}
              scrollX={scrollX}
              inActiveDotColor={COLOR.GRAY2}
              activeDotColor={"#FFFFFF"}
              dotStyle={styles.dotStyles}
              containerStyle={styles.constainerStyles}
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

const styles = StyleSheet.create({
  flatList: {
    width: 300,
    height: 300,
  },
  constainerStyles: {
    bottom: 10,
  },
  dotStyles: {
    width: 6,
    height: 6,
    borderRadius: 6,
    marginHorizontal: 4,
  },
});

const QuestionContainer = styled.View`
  position: relative;
`;

const TextInputBackground = styled.View`
  margin-top: 12px;
  padding: 12px 16px 32px 16px;
  width: 100%;
  background-color: ${COLOR.GRAY6};
  border-radius: 5px;
`;

const StyledTextInput = styled.TextInput`
  height: 240px;
  width: 100%;
  font-family: "Pretendard-Regular";
  font-size: ${TYPOGRAPHY.T6.SIZE};
  line-height: ${TYPOGRAPHY.T6.LEADING};
`;

const QuestionCount = styled.View`
  position: absolute;
  bottom: 10px;
  right: 12px;
`;

const NoticeBox = styled.View`
  margin-right: 20px;
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
  height: 300px;
  width: 300px;
  background-color: #d3d2fe;
  border-radius: 12px;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const BannerImage = styled.View`
  width: 300px;
  align-items: center;
`;
