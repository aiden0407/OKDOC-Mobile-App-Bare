//React
import { useState, useContext } from "react";
import { ApiContext } from "context/ApiContext";
import styled from "styled-components/native";

//Components
import * as Device from "expo-device";
import { COLOR } from "constants/design";
import { Ionicons } from "@expo/vector-icons";
import { RefreshControl } from "react-native";
import {
  SafeArea,
  Container,
  ScrollView,
  Row,
  DividingLine,
  ContainerCenter,
  PaddingContainer,
} from "components/Layout";
import { Text } from "components/Text";
import { Image } from "components/Image";
import { SolidButton } from "components/Button";
import NavigationBackArrow from "components/NavigationBackArrow";
import NeedLogin from "components/NeedLogin";

//Assets
import mainIcon from "assets/main/main_icon.png";
import noneHistoryIcon from "assets/icons/none-history.png";

const allQuestionExamples = [
  {
    question:
      "요즘 계속해서 밤에 잠을 제대로 못 자고 있어요. 인간에게 충분한 수면이 왜 필수적인가요? 제가 잠을 제대로 못 자는 이유 중 하나가 이런 중요성을 모르기 때문일까요?",
    answer: {
      message:
        "충분한 수면은 신체와 정신 건강에 필수적입니다. 수면 부족은 주의력, 기억력 및 판단력 저하, 기분 변화, 면역 체계 약화, 만성 건강 문제의 위험 증가와 관련이 있습니다. 대부분의 성인은 밤에 최소 7-8시간의 수면이 필요합니다.",
      department: "가정의학과",
    },
  },
  {
    question:
      "제가 최근에 당뇨병 진단을 받았어요. 식단 관리가 정말 중요하다고 들었는데, 당뇨병 환자가 식단에서 특별히 주의해야 할 것들이 무엇인지 알고 싶습니다. 혹시 제가 피해야 할 음식이나 섭취를 권장하는 음식이 있을까요?",
    answer: {
      department: "신장내과",
      message:
        "당뇨병 환자는 혈당 수치를 안정적으로 유지하기 위해 식사 계획을 잘 세워야 합니다. 고당분 식품, 가공식품, 고지방 식품을 피하고, 복합 탄수화물, 신선한 과일과 채소, 통곡물을 포함한 균형 잡힌 식단을 섭취하는 것이 좋습니다.",
    },
  },
  {
    question: "어떻게 하면 스트레스를 효과적으로 관리할 수 있나요?",
    answer: {
      message:
        "스트레스 관리에는 정기적인 운동, 충분한 수면, 건강한 식습관 유지, 명상 또는 요가 같은 이완 기법이 도움이 됩니다. 중요한 것은 스트레스의 원인을 파악하고 긍정적인 대처 방법을 찾는 것입니다.",
      department: "정신건강의학과",
    },
  },
  {
    question: "피부를 건강하게 유지하기 위한 최고의 팁은 무엇인가요?",
    answer: {
      message:
        "피부 건강을 위해 매일 자외선 차단제를 사용하고, 충분한 수분을 섭취하며, 건강한 식단을 유지하세요. 또한, 정기적인 피부 청결과 보습도 중요합니다.",
      department: "피부과",
    },
  },
  {
    question: "일상에서 눈 건강을 보호하는 방법은 무엇인가요?",
    answer: {
      message:
        "장시간 전자기기 사용을 피하고, 20분마다 20초간 20피트(약 6미터) 떨어진 곳을 바라보는 20-20-20 규칙을 따르세요. 눈에 좋은 비타민을 섭취하고, 자외선 차단 안경을 착용하세요.",
      department: "안과",
    },
  },
  {
    question: "고혈압을 관리하는 방법은 무엇인가요?",
    answer: {
      message:
        "저염식 식단을 유지하고, 규칙적으로 운동하며, 스트레스를 관리하고, 정기적인 혈압 체크를 하는 것이 중요합니다. 또한, 의사의 지시에 따라 약물 치료를 병행할 수 있습니다.",
      department: "심장내과",
    },
  },
  {
    question: "만성 피로를 극복하는 방법은 무엇인가요?",
    answer: {
      message:
        "충분한 수면을 취하고, 균형 잡힌 식단을 유지하며, 정기적으로 운동하세요. 또한, 스트레스를 관리하고, 필요한 경우 전문가의도움을 요청하고 자가 치료 방법을 찾는 것이 좋습니다.",
      department: "가정의학과",
    },
  },
  {
    question: "일상 생활에서 청력 손실을 예방하는 방법은 무엇인가요?",
    answer: {
      message:
        "시끄러운 환경을 피하고, 소음이 심할 때는 귀마개를 사용하세요. 또한, 정기적인 청력 검사를 받아 조기에 문제를 발견하고 대응하는 것이 중요합니다.",
      department: "이비인후과",
    },
  },
  {
    question: "골다공증을 예방하기 위한 생활 습관은 무엇인가요?",
    answer: {
      message:
        "칼슘과 비타민 D가 풍부한 음식을 섭취하고, 정기적인 운동을 통해 뼈의 밀도를 높이세요. 흡연과 과도한 알코올 섭취는 피해야 합니다.",
      department: "정형외과",
    },
  },
  {
    question: "아토피 피부염을 관리하는 가장 좋은 방법은 무엇인가요?",
    answer: {
      message:
        "보습제를 꾸준히 사용하여 피부를 촉촉하게 유지하고, 자극적인 성분이 없는 순한 제품을 사용하세요. 필요한 경우 의사의 지시에 따라 약물 치료를 병행할 수 있습니다.",
      department: "피부과",
    },
  },
];

const myQuestionExamples = [
  {
    question:
      "요즘 계속해서 밤에 잠을 제대로 못 자고 있어요. 인간에게 충분한 수면이 왜 필수적인가요? 제가 잠을 제대로 못 자는 이유 중 하나가 이런 중요성을 모르기 때문일까요?",
    answer: {
      message:
        "충분한 수면은 신체와 정신 건강에 필수적입니다. 수면 부족은 주의력, 기억력 및 판단력 저하, 기분 변화, 면역 체계 약화, 만성 건강 문제의 위험 증가와 관련이 있습니다. 대부분의 성인은 밤에 최소 7-8시간의 수면이 필요합니다.",
      department: "가정의학과",
    },
  },
  {
    question:
      "제가 최근에 당뇨병 진단을 받았어요. 식단 관리가 정말 중요하다고 들었는데, 당뇨병 환자가 식단에서 특별히 주의해야 할 것들이 무엇인지 알고 싶습니다. 혹시 제가 피해야 할 음식이나 섭취를 권장하는 음식이 있을까요?",
    answer: {
      department: "신장내과",
      message:
        "당뇨병 환자는 혈당 수치를 안정적으로 유지하기 위해 식사 계획을 잘 세워야 합니다. 고당분 식품, 가공식품, 고지방 식품을 피하고, 복합 탄수화물, 신선한 과일과 채소, 통곡물을 포함한 균형 잡힌 식단을 섭취하는 것이 좋습니다.",
    },
  },
  {
    question: "어떻게 하면 스트레스를 효과적으로 관리할 수 있나요?",
    answer: {
      message:
        "스트레스 관리에는 정기적인 운동, 충분한 수면, 건강한 식습관 유지, 명상 또는 요가 같은 이완 기법이 도움이 됩니다. 중요한 것은 스트레스의 원인을 파악하고 긍정적인 대처 방법을 찾는 것입니다.",
      department: "정신건강의학과",
    },
  },
  {
    question: "피부를 건강하게 유지하기 위한 최고의 팁은 무엇인가요?",
    answer: {
      message:
        "피부 건강을 위해 매일 자외선 차단제를 사용하고, 충분한 수분을 섭취하며, 건강한 식단을 유지하세요. 또한, 정기적인 피부 청결과 보습도 중요합니다.",
      department: "피부과",
    },
  },
  {
    question: "일상에서 눈 건강을 보호하는 방법은 무엇인가요?",
    answer: {
      message:
        "장시간 전자기기 사용을 피하고, 20분마다 20초간 20피트(약 6미터) 떨어진 곳을 바라보는 20-20-20 규칙을 따르세요. 눈에 좋은 비타민을 섭취하고, 자외선 차단 안경을 착용하세요.",
      department: "안과",
    },
  },
  {
    question: "고혈압을 관리하는 방법은 무엇인가요?",
    answer: {
      message:
        "저염식 식단을 유지하고, 규칙적으로 운동하며, 스트레스를 관리하고, 정기적인 혈압 체크를 하는 것이 중요합니다. 또한, 의사의 지시에 따라 약물 치료를 병행할 수 있습니다.",
      department: "심장내과",
    },
  },
  {
    question: "만성 피로를 극복하는 방법은 무엇인가요?",
    answer: {
      message:
        "충분한 수면을 취하고, 균형 잡힌 식단을 유지하며, 정기적으로 운동하세요. 또한, 스트레스를 관리하고, 필요한 경우 전문가의도움을 요청하고 자가 치료 방법을 찾는 것이 좋습니다.",
      department: "가정의학과",
    },
  },
  {
    question: "일상 생활에서 청력 손실을 예방하는 방법은 무엇인가요?",
    answer: {
      message:
        "시끄러운 환경을 피하고, 소음이 심할 때는 귀마개를 사용하세요. 또한, 정기적인 청력 검사를 받아 조기에 문제를 발견하고 대응하는 것이 중요합니다.",
      department: "이비인후과",
    },
  },
  {
    question: "골다공증을 예방하기 위한 생활 습관은 무엇인가요?",
    answer: {
      message:
        "칼슘과 비타민 D가 풍부한 음식을 섭취하고, 정기적인 운동을 통해 뼈의 밀도를 높이세요. 흡연과 과도한 알코올 섭취는 피해야 합니다.",
      department: "정형외과",
    },
  },
  {
    question: "아토피 피부염을 관리하는 가장 좋은 방법은 무엇인가요?",
    answer: {
      message:
        "보습제를 꾸준히 사용하여 피부를 촉촉하게 유지하고, 자극적인 성분이 없는 순한 제품을 사용하세요. 필요한 경우 의사의 지시에 따라 약물 치료를 병행할 수 있습니다.",
      department: "피부과",
    },
  },
];

export default function AllQuestionsScreen({ navigation }) {
  const {
    state: { accountData },
  } = useContext(ApiContext);
  const [pageStatus, setPageStatus] = useState("ALL");
  const [allRefreshing, setAllRefreshing] = useState(false);
  const [allDropdownIndex, setAllDropdownIndex] = useState();

  const [myRefreshing, setMyRefreshing] = useState(false);
  const [myDropdownIndex, setMyDropdownIndex] = useState();

  const [reportOpened, setReportOpened] = useState(false);
  const [reportReasonIndex, setReportReasonIndex] = useState(0);

  const onAllRefresh = () => {
    setAllRefreshing(true);
    setTimeout(() => {
      setAllRefreshing(false);
    }, 1000);
  };

  const onMyRefresh = () => {
    setMyRefreshing(true);
    setTimeout(() => {
      setMyRefreshing(false);
    }, 1000);
  };

  function handleDetail(questionDetailData) {
    setAllDropdownIndex();
    setMyDropdownIndex();
    navigation.navigate("QuestionDetail", {
      type: pageStatus,
      questionDetailData: questionDetailData,
    });
  }

  function handleLogin() {
    navigation.navigate("LoginStackNavigation");
  }

  function Question({ questionDetailData, index }) {
    return (
      <QuestionContainer>
        <StyledRow mTop={30}>
          <StyledRow>
            <CategoryBox>
              <Text T7 bold color={COLOR.MAIN}>
                {questionDetailData.answer?.department ?? "카테고리 없음"}
              </Text>
            </CategoryBox>
            <Text T7 medium color={COLOR.GRAY2} mLeft={8}>
              04/02 17:37
            </Text>
          </StyledRow>
          <DropdownMenu
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
          </DropdownMenu>
        </StyledRow>

        <QuestionBox
          activeOpacity={1}
          onPress={() => handleDetail(questionDetailData)}
        >
          <Ellipsis T6 bold mTop={14} numberOfLines={2} ellipsizeMode="tail">
            Q. {questionDetailData.question}
          </Ellipsis>
        </QuestionBox>

        {pageStatus === "ALL" && allDropdownIndex === index && (
          <DropdownBox>
            <DropdownReport
              underlayColor={COLOR.GRAY5}
              onPress={() => {
                setAllDropdownIndex();
                setReportOpened(true);
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
                setMyDropdownIndex(false);
              }}
            >
              <Text T6>질문 삭제</Text>
            </DropdownMyDelete>
            <DropdownMyReport
              underlayColor={COLOR.GRAY5}
              onPress={() => {
                setMyDropdownIndex();
                setReportOpened(true);
              }}
            >
              <Text T6>답변 신고</Text>
            </DropdownMyReport>
          </DropdownBox>
        )}

        <AnswerBox
          activeOpacity={1}
          onPress={() => handleDetail(questionDetailData)}
        >
          <>
            <Row align>
              <Image source={mainIcon} width={25} height={25} circle />
              <Text T6 bold mLeft={6} color={COLOR.GRAY0}>
                오케이닥 AI
              </Text>
            </Row>
            <Ellipsis T6 mTop={6} numberOfLines={2} ellipsizeMode="tail">
              A. {questionDetailData.answer.message}
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
        <Container>
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
                    refreshing={allRefreshing}
                    onRefresh={onAllRefresh}
                    tintColor={COLOR.MAIN}
                    progressViewOffset={20}
                  />
                }
              >
                {allQuestionExamples.map((item, index) => (
                  <Question
                    key={index}
                    questionDetailData={item}
                    index={index}
                  />
                ))}
              </ScrollView>
            </TouchableContainer>
          )}

          {pageStatus === "MY" && accountData.loginToken && (
            <>
              {myQuestionExamples.length > 0 ? (
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
                        refreshing={myRefreshing}
                        onRefresh={onMyRefresh}
                        tintColor={COLOR.MAIN}
                        progressViewOffset={20}
                      />
                    }
                  >
                    {myQuestionExamples.map((item, index) => (
                      <Question
                        key={index}
                        questionDetailData={item}
                        index={index}
                      />
                    ))}
                  </ScrollView>
                </TouchableContainer>
              ) : (
                <ContainerCenter>
                  <Image
                    source={noneHistoryIcon}
                    width={65}
                    height={65}
                    mTop={-50}
                  />
                  <Text T6 bold color={COLOR.GRAY3} mTop={16}>
                    아직 질문하신 내용이 없어요
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
        </Container>
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
                  onPress={() => setReportReasonIndex(0)}
                >
                  <CheckBox>
                    <Ionicons
                      name="checkmark-sharp"
                      size={16}
                      color={
                        reportReasonIndex === 0 ? "#FFFFFF" : "transparent"
                      }
                    />
                  </CheckBox>
                  <Text T5 medium mLeft={16}>
                    잘못된 정보 제공
                  </Text>
                </TouchableRow>
                <TouchableRow
                  activeOpacity={1}
                  onPress={() => setReportReasonIndex(1)}
                >
                  <CheckBox>
                    <Ionicons
                      name="checkmark-sharp"
                      size={16}
                      color={
                        reportReasonIndex === 1 ? "#FFFFFF" : "transparent"
                      }
                    />
                  </CheckBox>
                  <Text T5 medium mLeft={16}>
                    개인정보 유출 위험
                  </Text>
                </TouchableRow>
                <TouchableRow
                  activeOpacity={1}
                  onPress={() => setReportReasonIndex(2)}
                >
                  <CheckBox>
                    <Ionicons
                      name="checkmark-sharp"
                      size={16}
                      color={
                        reportReasonIndex === 2 ? "#FFFFFF" : "transparent"
                      }
                    />
                  </CheckBox>
                  <Text T5 medium mLeft={16}>
                    기타
                  </Text>
                </TouchableRow>
              </LargePadding>

              <SolidButton mTop={33} text="신고 하기" action={() => {}} />
            </PaddingContainer>
          </BottomSheetContainer>
        </BottomSheetBackground>
      )}
    </>
  );
}

const CustomHeader = styled.View`
  width: 100%;
  height: ${Device.osName === "Android" ? "90px" : "50px"};
  padding: ${Device.osName === "Android" ? "40px 24px 0px 24px" : "0 24px"};
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  border-bottom-width: 1.5px;
  border-color: ${COLOR.GRAY3};
`;

const BackArrowWrapper = styled.View`
  position: absolute;
  top: ${Device.osName === "Android" ? "44px" : "10px"};
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

const QuestionContainer = styled.View`
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

const QuestionBox = styled.TouchableOpacity`
  width: 100%;
  padding: 0 6px;
`;

const Ellipsis = styled(Text)`
  width: 100%;
`;

const AnswerBox = styled.TouchableOpacity`
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
