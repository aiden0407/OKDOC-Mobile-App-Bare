//React
import { useEffect, useState, useContext } from "react";
import { ApiContext } from "context/ApiContext";
import { AppContext } from "context/AppContext";
import useQnAUpdate from "hook/useQnAUpdate";
import styled from "styled-components/native";

//Components
import { COLOR } from "constants/design";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Platform, RefreshControl, Alert } from "react-native";
import {
  SafeArea,
  Container,
  ScrollView,
  Row,
  DividingLine,
  ContainerCenter,
  PaddingContainer,
  Box,
} from "components/Layout";
import { Text } from "components/Text";
import { Image } from "components/Image";
import { SolidButton } from "components/Button";
import NavigationBackArrow from "components/NavigationBackArrow";
import NeedLogin from "components/NeedLogin";

//Api
import { deleteMyQuestion, postFeedback } from "api/QnA";

//Assets
import mainIcon from "assets/main/main_icon.png";
import noneHistoryColorIcon from "assets/icons/none-history-color.png";

export default function AllQuestionsScreen({ navigation }) {
  const { updateAllQnA, updateMyQnA } = useQnAUpdate();
  const {
    state: { accountData, allQuestions, myQuestions },
  } = useContext(ApiContext);
  const {
    state: { questionDataLoading },
  } = useContext(AppContext);
  const [pageStatus, setPageStatus] = useState("ALL");
  const [refreshing, setRefreshing] = useState(false);

  const [allDropdownIndex, setAllDropdownIndex] = useState();
  const [myDropdownIndex, setMyDropdownIndex] = useState();

  const [reportIndex, setReportIndex] = useState();
  const [reportReason, setReportReason] = useState("WRONG");

  const onRefresh = () => {
    setRefreshing(true);
    updateAllQnA();
    updateMyQnA();
  };

  useEffect(() => {
    if (!questionDataLoading) {
      setRefreshing(false);
    }
  }, [questionDataLoading]);

  function handleDetail(questionDetailData) {
    setAllDropdownIndex();
    setMyDropdownIndex();
    navigation.navigate("QuestionDetail", {
      type: pageStatus,
      questionDetailData: questionDetailData,
    });
  }

  async function handleDeleteQuestion(questionDetailData) {
    try {
      response = await deleteMyQuestion(
        accountData.loginToken,
        questionDetailData.id
      );
      Alert.alert("삭제 완료", "해당 질문이 정상적으로 삭제되었습니다.");
    } catch {
      Alert.alert("오류", "질문 삭제를 실패하였습니다. 다시 시도해주세요.");
    }
    updateAllQnA();
    updateMyQnA();
  }

  async function handleReport() {
    try {
      if (pageStatus === "ALL") {
        await postFeedback(allQuestions[reportIndex].id, reportReason);
      } else {
        await postFeedback(myQuestions[reportIndex].id, reportReason);
      }
      setReportIndex();
      Alert.alert("신고 완료", "해당 신고가 정상적으로 접수되었습니다.");
    } catch (error) {
      Alert.alert(
        "오류",
        "답변 신고를 실패하였습니다. 다시 시도해 주시기 바립니다."
      );
    }
  }

  function handleLogin() {
    navigation.navigate("LoginStackNavigation");
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

  function Question({ questionDetailData, index }) {
    return (
      <QuestionContainer
        activeOpacity={1}
        onPress={() => {
          if (pageStatus === "ALL" && allDropdownIndex !== undefined) {
            setAllDropdownIndex();
          } else if (pageStatus === "MY" && myDropdownIndex !== undefined) {
            setMyDropdownIndex();
          } else {
            handleDetail(questionDetailData);
          }
        }}
      >
        <StyledRow mTop={30}>
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
          {/* <DropdownMenu
            activeOpacity={1}
            onPress={() => {
              if (pageStatus === "ALL") {
                if (allDropdownIndex === index) {
                  setAllDropdownIndex();
                } else {
                  setAllDropdownIndex(index);
                }
              } else {
                if (myDropdownIndex === index) {
                  setMyDropdownIndex();
                } else {
                  setMyDropdownIndex(index);
                }
              }
            }}
          >
            <Ionicons
              name="ellipsis-horizontal-circle-sharp"
              size={20}
              color="#BBBBBB"
            />
          </DropdownMenu> */}
        </StyledRow>

        <QuestionBox>
          <Ellipsis T5 bold mTop={14} numberOfLines={2} ellipsizeMode="tail">
            Q.{" "}
            {
              questionDetailData.question.messages[
                questionDetailData.question.messages.length - 1
              ].content
            }
          </Ellipsis>
        </QuestionBox>

        {pageStatus === "ALL" && allDropdownIndex === index && (
          <DropdownBox>
            <DropdownReport
              underlayColor={COLOR.GRAY5}
              onPress={() => {
                setReportIndex(index);
                setAllDropdownIndex();
              }}
            >
              <Text T6>답변 신고</Text>
            </DropdownReport>
          </DropdownBox>
        )}

        {pageStatus === "MY" && myDropdownIndex === index && (
          <DropdownBox>
            <DropdownMyDelete
              underlayColor={COLOR.GRAY5}
              onPress={() => {
                setMyDropdownIndex();
                handleDeleteQuestion(questionDetailData);
              }}
            >
              <Text T6>질문 삭제</Text>
            </DropdownMyDelete>
            <DropdownMyReport
              underlayColor={COLOR.GRAY5}
              onPress={() => {
                setReportIndex(index);
                setMyDropdownIndex();
              }}
            >
              <Text T6>답변 신고</Text>
            </DropdownMyReport>
          </DropdownBox>
        )}

        <AnswerBox>
          <>
            <Row align>
              <Image source={mainIcon} width={25} height={25} circle />
              <Text T6 bold mLeft={6} color={COLOR.GRAY0}>
                오케이닥 AI
              </Text>
            </Row>
            <Ellipsis T6 mTop={6} numberOfLines={2} ellipsizeMode="tail">
              A.{" "}
              {
                JSON.parse(
                  questionDetailData.answer.choices[
                    questionDetailData.answer.choices.length - 1
                  ].message.content
                ).message
              }
            </Ellipsis>
          </>
        </AnswerBox>

        <DividingLine thin mTop={30} />
      </QuestionContainer>
    );
  }

  return (
    <>
      <SafeArea>
        <ContainerTopPadding>
          <CustomHeader>
            <BackArrowWrapper>
              <NavigationBackArrow action={() => navigation.goBack()} />
            </BackArrowWrapper>
            <HeaderColumn
              onPress={() => {
                setPageStatus("ALL");
                setAllDropdownIndex();
                setMyDropdownIndex();
              }}
            >
              <Text
                T5
                bold={pageStatus === "ALL"}
                color={pageStatus === "ALL" ? "#000000" : COLOR.GRAY1}
                mTop={10}
              >
                전체 질문
              </Text>
              {pageStatus === "ALL" && <SelectedBorderBottom />}
            </HeaderColumn>
            <HeaderColumn
              onPress={() => {
                setPageStatus("MY");
                setAllDropdownIndex();
                setMyDropdownIndex();
              }}
            >
              <Text
                T5
                bold={pageStatus === "MY"}
                color={pageStatus === "MY" ? "#000000" : COLOR.GRAY1}
                mTop={10}
              >
                나의 질문
              </Text>
              {pageStatus === "MY" && <SelectedBorderBottom />}
            </HeaderColumn>
          </CustomHeader>

          {pageStatus === "ALL" && (
            <>
              {allQuestions.length > 0 ? (
                <TouchableContainer
                  activeOpacity={1}
                  onPress={() => {
                    if (allDropdownIndex !== undefined) {
                      setAllDropdownIndex();
                    }
                  }}
                >
                  <ScrollView
                    refreshControl={
                      <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={COLOR.MAIN}
                        progressViewOffset={20}
                      />
                    }
                  >
                    {allQuestions.map((item, index) => (
                      <Question
                        key={index}
                        questionDetailData={item}
                        index={index}
                      />
                    ))}
                    <Box height={120} />
                  </ScrollView>
                </TouchableContainer>
              ) : (
                <ContainerCenter>
                  <Image
                    source={noneHistoryColorIcon}
                    width={65}
                    height={65}
                    mTop={-50}
                  />
                  <Text T3 bold mTop={24}>
                    아직 질문 내역이 없어요
                  </Text>
                  <Text T6 medium center color={COLOR.GRAY1} mTop={12}>
                    오케이닥 AI에게 의료 상담 해보세요
                  </Text>
                </ContainerCenter>
              )}
            </>
          )}

          {pageStatus === "MY" && accountData.loginToken && (
            <>
              {myQuestions.length > 0 ? (
                <TouchableContainer
                  activeOpacity={1}
                  onPress={() => {
                    if (myDropdownIndex !== undefined) {
                      setMyDropdownIndex();
                    }
                  }}
                >
                  <ScrollView
                    refreshControl={
                      <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={COLOR.MAIN}
                        progressViewOffset={20}
                      />
                    }
                  >
                    {myQuestions.map((item, index) => (
                      <Question
                        key={index}
                        questionDetailData={item}
                        index={index}
                      />
                    ))}
                    <Box height={120} />
                  </ScrollView>
                </TouchableContainer>
              ) : (
                <ContainerCenter>
                  <Image
                    source={noneHistoryColorIcon}
                    width={65}
                    height={65}
                    mTop={-50}
                  />
                  <Text T3 bold mTop={24}>
                    아직 질문 내역이 없어요
                  </Text>
                  <Text T6 medium center color={COLOR.GRAY1} mTop={12}>
                    오케이닥 AI에게 의료 상담 해보세요
                  </Text>
                </ContainerCenter>
              )}
            </>
          )}

          {pageStatus === "MY" && !accountData.loginToken && (
            <ContainerCenter>
              <NeedLogin mTop={-80} action={() => handleLogin()} />
            </ContainerCenter>
          )}
        </ContainerTopPadding>

        {(pageStatus === "ALL" || accountData.loginToken) && (
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
              action={() => navigation.navigate("PostQuestion")}
            />
          </LinearGradient>
        )}
      </SafeArea>

      {reportIndex !== undefined && (
        <BottomSheetBackground onPress={() => setReportIndex()}>
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
                    잘못된 정보 제공
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

const ContainerTopPadding = styled(Container)`
  padding-top: ${Platform.OS === "ios" ? "0px" : "40px"};
`;

const CustomHeader = styled.View`
  width: 100%;
  height: 50px;
  padding: 0 24px;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  border-bottom-width: 1.5px;
  border-color: ${COLOR.GRAY3};
`;

const BackArrowWrapper = styled.View`
  position: absolute;
  top: 10px;
  left: 16px;
`;

const HeaderColumn = styled.Pressable`
  width: 120px;
  height: 100%;
  align-items: center;
`;

const SelectedBorderBottom = styled.View`
  position: absolute;
  width: 120px;
  height: 3px;
  bottom: -2px;
  background-color: ${COLOR.MAIN};
`;

const TouchableContainer = styled.TouchableOpacity`
  padding: 0 20px;
  flex: 1;
`;

const QuestionContainer = styled.TouchableOpacity`
  position: relative;
`;

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

const DropdownBox = styled.View`
  top: 50px;
  right: 22px;
  position: absolute;
  flex-direction: column;
`;

const DropdownMyDelete = styled.TouchableHighlight`
  padding: 7px 14px;
  background-color: ${COLOR.GRAY6};
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
`;

const DropdownMyReport = styled.TouchableHighlight`
  padding: 7px 14px;
  background-color: ${COLOR.GRAY6};
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
`;

const DropdownReport = styled.TouchableHighlight`
  padding: 7px 14px;
  background-color: ${COLOR.GRAY6};
  border-radius: 5px;
`;

const QuestionBox = styled.View`
  width: 100%;
  padding: 0 6px;
`;

const Ellipsis = styled(Text)`
  width: 100%;
`;

const AnswerBox = styled.View`
  margin-top: 20px;
  padding: 16px 12px;
  background-color: ${COLOR.GRAY6};
  border-radius: 10px;
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
  height: 340px;
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

const LargePadding = styled.View`
  width: 100%;
  padding: 0 14px;
`;
