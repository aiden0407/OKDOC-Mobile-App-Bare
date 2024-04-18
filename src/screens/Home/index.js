//React
import { useEffect, useState, useContext, useRef, useCallback } from "react";
import { ApiContext } from "context/ApiContext";
import { AppContext } from "context/AppContext";
import { useIsFocused } from "@react-navigation/native";
import styled from "styled-components/native";

//Components
import * as Device from "expo-device";
import { BUTTON, COLOR } from "constants/design";
import { SYMPTOM, DEPARTMENT } from "constants/service";
import {
  Alert,
  Linking,
  Animated,
  FlatList,
  useWindowDimensions,
  StyleSheet,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  StatusBarArea,
  SafeArea,
  ContainerTop,
  ContainerCenter,
  DividingLine,
} from "components/Layout";
import { Text } from "components/Text";
import { Image } from "components/Image";
import { ExpandingDot } from "react-native-animated-pagination-dots";

//Api
import { getProducts } from "api/Home";

//Assets
import bannerImage1 from "assets/images/banner_image1.png";
import bannerImage2 from "assets/images/banner_image2.png";
import bannerImage3 from "assets/images/banner_image3.png";
import bannerImage4 from "assets/images/banner_image4.png";
import bannerImage5 from "assets/images/banner_image5.png";
import bellIcon from "assets/icons/bell.png";
import { Ionicons } from "@expo/vector-icons";

function FocusAwareStatusBar(props) {
  const isFocused = useIsFocused();
  return isFocused && <StatusBar {...props} />;
}

const bannerForTelemedicine = [
  {
    key: "1",
    image: bannerImage4,
  },
  {
    key: "2",
    image: bannerImage1,
    link: "https://insunginfo.notion.site/OK-DOC-ea3bd10f6dbf429389dfd924b29f989a?pvs=4",
  },
  // {
  //   key: '2',
  //   image: bannerImage2,
  //   link: 'https://www.notion.so/insunginfo/OK-DOC-ea3bd10f6dbf429389dfd924b29f989a?pvs=4#a2e7573a0a494cb59dd2ed4e0a051f51'
  // },
  // {
  //   key: '3',
  //   image: bannerImage3,
  //   link: 'https://www.notion.so/insunginfo/OK-DOC-ea3bd10f6dbf429389dfd924b29f989a?pvs=4#10ef9357761648758dc19354c54a8558'
  // }
];

const bannerForQuestions = [
  {
    key: "1",
    image: bannerImage5,
  },
];

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

export default function HomeScreen({ navigation }) {
  const { dispatch: apiContextDispatch } = useContext(ApiContext);
  const { dispatch: appContextDispatch } = useContext(AppContext);
  const [pageStatus, setPageStatus] = useState("TELEMEDICINE");

  useEffect(() => {
    initProducts();
  }, []);

  const initProducts = async function () {
    try {
      const getProductsResponse = await getProducts();
      apiContextDispatch({
        type: "PRODUCT_LIST_UPDATE",
        productList: getProductsResponse.data.response,
      });
      // appContextDispatch({ type: 'TELEMEDICINE_RESERVATION_PRODUCT', product: getProductsResponse.data.response[0] });
      appContextDispatch({
        type: "TELEMEDICINE_RESERVATION_PRODUCT",
        product: getProductsResponse.data.response[3],
      });
    } catch {
      Alert.alert("네트워크 오류로 인해 정보를 불러오지 못했습니다.");
    }
  };

  function handleNextStep(category, name) {
    let department;
    if (category === "symptom") {
      department = SYMPTOM[name]?.DEPARTMENT;
    } else {
      department = [name];
    }
    appContextDispatch({
      type: "TELEMEDICINE_RESERVATION_DEPARTMENT",
      department: department,
    });
    appContextDispatch({ type: "USE_SHORTCUT" });
    navigation.navigate("TelemedicineReservation", { screen: "Reservation" });
  }

  function handleFullCategory() {
    appContextDispatch({ type: "DELETE_SHORTCUT" });
    navigation.navigate("TelemedicineReservation", { screen: "Category" });
  }

  function handlePostQuestion() {
    navigation.navigate("MedicalQuestionNavigation", {
      screen: "PostQuestion",
    });
  }

  function handleAllQuestions() {
    navigation.navigate("MedicalQuestionNavigation", {
      screen: "AllQuestions",
    });
  }

  function Icon({ category, name }) {
    return (
      <IconButton
        underlayColor={COLOR.GRAY5}
        onPress={() => handleNextStep(category, name)}
      >
        <>
          {category === "symptom" && (
            <>
              <Image
                source={SYMPTOM[name]?.ICON}
                mTop={1}
                width={66}
                height={66}
              />
              <Text T6>{name}</Text>
            </>
          )}
          {category === "medicalSubject" && (
            <>
              <Image
                source={DEPARTMENT[name]?.ICON}
                mTop={1}
                width={66}
                height={66}
              />
              <Text T6>{name}</Text>
            </>
          )}
        </>
      </IconButton>
    );
  }

  function Question({ data }) {
    return (
      <QuestionBox
        onPress={() => {
          appContextDispatch({ type: "USE_QUESTION_SHORTCUT" });
          navigation.navigate("MedicalQuestionNavigation", {
            screen: "QuestionDetail",
            params: {
              type: "ALL",
              questionDetailData: data,
            },
          });
        }}
      >
        <IconBox>
          <Image
            source={DEPARTMENT[data.answer.department]?.ICON}
            width={64}
            height={64}
          />
        </IconBox>
        <Column mLeft={12}>
          <Ellipsis T5 bold numberOfLines={1} ellipsizeMode="tail">
            {data.question}
          </Ellipsis>
          <Ellipsis T6 numberOfLines={2} ellipsizeMode="tail">
            {data.answer.message}
          </Ellipsis>
        </Column>
      </QuestionBox>
    );
  }

  const { width } = useWindowDimensions();
  const scrollX = useRef(new Animated.Value(0)).current;
  const renderItem = useCallback(
    ({ item }) => {
      return (
        <BannerTouchableOpacity
          key={`banner_${item.key}`}
          activeOpacity={item?.link ? 0.8 : 1}
          onPress={() => item?.link && Linking.openURL(item.link)}
        >
          <Image source={item.image} width={300} height={100} mLeft={10} />
        </BannerTouchableOpacity>
      );
    },
    [width]
  );
  const keyExtractor = useCallback((item) => item.key, []);

  return (
    <>
      <StatusBarArea backgroundColor={COLOR.MAIN}>
        <FocusAwareStatusBar animated style="light" />
      </StatusBarArea>

      <SafeArea backgroundColor={COLOR.MAIN}>
        <HomeContainerTop>
          <CustomHeader>
            <HeaderColumn onPress={() => setPageStatus("TELEMEDICINE")}>
              <Text
                T3
                bold={pageStatus === "TELEMEDICINE"}
                medium={pageStatus !== "TELEMEDICINE"}
                mTop={6}
                color="#FFFFFF"
              >
                비대면 상담
              </Text>
              {pageStatus === "TELEMEDICINE" && <SelectedBorderBottom />}
            </HeaderColumn>
            <HeaderColumn onPress={() => setPageStatus("QUESTION")}>
              <Text
                T3
                bold={pageStatus === "QUESTION"}
                medium={pageStatus !== "QUESTION"}
                mTop={6}
                color="#FFFFFF"
              >
                AI 닥터
              </Text>
              {pageStatus === "QUESTION" && <SelectedBorderBottom />}
            </HeaderColumn>
          </CustomHeader>

          <BannerContainer>
            <FlatList
              data={
                pageStatus === "TELEMEDICINE"
                  ? bannerForTelemedicine
                  : bannerForQuestions
              }
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
              decelerationRate={"normal"}
              renderItem={renderItem}
            />
            {pageStatus === "TELEMEDICINE" && (
              <ExpandingDot
                data={bannerForTelemedicine}
                expandingDotWidth={17}
                scrollX={scrollX}
                inActiveDotColor={COLOR.GRAY2}
                activeDotColor={"#FFFFFF"}
                dotStyle={styles.dotStyles}
                containerStyle={styles.constainerStyles}
              />
            )}
          </BannerContainer>

          {pageStatus === "TELEMEDICINE" && (
            <ContentsContainer>
              <Text T6 color={COLOR.GRAY1}>
                해외에서도 한국 대학병원 전문의에게
              </Text>
              <Text T3 bold mTop={4}>
                비대면 의료 상담
              </Text>

              <ContainerCenter>
                <IconsWrapper>
                  <Icon category="medicalSubject" name="가정의학과" />
                  <Icon category="medicalSubject" name="소아청소년과" />
                  <Icon category="medicalSubject" name="산부인과" />
                  <Icon category="medicalSubject" name="신경과" />
                  <Icon category="medicalSubject" name="외과" />
                  <Icon category="medicalSubject" name="흉부외과" />
                  <Icon category="medicalSubject" name="신장내과" />
                  <Icon category="medicalSubject" name="소화기내과" />
                  <Icon category="medicalSubject" name="정신건강의학과" />
                </IconsWrapper>

                <FullCategoryButton
                  underlayColor={COLOR.GRAY5}
                  onPress={() => handleFullCategory()}
                >
                  <Text T5 medium>
                    증상/상담과목 전체 보기 +
                  </Text>
                </FullCategoryButton>
              </ContainerCenter>
            </ContentsContainer>
          )}

          {pageStatus === "QUESTION" && (
            <ContentsContainer2>
              <QuestionContainer>
                <Column>
                  <Text T6 color={COLOR.GRAY1}>
                    건강 고민이 있으신가요?
                  </Text>
                  <Text T3 bold mTop={4}>
                    질문을 올리고{`\n`}고민을 해결해 보세요
                  </Text>
                  <NavigateRow onPress={() => handlePostQuestion()}>
                    <Text T5 bold color={COLOR.MAIN}>
                      질문 올리기
                    </Text>
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color={COLOR.MAIN}
                    />
                  </NavigateRow>
                </Column>

                <Image source={bellIcon} width={70} height={70} />
              </QuestionContainer>

              <DividingLine mTop={20} />

              <RealtimeContainer>
                <Text T3 bold>
                  실시간 의료 질문
                </Text>
                {allQuestionExamples.map((item, index) => {
                  if (index < 2) {
                    return <Question key={index} data={item} />;
                  }
                })}
                <RealtimeButton
                  underlayColor={COLOR.GRAY5}
                  onPress={() => handleAllQuestions()}
                >
                  <Text T5 medium>
                    의료 질문 전체 보기
                  </Text>
                </RealtimeButton>
              </RealtimeContainer>
            </ContentsContainer2>
          )}
        </HomeContainerTop>
      </SafeArea>
    </>
  );
}

const styles = StyleSheet.create({
  flatList: {
    width: 360,
    height: 100,
    marginBottom: 20,
  },
  constainerStyles: {
    bottom: 23,
    left: 1,
  },
  dotStyles: {
    width: 5,
    height: 5,
    borderRadius: 5,
    marginHorizontal: 4,
  },
});

const HomeContainerTop = styled(ContainerTop)`
  padding-top: ${Device.osName === "iOS" ? "0px" : "30px"};
`;

const CustomHeader = styled.View`
  width: 90%;
  height: 50px;
  margin: 10px 0 10px 0;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  border-bottom-width: 1.5px;
  border-color: ${COLOR.GRAY0};
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
  background-color: #ffffff;
`;

const BannerContainer = styled.View`
  width: 300px;
  height: 130px;
  align-items: center;
  justify-content: center;
`;

const BannerTouchableOpacity = styled.TouchableOpacity`
  width: 360px;
  align-items: center;
`;

const ContentsContainer = styled.View`
  flex: 1;
  width: 100%;
  padding: 20px 24px 0px 24px;
  background-color: #ffffff;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
`;

const IconsWrapper = styled.View`
  width: 304px;
  flex-flow: row wrap;
  gap: 8px;
`;

const IconButton = styled.TouchableHighlight`
  width: 96px;
  height: 90px;
  border-radius: 10px;
  background-color: ${COLOR.GRAY6};
  align-items: center;
`;

const FullCategoryButton = styled.TouchableHighlight`
  margin-top: 8px;
  width: 304px;
  height: 56px;
  border-radius: 5px;
  background-color: ${COLOR.GRAY6};
  align-items: center;
  justify-content: center;
`;

const ContentsContainer2 = styled.View`
  flex: 1;
  width: 100%;
  background-color: #ffffff;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
`;

const QuestionContainer = styled.View`
  width: 100%;
  padding: 20px 24px 0px 24px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const Column = styled.View`
  flex-dirction: column;
  ${(props) => props.mLeft && `margin-left: ${props.mLeft}px;`}
`;

const NavigateRow = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  margin-top: 6px;
  gap: 4px;
`;

const RealtimeContainer = styled.View`
  flex: 1;
  width: 100%;
  padding: 20px 24px 20px 24px;
  justify-content: space-between;
`;

const QuestionBox = styled.TouchableOpacity`
  width: 100%;
  flex-direction: row;
  align-items: center;
`;

const IconBox = styled.View`
  width: 64px;
  height: 64px;
  border-radius: 5px;
  background-color: ${COLOR.GRAY6};
  justify-contents: center;
  align-items: center;
`;

const RealtimeButton = styled.TouchableHighlight`
  margin-top: 12px;
  width: ${BUTTON.FULL.WIDTH};
  height: ${BUTTON.FULL.HEIGHT};
  border-radius: ${BUTTON.FULL.BORDER_RADIUS};
  background-color: ${COLOR.GRAY6};
  align-items: center;
  justify-content: center;
`;

const Ellipsis = styled(Text)`
  width: 230px;
`;
