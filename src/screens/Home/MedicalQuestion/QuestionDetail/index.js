//React
import { useEffect, useState, useContext } from "react";
import { ApiContext } from "context/ApiContext";
import { AppContext } from "context/AppContext";
import useTestAccount from "hook/useTestAccount";
import useQnAUpdate from "hook/useQnAUpdate";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styled from "styled-components/native";
import { dataDogFrontendError } from "api/DataDog";

//Components
import { COLOR } from "constants/design";
import { Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "components/Image";
import {
  SafeArea,
  ScrollView,
  DividingLine,
  PaddingContainer,
  Row,
  Box,
} from "components/Layout";
import { Text } from "components/Text";
import { SolidButton } from "components/Button";

//Api
import { getDoctorsByDepartment } from "api/Home";
import { deleteMyQuestion, postFeedback } from "api/QnA";

//Assets
import mainIcon from "assets/main/main_icon.png";

export default function QuestionDetailScreen({ navigation, route }) {
  const { updateAllQnA, updateMyQnA } = useQnAUpdate();
  const {
    state: { accountData },
  } = useContext(ApiContext);
  const { dispatch: appContextDispatch } = useContext(AppContext);
  const [isDoctorExist, setIsDoctorExist] = useState(false);
  const [isAbroad, setIsAbroad] = useState(false);
  const [dropdownOpened, setDropdownOpened] = useState(false);
  const [reportOpened, setReportOpened] = useState(false);
  const [reportReason, setReportReason] = useState("WRONG");
  const type = route.params.type;
  const questionDetailData = route.params.questionDetailData;

  useEffect(() => {
    if (type === "MY")
      navigation.setOptions({
        title: "나의 질문",
      });
  }, [navigation]);

  useEffect(() => {
    initDoctorExist();
    initNetInfo();
  }, []);

  const initDoctorExist = async () => {
    if (questionDetailData?.clinical_department) {
      try {
        await getDoctorsByDepartment(
          questionDetailData?.clinical_department?.name
        );
        setIsDoctorExist(true);
      } catch {
        // 해당 진료과 의사 없음
      }
    }
  };

  const initNetInfo = async () => {
    let netInfo;
    try {
      const jsonValue = await AsyncStorage.getItem("@net_information");
      if (jsonValue !== null) {
        netInfo = JSON.parse(jsonValue);
      }
    } catch (error) {
      dataDogFrontendError(error);
    }
    if (netInfo?.geoip?.country?.iso_code !== "KR") {
      setIsAbroad(true);
    }
  };

  function handleReservation(department) {
    appContextDispatch({
      type: "TELEMEDICINE_RESERVATION_DEPARTMENT",
      department: [department],
    });
    appContextDispatch({ type: "USE_SHORTCUT" });
    navigation.navigate("TelemedicineReservation", { screen: "Reservation" });
  }

  async function handleDeleteQuestion() {
    try {
      await deleteMyQuestion(accountData.loginToken, questionDetailData.id);
      Alert.alert("삭제 완료", "해당 질문이 정상적으로 삭제되었습니다.");
    } catch {
      Alert.alert(
        "오류",
        "질문 삭제를 실패하였습니다. 다시 시도해 주시기 바립니다."
      );
    }

    updateAllQnA();
    updateMyQnA();
    navigation.goBack();
  }

  async function handleReport() {
    try {
      await postFeedback(questionDetailData.id, reportReason);
      setReportOpened(false);
      Alert.alert("신고 완료", "해당 신고가 정상적으로 접수되었습니다.");
    } catch {
      Alert.alert(
        "오류",
        "답변 신고를 실패하였습니다. 다시 시도해 주시기 바립니다."
      );
    }
  }

  function formatDate(createdAt) {
    const date = new Date(createdAt);

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();

    const formattedYear = year.toString().slice(-2);
    const formattedMonth = ("0" + month).slice(-2);
    const formattedDay = ("0" + day).slice(-2);
    const formattedHour = ("0" + hour).slice(-2);
    const formattedMinute = ("0" + minute).slice(-2);

    return `${formattedYear}/${formattedMonth}/${formattedDay} ${formattedHour}:${formattedMinute}`;
  }

  return (
    <>
      <SafeArea>
        <ScrollView paddingTop={24}>
          <PaddingContainer>
            <StyledRow>
              <StyledRow>
                <CategoryBox>
                  <Text T6 bold color={COLOR.MAIN}>
                    {questionDetailData?.clinical_department?.name ??
                      "카테고리 없음"}
                  </Text>
                </CategoryBox>
                <Text T7 medium color={COLOR.GRAY2} mLeft={8}>
                  {formatDate(questionDetailData.createdAt)}
                </Text>
              </StyledRow>

              <DropdownMenu
                activeOpacity={1}
                onPress={() => setDropdownOpened(true)}
              >
                <Ionicons
                  name="ellipsis-horizontal-circle-sharp"
                  size={26}
                  color="#BBBBBB"
                />
              </DropdownMenu>
            </StyledRow>

            <SmallPadding>
              <Text T5 bold mTop={10}>
                Q.{" "}
                {
                  questionDetailData.question.messages[
                    questionDetailData.question.messages.length - 1
                  ].content
                }
              </Text>
            </SmallPadding>
          </PaddingContainer>

          <DividingLine mTop={30} />

          <PaddingContainer>
            <AnswerBox>
              <Row align>
                <Image source={mainIcon} width={37} height={37} circle />
                <Text T6 bold mLeft={12}>
                  오케이닥 AI
                </Text>
              </Row>
              <Text T5 bold mTop={20}>
                A. 안녕하세요, 오케이닥 AI입니다.
              </Text>
              <Text T5 mTop={20}>
                {
                  JSON.parse(
                    questionDetailData.answer.choices[
                      questionDetailData.answer.choices.length - 1
                    ].message.content
                  ).message
                }
              </Text>
            </AnswerBox>

            <Row mTop={16}>
              <Ionicons
                name="alert-circle-outline"
                size={14}
                color={COLOR.GRAY2}
                style={{ marginTop: 1 }}
              />
              <NoticeBox>
                <Text T7 color={COLOR.GRAY2} mLeft={4}>
                  본 답변은 AI가 생성한 답변으로 의학적 판단이나 진료 행위로
                  해석될 수 없으며, 이로 인해 발생하는 어떠한 책임도 지지
                  않습니다.
                </Text>
              </NoticeBox>
            </Row>
          </PaddingContainer>

          <Box height={300} />
        </ScrollView>

        {dropdownOpened && (
          <DropdownBackground
            activeOpacity={1}
            onPress={() => setDropdownOpened(false)}
          >
            <DropdownBox>
              {type === "MY" ? (
                <>
                  <DropdownMyDelete
                    underlayColor={COLOR.GRAY5}
                    onPress={() => handleDeleteQuestion()}
                  >
                    <Text T6>질문 삭제</Text>
                  </DropdownMyDelete>
                  <DropdownMyReport
                    underlayColor={COLOR.GRAY5}
                    onPress={() => {
                      setDropdownOpened(false);
                      setReportOpened(true);
                    }}
                  >
                    <Text T6>답변 신고</Text>
                  </DropdownMyReport>
                </>
              ) : (
                <DropdownReport
                  underlayColor={COLOR.GRAY5}
                  onPress={() => {
                    setDropdownOpened(false);
                    setReportOpened(true);
                  }}
                >
                  <Text T6>답변 신고</Text>
                </DropdownReport>
              )}
            </DropdownBox>
          </DropdownBackground>
        )}

        {(isAbroad || useTestAccount(accountData.email)) && isDoctorExist && (
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
              text={
                questionDetailData?.clinical_department?.name + " " + "상담하기"
              }
              action={() =>
                handleReservation(questionDetailData?.clinical_department?.name)
              }
            />
          </LinearGradient>
        )}
      </SafeArea>

      {reportOpened && (
        <BottomSheetBackground onPress={() => setReportOpened(false)}>
          <BottomSheetContainer>
            <Text T5 bold>
              신고 사유
            </Text>
            <DividingLine thin mTop={12} />
            <PaddingContainer>
              <LargePadding>
                <TouchableRow
                  activeOpacity={1}
                  onPress={() => setReportReason("WRONG")}
                >
                  <CheckBox>
                    <Ionicons
                      name="checkmark-sharp"
                      size={16}
                      color={
                        reportReason === "WRONG" ? "#FFFFFF" : "transparent"
                      }
                    />
                  </CheckBox>
                  <Text T5 medium mLeft={16}>
                    잘못된 답변 제공
                  </Text>
                </TouchableRow>
                <TouchableRow
                  activeOpacity={1}
                  onPress={() => setReportReason("MISS_MAPPING")}
                >
                  <CheckBox>
                    <Ionicons
                      name="checkmark-sharp"
                      size={16}
                      color={
                        reportReason === "MISS_MAPPING"
                          ? "#FFFFFF"
                          : "transparent"
                      }
                    />
                  </CheckBox>
                  <Text T5 medium mLeft={16}>
                    잘못된 진료과 제공
                  </Text>
                </TouchableRow>
                <TouchableRow
                  activeOpacity={1}
                  onPress={() => setReportReason("WARN")}
                >
                  <CheckBox>
                    <Ionicons
                      name="checkmark-sharp"
                      size={16}
                      color={
                        reportReason === "WARN" ? "#FFFFFF" : "transparent"
                      }
                    />
                  </CheckBox>
                  <Text T5 medium mLeft={16}>
                    개인정보 유출 위험
                  </Text>
                </TouchableRow>
                <TouchableRow
                  activeOpacity={1}
                  onPress={() => setReportReason("ETC")}
                >
                  <CheckBox>
                    <Ionicons
                      name="checkmark-sharp"
                      size={16}
                      color={reportReason === "ETC" ? "#FFFFFF" : "transparent"}
                    />
                  </CheckBox>
                  <Text T5 medium mLeft={16}>
                    기타
                  </Text>
                </TouchableRow>
              </LargePadding>

              <SolidButton
                mTop={33}
                text="신고 하기"
                action={() => handleReport()}
              />
            </PaddingContainer>
          </BottomSheetContainer>
        </BottomSheetBackground>
      )}
    </>
  );
}

const StyledRow = styled(Row)`
  justify-content: space-between;
  align-items: center;
`;

const CategoryBox = styled.View`
  padding: 4px 16px;
  background-color: ${COLOR.SUB4};
  border-radius: 5px;
  justify-content: center;
  align-items: center;
`;

const DropdownMenu = styled.TouchableOpacity``;

const DropdownBackground = styled.TouchableOpacity`
  position: absolute;
  width: 100%;
  height: 100%;
`;

const DropdownBox = styled.View`
  top: 54px;
  right: 24px;
  position: absolute;
  flex-direction: column;
`;

const DropdownMyDelete = styled.TouchableHighlight`
  padding: 8px 18px;
  background-color: ${COLOR.GRAY5};
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
`;

const DropdownMyReport = styled.TouchableHighlight`
  padding: 8px 18px;
  background-color: ${COLOR.GRAY5};
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
`;

const DropdownReport = styled.TouchableHighlight`
  padding: 8px 18px;
  background-color: ${COLOR.GRAY5};
  border-radius: 5px;
`;

const SmallPadding = styled.View`
  width: 100%;
  padding: 0 6px;
`;

const LargePadding = styled.View`
  width: 100%;
  padding: 0 14px;
`;

const AnswerBox = styled.View`
  margin-top: 30px;
  padding: 16px 12px;
  background-color: ${COLOR.GRAY6};
  border-radius: 10px;
`;

const NoticeBox = styled.View`
  margin-right: 20px;
`;

const BottomSheetBackground = styled.Pressable`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #000000aa;
`;

const BottomSheetContainer = styled.Pressable`
  position: absolute;
  padding: 15px 0px;
  height: 400px;
  width: 100%;
  bottom: 0;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  background-color: #ffffff;
  align-items: center;
`;

const TouchableRow = styled.TouchableOpacity`
  margin-top: 28px;
  flex-direction: row;
  align-items: center;
`;

const CheckBox = styled.View`
  width: 16px;
  height: 16px;
  border-radius: 2px;
  background-color: ${COLOR.MAIN};
  justify-content: center;
  align-items: center;
`;
