//React
import { useEffect, useState, useContext, useRef, useCallback } from "react";
import { ApiContext } from "context/ApiContext";
import { AppContext } from "context/AppContext";
import { useIsFocused } from "@react-navigation/native";
import styled from "styled-components/native";

//Components
import { COLOR } from "constants/design";
import { SYMPTOM, DEPARTMENT } from "constants/service";
import {
  Platform,
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
    image: bannerImage1,
    link: "https://insunginfo.notion.site/OK-DOC-ea3bd10f6dbf429389dfd924b29f989a?pvs=4",
  },
  {
    key: "2",
    image: bannerImage2,
    link: "https://www.notion.so/insunginfo/OK-DOC-ea3bd10f6dbf429389dfd924b29f989a?pvs=4#a2e7573a0a494cb59dd2ed4e0a051f51",
  },
  {
    key: "3",
    image: bannerImage3,
    link: "https://www.notion.so/insunginfo/OK-DOC-ea3bd10f6dbf429389dfd924b29f989a?pvs=4#10ef9357761648758dc19354c54a8558",
  },
  // {
  //   key: "4",
  //   image: bannerImage4,
  // },
];

const bannerForQuestions = [
  {
    key: "1",
    image: bannerImage5,
  },
];

export default function HomeScreen({ navigation }) {
  const {
    state: { allQuestions },
    dispatch: apiContextDispatch,
  } = useContext(ApiContext);
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
      appContextDispatch({
        type: "TELEMEDICINE_RESERVATION_PRODUCT",
        product: getProductsResponse.data.response[0],
      });
    } catch {
      Alert.alert("오류", "네트워크 에러로 인해 정보를 불러오지 못했습니다.");
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
    appContextDispatch({ type: "USE_QUESTION_SHORTCUT" });
    navigation.navigate("MedicalQuestionNavigation", {
      screen: "PostQuestion",
    });
  }

  function handleQuestionDetail(data) {
    appContextDispatch({ type: "USE_QUESTION_SHORTCUT" });
    navigation.navigate("MedicalQuestionNavigation", {
      screen: "QuestionDetail",
      params: {
        type: "ALL",
        questionDetailData: data,
      },
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
              <Text T6 mTop={-10}>
                {name}
              </Text>
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
              <Text T6 mTop={-10}>
                {name}
              </Text>
            </>
          )}
        </>
      </IconButton>
    );
  }

  function Question({ data }) {
    return (
      <QuestionBox onPress={() => handleQuestionDetail(data)}>
        <IconBox>
          <Image
            source={DEPARTMENT[data.clinical_department.name]?.ICON}
            width={64}
            height={64}
          />
        </IconBox>
        <Column mLeft={12}>
          <Ellipsis T5 bold numberOfLines={1} ellipsizeMode="tail">
            {data.question.messages[data.question.messages.length - 1].content}
          </Ellipsis>
          <Ellipsis T6 numberOfLines={2} ellipsizeMode="tail">
            {
              JSON.parse(
                data.answer.choices[data.answer.choices.length - 1].message
                  .content
              ).message
            }
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

                <FullButton
                  underlayColor={COLOR.GRAY5}
                  onPress={() => handleFullCategory()}
                >
                  <Text T5 medium>
                    증상/상담과목 전체 보기 +
                  </Text>
                </FullButton>
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

              <DividingLine mTop={16} />

              <RealtimeContainer>
                <Text T3 bold>
                  실시간 의료 질문
                </Text>
                <ContainerCenter>
                  <QuestionContainerCenter>
                    {allQuestions.map((item, index) => {
                      if (index < 2) {
                        return <Question key={index} data={item} />;
                      }
                    })}

                    <FullButton
                      underlayColor={COLOR.GRAY5}
                      onPress={() => handleAllQuestions()}
                    >
                      <Text T5 medium>
                        의료 질문 전체 보기
                      </Text>
                    </FullButton>
                  </QuestionContainerCenter>
                </ContainerCenter>
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
    bottom: 13,
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
  padding-top: ${Platform.OS === "ios" ? "0px" : "30px"};
`;

const CustomHeader = styled.View`
  width: 90%;
  height: 50px;
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
  height: 120px;
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
  height: 80px;
  border-radius: 10px;
  background-color: ${COLOR.GRAY6};
  align-items: center;
`;

const FullButton = styled.TouchableHighlight`
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
  padding: 16px 24px 4px 24px;
`;

const QuestionContainerCenter = styled.View`
  max-height: 300px
  flex: 1;
  justify-content: space-around;
`;

const QuestionBox = styled.TouchableOpacity`
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

const Ellipsis = styled(Text)`
  width: 220px;
`;
