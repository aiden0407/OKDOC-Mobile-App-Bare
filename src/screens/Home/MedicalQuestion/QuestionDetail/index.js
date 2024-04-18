//React
import { useEffect, useState, useContext } from "react";
import { AppContext } from "context/AppContext";
import styled from "styled-components/native";

//Components
import * as Device from "expo-device";
import { COLOR } from "constants/design";
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

//Assets
import mainIcon from "assets/main/main_icon.png";

export default function PaymentNotificationScreen({ navigation, route }) {
  const { dispatch: appContextDispatch } = useContext(AppContext);
  const [dropdownOpened, setDropdownOpened] = useState(false);
  const [reportOpened, setReportOpened] = useState(false);
  const [reportReasonIndex, setReportReasonIndex] = useState(0);
  const type = route.params.type;
  const questionDetailData = route.params.questionDetailData;

  useEffect(() => {
    if (type === "MY")
      navigation.setOptions({
        title: "나의 질문",
      });
  }, [navigation]);

  function handleReservation(department) {
    appContextDispatch({
      type: "TELEMEDICINE_RESERVATION_DEPARTMENT",
      department: [department],
    });
    appContextDispatch({ type: "USE_SHORTCUT" });
    navigation.navigate("TelemedicineReservation", { screen: "Reservation" });
  }

  return (
    <>
      <SafeArea>
        <ScrollView paddingTop={24}>
          <PaddingContainer>
            <StyledRow>
              <StyledRow>
                <CategoryBox>
                  <Text T7 bold color={COLOR.MAIN}>
                    {questionDetailData.answer?.department ?? "카테고리 없음"}
                  </Text>
                </CategoryBox>
                <Text T7 bold color={COLOR.GRAY2} mLeft={8}>
                  04/02 17:37
                </Text>
              </StyledRow>

              <DropdownMenu
                activeOpacity={1}
                onPress={() => setDropdownOpened(true)}
              >
                <Ionicons
                  name="ellipsis-horizontal-circle-sharp"
                  size={20}
                  color="#BBBBBB"
                />
              </DropdownMenu>
            </StyledRow>

            <SmallPadding>
              <Text T6 bold mTop={10}>
                Q. {questionDetailData.question}
              </Text>
            </SmallPadding>
          </PaddingContainer>

          <DividingLine mTop={30} />

          <PaddingContainer>
            <AnswerBox>
              <Row align>
                <Image source={mainIcon} width={30} height={30} circle />
                <Text T6 bold mLeft={12}>
                  오케이닥 AI
                </Text>
              </Row>
              <Text T6 bold mTop={20}>
                A. 안녕하세요, 오케이닥 AI입니다.
              </Text>
              <Text T6 mTop={20}>
                {questionDetailData.answer.message}
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
                    onPress={() => {
                      setDropdownOpened(false);
                    }}
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

        {questionDetailData.answer?.department && (
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
              text={questionDetailData.answer?.department + " " + "상담하기"}
              action={() =>
                handleReservation(questionDetailData.answer?.department)
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
